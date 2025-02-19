import express from 'express';
import accessFileLogger from './backend/logger/access';
import { logErrors, errorHandler } from './backend/logger/error';
import { notFoundHandler } from './backend/logger/notfound';
import { swaggerSpec } from './backend/docs/swagger';
import swaggerUi from 'swagger-ui-express';

// Apis
import membersApi from './backend/routers/members';
import nearbyApi from './backend/routers/nearby';

const app = express();

// Common
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Here we should have some middlewares for compression(gzip),
// to reduce the load of networks

// Applying logging middlewares below
if (process.env.NODE_ENV == 'dev' || process.env.NODE_ENV == 'staging') {
  // Saving logs to the log files
  app.use(accessFileLogger);
}

if (process.env.NODE_ENV == 'prod') {
  // The logging stack here should revolves the ELK in the mode of production
}

// Adding the API docs
if (process.env.NODE_ENV == 'dev' || process.env.NODE_ENV == 'staging') {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// APIs
app.use(
  '/api/v1/members/', //applying some middlewares about authorization here if in needs
  membersApi
);
app.use('/api/v1/nearby/', nearbyApi);

// Applying error capturing middlewares below
if (process.env.NODE_ENV == 'dev' || process.env.NODE_ENV == 'staging') {
  // In this test, error logs just display in console
  app.use(logErrors);
  app.use(errorHandler);
}

if (process.env.NODE_ENV == 'prod') {
  // In the environment of production, save error and report the problem.
  // The feature of error report could be combine with Auto DevOps tools,
  // so it could be a automatic stage in SLDC
}

app.use(notFoundHandler)

export default app;
