import { Icon } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

const useGetIcons = () => {
  return useQuery(['icons'], async () => {
    const res = await fetch('/api/icons');

    if (!res.ok) throw new Error();
    const body: { icons: Icon[] } = await res.json();

    return body.icons;
  });
};

export default useGetIcons;
