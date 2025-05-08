import padNumber from '@/lib/utils/padNumber';
import { ReactNode, useEffect, useState } from 'react';
import ToughestProgress from './ToughestProgress';

const ToughestCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDateStr = '2025-09-05T23:00:00.000Z'; // FIXME: Hardcoded 23:00 to offset 1hour

    const calculateTimeLeft = () => {
      const now = new Date();
      const targetDate = new Date(targetDateStr);

      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-3 p-4 bg-gradient-to-tl to-60% from-emerald-400 to-emerald-900 rounded-xl dark:to-emerald-900/50 dark:from-emerald-400/50">
      <h2 className="text-2xl font-bold bg-gradient-to-b from-stone-300 to-stone-50 bg-clip-text text-transparent text-stone-400">
        Time until Race Day
      </h2>
      <div className="grid grid-cols-4 gap-2">
        <DigitContainer>
          <Digit>{timeLeft.days}</Digit>
          <Subtext>Days</Subtext>
        </DigitContainer>

        <DigitContainer>
          <Digit>{padNumber(timeLeft.hours)}</Digit>
          <Subtext>Hours</Subtext>
        </DigitContainer>

        <DigitContainer>
          <Digit>{padNumber(timeLeft.minutes)}</Digit>
          <Subtext>Minutes</Subtext>
        </DigitContainer>
        <DigitContainer>
          <Digit>{padNumber(timeLeft.seconds)}</Digit>
          <Subtext>Seconds</Subtext>
        </DigitContainer>
      </div>
      <ToughestProgress />
    </div>
  );
};

const DigitContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-white/20 backdrop-blur-lg border border-white/10 p-3 rounded-xl text-center shadow-lg">
      {children}
    </div>
  );
};

const Digit = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-2xl text-stone-50 font-bold geist-mono dark:text-stone-200">
      {children}
    </div>
  );
};

const Subtext = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-gray-100 tracking-wide text-[0.6rem] font-bold uppercase dark:text-gray-200">
      {children}
    </div>
  );
};

export default ToughestCountdown;
