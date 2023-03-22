import { useQuery } from '@tanstack/react-query';
import { Habit, Completion } from '@prisma/client';

const useGetHabits = () => {
  return useQuery(['habits'], async () => {
    const res = await fetch('/api/habits');

    if (!res.ok) throw new Error();
    const body: {
      habits: (Habit & {
        Completion: Completion[];
      })[];
    } = await res.json();
    return body.habits;
  });
};

export default useGetHabits;
