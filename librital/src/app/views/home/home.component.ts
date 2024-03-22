import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {SpinnerService} from "../../services/spinner.service";
import {NgIf} from "@angular/common";
import {Application} from "@splinetool/runtime";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    NgIf,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  isLoading: boolean = false;
  constructor(private spinnerService: SpinnerService) {}

  ngOnInit() {

  }


   reducirOpacidad(): void {
    this.isLoading = true;
    this.spinnerService.setOpacidad(0.9);
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  }


}
