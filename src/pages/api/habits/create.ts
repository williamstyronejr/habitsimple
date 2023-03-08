import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { Habit } from '@prisma/client';

type ResponseData = {
  habit: Habit;
  success: boolean;
};

export default async function RequestHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | String>
) {
  const {
    method,
    body: { title, description },
  } = req;

  try {
    if (method !== 'POST') return res.status(404).end();

    const habit = await prisma.habit.create({
      data: {
        title,
        description,
      },
    });

    return res.json({ success: true, habit });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
