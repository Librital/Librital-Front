import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HttpClientXsrfModule, provideHttpClient, withInterceptors} from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {authInterceptorInterceptor} from "./interceptors/auth-interceptor.interceptor";
import {NgxEchartsModule, provideEcharts} from "ngx-echarts";
import {MessageService} from "primeng/api";


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptorInterceptor])),
    provideEcharts(),
    MessageService,
  ]
};
