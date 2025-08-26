import express from 'express';
import { port } from './config';
import routes from './api/routes';

import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

const xss = require('xss-clean');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

app.use(express.json());

// Sanitize user-supplied data to prevent MongoDB operator injection
app.use(mongoSanitize());

// Sanitize user input to prevent XSS
app.use(xss());

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
