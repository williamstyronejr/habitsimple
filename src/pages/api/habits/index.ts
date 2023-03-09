import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { Habit } from '@prisma/client';

type ResponseData = {
  habits: Habit[];
};

export default async function RequestHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | String>
) {
  try {
    const habits = await prisma.habit.findMany();

    return res.json({ habits });
  } catch (err) {
    console.log(err);
    res.status(500).send('A server error occurred please try again.');
  }
}
