export function getWeek(year, month, date) {
  let onejan = new Date(new Date().getFullYear(), 0, 1);
  let today = new Date(year, month, date);
  let dayOfYear = (today - onejan + 86400000) / 86400000;

  return Math.ceil(dayOfYear / 7);
}
