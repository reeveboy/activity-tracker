export const getHrsAsString = (hrs) => {
  const intHrs = parseInt(hrs);
  let hrsStr = `0${intHrs}`;

  if (hrs == intHrs) hrsStr = hrsStr + ":00:00";
  else if (hrs == intHrs + 0.25) hrsStr = hrsStr + ":15:00";
  else if (hrs == intHrs + 0.5) hrsStr = hrsStr + ":30:00";
  else hrsStr = hrsStr + ":45:00";

  return hrsStr;
};
