const getGradeColor = (grade: string, dark = false) => {
  const colors: Record<string, { text: string; bg: string }> = {
    white: {
      text: 'text-stone-700',
      bg: dark ? 'bg-white/85 border-transparent' : 'bg-white border-stone-150',
    },
    green: {
      text: 'text-green-700',
      bg: dark
        ? 'bg-green-100/85 border-transparent'
        : 'bg-green-100 border-green-200',
    },
    blue: {
      text: 'text-blue-700',
      bg: dark
        ? 'bg-blue-100/85 border-transparent'
        : 'bg-blue-100 border-blue-200',
    },
    yellow: {
      text: 'text-yellow-700',
      bg: dark
        ? 'bg-yellow-100/85 border-transparent'
        : 'bg-yellow-100 border-yellow-200',
    },
    orange: {
      text: 'text-orange-700',
      bg: dark
        ? 'bg-orange-100/85 border-transparent'
        : 'bg-orange-100 border-orange-200',
    },
    red: {
      text: 'text-red-700',
      bg: dark
        ? 'bg-red-100/85 border-transparent'
        : 'bg-red-100 border-red-200',
    },
    purple: {
      text: 'text-purple-700',
      bg: dark
        ? 'bg-purple-100/85 border-transparent'
        : 'bg-purple-100 border-purple-200',
    },
    black: {
      text: 'text-stone-800',
      bg: dark
        ? 'bg-neutral-400/85 border-transparent'
        : 'bg-neutral-400 border-stone-300',
    },
    silver: {
      text: 'text-slate-700',
      bg: dark
        ? 'bg-slate-200/85 border-transparent'
        : 'bg-slate-200 border-slate-300',
    },
    comp: {
      text: 'text-white [text-shadow:_1px_1px_1px_rgb(0_0_0_/_70%)] font-semibold',
      bg: dark
        ? 'bg-gradient-to-tl from-yellow-300/85 via-orange-400/85 to-red-600/85 border-transparent'
        : 'bg-gradient-to-tl from-yellow-300 via-orange-400 to-red-600 border-white',
    },
    'slab challenge': {
      text: 'text-white [text-shadow:_1px_1px_1px_rgb(0_0_0_/_70%)] font-semibold',
      bg: dark
        ? 'bg-gradient-to-tl from-yellow-300/85 via-orange-400/85 to-red-600/85 border-transparent'
        : 'bg-gradient-to-tl from-yellow-300 via-orange-400 to-red-600 border-white',
    },
  };
  return (
    colors[grade] || {
      text: 'text-stone-600',
      bg: dark
        ? 'bg-stone-200/85 border-transparent'
        : 'bg-stone-200 border-stone-300',
    }
  );
};

export default getGradeColor;
