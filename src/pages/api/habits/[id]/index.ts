import { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import { Habit, Completion, Icon } from '@prisma/client';
import { prisma } from '@/utils/db';
import { HabitErrors, validateHabit } from '@/utils/validation';

type GetResponse = {
  habit:
    | (Habit & {
        Completion: Completion[];
        icon: Icon;
      })
    | null;
};

type PostDeleteResponse = {
  success: boolean;
};

type PostError = {
  errors: HabitErrors;
};

export default async function RequestHandler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponse | PostError | PostDeleteResponse | String>
) {
  const {
    method,
    query: { id },
    body: { title, description, icon },
  } = req;

  if (!id || id === '') return res.status(404).end();
  const idNum = parseInt(id.toString());

  switch (method) {
    case 'GET': {
      try {
        const habit = await prisma.habit.findUnique({
          where: {
            id: idNum,
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

        return res.json({ habit });
      } catch (err) {
        console.log(err);
        res.status(500).send('A server error occurred please try again.');
      }
    }

    case 'POST': {
      const { errors, valid } = validateHabit({ title, icon: icon });
      if (!valid) return res.status(400).json({ errors });

      const data: any = {};
      if (title) data.title = title;
      if (description) data.description = description;
      if (icon) data.icon = { connect: { id: parseInt(icon.toString()) } };

      await prisma.habit.update({
        where: {
          id: idNum,
        },
        data,
      });

      return res.json({ success: true });
    }

    case 'DELETE': {
      try {
        const habit = await prisma.habit.delete({
          where: {
            id: idNum,
          },
        });

        return res.json({ success: !!habit });
      } catch (err) {
        console.log(err);
        res.status(500).send('A server error occurred please try again.');
      }
    }

    default:
      res.status(404).end();
  }
}
