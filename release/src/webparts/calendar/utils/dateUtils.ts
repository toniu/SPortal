import * as moment from 'moment';

export function toLocaleLongDateString(date: Date): string {
    return moment(date).format('LL');
}

export function toLocaleShortDateString(date: Date): string {
    return moment(date).format('ll');
}