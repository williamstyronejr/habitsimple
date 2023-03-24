import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { Habit } from '@prisma/client';

type ResponseData = {
  habit: Habit;
  success: boolean;
};

type ErrorData = {
  errors: {
    icons?: String;
  };
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
    if (!icon)
      return res.status(400).json({
        errors: {
          icons: 'Invalid icon',
        },
      });

    const habit = await prisma.habit.create({
      data: {
        title,
        description,
        icon: {
          connect: {
            id: icon,
          },
        },
      },
    });

    return res.json({ success: true, habit });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
}
