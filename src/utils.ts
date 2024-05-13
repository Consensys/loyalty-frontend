export const shortenHexString = (str, length = 10) => {
  return (
    str.slice(0, Math.floor(length / 2)) +
    "..." +
    str.slice(-1 * Math.floor(length / 2))
  );
};
