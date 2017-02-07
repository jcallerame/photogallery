export class ImageMetadata {
  id: string;
  title: string;
  capturedYear: number;
  capturedMonth: number;
  capturedDay: number;
  location: string;
  notes: string;

  constructor(config: any) {
    if (config.id !== undefined) {
      this.id = config.id;
    }
    this.title = config.title;
    this.capturedYear = config.capturedYear;
    this.capturedMonth = config.capturedMonth;
    this.capturedDay = config.capturedDay;
    this.location = config.location;
    this.notes = config.notes;
  }

  getDateString(format: any): string {
    if (this.capturedYear == null || this.capturedMonth == null || this.capturedDay == null) {
      return '';
    }
    let date = new Date(this.capturedYear, this.capturedMonth - 1, this.capturedDay);
    return date.toLocaleDateString('en-US', format);
  }

  get longDateString(): string {
    return this.getDateString({weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  get shortDateString(): string {
    return this.getDateString({year: 'numeric', month: 'long', day: 'numeric'});
  }

  set capturedYearHtmlValue(year: string) {
    this.capturedYear = (year === '') ? null : parseInt(year);
  }

  set capturedMonthHtmlValue(month: string) {
    this.capturedMonth = (month === '') ? null : parseInt(month);
  }

  set capturedDayHtmlValue(day: string) {
    this.capturedDay = (day === '') ? null : parseInt(day);
  }

  get capturedYearHtmlValue(): string {
    return (this.capturedYear == null) ? '' : this.capturedYear.toString();
  }

  get capturedMonthHtmlValue(): string {
    return (this.capturedMonth == null) ? '' : this.capturedMonth.toString();
  }

  get capturedDayHtmlValue(): string {
    return (this.capturedDay == null) ? '' : this.capturedDay.toString();
  }
}
