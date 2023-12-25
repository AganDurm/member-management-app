import {Pipe, PipeTransform} from '@angular/core';
import {File} from '../model/file';

@Pipe({
  name: 'filterUserFile'
})
export class FilterUserFilePipe implements PipeTransform {

  transform(items: File[], filterText: string): any[] {
    if (!items) {
      return [];
    }
    if (!filterText) {
      return items;
    }
    filterText = filterText.toLowerCase();
    return items.filter(item => {
      return item.fileName.toLowerCase().includes(filterText);
    });
  }

}
