import { Pipe, PipeTransform } from '@angular/core';
import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from 'date-fns';

@Pipe({
  name: 'timePipe',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(value: string | null): string | null {
    if (!value) return null;

    const now = new Date();
    const date = new Date(value + 'Z');

    const sec = differenceInSeconds(now, date);
    const min = differenceInMinutes(now, date);
    const hours = differenceInHours(now, date);
    const days = differenceInDays(now, date);

    if (sec < 10) return 'только что';
    if (sec < 60) return `${sec} сек. назад`;
    if (min < 60) return `${min} мин. назад`;
    if (hours < 24) {
      if (hours === 1) return 'часик назад';
      if (hours < 5) return `${hours} часика назад`;
      return `${hours} часов назад`;
    }
    if (days < 7) {
      if (days === 1) return 'вчера';
      if (days < 5) return `${days} дня назад`;
      return `${days} дней назад`;
    }
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `${weeks} ${weeks === 1 ? 'неделю' : 'недели'} назад`;
    }
    const months = Math.floor(days / 30);
    return `${months} ${months === 1 ? 'месяц' : 'месяцев'} назад`;
  }
}
