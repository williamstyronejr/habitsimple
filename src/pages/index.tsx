import Head from 'next/head';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import useOutsideClick from '@/hooks/useOutsideClick';
import { Habit } from '@prisma/client';
import Input from '@/components/ui/Input';

function isSameDay(date1: Date | null, date2: Date | null) {
  return date1 === null || date2 === null
    ? false
    : date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

const HabitModal = ({
  onSuccess,
  onClose,
}: {
  onSuccess: (habit: Habit) => void;
  onClose: () => void;
}) => {
  const [requesting, setRequesting] = useState(false);
  const ref = useOutsideClick({
    closeEvent: onClose,
    active: true,
    ignoreButton: true,
  });

  const onSubmit = (evt: SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    // Prevent double submits
    if (requesting) return;

    const formData = new FormData(evt.currentTarget);
    const fields = Object.fromEntries(formData.entries());

    fetch('/api/habits/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fields),
    }).then(async (res) => {
      if (!res.ok) {
        onClose();
      }

      const body = await res.json();
      onSuccess(body.habit);
      setRequesting(false);
      onClose();
    });
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
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitModal, setHabitModal] = useState(false);
  const [parent, enableAnimations] = useAutoAnimate();
  const taskColors: Record<number, string> = {
    0: 'bg-task-1',
    1: 'bg-task-2',
    2: 'bg-task-3',
    3: 'bg-task-4',
    4: 'hover:bg-task-1-hover',
    5: 'hover:bg-task-2-hover',
    6: 'hover:bg-task-3-hover',
    7: 'hover:bg-task-4-hover',
  };

  useEffect(() => {
    fetch('/api/habits').then(async (res) => {
      if (!res.ok) return;
      const body: { habits: Habit[] } = await res.json();
      setHabits(body.habits);
    });
  }, []);

  const updateHabit = useCallback((id: String) => {
    fetch(`/api/habits/complete?id=${id}`, { method: 'POST' }).then(() => {});
  }, []);

  return (
    <>
      <Head>
        <title>Habit Tracker</title>
      </Head>

      <section className="">
        {habitModal ? (
          <HabitModal
            onClose={() => setHabitModal(false)}
            onSuccess={(habit) => setHabits((old) => [...old, habit])}
          />
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
            {habits
              .filter(
                (habit) =>
                  !isSameDay(new Date(), new Date(habit.lastCompleted || ''))
              )
              .map((habit, index) => (
                <li
                  key={habit.id}
                  className={`w-10/12  my-2 mx-auto rounded-md bg-task-1 transition-colors ${
                    taskColors[index % 4]
                  } ${taskColors[(index % 4) + 4]}`}
                >
                  <button
                    className="block p-4 text-white w-full"
                    type="button"
                    onClick={() => {
                      setHabits((old) =>
                        old.map((item) => {
                          return item.id !== habit.id
                            ? item
                            : {
                                ...item,
                                lastCompleted: new Date().toDateString(),
                              };
                        })
                      );
                      updateHabit(habit.id);
                    }}
                  >
                    {habit.title}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </>
  );
}
