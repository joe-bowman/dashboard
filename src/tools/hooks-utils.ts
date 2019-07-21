import React from "react";

/**
 * A React hook to give you the current Date object.
 *
 * @param currentDate initial Date
 * @returns `Date` object, updated every second
 */
export const useDateTime = (currentDate: Date) => {
  const [date, setDate] = React.useState(currentDate);

  const tick = () => setDate(new Date());

  React.useEffect(() => {
    const timerID = setInterval(tick, 1000);
    return () => clearInterval(timerID);
  });

  return date;
};
