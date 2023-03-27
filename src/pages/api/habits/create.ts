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
    title?: String;
    description?: String;
  };
};

function validation({ title, icon }: { title: String; icon: String }) {
  const errors: {
    title?: String;
    icon?: String;
    description?: String;
  } = {};

  if (!title || title === '') errors.title = 'A habit name is required';
  if (!icon) errors.icon = 'Invalid icon selected';

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
}

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
    const { errors, valid } = validation({ title, icon });
    if (!valid) return res.status(400).json({ errors });

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
