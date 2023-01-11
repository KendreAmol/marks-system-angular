import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Student } from '../models/student.class';
import { Router } from '@angular/router';
import { StudentService } from '../services/student.service';
import { ImageUploaderService } from '../services/image-uploader.service';
import { ErrorDialogService } from '../services/errordialog.sercive';
import { first } from 'rxjs/operators';
import { OptionItem } from '../models/option-item.model';
import { ImageUploaderResponse } from '../models/image-uploader-response.model';
import { Models } from '../models/models.enum'
@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  addStudentForm: FormGroup;
  loading = false;
  imageUploadloading = false;
  submitted = false;
  isUploadBtnDisable: boolean = true;
  student: Student;
  imageUploaderResponse: ImageUploaderResponse;
  tempStates: OptionItem[];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  selectedFile: File;
  constructor(private formBuilder: FormBuilder,
    private errorDialogService: ErrorDialogService,
    private router: Router,
    private studentService: StudentService,
    private imageUploaderService: ImageUploaderService) { }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.student = new Student();
    this.imageUploaderResponse = new ImageUploaderResponse();
    this.getStudentByStudentID();
    this.createForm();
  }

  createForm() {
    this.addStudentForm = this.formBuilder.group({});
    this.addStudentForm.addControl('rollNo', new FormControl(this.student.RollNo, [Validators.required]));
    this.addStudentForm.addControl('firstName', new FormControl(this.student.FirstName, [Validators.required]));
    this.addStudentForm.addControl('middleName', new FormControl(this.student.MiddleName));
    this.addStudentForm.addControl('lastName', new FormControl(this.student.LastName, [Validators.required]));
    this.addStudentForm.addControl('motherName', new FormControl(this.student.MotherName, [Validators.required]));
    this.addStudentForm.addControl('gender', new FormControl(this.student.Gender, [Validators.required]));
    this.addStudentForm.addControl('class', new FormControl(this.student.Class, [Validators.required]));
    this.addStudentForm.addControl('dob', new FormControl(this.student.DOB, [Validators.required]));
    this.addStudentForm.addControl('city', new FormControl(this.student.City, [Validators.required]));
    this.addStudentForm.addControl('state', new FormControl(this.student.State, [Validators.required]));
    this.addStudentForm.addControl('country', new FormControl(this.student.Country, [Validators.required]));
    this.addStudentForm.addControl('pinCode', new FormControl(this.student.PinCode,
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)
      ]));
    this.addStudentForm.addControl('address', new FormControl(this.student.Address));
    this.addStudentForm.addControl('mobile', new FormControl(this.student.Mobile,
      [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10)
      ]));
    this.addStudentForm.addControl('email', new FormControl(this.student.Email,
      [
        Validators.required,
        Validators.email
      ]));
    this.addStudentForm.addControl('hobbies', new FormControl(this.student.Hobbies, [Validators.required]));
  }

  get f() { return this.addStudentForm.controls; }

  getStudentByStudentID() {
    this.studentService.getStudentByStudentID(-1)
      .pipe(first())
      .subscribe(
        student => {
          this.student = student;
          this.tempStates = this.student.States;
          this.student.States = [];
        });
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addStudentForm.invalid) {
      return;
    }

    this.loading = true;
    this.mapFormToObject();
    this.studentService.addStudent(this.student, this.imageUploaderResponse.Path)
      .pipe(first())
      .subscribe(
        data => {
          let reason: string;
          if (data === true) {
            reason = 'Student has been added successful';
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
            this.router.navigate(['/studentlist']);
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

  onCountryChange(value: any) {
    this.student.States = this.tempStates;
    this.student.States = this.tempStates.filter(s => s.Value == value);
  }
  // onItemSelect(item: any) {
  //   console.log(this.student.Hobbies);
  // }
  // onSelectAll(items: any) {
  //   console.log(items);
  // }
  // onDeSelect(items: any) {
  //   alert('OnDeSelect');
  // }

  mapFormToObject() {
    this.student.DOB = this.addStudentForm.get('dob').value;
    this.student.Gender = this.student.Genders.filter(g => g.ID === +this.student.Gender)[0];
    this.student.Class = this.student.Classes.filter(cls => cls.ID === +this.student.Class)[0];
    this.student.Country = this.student.Countries.filter(country => country.ID === +this.student.Country)[0];
    this.student.State = this.student.States.filter(s => s.ID === +this.student.State)[0];
  }

  handleUpload(event: any) {
    this.selectedFile = event.target.files[0];
    this.isUploadBtnDisable = this.isUploadBtnDisable ? false : true;
  }

  onUpload() {
    this.isUploadBtnDisable = true;
    this.imageUploadloading = true;

    this.imageUploaderService.upload(this.selectedFile, Models.Student.toString())
      .pipe(first())
      .subscribe(
        data => {
          this.imageUploaderResponse = data;          
          let reason: string;
          if (data.IsFileUploaded === true) {
            let msg = {};
            msg = {
              reason: 'Image Uploaded successful',
              status: "success"
            };
            this.errorDialogService.openDialog(msg);
            this.imageUploadloading = false;
          }
        },
        error => {
          let data = {};
          data = {
            reason: error && error.error.Message ? error.error.Message : '',
            status: error.status
          };
          this.errorDialogService.openDialog(data);
          this.imageUploadloading = false;
        });
  }
}
