import { Component, OnInit } from '@angular/core';
import { ClassService } from '../services/class.service';
import { OptionItem } from '../models/option-item.model';
import { StudentService } from '../services/student.service';
import { Student } from '../models/student.class';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  exams: OptionItem[] = [];
  classes: OptionItem[] = [];
  students: OptionItem[] = [];
  selectedClass: number;
  showStudentPanel: boolean = false;

  constructor(private classService: ClassService,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // read route parameters
    // this.route.snapshot.paramMap.get('classID');

    // read query parameters
    this.route.queryParams.subscribe(params => {
      this.selectedClass = +params['classID'] || 0;
      if (this.selectedClass != 0) {
        this.onClassChange();
      } else {
        this.showStudentPanel = false;
      }
    });

    this.getClasses();
  }

  getClasses() {
    this.classService.getClasses()
      .subscribe(
        result => {
          this.classes = result;
        });
  }

  onClassChange() {
    this.studentService.getStudentByClassID(this.selectedClass)
      .subscribe(student => {
        this.students = student;
        this.showStudentPanel = true;
      })
  }

  showReportCard(studentID: number) {
    this.router.navigate(['reportcard', studentID, this.selectedClass]);
    this.showStudentPanel = false;
  }
}
