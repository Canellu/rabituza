const bytesToText = (bytes: number): { value: string; unit: string } => {
  if (bytes < 1024) {
    return { value: `${bytes}`, unit: 'bytes' };
  } else if (bytes < 1048576) {
    return { value: `${(bytes / 1024).toFixed(2)}`, unit: 'Kb' };
  } else if (bytes < 1073741824) {
    return { value: `${(bytes / 1048576).toFixed(2)}`, unit: 'Mb' };
  } else {
    return { value: `${(bytes / 1073741824).toFixed(2)}`, unit: 'Gb' };
  }
};

export default bytesToText;
