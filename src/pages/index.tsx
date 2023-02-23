import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Habit } from '@prisma/client';

function isSameDay(date1: Date | null, date2: Date | null) {
  return date1 === null || date2 === null
    ? false
    : date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [parent, enableAnimations] = useAutoAnimate();

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

  console.log(habits);

  return (
    <>
      <Head>
        <title>Habit Tracker</title>
      </Head>

      <section>
        <header></header>

        <div>
          <ul ref={parent}>
            {habits
              .filter(
                (habit) =>
                  !isSameDay(new Date(), new Date(habit.lastCompleted || ''))
              )
              .map((habit) => (
                <li key={habit.id} className="">
                  <button
                    className=""
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
