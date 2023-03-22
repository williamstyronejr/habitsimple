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

      if (!res.ok) throw new Error();
      return await res.json();

      // .then(async (res) => {
      //   if (!res.ok) {
      //     onClose();
      //   }

      //   const body = await res.json();
      //   onSuccess(body.habit);
      //   setRequesting(false);
      //   onClose();
      // });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['habits']);
      },
      onSettled: options.onSettled,
    }
  );
};

export default useCreateHabit;
