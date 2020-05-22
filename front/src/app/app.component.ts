import {Component} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Zen code test work: gallery';

  constructor(private titleService: Title,
              private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url == '/404') {
        this.titleService.setTitle("Страница не найдена")
      } else {
        this.titleService.setTitle(this.title)
      }
    })
  }
}
