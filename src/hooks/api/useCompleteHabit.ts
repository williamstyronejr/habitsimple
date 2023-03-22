import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCompleteHabit = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, date }: { id: String; date: String }) => {
      const res = await fetch(`/api/habits/complete?id=${id}`, {
        method: 'POST',
        body: JSON.stringify({ date }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error();
      return await res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['habits'] });
      },
    }
  );
};

export default useCompleteHabit;
