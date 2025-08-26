import express from 'express';
import { port } from './config';
import routes from './api/routes';

const app = express();

app.use(express.json());

app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
