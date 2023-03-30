import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { Habit } from '@prisma/client';
import { HabitErrors, validateHabit } from '@/utils/validation';

type ResponseData = {
  habit: Habit;
  success: boolean;
};

type ErrorData = {
  errors: HabitErrors;
};

export default async function RequestHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | ErrorData>
) {
  const {
    method,
    body: { title, description, icon },
  } = req;

  try {
    if (method !== 'POST') return res.status(404).end();
    const { errors, valid } = validateHabit({ title, icon });
    if (!valid) return res.status(400).json({ errors });

    const habit = await prisma.habit.create({
      data: {
        title,
        description,
        icon: {
          connect: {
            id: parseInt(icon),
          },
        },
      },
    });

    return res.json({ success: true, habit });
  } catch (err) {
    res.status(500).end();
  }
}
