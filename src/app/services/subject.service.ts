import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OptionItem } from '../models/option-item.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private http: HttpClient) { }

  getSubjects() {
    return this.http.get<OptionItem[]>(`http://localhost:50299/api/subject/getsubjects`);
  }

  getSubjectsByClassID(classID: number) {
    return this.http.get<OptionItem[]>(`http://localhost:50299/api/subject/getsubjectsbyclassid/` + classID);
  }

  getSubjectsOfMarkTypeNumber() {
    return this.http.get<OptionItem[]>(`http://localhost:50299/api/subject/getsubjectsofmarktypenumber`);
  }

  saveSubjects(listSubject: OptionItem[]) {
    return this.http.post<boolean>('http://localhost:50299/api/subject/savesubject', listSubject);
  }

  deleteSubject(subject: OptionItem) {
    return this.http.post<boolean>('http://localhost:50299/api/subject/deletesubject', subject);
  }
}
