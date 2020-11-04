# Zoom Slack Status Updater
Update your Slack status automatically when you join a Zoom meeting.

## GET LIST OF USERS
```
curl --location --request GET 'https://gw-status-updater.herokuapp.com/api/v1/users' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer API_KEY_FOUND_IN_HEROKU_CONFIG' \
```

## CREATE USER
```
curl --location --request POST 'https://gw-status-updater.herokuapp.com/api/v1/users' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer API_KEY_FOUND_IN_HEROKU_CONFIG' \
--data-raw '{
    "email": "johndoe@gatewaystaff.com"
}'
```

## DELETE USER
```
curl --location --request DELETE 'https://gw-status-updater.herokuapp.com/api/v1/users' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer API_KEY_FOUND_IN_HEROKU_CONFIG' \
--data-raw '{
    "email": "johndoe@gatewaystaff.com"
}'
```

## Requirements

- a Zoom App
- a Slack App

## Development

### Installation

```bash
yarn install
```

### Step 1 - Setup Slack

1. Create a [Slack App](https://api.slack.com/apps) for your workspace(s)
2. Grant each app the `users.profile:write` **and** `dnd:write` privilege in
   `User Token Scopes` in the `OAuth & Permissions` view, before
   clicking on the "Install App" button.
3. Copy and paste each `OAuth Access Token` into the configuration file created
   in the subsequent step.

![Create Webhook Only Zoom App](./assets/slack.png)

### Step 2 - Setup Zoom

![Create Webhook Only Zoom App](./assets/zoom_1.png)

[Create a new (or use an existing) "Webhook Only" Zoom app](https://marketplace.zoom.us/develop/create)
with your Zoom account. Even if you added multiple Slack workspaces, you just
need one Zoom app.

Fill out the required information and activate `Event Subscriptions`. Add
the `User’s presence status has been updated` event type. Once you have deployed
the app to now.sh (in a later step) you can add the
`Event notification endpoint URL`.

The `Verification Token` is also visible on this page, you need to
add this to the app configuration in the next step.

![Setup Zoom App](./assets/zoom_2.png)

You can read more about it setting up the App [here](https://marketplace.zoom.us/docs/api-reference/webhook-reference/user-events/presence-status-updated).

### Step 3 - Configure App

1. Duplicate the [example config](./slack-status-config-example.js) and rename
   it to `slack-status-config.js`. This should happen automatically thanks
   to a `postinstall` script.
2. Create a config object for each slack workspace you want to update when a
   Zoom meeting starts.

You can either use `now secret` for the token values, copy the token string
right into the workspace config or use `process.env.*` by setting the values in
`.env`. I used the now secret option described below:

#### Add Secrets to dotenv / heroku env variables.

Step 1 - now you can the secret with `process.env.<secret name>` to your
configuration file

```js
  {
    name: 'Slack Workspace 1',
    token: process.env.SLACK_TOKEN_1,
    zoomVerificationToken: process.env.VERIFICATION_TOKEN_1,
    ...
  }
```

#### Example configuration

You can add as many slack workspaces as you want here, just make sure you have
created an app for each of them.

```js
module.exports = [
  /**
   * You can add as many slack workspaces as you want here, just make sure
   * you have created an app for each of them.
   */
  {
    // this name can be anything and is only for you, it is not used in the app
    name: 'Slack Workspace 1',
    /**
     * this is the email address of your zoom user
     * events are filtered and slack updates are only done for this user
     * remove, if filtering is not intended
     */
    email: 'your-address@mail.com',
    /**
     * either copy & paste the token string here or use
     * process.env.SLACK_TOKEN_1 (now secret add SLACK_TOKEN_1 "xoxp-xxx-xxx")
     */
    token: 'xoxp-xxx-xxx',
    /**
     * Zoom Verification Token
     *
     * A verification token will be generated in the Feature page after you
     * enable and save the event subscription.
     *
     * @see https://marketplace.zoom.us/docs/api-reference/webhook-reference#headers
     */
    zoomVerificationToken: 'Vivamusultricies',
    /**
     * Slack DnD Status
     *
     * Turns on Do Not Disturb mode for the current user. Number of minutes,
     * from now, to snooze until.
     *
     * @see https://api.slack.com/methods/dnd.setSnooze
     */
    dndNumMinutes: 60,
    meetingStatus: {
      text: "I'm in a meeting",
      emoji: ':warning:', // emoji code
    },
    noMeetingStatus: {
      text: '',
      emoji: '',
    },
  },
]
```

### Step 4 - Deploy App to heroku
Remember the created URL. You are going to need it in the next step for the ZOOM app.

### Step 5 - Finish Zoom Setup

Add the generated heroku domain as `Event notification endpoint URL`.

![Setup Zoom App](./assets/zoom_2.png)

### Step 6 - Test :)

Now, open both Zoom and Slack and watch the status change when you start or
join a meeting.

## References

- [How to set a Slack status from other apps](https://medium.com/slack-developer-blog/how-to-set-a-slack-status-from-other-apps-ab4eef871339)

## License

[MIT](License)
