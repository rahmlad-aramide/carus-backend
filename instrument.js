// eslint-disable-next-line @typescript-eslint/no-var-requires
const Sentry = require('@sentry/node')

Sentry.init({
  dsn: 'https://01c7dc98a8e0749f6e417433d1d60c9b@o4510017484881920.ingest.us.sentry.io/4510017487634432',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
})
