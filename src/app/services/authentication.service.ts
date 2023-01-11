import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    var data = "username=" + username + "&password=" + password + "&grant_type=password";
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded', 'No-Auth': 'True' });
    return this.http.post<any>(`http://localhost:50299/token`, data, { headers: reqHeader })
      .pipe(map(user => {
        let userToken = new User();
        userToken.userName = user.userName;
        userToken.access_token = user.access_token;
        // login successful if there's a jwt token in the response
        if (userToken && userToken.access_token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.currentUserSubject.next(userToken);
          localStorage.setItem('currentUser', JSON.stringify(this.currentUserSubject));
          localStorage.setItem('token', userToken.access_token);
        }

        return userToken;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

}
