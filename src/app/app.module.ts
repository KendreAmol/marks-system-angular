import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material';
import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorDialogComponent } from './errorDialog/error-dialog.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { routing } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { DeleteTeacherComponent } from './teacher/delete-teacher.component';
import { ListTeacherComponent } from './teacher/list-teacher.component';
import { AddTeacherComponent } from './teacher/add-teacher.component';
import { EditTeacherComponent } from './teacher/edit-teacher.component';
import { ViewTeacherComponent } from './teacher/view-teacher.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentListComponent } from './student/student-list.component';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AddStudentComponent } from './student/add-student.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NumberOnlyDirective } from './directive/number-only.directive';
import { EducationDetailsComponent } from './teacher/education-details.component';
import { ExperienceDetailsComponent } from './teacher/experience-details.component';
import { EnterMarksComponent } from './marks/enter-marks.component';
import { AgGridModule } from 'ag-grid-angular';
import { ExamConfigurationComponent } from './exam-configuration/exam-configuration.component';
import { ReportComponent } from './report/report.component';
import { SubjectClassMappingComponent } from './master/subject-class-mapping/subject-class-mapping.component'
import { ClassComponent } from './master/class/class.component';
import { SubjectComponent } from './master/subject/subject.component';

@NgModule({
  declarations: [
    AppComponent,
    ErrorDialogComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    DeleteTeacherComponent,
    ListTeacherComponent,
    AddTeacherComponent,
    EditTeacherComponent,
    ViewTeacherComponent,
    ConfirmationDialogComponent,
    DashboardComponent,
    StudentListComponent,
    AddStudentComponent,
    NumberOnlyDirective,
    EducationDetailsComponent,
    ExperienceDetailsComponent,
    EnterMarksComponent,
    ExamConfigurationComponent,
    ReportComponent,
    ClassComponent,
    SubjectComponent,
    SubjectClassMappingComponent
  ],
  entryComponents: [ErrorDialogComponent, ConfirmationDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    routing,
    NgbModule,
    NgProgressModule.withConfig({
      spinnerPosition: 'left',
      color: '#000000'
    }),
    NgProgressHttpModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    AgGridModule.withComponents([]),

  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
