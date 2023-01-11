import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OptionItem } from '../models/option-item.model';
import { ExamConfiguration } from '../models/exam-configuration.model'

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private http: HttpClient) { }

  getExams() {
    return this.http.get<OptionItem[]>(`http://localhost:50299/api/exam/getexams`);
  }

  getExamConfigurationByExamIDAndClassID(examID: number, classID: number) {
    return this.http.get<ExamConfiguration[]>(`http://localhost:50299/api/exam/getexamconfigurationbyexamidandclassid/${examID}/${classID}`);
  }

  saveExamConfiguration(listExamConfiguration: ExamConfiguration[]) {    
    return this.http.post<boolean>(`http://localhost:50299/api/exam/saveexamconfigurations`, listExamConfiguration);
  }

  deleteConfigurationByExamConfigurationID(examConfiguration:ExamConfiguration){
    return this.http.post<Boolean>(`http://localhost:50299/api/exam/deleteexamconfigurationbyexamconfigurationid`,examConfiguration);
  }

}
