import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { OptionItem } from '../../models/option-item.model';
import { SubjectService } from '../../services/subject.service';
import { MarksService } from '../../services/marks.service';
import { ErrorDialogService } from '../../services/errordialog.sercive';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  subjectForm: FormGroup;
  subject: OptionItem;
  subjects: OptionItem[] = [];
  newSubjects: OptionItem[] = [];
  markTypes: OptionItem[] = [];

  insertAt: number;
  submitted: boolean = false;
  enblSaveSubjectBtn: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private subjectService: SubjectService,
    private markService: MarksService,
    private errorDialogService: ErrorDialogService) { }

  ngOnInit() {
    this.subject = new OptionItem();
    this.getSubjects();
    this.createForm();
  }

  createForm() {
    this.subjectForm = this.formBuilder.group({});
    this.subjectForm.addControl('name', new FormControl(this.subject.Name, [Validators.required]));
    this.subjectForm.addControl('markType', new FormControl(this.subject.Value, [Validators.required]));
  }

  get f() { return this.subjectForm.controls; }

  getSubjects() {
    this.subjectService.getSubjects()
      .subscribe(response => {
        this.subjects = response;
        if (this.markTypes.length === 0) {
          this.markTypes = this.markService.getMarkType();
        }
      });
  }

  addSubject() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.subjectForm.invalid) {
      return;
    }

    if (this.subjects.some(ec => ec.Name === this.subject.Name)) {
      alert(this.subject.Name + ' Subject is already added in subject list');
      return;
    }
    if (this.insertAt != null) {
      this.newSubjects.splice(this.insertAt, 0, this.subject);
      this.subjects.splice(this.insertAt, 0, this.subject);
      this.insertAt = null;
    }
    else {
      this.newSubjects.push(this.subject);
      this.subjects.push(this.subject);
    }
    this.enblSaveSubjectBtn = true;
    this.subject = new OptionItem();
    this.submitted = false;
  }

  editSubject(index: number) {
    this.subject = this.subjects.splice(index, 1)[0];
    this.newSubjects.splice(index, 1)[0];
    this.insertAt = index;
  }

  deleteSubject(index: number) {
    if (confirm('Are you sure you want to remove subject')) {
      // delete from new items array
      this.newSubjects.splice(index, 1);
      // delete from original array
      let deleteSubject = this.subjects.splice(index, 1)[0];
      this.subjectService.deleteSubject(deleteSubject)
        .subscribe(
          data => {
            this.getSubjects();
            this.enblSaveSubjectBtn = false;

            let reason: string;
            if (data === true) {
              reason = 'Subjects has been deleted successfully';
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
                reason = 'Record Not Found in Database. Please add this subject and then save.'
              }
              else {
                reason = error && error.error.ExceptionMessage ? error.error.ExceptionMessage : ''
              }
            }
            this.getSubjects();
            this.enblSaveSubjectBtn = false;
            let data = {};
            data = {
              reason: reason,
              status: error.status
            };
            this.errorDialogService.openDialog(data);
          });
    }
  }

  saveSubjects() {
    this.subjectService.saveSubjects(this.newSubjects)
      .subscribe(
        data => {
          this.subject = new OptionItem();
          this.getSubjects();
          this.enblSaveSubjectBtn = false;

          let reason: string;
          if (data === true) {
            reason = 'Subjects has been saved successfully';
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
  }
  
}
