import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

const useDeleteHabit = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id }: { id: number }) => {
      const res = await fetch(`/api/habits/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) return await res.json();

      throw new Error('Server Error Occurred');
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          queryClient.invalidateQueries({ queryKey: ['habits'] });
        }
      },
    }
  );
};

export default useDeleteHabit;
