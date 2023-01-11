import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportCardComponent } from './report-card.component';
import { ProgressCardComponent } from './progress-card/progress-card.component'
export const reportingRoutes: Routes = [
  {
    path: '', component: ReportCardComponent, children: [
      { path: 'test1report/:examID', component: ProgressCardComponent },
      { path: 'test2report/:examID', component: ProgressCardComponent },
      { path: 'sem1report/:examID', component: ProgressCardComponent },
      { path: 'sem2report/:examID', component: ProgressCardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(reportingRoutes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
