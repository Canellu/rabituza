const padNumber = (num: number, padLength: number = 2): string => {
  return num.toString().padStart(padLength, '0');
};

export default padNumber;
