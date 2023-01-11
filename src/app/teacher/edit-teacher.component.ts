import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Teacher } from '../models/teacher.model';
import { OptionItem } from '../models/option-item.model';
import { ErrorDialogService } from '../services/errordialog.sercive';
import { Router, ActivatedRoute } from '@angular/router';
import { TeacherService } from '../services/teacher.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-edit-teacher',
  templateUrl: './edit-teacher.component.html',
  styleUrls: ['./edit-teacher.component.css']
})
export class EditTeacherComponent implements OnInit {
  editTeacherForm: FormGroup;
  loading = false;
  submitted = false;
  teacher: Teacher;
  selectedGender: OptionItem = { ID: 1, Name: 'Male', Value: 1 };
  teacherID: number;

  constructor(private formBuilder: FormBuilder,
    private errorDialogService: ErrorDialogService,
    private router: Router,
    private teacherService: TeacherService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // Read Query Paramer Value
    this.route.paramMap.subscribe(params => {
      this.teacherID = +params.get("id");
    });

    this.teacher = new Teacher();
    this.getTeacherByTeacherID(this.teacherID);
    this.createForm();
  }

  get f() { return this.editTeacherForm.controls; }

  createForm() {
    this.editTeacherForm = this.formBuilder.group({});
    this.editTeacherForm.addControl('name', new FormControl(this.teacher.FName, [Validators.required]));
    this.editTeacherForm.addControl('gender', new FormControl(this.teacher.Gender, [Validators.required]));
    this.editTeacherForm.addControl('address', new FormControl(this.teacher.Address));
    this.editTeacherForm.addControl('mobile', new FormControl(this.teacher.Mobile,
      [
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(10)
      ]));
    this.editTeacherForm.addControl('email', new FormControl(this.teacher.Email,
      [
        Validators.required,
        Validators.email
      ]));
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.editTeacherForm.invalid) {
      return;
    }

    this.loading = true;
    this.teacherService.editTeacher(this.teacher.ID, this.editTeacherForm.value)
      .pipe(first())
      .subscribe(
        data => {
          let reason: string;
          if (data === true) {
            reason = 'Teacher details updated successful';
          } else {
            reason = 'Something went wrong...Please try after sometime';
          }

          let msg = {};
          msg = {
            reason: reason,
            status: "success"
          };
          this.errorDialogService.openDialog(msg);
          this.loading = false;
          if (data === true) {
            this.router.navigate(['/teacherlist']);
          }
        },
        error => {
          let data = {};
          data = {
            reason: error && error.error.ExceptionMessage ? error.error.ExceptionMessage : '',
            status: error.status
          };
          this.errorDialogService.openDialog(data);
          this.loading = false;
        });
  }

  getTeacherByTeacherID(teacherID: number) {
    this.teacherService.getTeacherByTeacherID(teacherID)
      .pipe(first())
      .subscribe(
        teacher => {
          this.teacher = teacher;
          if (this.teacher.Gender !== null) {
            this.selectedGender = this.teacher.Gender;
          }
        });
  }

}
