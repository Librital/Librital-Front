import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {SpinnerService} from "../../services/spinner.service";
import {NgIf} from "@angular/common";
import {Application} from "@splinetool/runtime";
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    NgIf,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  isLoading: boolean = false;
  constructor(private spinnerService: SpinnerService) {}

  ngOnInit() {
    /*setTimeout(() => {
      this.reducirOpacidad();
    }, 0);*/

  }


   reducirOpacidad(): void {
    this.isLoading = true;
    this.spinnerService.setOpacidad(0.9);
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  }


}
