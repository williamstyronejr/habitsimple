import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const useCurrentDate = () => {
  const [date, setDate] = useState(dayjs());

  // Sets a timeout to update on day change
  useEffect(() => {
    const startNextDay = dayjs().add(1, 'd').startOf('day');
    const diffMS = startNextDay.diff(date);

    const timeout = setTimeout(() => setDate(dayjs()), diffMS);

    return () => clearTimeout(timeout);
  }, [date, setDate]);

  return date.startOf('d');
};

export default useCurrentDate;
