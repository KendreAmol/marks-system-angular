import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { OptionItem } from '../../models/option-item.model';
import { ClassService } from '../../services/class.service';
import { ErrorDialogService } from '../../services/errordialog.sercive';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {
  classForm: FormGroup;
  class: OptionItem;
  classes: OptionItem[] = [];
  newClasses: OptionItem[] = [];

  submitted: boolean = false;
  enblSaveClassBtn: boolean = false;
  insertAt: number;

  constructor(private formBuilder: FormBuilder,
    private classService: ClassService,
    private errorDialogService: ErrorDialogService) { }

  ngOnInit() {
    this.class = new OptionItem();
    this.getClasses();
    this.createForm();
  }

  createForm() {
    this.classForm = this.formBuilder.group({});
    this.classForm.addControl('name', new FormControl(this.class.Name, [Validators.required]));
  }

  get f() { return this.classForm.controls; }

  getClasses() {
    this.classService.getClasses().subscribe(result => {
      this.classes = result
    });
  }

  addClass() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.classForm.invalid) {
      return;
    }

    if (this.classes.some(c => c.Name === this.class.Name)) {
      alert(this.class.Name + ' Class is already added in class list');
      return;
    }
    if (this.insertAt != null) {
      this.newClasses.splice(this.insertAt, 0, this.class);
      this.classes.splice(this.insertAt, 0, this.class);
      this.insertAt = null;
    }
    else {
      this.newClasses.push(this.class);
      this.classes.push(this.class);
    }
    this.enblSaveClassBtn = true;
    this.class = new OptionItem();
    this.submitted = false;
  }
  editClass(index: number) {
    this.class = this.classes.splice(index, 1)[0];
    this.newClasses.splice(index, 1)[0];
    this.insertAt = index;
  }

  deleteClass(index: number) {
    if (confirm('Are you sure you want to remove class')) {
      // delete from new items array
      this.newClasses.splice(index, 1);
      // delete from original array
      let deleteClass = this.classes.splice(index, 1)[0];
      this.classService.deleteClass(deleteClass)
        .subscribe(
          data => {
            this.getClasses();
            this.enblSaveClassBtn = false;

            let reason: string;
            if (data === true) {
              reason = 'Class has been deleted successfully';
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
                reason = 'Record Not Found in Database. Please add this class and then save.'
              }
              else {
                reason = error && error.error.ExceptionMessage ? error.error.ExceptionMessage : ''
              }
            }
            this.getClasses();
            this.enblSaveClassBtn = false;
            let data = {};
            data = {
              reason: reason,
              status: error.status
            };
            this.errorDialogService.openDialog(data);
          });
    }
  }

  saveClasses() {
    this.classService.saveClass(this.newClasses)
      .subscribe(
        data => {
          this.class = new OptionItem();
          this.getClasses();
          this.enblSaveClassBtn = false;

          let reason: string;
          if (data === true) {
            reason = 'Class has been saved successfully';
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
