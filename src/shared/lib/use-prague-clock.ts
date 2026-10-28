import { useEffect, useState } from 'react';

const THIRTY_SECONDS = 30_000;

const pragueTime = new Intl.DateTimeFormat('cs-CZ', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Prague',
});

/**
 * Live Europe/Prague clock for the menu bar, refreshed every 30 s.
 * Shows `--:--` until the first tick.
 */
export function usePragueClock(): string {
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    const tick = () => setTime(pragueTime.format(new Date()));
    tick();
    const timer = window.setInterval(tick, THIRTY_SECONDS);
    return () => window.clearInterval(timer);
  }, []);

  return time;
}
