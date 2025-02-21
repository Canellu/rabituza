export const getGradientClass = () => {
  const gradients = [
    'from-blue-300 to-blue-800',
    'from-emerald-300 to-emerald-800',
    'from-violet-300 to-violet-800',
    'from-amber-300 to-amber-800',
    'from-rose-300 to-rose-800',
  ];

  const index = Math.floor(Math.random() * gradients.length);
  return gradients[index];
};
