import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'angular6-interceptor';
  isUserLogedIn: boolean = false;
  openNavBar: boolean = false;

  startedClass = false;
  completedClass = false;
  preventAbuse = false;

  constructor(private authenticationServcie: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    let currentUser = this.authenticationServcie.currentUserValue;
    if (currentUser) {
      this.isUserLogedIn = true;
    }
    else {
      this.isUserLogedIn = false;
    }
  }

  logout() {
    this.authenticationServcie.logout();
    this.router.navigate(['login']);
  }

  onStarted() {
    this.startedClass = true;
    setTimeout(() => {
      this.startedClass = false;
    }, 800);
  }

  onCompleted() {
    this.completedClass = true;
    setTimeout(() => {
      this.completedClass = false;
    }, 800);
  }

  openNav() {
    this.openNavBar = true;
  }

  closeNav() {
    this.openNavBar = false;
  }
}
