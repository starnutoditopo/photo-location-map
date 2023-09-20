import * as moment from 'moment';
import { momentToDateString, momentToDateTimeString, momentToTimeString } from '../moment-to-string';

export class DateTimeOriginal {
  constructor(dateOrMoment: Date | ReturnType<typeof import('moment')>) {
    this.moment = moment(dateOrMoment);
  }

  public readonly moment: ReturnType<typeof import('moment')>;

  public toDateTimeString(option: {dayOfWeek: boolean} = {dayOfWeek: false}): string {
    return momentToDateTimeString(this.moment, option);
  }

  public toDateString(option: {dayOfWeek: boolean} = {dayOfWeek: false}): string {
    return momentToDateString(this.moment, option);
  }

  public toTimeString(): string {
    return momentToTimeString(this.moment);
  }
}
