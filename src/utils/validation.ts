export type HabitErrors = {
  title?: String;
  description?: String;
  icon?: String;
};

export function validateHabit({
  title,
  icon,
}: {
  title: String;
  icon: String;
}) {
  const errors: HabitErrors = {};

  if (!title || title === '') errors.title = 'A habit name is required';
  if (!icon) errors.icon = 'Invalid icon selected';

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
}
