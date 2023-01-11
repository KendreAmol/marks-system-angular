import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { DeleteTeacherComponent } from './teacher/delete-teacher.component';
import { ListTeacherComponent } from './teacher/list-teacher.component';
import { AddTeacherComponent } from './teacher/add-teacher.component';
import { EditTeacherComponent } from './teacher/edit-teacher.component';
import { ViewTeacherComponent } from './teacher/view-teacher.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentListComponent } from './student/student-list.component';
import { AddStudentComponent } from './student/add-student.component';
import { EnterMarksComponent } from './marks/enter-marks.component';
import { ExamConfigurationComponent } from './exam-configuration/exam-configuration.component';
import { ReportComponent } from './report/report.component';
import { CanLoadGuard } from './guards/can-load.guard';
import { SubjectClassMappingComponent } from './master/subject-class-mapping/subject-class-mapping.component';
import { ClassComponent } from './master/class/class.component';
import { SubjectComponent } from './master/subject/subject.component';

const appRoutes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'teacherlist', component: ListTeacherComponent },
    { path: 'addteacher', component: AddTeacherComponent },
    { path: 'viewteacher/:id', component: ViewTeacherComponent },
    { path: 'editteacher/:id', component: EditTeacherComponent },
    { path: 'deleteteacher/:id', component: DeleteTeacherComponent },
    { path: 'studentlist', component: StudentListComponent },
    { path: 'addstudent', component: AddStudentComponent },
    { path: 'entermarks', component: EnterMarksComponent },
    { path: 'examsetup', component: ExamConfigurationComponent },
    { path: 'classmaster', component: ClassComponent },
    { path: 'subjectmaster', component: SubjectComponent },
    { path: 'subjectclasmapping', component: SubjectClassMappingComponent },
    { path: 'report', component: ReportComponent },
    { path: 'reportcard/:studentID/:classID', loadChildren: './report/report.module#ReportModule', canLoad: [CanLoadGuard] },

    // otherwise redirect to Dashboard
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);