import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';

type ResponseData = {
  success: boolean;
};

export default async function RequestHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | String>
) {
  const { id } = req.query;
  const { date } = req.body;

  if (!id || id === '') return res.status(400).end();

  try {
    const idNum = parseInt(id.toString());

    const habit = await prisma.habit.findUnique({
      where: {
        id: idNum,
      },
    });

    if (!habit) return res.status(400).end();

    await prisma.completion.create({
      data: {
        habit: {
          connect: {
            id: habit.id,
          },
        },
        date: new Date(date),
      },
    });

    await prisma.habit.update({
      where: { id: idNum },
      data: {
        lastCompleted: new Date().toDateString(),
        completionStreak: {
          increment: 1,
        },
        completedCount: {
          increment: 1,
        },
      },
    });

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send('A server error occurred please try again.');
  }
}
