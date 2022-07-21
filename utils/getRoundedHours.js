export const getRoundedHours = (time) => {
  const timeSplit = time.split(":");
  const hrStr = timeSplit[0];
  const hr = parseInt(hrStr);
  const min = parseInt(timeSplit[1]);

  if (min >= 0 && min <= 7) return hr + "." + 0;
  if (min > 7 && min <= 22) return hr + "." + 25;
  if (min > 22 && min <= 37) return hr + "." + 5;
  if (min > 37 && min <= 52) return hr + "." + 75;
  if (min > 52 && min < 60) return `${hr + 1}`;
};
