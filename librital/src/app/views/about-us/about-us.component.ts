import { Component } from '@angular/core';
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'app-about-us',
  standalone: true,
    imports: [
        FooterComponent
    ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {

}
