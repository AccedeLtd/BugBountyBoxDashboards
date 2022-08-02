import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'bbb-site';
  constructor() {
    document.querySelector("meta[name=viewport]")!.setAttribute('content', 'width=device-width, initial-scale=' + (1 / window.devicePixelRatio));
  }
}
