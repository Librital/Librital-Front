import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(private route: Router) {}

  public irAboutUs() {

    window.scrollTo(0, 0);

    this.route.navigate(['/about-us']);

  }


}
