import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import { first } from 'rxjs/operators';
import { Student } from '../models/student.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  constructor(private studentService: StudentService,
    private router: Router) { }

  ngOnInit() {
    this.loadAllStudents();
  }

  private loadAllStudents() {
    this.studentService.getStudents().pipe(first()).subscribe(students => {
      this.students = students;
    });
  }

  addStudent() {
    this.router.navigate(["addstudent"]);
  }

  viewStudent(studentID: number) {
    this.router.navigate(["viewstudent", studentID]);
  }

  editStudent(studentID: number) {
    this.router.navigate(["editstudent", studentID]);
  }

  deleteStudent(studentID: number) {
    this.router.navigate(["deletestudent", studentID]);
  }

}
