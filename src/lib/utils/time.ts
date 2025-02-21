export const formatTime = (
  date: Date,
  format: 'HH:mm:ss' | 'HH:mm' = 'HH:mm:ss'
) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  switch (format) {
    case 'HH:mm':
      return `${hours}:${minutes}`;
    case 'HH:mm:ss':
    default:
      return `${hours}:${minutes}:${seconds}`;
  }
};

// New function to format duration in seconds to HH:mm:ss
export const formatDuration = (durationInSeconds: number): string => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;

  const hoursPart = hours > 0 ? `${hours}h ` : '';
  const minutesPart = minutes > 0 ? `${minutes}min ` : '';
  const secondsPart = `${seconds}s`;

  return `${hoursPart}${minutesPart}${secondsPart}`.trim();
};
