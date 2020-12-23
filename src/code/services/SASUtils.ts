export class SASUtils {
  /*   Converts YYYY-MM-DD to DDMMM  */
  static convertDate(dateStr) {
    var dd = dateStr.substring(8, 10);
    let mm: number = parseInt(dateStr.substring(5, 7)) - 1;
    var mmm = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ][mm];

    var ddmmm = dd + mmm;
    return dd + mmm;
  }
}
