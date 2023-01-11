import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ErrorDialogService } from '../services/errordialog.sercive';
import { Router } from '@angular/router';
import { TeacherService } from '../services/teacher.service';
import { Teacher } from '../models/teacher.model';
import { ImageUploaderService } from '../services/image-uploader.service';
import { Models } from '../models/models.enum';
import { EducationDetails } from '../models/education-details.model';
import { ExperienceDetails } from '../models/experience-details.model';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.css']
})
export class AddTeacherComponent implements OnInit {
  addTeacherForm: FormGroup;
  loading = false;
  imageUploadloading = false;
  submitted = false;
  teacher: Teacher;
  selectedFile: File;
  isUploadBtnDisable: boolean = true;
  imagePath: string;
  isImageUpload: boolean = false;
  currentDate: Date;
  dropdownSettings = {};
  isEnglishFluencyControlEnabled: boolean = false;
  isAddEducationDetails: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private errorDialogService: ErrorDialogService,
    private router: Router,
    private teacherService: TeacherService,
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
    this.imagePath = '/assets/default-profile/profile-default.png';
    this.currentDate = new Date();

    this.teacher = new Teacher();
    this.getTeacherByTeacherID(-1);
    this.createForm();
  }

  createForm() {
    this.addTeacherForm = this.formBuilder.group({});
    this.addTeacherForm.addControl('fname', new FormControl(this.teacher.FName, [Validators.required]));
    this.addTeacherForm.addControl('lname', new FormControl(this.teacher.LName, [Validators.required]));
    this.addTeacherForm.addControl('gender', new FormControl(this.teacher.Gender, [Validators.required]));
    this.addTeacherForm.addControl('dob', new FormControl(this.teacher.DOB, [Validators.required]));
    this.addTeacherForm.addControl('knownLanguages', new FormControl(this.teacher.KnownLanguages, [Validators.required]));
    this.addTeacherForm.addControl('englishLanguage', new FormControl(this.teacher.EnglishLanguage));
    this.addTeacherForm.addControl('address', new FormControl(this.teacher.Address));
    this.addTeacherForm.addControl('mobile', new FormControl(this.teacher.Mobile,
      [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10)
      ]));
    this.addTeacherForm.addControl('email', new FormControl(this.teacher.Email,
      [
        Validators.required,
        Validators.email
      ]));
    this.addTeacherForm.addControl('highestQualification', new FormControl(this.teacher.HighestQualification, [Validators.required]));
    this.addTeacherForm.addControl('isExperience', new FormControl(this.teacher.IsExperience, [Validators.required]));
  }

  get f() { return this.addTeacherForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addTeacherForm.invalid) {
      return;
    }

    this.loading = true;
    this.mapFormToObject();
    this.teacherService.addTeacher(this.teacher, this.imagePath)
      .pipe(first())
      .subscribe(
        data => {
          let reason: string;
          if (data === true) {
            reason = 'Teacher has been added successful';
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

  mapFormToObject() {
    this.teacher.DOB = this.addTeacherForm.get('dob').value;
    this.teacher.Gender = this.teacher.Genders.filter(g => g.ID === +this.teacher.Gender)[0];
    if (this.isEnglishFluencyControlEnabled === false) {
      this.teacher.EnglishLanguage = null;
    }
  }

  getTeacherByTeacherID(teacherID: number) {
    this.teacherService.getTeacherByTeacherID(teacherID)
      .pipe(first())
      .subscribe(
        teacher => {
          this.teacher = teacher;
        });
  }

  handleUpload(event: any) {
    this.selectedFile = event.target.files[0];
    this.isUploadBtnDisable = this.isUploadBtnDisable ? false : true;
  }

  onUpload() {
    this.isUploadBtnDisable = true;
    this.imageUploadloading = true;

    this.imageUploaderService.upload(this.selectedFile, Models.Teacher.toString())
      .pipe(first())
      .subscribe(
        data => {
          this.imagePath = data.Path;
          this.isImageUpload = data.IsFileUploaded;
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

  onItemSelect(item: any) {
    if (item.ID === 1 && item.Name === 'English') {
      this.isEnglishFluencyControlEnabled = true;
    }
  }

  onDeSelect(item: any) {
    if (item.ID === 1 && item.Name === 'English') {
      this.isEnglishFluencyControlEnabled = false;
    }
  }

  addEducationDetails() {
    this.isAddEducationDetails = true;
  }

  childAddEducationDetailsBtn_Click(listEducationDtls: EducationDetails[]) {
    this.teacher.EducationDetails = listEducationDtls;
  }

  childAddExperienceDetailsBtn_Click(listExperienceDtls: ExperienceDetails[]) {
    this.teacher.ExperienceDetails = listExperienceDtls;
  }
}
