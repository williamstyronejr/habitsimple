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

  try {
    await prisma.habit.update({
      where: { id: id?.toString() },
      data: {
        lastCompleted: new Date().toDateString(),
      },
    });

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send('A server error occurred please try again.');
  }
}
