import { useEffect, useState } from 'react';

const ToughestProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const targetDate = new Date('2025-09-06T00:00:00');
    const startDate = new Date('2025-01-01T00:00:00');
    const totalDuration = targetDate.getTime() - startDate.getTime();

    const calculateProgress = () => {
      const currentDate = new Date();
      const progressDate = new Date(
        2025,
        currentDate.getMonth(),
        currentDate.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes(),
        currentDate.getSeconds()
      );

      const elapsed = progressDate.getTime() - startDate.getTime();
      const yearProgress = (elapsed / totalDuration) * 100;
      setProgress(Math.min(Math.max(yearProgress, 0), 100));
    };

    calculateProgress();
    const timer = setInterval(calculateProgress, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full mt-4">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-200 to-emerald-700 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs text-emerald-50 font-medium mt-2 text-right">
        {Math.round(progress)}% of the journey
      </div>
    </div>
  );
};

export default ToughestProgress;
