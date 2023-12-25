import { Pipe, PipeTransform } from '@angular/core';
import {Member} from './model/member';

@Pipe({
  name: 'filterMembers',
  standalone: true
})
export class FilterMembers implements PipeTransform {

  transform(items: Member[], filterText: string): any[] {
    if (!items) {
      return [];
    }
    if (!filterText) {
      return items;
    }
    filterText = filterText.toLowerCase();
    return items.filter(item => {
      return item.username.toLowerCase().includes(filterText);
    });
  }

}
