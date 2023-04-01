import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { Habit, Completion, Icon } from '@prisma/client';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

type ResponseData = {
  habits: (Habit & {
    Completion: Completion[];
    icon: Icon;
  })[];
};

async function updateHabits(
  habits: (Habit & {
    Completion: Completion[];
    icon: Icon;
  })[]
) {
  const dayBeforeCurrent = dayjs().startOf('day').subtract(1, 'day');

  const habitToUpdate: number[] = [];

  habits.forEach((habit) => {
    const lastDate = dayjs(habit.lastCompleted).startOf('day');
    if (!lastDate.isSameOrAfter(dayBeforeCurrent)) {
      habitToUpdate.push(habit.id);
    }
  });

  if (habitToUpdate.length) {
    await prisma.habit.updateMany({
      where: {
        id: {
          in: habitToUpdate,
        },
      },
      data: {
        completionStreak: 0,
      },
    });
  }

  return habitToUpdate.length > 0;
}

export default async function RequestHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | String>
) {
  try {
    let habits = await prisma.habit.findMany({
      orderBy: {
        title: 'asc',
      },
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

    const needsUpdate = await updateHabits(habits);

    if (needsUpdate) {
      habits = await prisma.habit.findMany({
        orderBy: {
          title: 'asc',
        },
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
    }

    return res.json({ habits });
  } catch (err) {
    console.log(err);
    res.status(500).send('A server error occurred please try again.');
  }
}
