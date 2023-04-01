import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/db';
import { Icon } from '@prisma/client';

type Data = {
  icons: Icon[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const icons = await prisma.icon.findMany();

    res.status(200).json({ icons });
  } catch (err) {
    return res.status(500).end();
  }
}
