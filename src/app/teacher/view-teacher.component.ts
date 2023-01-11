import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TeacherService } from '../services/teacher.service';
import { first } from 'rxjs/operators';
import { Teacher } from '../models/teacher.model';

@Component({
  selector: 'app-view-teacher',
  templateUrl: './view-teacher.component.html',
  styleUrls: ['./view-teacher.component.css']
})
export class ViewTeacherComponent implements OnInit {
  teacher: Teacher;
  teacherID: number;

  constructor(private formBuilder: FormBuilder,
    private teacherService: TeacherService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // Read Query Parameter Value
    this.route.paramMap.subscribe(params => {
      this.teacherID = +params.get("id");
    });

    this.teacher = new Teacher();
    this.getTeacherByTeacherID(this.teacherID);
  }
  getTeacherByTeacherID(teacherID: number) {
    this.teacherService.getTeacherByTeacherID(teacherID)
      .pipe(first()).subscribe(teacher => this.teacher = teacher);
  }
}
