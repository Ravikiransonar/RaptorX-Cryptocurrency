export const roundToTwoDecimals = (num) => {
  return Math.floor(num * 100) / 100;
};

export const formatLargeNumber = (num) => {
  if (num >= 1e9) {
    return Math.floor(num / 1e9) + 'B'; // Billions
  } else if (num >= 1e6) {
    return Math.floor(num / 1e6) + 'M'; // Millions
  } else if (num >= 1e5) {
    return Math.floor(num / 1e5) + 'L'; // Lakhs
  } else if (num >= 1e3) {
    return Math.floor(num / 1e3) + 'K'; // Thousands
  } else {
    return num.toString(); // Less than 1000
  }
};