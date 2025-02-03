const getGradeColor = (grade: string) => {
  const colors: Record<string, { text: string; bg: string }> = {
    white: { text: 'text-stone-700', bg: 'bg-white border border-stone-100' },
    green: {
      text: 'text-green-700',
      bg: 'bg-green-100 border border-green-200',
    },
    blue: { text: 'text-blue-700', bg: 'bg-blue-100 border border-blue-200' },
    yellow: {
      text: 'text-yellow-700',
      bg: 'bg-yellow-100 border border-yellow-200',
    },
    orange: {
      text: 'text-orange-700',
      bg: 'bg-orange-100 border border-orange-200',
    },
    red: { text: 'text-red-700', bg: 'bg-red-100 border border-red-200' },
    purple: {
      text: 'text-purple-700',
      bg: 'bg-purple-100 border border-purple-200',
    },
    black: {
      text: 'text-stone-900',
      bg: 'bg-stone-300 border border-stone-300',
    },
    silver: {
      text: 'text-slate-700',
      bg: 'bg-slate-200 border border-slate-300',
    },
    comp: {
      text: 'text-white [text-shadow:_1px_1px_1px_rgb(0_0_0_/_70%)] font-semibold',
      bg: 'bg-gradient-to-tl from-yellow-300 via-orange-400 to-red-600 border border-white',
    },
    'slab of the week': {
      text: 'text-white [text-shadow:_1px_1px_1px_rgb(0_0_0_/_70%)] font-semibold',
      bg: 'bg-gradient-to-tl from-yellow-300 via-orange-400  to-red-600 border border-white',
    },
    'slab of the month': {
      text: 'text-white [text-shadow:_1px_1px_1px_rgb(0_0_0_/_70%)] font-semibold',
      bg: 'bg-gradient-to-tl from-yellow-300 via-orange-400  to-red-600 border border-white',
    },
  };
  return (
    colors[grade] || {
      text: 'text-stone-600',
      bg: 'bg-stone-200 border border-stone-300',
    }
  );
};

export default getGradeColor;
