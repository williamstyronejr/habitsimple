import Head from 'next/head';
import { SyntheticEvent, useState } from 'react';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import useOutsideClick from '@/hooks/useOutsideClick';
import Input from '@/components/ui/Input';
import useCurrentDate from '@/hooks/useCurrentDate';
import useCompleteHabit from '@/hooks/api/useCompleteHabit';
import useGetHabits from '@/hooks/api/useGetHabits';
import useCreateHabit from '@/hooks/api/useCreateHabit';

const HabitModal = ({ onClose }: { onClose: () => void }) => {
  const { mutate, isLoading } = useCreateHabit({ onSettled: onClose });
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
      <div className="bg-white w-72 rounded-md p-4" ref={ref}>
        <div className="text-right">
          <button
            className="w-8 h-8 rounded-full transition-colors bg-gray-100 hover:bg-gray-300"
            type="button"
            onClick={() => onClose()}
          >
            X
          </button>
        </div>
        <form action="POST" onSubmit={onSubmit}>
          <fieldset>
            <Input
              name="title"
              placeholder="Task Title"
              type="text"
              label="Title"
            />

            <Input
              name="description"
              placeholder="Task Description"
              type="textarea"
              label="Description"
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
  const { data: habits, isLoading } = useGetHabits();
  const { mutate } = useCompleteHabit();
  const currentDate = useCurrentDate();
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  if (isLoading) return null;
  return (
    <>
      <Head>
        <title>Habit Tracker</title>
      </Head>

      <section className="">
        {habitModal ? (
          <HabitModal onClose={() => setHabitModal(false)} />
        ) : null}

        <header className="text-right px-6 mb-2">
          <button
            className="w-10 h-10 rounded-full transition transition-colors shadow-button hover:shadow-button-hover bg-sky-500 hover:bg-sky-700  text-white"
            type="button"
            onClick={() => setHabitModal(true)}
          >
            +
          </button>
        </header>

        <div>
          <ul
            ref={parent}
            className="flex flex-col flex-nowrap overflow-y-auto"
          >
            {habits.map((habit) => (
              <li
                key={habit.id}
                className="w-10/12  my-2 mx-auto rounded-md transition-colors"
              >
                <div className="flex flex-row flex-nowrap items-center">
                  <Image
                    className="w-10 h-10 bg-black rounded-2xl mr-4"
                    src=""
                    alt=""
                  />

                  <div>{habit.title}</div>
                </div>

                <div>
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
                            mutate({ id: habit.id, date: dayDate.toString() });
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
        </div>
      </section>
    </>
  );
}
