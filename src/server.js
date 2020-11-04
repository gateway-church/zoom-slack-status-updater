const express = require('express')

const bodyParser = require('body-parser')

const get = require('lodash.get')

const path = require('path');

const logger = require('./logger')

const updateSlackStatus = require('./slack')

const database = require('./db');

const app = express()

app.use(express.static(path.join(__dirname, 'assets')));

logger(path.join(__dirname, 'assets'));

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

/**
 * API Endpoint for getting list of emails in DB.
 *
 */
app.get('/api/v1/users', async (req, res, next) => {
  if (req.headers['authorization'] === `Bearer ${process.env.GW_STATUS_API_KEY}`) {
    const { rows } = await database.query(`SELECT email FROM users`);

    // Collect email values.
    const emails =  !!rows ? rows.reduce((map, row) =>  {
      map.push(row['email']);

      return map;
    }, []) : [];

    res.status(200).send(emails);
  } else {
    res.sendStatus(401)
  }
});

/**
 * API Endpoint for adding email to DB.
 *
 */
app.post('/api/v1/users', async (req, res, next) => {
  if (req.headers['authorization'] === `Bearer ${process.env.GW_STATUS_API_KEY}`) {
    logger('USERS CREATE REQUEST', req.body);

    const emailAddress = get(req, 'body.email')

    if (emailAddress) {
      try {
        await database.query_with_params(`INSERT INTO users(email) VALUES($1)`, [emailAddress]);

        res.sendStatus(201)
      } catch (error) {
        logger(error);

        res.status(400).send({ message: error.message });
      }
    } else {
      logger('User could not be created')

      res.sendStatus(400)
    }
  } else {
    res.sendStatus(401)
  }
});

/**
 * API Endpoint for removing email from DB.
 *
 */
app.delete('/api/v1/users', async (req, res, next) => {
  if (req.headers['authorization'] === `Bearer ${process.env.GW_STATUS_API_KEY}`) {
    logger('USERS DELETE REQUEST', req.body);

    const emailAddress = get(req, 'body.email')

    if (emailAddress) {
      try {
        await database.query_with_params(`DELETE FROM users WHERE email=$1`, [emailAddress]);

        res.sendStatus(200)
      } catch(error) {
        logger(error);

        res.status(400).send({ message: error.message });
      }
    } else {
      logger('User could not be created')

      res.sendStatus(400)
    }
  } else {
    res.sendStatus(401)
  }
});

/**
 * Webhook Endpoint called when "User’s presence status has been updated"
 * happens.
 *
 * Docs
 * @see https://marketplace.zoom.us/docs/api-reference/webhook-reference/user-events/presence-status-updated
 */
app.post('/', async (req, res, next) => {
  logger('REQUEST', req.body)

  const currentPresenceStatus = get(req, 'body.payload.object.presence_status')
  const currentEmail = get(req, 'body.payload.object.email')
  const verificationToken = get(req, 'headers.authorization')

  if (!currentPresenceStatus) {
    return next(new Error('presence_status is not available'))
  }

  try {
    await updateSlackStatus({
      presenceStatus: currentPresenceStatus,
      email: currentEmail,
      verificationToken,
    })
    res.sendStatus(200)
  } catch (error) {
    return next(new Error(error))
  }
})

// This is catch all get route leading to home page.
app.get('/*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
})

/**
 * global error middleware, catches any uncatched errors thrown in app routes.
 * Logs the error to the console.
 */
app.use(function (error, _req, res, _next) {
  logger('REQUEST error', error.message)
  res.sendStatus(200)
})

module.exports = app
