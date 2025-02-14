const formatTrafficCondition = (text: string | undefined) => {
  if (text === undefined) {
    return '';
  }
  return text
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default formatTrafficCondition;
