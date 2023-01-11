import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportCardComponent } from './report-card.component';
import { ProgressCardComponent } from './progress-card/progress-card.component';


@NgModule({
  declarations: [
    ReportCardComponent,
    ProgressCardComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule
  ]
})
export class ReportModule { }
