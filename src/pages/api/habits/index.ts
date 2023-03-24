import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { Habit, Completion } from '@prisma/client';
import dayjs from 'dayjs';

type ResponseData = {
  habits: (Habit & {
    Completion: Completion[];
  })[];
};

export default async function RequestHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | String>
) {
  try {
    const habits = await prisma.habit.findMany({
      include: {
        icon: {},
        Completion: {
          where: {
            date: {
              gte: dayjs().startOf('w').toDate(),
            },
          },
        },
      },
    });

    return res.json({ habits });
  } catch (err) {
    console.log(err);
    res.status(500).send('A server error occurred please try again.');
  }
}
