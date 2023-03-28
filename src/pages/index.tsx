import Head from 'next/head';
import { SyntheticEvent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import useOutsideClick from '@/hooks/useOutsideClick';
import Input from '@/components/ui/Input';
import useCurrentDate from '@/hooks/useCurrentDate';
import useCompleteHabit from '@/hooks/api/useCompleteHabit';
import useGetHabits from '@/hooks/api/useGetHabits';
import useCreateHabit from '@/hooks/api/useCreateHabit';
import useGetIcons from '@/hooks/api/useGetIcons';
import Reload from '@/components/ui/Reload';

const HabitIcon = ({ submitError }: { submitError: String }) => {
  const [icon, setIcon] = useState('');
  const [iconId, setIconId] = useState('');
  const { data, isError, isLoading } = useGetIcons();
  const [selecting, setSelecting] = useState(false);
  const ref = useOutsideClick({
    closeEvent: () => setSelecting(false),
    ignoreButton: true,
    active: selecting,
  });

  useEffect(() => {
    if (data) {
      setIcon(data[0].location);
      setIconId(data[0].id);
    }
  }, [data]);

  if (isLoading) return null;
  if (isError) return null;

  return (
    <div className="" ref={ref}>
      <input name="icon" type="hidden" value={iconId} />

      <div className="relative w-10 h-10">
        {iconId !== '' && icon !== '' ? (
          <button
            type="button"
            className="w-10 h-10"
            onClick={() => setSelecting((old) => !old)}
          >
            <Image src={icon} fill={true} alt="Habit Icon" />
          </button>
        ) : null}
      </div>

      <div data-cy="input-error" className="block text-red-500 text-sm">
        {submitError}
      </div>

      <div
        className={`${
          selecting ? 'block' : 'hidden'
        } absolute bg-white shadow-md w-52 py-4 rounded-lg`}
      >
        <div className="font-medium">Select Habit Icon</div>

        <div className="flex flex-row flex-wrap h-32 overflow-y-auto">
          {data &&
            data.map((icon) => (
              <button
                className="p-1 m-2 rounded hover:bg-slate-100"
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
      <div className="relative bg-white w-72 rounded-md p-4" ref={ref}>
        <div className="text-right">
          <button
            className="w-8 h-8 rounded-full transition-colors bg-gray-100 hover:bg-gray-300"
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
            submitError={data && data.errors ? data.errors.icon : null}
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

export default function Home() {
  const [habitModal, setHabitModal] = useState(false);
  const [parent, enableAnimations] = useAutoAnimate();
  const {
    data: habits,
    isLoading,
    isError: fetchingError,
    refetch,
  } = useGetHabits();
  const { mutate, isLoading: isMutating } = useCompleteHabit();
  const currentDate = useCurrentDate();
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  if (isLoading) return null;

  return (
    <>
      <Head>
        <title>Habit Tracker</title>
      </Head>

      <section className="max-w-5xl mx-auto">
        {habitModal ? (
          <HabitModal onClose={() => setHabitModal(false)} />
        ) : null}

        <header className="text-right px-6 mb-2">
          <button
            className="w-10 h-10 rounded-full transition transition-colors shadow-button hover:shadow-button-hover bg-black  text-white"
            type="button"
            onClick={() => setHabitModal(true)}
          >
            +
          </button>
        </header>

        <div>
          <ul
            ref={parent}
            className="grid  grid-cols-[repeat(auto-fit,_minmax(305px,_1fr))] gap-x-8 gap-y-4"
          >
            {habits &&
              habits.map((habit) => (
                <li
                  key={habit.id}
                  className="my-2 md:my-6 max-w-[305px] mx-auto rounded-md transition-colors"
                >
                  <div className="flex flex-row flex-nowrap items-center relative mb-4">
                    <div className="relative w-10 h-10 mr-4 border border-slate-500 rounded-2xl">
                      <Image
                        className="p-1"
                        src={habit.icon.location}
                        fill={true}
                        alt="Habit Icon"
                      />
                    </div>

                    <div className="font-bold flex-grow">{habit.title}</div>

                    <div className="font-bold">{habit.completedCount}</div>
                  </div>

                  <div className="px-1">
                    <div className="flex flex-row flex-nowrap">
                      {days.map((day, index) => {
                        const dayDate = dayjs().startOf('w').add(index, 'day');
                        const completionDates = habit.Completion.map(
                          (completion) =>
                            dayjs(completion.date).startOf('d').toString()
                        );
                        let styles = '';
                        let isDisabled = false;
                        let content = <span>{day}</span>;

                        if (completionDates.includes(dayDate.toString())) {
                          styles = 'bg-black text-white';
                          content = <i className="fas fa-check" />;
                        } else if (dayDate.isSame(currentDate)) {
                          styles = 'border-dashed border-black text-black';
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
                            className={`w-8 h-8 rounded-full border ${styles} px-2 py-1 mr-2`}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => {
                              mutate({
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
              ))}
          </ul>

          {fetchingError ? <Reload retry={refetch} /> : null}
        </div>
      </section>
    </>
  );
}
