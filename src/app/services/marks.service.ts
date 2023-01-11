import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Marks } from '../models/marks.model';
import { OptionItem } from '../models/option-item.model';
import { ReportResponce } from '../models/report-responce.model';

@Injectable({
  providedIn: 'root'
})
export class MarksService {

  constructor(private http: HttpClient) { }

  getMarksByClassIDExamID(classID: number, examID: number) {
    return this.http.get<Marks[]>(`http://localhost:50299/api/mark/getmarksbyclassidexamid/${classID}/${examID}`);
  }

  saveMarks(marks: Marks[]) {
    return this.http.post<boolean>(`http://localhost:50299/api/mark/savemarks`, marks);
  }

  getMarkType() {
    let markType: OptionItem[] = [
      { ID: 1, Name: 'Number', Value: 'Number' },
      { ID: 2, Name: 'Grade', Value: 'Grade' }
    ];
    return markType;
  }

  findClass(per: number, exam: string): string {
    let className: string;
    if (exam === 'TEST') {
      if (per >= 15) {
        className = 'Distinction';
      } else if (per >= 12) {
        className = 'First Class'
      } else if (per >= 10) {
        className = 'Second Class'
      } else if (per >= 7) {
        className = "Pass"
      }
    } else if (exam === 'SEM') {
      if (per >= 75) {
        className = 'Distinction';
      } else if (per >= 60) {
        className = 'First Class'
      } else if (per >= 50) {
        className = 'Second Class'
      } else if (per >= 35) {
        className = "Pass"
      }
    }
    return className;
  }

  getClassification(exam: string): OptionItem[] {
    let classifications: OptionItem[];
    if (exam === 'TEST') {
      classifications = [
        { ID: 1, Name: 'Distinction', Value: '>=15 AND <=20' },
        { ID: 2, Name: 'First Class', Value: '>=12 AND < 15' },
        { ID: 3, Name: 'Second Class', Value: '>=10 AND < 12' },
        { ID: 4, Name: 'Pass', Value: '>=7 AND < 10' }
      ];
    }

    if (exam === 'SEM') {
      classifications = [
        { ID: 1, Name: 'Distinction', Value: '>=75 AND <=100' },
        { ID: 2, Name: 'First Class', Value: '>=60 AND < 75' },
        { ID: 3, Name: 'Second Class', Value: '>=50 AND < 60' },
        { ID: 4, Name: 'Pass', Value: '>=35 AND < 50' }
      ];
    }

    return classifications;
  }

  getMarksByStudentIDClassIDExamID(studentID: number, classID: number, examID: number) {
    return this.http.get<ReportResponce>(`http://localhost:50299/api/mark/getmarksbystudentidclassidexamid/${studentID}/${classID}/${examID}`);
  }
}
