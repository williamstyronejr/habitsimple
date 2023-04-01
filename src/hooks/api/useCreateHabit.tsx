import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreateHabit = (options: any) => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ fields }: { fields: any }) => {
      const res = await fetch('/api/habits/create', {
        method: 'POST',
        body: JSON.stringify(fields),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok || res.status === 400) return await res.json();
      throw new Error();
    },
    {
      onSuccess: (data) => {
        if (!data.errors) {
          queryClient.invalidateQueries(['habits']);
          options.onSuccess();
        }
      },
    }
  );
};

export default useCreateHabit;
