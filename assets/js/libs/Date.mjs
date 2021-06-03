export default class DateUtils {
  getOneWeekFromDate(date) {
    const dateObj = new Date(date);
    const sevenDays = 1000 * 60 * 60 * 24 * 7;
    const sevenDaysBefore = Date.parse(dateObj) - sevenDays;
    return new Date(sevenDaysBefore).toISOString();
  }

  getOneDayFromDate(date) {
    const dateObj = new Date(date);
    const oneDay = 1000 * 60 * 60 * 24;
    const oneDayBefore = Date.parse(dateObj) - oneDay;
    return new Date(oneDayBefore).toISOString();
  }
}
