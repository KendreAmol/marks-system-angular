import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OptionItem } from '../models/option-item.model';

@Injectable({
  providedIn: 'root'
})

export class ClassService {

  constructor(private http: HttpClient) { }

  getClasses() {
    return this.http.get<OptionItem[]>(`http://localhost:50299/api/class/getclasses`);
  }

  saveClass(param: OptionItem[]) {
    return this.http.post<boolean>(`http://localhost:50299/api/class/saveclass`, param);
  }

  deleteClass(param: OptionItem) {
    console.log('class api');
    return this.http.post<boolean>(`http://localhost:50299/api/class/deleteclass`,param);
  }

}
