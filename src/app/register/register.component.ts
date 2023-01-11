import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, UrlSerializer } from '@angular/router';
import { ErrorDialogService } from '../services/errordialog.sercive';
import { UserService } from '../services/user.service';
import { first } from 'rxjs/operators';
import { RegisterUser } from '../models/register-user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  registerUser: RegisterUser;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private errorDialogService: ErrorDialogService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          let msg = {};
          msg = {
            reason: "Registration successful",
            status: "success"
          };
          this.errorDialogService.openDialog(msg);
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error => {
          let reason: string;
          if (error.error.ModelState[""] != undefined) {
            reason = error.error.ModelState[""][0]
          }
          if (error.error.ModelState["model.ConfirmPassword"] != undefined) {
            reason = error.error.ModelState["model.ConfirmPassword"][0];
          }
          if (error.error.ModelState["model.Password"] != undefined) {
            reason = error.error.ModelState["model.Password"][0];
          }
          let data = {};
          data = {
            reason: error && error.error.ExceptionMessage ? error.error.ExceptionMessage : reason,
            status: error.status
          };
          this.errorDialogService.openDialog(data);
          this.loading = false;
        });
  }
}
