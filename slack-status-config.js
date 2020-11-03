module.exports = [
  /**
   * You can add as many slack workspaces as you want here, just make sure
   * you have created an app for each of them.
   */
  {
    // this name can be anything and is only for you, it is not used in the app
    name: 'Gateway Status Updater',
    /**
     * this is the email address of your zoom user
     * events are filtered and slack updates are only done for this user
     * remove, if filtering is not intended
     */
    /**
     *
     * Using pg DB for emails.
     *
     */
    // emails: process.env.VALID_EMAILS,
    /**
     * either copy & paste the token string here or use
     * process.env.SLACK_TOKEN_1 (now secret add SLACK_TOKEN_1 "xoxp-xxx-xxx")
     */
    token: process.env.SLACK_TOKEN_1,
    /**
     * Zoom Verification Token
     *
     * A verification token will be generated in the Feature page after you
     * enable and save the event subscription.
     *
     * @see https://marketplace.zoom.us/docs/api-reference/webhook-reference#headers
     */
    zoomVerificationToken: process.env.VERIFICATION_TOKEN_1,
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
      text: "On a Zoom Call",
      emoji: ':slack_call:', // emoji code
    },
    noMeetingStatus: {
      text: '',
      emoji: '',
    },
  },
]
