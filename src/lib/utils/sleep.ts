// Utility to add a delay
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default sleep;
