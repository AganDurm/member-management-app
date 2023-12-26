import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {LoadingService} from '../loading.service';
import {SharedModule} from '../shared/shared.module';

@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './preloader.component.html',
  styleUrl: './preloader.component.less'
})
export class PreloaderComponent {
  isLoading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.isLoading$ = this.loadingService.loading$;
  }
}
