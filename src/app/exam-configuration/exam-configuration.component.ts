import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ExamConfiguration } from '../models/exam-configuration.model';
import { SubjectService } from '../services/subject.service';
import { OptionItem } from '../models/option-item.model';
import { forkJoin } from 'rxjs';
import { ExamService } from '../services/exam.service';
import { ClassService } from '../services/class.service';
import { ErrorDialogService } from '../services/errordialog.sercive';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-exam-configuration',
  templateUrl: './exam-configuration.component.html',
  styleUrls: ['./exam-configuration.component.css']
})
export class ExamConfigurationComponent implements OnInit {
  examConfigurationForm: FormGroup;
  examConfiguration: ExamConfiguration;
  listExamConfiguration: ExamConfiguration[] = [];
  newListExamConfiguration: ExamConfiguration[] = [];

  selectedExam: OptionItem;
  selectedClass: OptionItem;
  subjects: OptionItem[] = [];
  exams: OptionItem[] = [];
  classes: OptionItem[] = [];

  submitted: boolean = false;
  insertAt: number;
  enblSaveExamConfigBtn: boolean = false;
  showCardBody: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private subjectService: SubjectService,
    private examService: ExamService,
    private classService: ClassService,
    private errorDialogService: ErrorDialogService) { }

  ngOnInit() {
    this.examConfiguration = new ExamConfiguration();
    this.getSubjectsExamsAndClasses();
    this.createForm();
    this.examConfigurationForm.get('class').disable();
  }

  createForm() {
    this.examConfigurationForm = this.formBuilder.group({});
    this.examConfigurationForm.addControl('exam', new FormControl(this.examConfiguration.Exam, [Validators.required]));
    this.examConfigurationForm.addControl('class', new FormControl(this.examConfiguration.Class, [Validators.required]));
    this.examConfigurationForm.addControl('subject', new FormControl(this.examConfiguration.Subject, [Validators.required]));
    this.examConfigurationForm.addControl('totalMark', new FormControl(this.examConfiguration.TotalMark, [Validators.required]));
    this.examConfigurationForm.addControl('passingMark', new FormControl(this.examConfiguration.PassingMark, [Validators.required]));
  }

  get f() { return this.examConfigurationForm.controls; }

  addExamConfiguration() {
    this.submitted = true;


    this.selectedExam = this.examConfiguration.Exam;
    this.selectedClass = this.examConfiguration.Class;
    // stop here if form is invalid
    if (this.examConfigurationForm.invalid) {
      return;
    }

    if (this.listExamConfiguration.some(ec => ec.Subject.ID === this.examConfiguration.Subject.ID)) {
      alert('Exam configuration is already added for subject ' + this.examConfiguration.Subject.Name);
      return;
    }

    this.enblSaveExamConfigBtn = true;
    
    if (this.insertAt != null) {
      this.listExamConfiguration.splice(this.insertAt, 0, this.examConfiguration);
      this.newListExamConfiguration.splice(this.insertAt, 0, this.examConfiguration);
      this.insertAt = null;
    }
    else {
      this.examConfiguration.ClassID = this.selectedClass.ID;
      this.examConfiguration.ExamID = this.selectedExam.ID;
      this.examConfiguration.SubjectID = this.examConfiguration.Subject.ID;

      this.listExamConfiguration.push(this.examConfiguration);
      this.newListExamConfiguration.push(this.examConfiguration);
    }
    this.examConfiguration = new ExamConfiguration();
    this.examConfiguration.Exam = this.selectedExam;
    this.examConfiguration.Class = this.selectedClass;
    this.submitted = false;
  }

  editExamConfiguration(index: number) {
    this.selectedExam = this.examConfiguration.Exam;
    this.selectedClass = this.examConfiguration.Class;

    this.examConfiguration = this.listExamConfiguration.splice(index, 1)[0];
    this.newListExamConfiguration.splice(index, 1);
    this.insertAt = index;

    this.examConfiguration.Exam = this.selectedExam;
    this.examConfiguration.Class = this.selectedClass;
  }

  deleteExamConfiguration(index: number) {
    if (confirm('Are you sure you want to remove configuration')) {
      // delete from new items array
      this.newListExamConfiguration.splice(index, 1);
      // delete from original array
      let deleteExamConfiguration = this.listExamConfiguration.splice(index, 1)[0];
      this.examService.deleteConfigurationByExamConfigurationID(deleteExamConfiguration)
        .subscribe(
          data => {

            this.enblSaveExamConfigBtn = false;

            let reason: string;
            if (data === true) {
              reason = 'Exam configuration has been deleted successfully';
            } else {
              reason = 'Something went wrong...Please try after sometime';
            }

            let msg = {};
            msg = {
              reason: reason,
              status: "success"
            };
            this.errorDialogService.openDialog(msg);
          },
          error => {
            let reason: string;
            if (error instanceof HttpErrorResponse) {
              if (error.status === 404) {
                reason = 'Record Not Found in Database. Please add configuration and then save.'
              }
              else {
                reason = error && error.error.ExceptionMessage ? error.error.ExceptionMessage : ''
              }
            }
            this.enblSaveExamConfigBtn = false;
            let data = {};
            data = {
              reason: reason,
              status: error.status
            };
            this.errorDialogService.openDialog(data);
          });
    }
  }

  getSubjectsExamsAndClasses() {
    forkJoin(
      // this.subjectService.getSubjectsOfMarkTypeNumber(),
      this.examService.getExams(),
      this.classService.getClasses()
    )
      .subscribe(
        results => {
          // this.subjects = results[0];
          this.exams = results[0];
          this.classes = results[1];
        })
  }

  saveExamConfiguration() {
    this.examService.saveExamConfiguration(this.listExamConfiguration)
      .subscribe(
        data => {
          this.enblSaveExamConfigBtn = false;
          let reason: string;
          if (data === true) {
            reason = 'Exam Configuration has been saved successfully';
          } else {
            reason = 'Something went wrong...Please try after sometime';
          }

          let msg = {};
          msg = {
            reason: reason,
            status: "success"
          };
          this.errorDialogService.openDialog(msg);
        },
        error => {
          let data = {};
          data = {
            reason: error && error.error.ExceptionMessage ? error.error.ExceptionMessage : '',
            status: error.status
          };
          this.errorDialogService.openDialog(data);
        });

    this.examConfigurationForm.get('exam').enable();
    this.examConfiguration = new ExamConfiguration();
    this.listExamConfiguration = [];
    this.showCardBody = false;
  }

  onExamChange() {
    this.examConfigurationForm.get('class').enable();
  }

  onClassChange() {
    // this.examConfigurationForm.get('exam').disable();
    // this.examConfigurationForm.get('class').disable();
    this.subjects = null;
    this.subjectService.getSubjectsByClassID(this.examConfiguration.Class.ID)
      .subscribe(res => {
        this.subjects = res;
        this.subjects = this.subjects.filter(s => s.Value == 'Number');

        this.showCardBody = true;

        this.examService.getExamConfigurationByExamIDAndClassID(this.examConfiguration.Exam.ID, this.examConfiguration.Class.ID)
          .subscribe(result => {
            this.listExamConfiguration = result;

            // to reset all fields except Exam and Class
            this.selectedExam = this.examConfiguration.Exam;
            this.selectedClass = this.examConfiguration.Class;
            this.examConfiguration = new ExamConfiguration();
            this.examConfiguration.Exam = this.selectedExam;
            this.examConfiguration.Class = this.selectedClass;
          });
      });


  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.ID === c2.ID : c1 === c2;
  }

}
