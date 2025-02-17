const bytesToText = (bytes: number): { value: string; unit: string } => {
  if (bytes < 1024) {
    return { value: `${bytes}`, unit: 'B' };
  } else if (bytes < 1048576) {
    return { value: `${(bytes / 1024).toFixed(2)}`, unit: 'KB' };
  } else if (bytes < 1073741824) {
    return { value: `${(bytes / 1048576).toFixed(2)}`, unit: 'MB' };
  } else {
    return { value: `${(bytes / 1073741824).toFixed(2)}`, unit: 'GB' };
  }
};

export default bytesToText;
