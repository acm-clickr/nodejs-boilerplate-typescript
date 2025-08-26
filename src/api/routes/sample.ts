import { Router } from 'express';
import { getSampleData } from '../controllers/sample';

const router = Router();

router.get('/', getSampleData);

export default router;
