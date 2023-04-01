import { useMutation, useQueryClient } from '@tanstack/react-query';

const useEditHabit = ({ onSuccess }: { onSuccess: () => void }) => {
  const queryclient = useQueryClient();

  return useMutation(
    async ({
      id,
      title,
      description,
      icon,
    }: {
      id: number;
      title: string;
      description: string;
      icon: number;
    }) => {
      const res = await fetch(`/api/habits/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, icon }),
      });

      if (res.ok || res.status === 400) return await res.json();

      throw new Error();
    },
    {
      onSuccess: (data) => {
        if (!data.errors) {
          queryclient.invalidateQueries(['habits']);
          onSuccess();
        }
      },
    }
  );
};

export default useEditHabit;
