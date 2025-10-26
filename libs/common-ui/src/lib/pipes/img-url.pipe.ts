import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imgUrl',
  standalone: true,
})
export class ImgUrlPipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) return '/assets/imgs/avatar-placeholder.png';
    return `https://icherniakov.ru/yt-course/${value}`;
  }
}
