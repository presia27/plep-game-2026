/**
 * Express application
 */

import cors from 'cors';
import express, { Express } from 'express';

const createApp = (): Express => {
  const app = express();

  // Configure middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Configure routes
  app.use('/', express.static('view'));
  app.use('/assets', express.static('assets'));
  app.use('/js', express.static('js'));

  return app;
};

export default createApp;
