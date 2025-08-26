import { Request, Response } from 'express';

export const getSampleData = (req: Request, res: Response) => {
  res.status(200).json({ message: 'This is a sample response' });
};
