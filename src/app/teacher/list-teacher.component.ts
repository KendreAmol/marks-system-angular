import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Teacher } from '../models/teacher.model';
import { TeacherService } from '../services/teacher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-teacher',
  templateUrl: './list-teacher.component.html',
  styleUrls: ['./list-teacher.component.css']
})
export class ListTeacherComponent implements OnInit {
  teachers: Teacher[] = [];
  constructor(private teacherService: TeacherService,
    private router: Router) { }

  ngOnInit() {
    this.loadAllTeachers();
  }

  private loadAllTeachers() {
    this.teacherService.getTeachers().pipe(first()).subscribe(teachers => {
      this.teachers = teachers;
    });
  }

  addTeacher() {
    this.router.navigate(["addteacher"]);
  }

  viewTeacher(teachersID: number) {
    this.router.navigate(["viewteacher", teachersID]);
  }

  editTeacher(teachersID: number) {
    this.router.navigate(["editteacher", teachersID]);
  }

  deleteTeacher(teachersID: number) {
    this.router.navigate(["deleteteacher", teachersID]);
  }

}
