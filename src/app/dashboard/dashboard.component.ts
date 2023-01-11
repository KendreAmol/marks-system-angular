import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../services/teacher.service';
import { first } from 'rxjs/operators';
import { Teacher } from '../models/teacher.model';
import { Student } from '../models/student.class';
import { StudentService } from '../services/student.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  teachers: Teacher[] = [];
  students: Student[] = [];
  constructor(private teacherService: TeacherService,
    private studentService: StudentService,
    private router: Router) { }

  ngOnInit() {
    this.loadAllTeachers();
  }

  private loadAllTeachers() {
    forkJoin(
      this.teacherService.getTeachers(),
      this.studentService.getStudents()
    ).pipe(first()).subscribe(results => {
      this.teachers = results[0];
      this.students = results[1];
    });
  }

  goToStudentPortal(){
    this.router.navigate(['/studentlist']);
  }

  goToTeacherPortal(){
    this.router.navigate(['/teacherlist']);
  }

}
