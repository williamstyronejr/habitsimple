import { Habit, Completion, Icon } from '@prisma/client';
import Head from 'next/head';
import { SyntheticEvent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import useOutsideClick from '@/hooks/useOutsideClick';
import useCurrentDate from '@/hooks/useCurrentDate';
import useCompleteHabit from '@/hooks/api/useCompleteHabit';
import useGetHabits from '@/hooks/api/useGetHabits';
import useCreateHabit from '@/hooks/api/useCreateHabit';
import useGetIcons from '@/hooks/api/useGetIcons';
import useDeleteHabit from '@/hooks/api/useDeleteHabit';
import useEditHabit from '@/hooks/api/useEditHabit';
import Input from '@/components/ui/Input';
import Reload from '@/components/ui/Reload';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const HabitIcon = ({
  submitError,
  initialIcon = null,
  initialIconId = null,
}: {
  initialIcon?: string | null;
  initialIconId?: number | null;
  submitError: string | null;
}) => {
  const [icon, setIcon] = useState(initialIcon || '');
  const [iconId, setIconId] = useState<number | null>(initialIconId);
  const { data, isError, isLoading } = useGetIcons();
  const [selecting, setSelecting] = useState(false);
  const ref = useOutsideClick({
    closeEvent: () => setSelecting(false),
    ignoreButton: true,
    active: selecting,
  });

  useEffect(() => {
    if (data && initialIconId === null) {
      setIcon(data[0].location);
      setIconId(data[0].id);
    }
  }, [data, initialIconId]);

  if (isLoading) return null;
  if (isError) return null;

  return (
    <div className="" ref={ref}>
      <div className="relative w-10 h-10">
        {iconId !== null && icon !== '' ? (
          <>
            <input name="icon" type="hidden" value={iconId} />

            <button
              type="button"
              className="relative w-10 h-10 bg-white rounded-lg"
              onClick={() => setSelecting((old) => !old)}
            >
              <Image
                className="p-0.5"
                src={icon}
                fill={true}
                alt="Habit Icon"
              />
            </button>
          </>
        ) : null}
      </div>

      <div data-cy="input-error" className="block text-red-500 text-sm">
        {submitError}
      </div>

      <div
        className={`${
          selecting ? 'block' : 'hidden'
        } absolute shadow-modal dark:shadow-slate-100/20  w-52 pt-2 py-2 mt-2 rounded-lg bg-white dark:bg-black`}
      >
        <div className="font-medium p-2">Select Habit Icon</div>

        <div className="flex flex-row flex-wrap h-32 overflow-y-auto">
          {data &&
            data.map((icon) => (
              <button
                className="p-1 m-2 rounded bg-white hover:bg-slate-100"
                key={icon.id}
                type="button"
                title={icon.name}
                onClick={() => {
                  setSelecting(false);
                  setIcon(icon.location);
                  setIconId(icon.id);
                }}
              >
                <div className="relative w-6 h-6">
                  <Image src={icon.location} fill={true} alt={icon.name} />
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

const HabitModal = ({ onClose }: { onClose: () => void }) => {
  const { data, mutate, isLoading, isError } = useCreateHabit({
    onSuccess: onClose,
  });
  const ref = useOutsideClick({
    closeEvent: onClose,
    active: true,
    ignoreButton: true,
  });

  const onSubmit = (evt: SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (isLoading) return;

    const formData = new FormData(evt.currentTarget);
    const fields = Object.fromEntries(formData.entries());

    mutate({ fields });
  };

  return (
    <div className="flex flex-row flex-nowrap absolute z-10 w-full h-full top-0 left-0 justify-center items-center bg-black/40">
      <div
        className="relative w-72 rounded-md p-4 bg-white dark:bg-black"
        ref={ref}
      >
        <div className="text-right">
          <button
            className="w-8 h-8 rounded-full transition-colors bg-gray-100 dark:text-black hover:bg-gray-300"
            type="button"
            onClick={() => onClose()}
          >
            X
          </button>
        </div>

        {isError ? (
          <div className="block w-full bg-red-500 py-4 px-4 my-2 rounded-md text-white">
            An error occurred, please try again.
          </div>
        ) : null}

        <form action="POST" onSubmit={onSubmit}>
          <HabitIcon
            submitError={
              data && data.errors ? (data.errors.icon as string) : null
            }
          />

          <fieldset>
            <Input
              name="title"
              placeholder="Task Title"
              type="text"
              label="Title"
              error={data && data.errors ? data.errors.title : null}
            />

            <Input
              name="description"
              placeholder="Task Description"
              type="textarea"
              label="Description"
              error={data && data.errors ? data.errors.description : null}
            />
          </fieldset>

          <button
            className="block text-center mx-auto px-4 py-2 rounded-md text-white shadow-button hover:shadow-button-hover transition bg-sky-500 hover:bg-sky-700 "
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const HabitEdit = ({
  onClose,
  id,
  title,
  description,
  icon,
  iconId,
}: {
  onClose: () => void;
  id: number;
  title: string;
  description: string;
  iconId: number;
  icon: string;
}) => {
  const { data, isError, mutate, isLoading } = useEditHabit({
    onSuccess: onClose,
  });
  const ref = useOutsideClick({
    ignoreButton: true,
    active: true,
    closeEvent: () => onClose(),
  });

  const onSubmit = (evt: SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (isLoading) return;

    const formData = new FormData(evt.currentTarget);
    const fields: any = Object.fromEntries(formData.entries());

    mutate({ id, ...fields });
  };

  return (
    <div className="flex flex-row flex-nowrap absolute z-10 w-full h-full top-0 left-0 justify-center items-center bg-black/40">
      <div
        className="relative w-72 rounded-md p-4  bg-white dark:bg-black"
        ref={ref}
      >
        <div className="text-right">
          <button
            className="w-8 h-8 rounded-full transition-colors bg-gray-100 hover:bg-gray-300 dark:bg-white dark:text-black"
            type="button"
            onClick={() => onClose()}
          >
            X
          </button>
        </div>

        {isError ? (
          <div className="block w-full bg-red-500 py-4 px-4 my-2 rounded-md text-white">
            An error occurred, please try again.
          </div>
        ) : null}

        <form action="POST" onSubmit={onSubmit}>
          <HabitIcon
            initialIcon={icon}
            initialIconId={iconId}
            submitError={
              data && data.errors ? (data.errors.icon as string) : null
            }
          />

          <fieldset>
            <Input
              name="title"
              placeholder="Task Title"
              type="text"
              label="Title"
              initialValue={title}
              error={data && data.errors ? data.errors.title : null}
            />

            <Input
              name="description"
              placeholder="Task Description"
              type="textarea"
              label="Description"
              initialValue={description}
              error={data && data.errors ? data.errors.description : null}
            />
          </fieldset>

          <button
            className="block text-center mx-auto px-4 py-2 rounded-md text-white shadow-button hover:shadow-button-hover transition bg-sky-500 hover:bg-sky-700 "
            type="submit"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

const Habit = ({
  habit,
  currentDate,
}: {
  habit: Habit & {
    Completion: Completion[];
    icon: Icon;
  };
  currentDate: dayjs.Dayjs;
}) => {
  const [options, setOptions] = useState(false);
  const { mutate: completeHabit, isLoading } = useCompleteHabit();
  const { mutate: deleteHabit } = useDeleteHabit();
  const [editMode, setEditMode] = useState(false);

  const ref = useOutsideClick({
    ignoreButton: true,
    closeEvent: () => setOptions(false),
    active: options,
  });

  return (
    <>
      {editMode ? (
        <HabitEdit
          id={habit.id}
          title={habit.title}
          description={habit.description}
          iconId={habit.iconId}
          icon={habit.icon.location}
          onClose={() => setEditMode(false)}
        />
      ) : null}

      <li
        key={habit.id}
        className="relative my-6 max-w-[350px] mx-auto rounded-md transition-colors"
      >
        <div className="flex flex-row flex-nowrap items-center relative mb-4">
          <div className="relative shrink-0 w-10 h-10 mr-4 border border-slate-500 rounded-2xl dark:bg-white">
            <span className="absolute -top-2 -left-2.5 rounded-full px-1.5  text-xs text-white dark:text-black bg-black dark:bg-white ">
              {habit.completionStreak}
            </span>

            <Image
              className="p-1"
              src={habit.icon.location}
              fill={true}
              alt="Habit Icon"
            />
          </div>

          <div
            title={habit.title}
            className="font-bold flex-grow whitespace-nowrap text-ellipsis overflow-hidden"
          >
            {habit.title}
          </div>

          <div className="" ref={ref}>
            <button
              className=""
              type="button"
              onClick={() => setOptions((old) => !old)}
            >
              <i className="font-bold fas fa-ellipsis-h" />
            </button>

            {options ? (
              <div className="absolute top-10 right-0 py-4 z-20 rounded-md transition-colors shadow-modal dark:shadow-slate-100/20 bg-white dark:bg-black text-black dark:text-white">
                <button
                  className="block w-full mb-1 px-4 py-2 text-left transition-colors hover:bg-slate-100  dark:hover:bg-slate-300/20"
                  type="button"
                  onClick={() => {
                    setOptions(false);
                    setEditMode(true);
                  }}
                >
                  Edit Habit
                </button>

                <button
                  className="block w-full px-4 py-2 text-left text-red-500 transition-colors hover:bg-red-100/30 dark:hover:bg-red-500/30 "
                  type="button"
                  onClick={() => {
                    deleteHabit({ id: habit.id });
                  }}
                >
                  Delete Habit
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="px-1">
          <div className="flex flex-row flex-nowrap justify-center">
            {DAYS.map((day, index) => {
              const dayDate = dayjs().startOf('w').add(index, 'day');
              const completionDates = habit.Completion.map((completion) =>
                dayjs(completion.date).startOf('d').toString()
              );
              let styles = '';
              let isDisabled = false;
              let content = <span>{day}</span>;

              if (completionDates.includes(dayDate.toString())) {
                styles =
                  'transition-colors bg-black dark:bg-white text-white dark:text-black';
                content = <i className="fas fa-check" />;
                isDisabled = true;
              } else if (dayDate.isSame(currentDate)) {
                styles = `border-dashed border-black dark:border-white text-black dark:text-white transition-colors ${
                  isLoading
                    ? 'day-animate bg-slate-500/20 dark:bg-white/20'
                    : 'hover:bg-slate-500/20 dark:hover:bg-white/10 hover:border-solid'
                }`;
              } else if (dayDate.isBefore(currentDate)) {
                styles = 'border-slate-400 text-slate-400';
                isDisabled = true;
                content = <i className="fas fa-times" />;
              } else if (dayDate.isAfter(currentDate)) {
                styles = 'border-slate-400 text-slate-400';
                isDisabled = true;
              }

              return (
                <button
                  key={`${habit.id}-${day}-${index}`}
                  className={`w-10 h-10 rounded-full border ${styles} py-1 mx-1`}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    completeHabit({
                      id: habit.id,
                      date: dayDate.toString(),
                    });
                  }}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </li>
    </>
  );
};

const isBrowserDefaultDark = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const getDefaultTheme = (): string => {
  const localStorageTheme = localStorage.getItem('theme');
  const browserDefault = isBrowserDefaultDark() ? 'dark' : 'light';
  return localStorageTheme || browserDefault;
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState<string>('');

  useEffect(() => {
    if (theme !== '') {
      // Update LocalStorage with theme
      localStorage.setItem('theme', theme === 'light' ? 'light' : 'dark');
      const html = document.querySelector('html');
      if (html) {
        html.classList.remove(theme === 'dark' ? 'light' : 'dark');
        html.classList.add(theme);
      }
    }
  }, [theme]);

  useEffect(() => {
    setTheme(getDefaultTheme());
  }, []);

  return (
    <button
      className="w-10 h-10 rounded-full transition transition-colors shadow-button hover:shadow-button-hover bg-black dark:bg-white text-white dark:text-black"
      type="button"
      onClick={() => {
        setTheme((old) => (old === 'dark' ? 'light' : 'dark'));
      }}
    >
      <i
        className={`text-xl ${
          theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'
        }`}
      />
    </button>
  );
};

export default function Home() {
  const [habitModal, setHabitModal] = useState(false);
  const [parent, enableAnimations] = useAutoAnimate();
  const {
    data: habits,
    isLoading,
    isError: fetchingError,
    refetch,
  } = useGetHabits();
  const currentDate = useCurrentDate();

  if (isLoading) return null;

  return (
    <>
      <Head>
        <title>Habit Tracker</title>
      </Head>

      <section className="flex flex-col max-w-5xl mx-auto h-full">
        {habitModal ? (
          <HabitModal onClose={() => setHabitModal(false)} />
        ) : null}

        <header className="flex flex-row flex-nowrap items-center px-6 py-6 mb-2">
          <h2 className="flex-grow font-bold text-xl">Habit Tracker</h2>

          <button
            className="w-10 h-10 rounded-full mr-4 text-xl transition transition-colors shadow-button hover:shadow-button-hover bg-black dark:bg-white text-white dark:text-black"
            type="button"
            onClick={() => setHabitModal(true)}
          >
            +
          </button>

          <ThemeToggle />
        </header>

        <div className="flex-grow">
          <ul
            ref={parent}
            className="grid grid-cols-[repeat(auto-fit,_minmax(360px,_1fr))] gap-x-4 md:gap-x-8 gap-y-4 auto-rows-min  h-full"
          >
            {habits &&
              habits.map((habit) => (
                <Habit key={habit.id} habit={habit} currentDate={currentDate} />
              ))}
          </ul>

          {fetchingError ? <Reload retry={refetch} /> : null}
        </div>
      </section>
    </>
  );
}
