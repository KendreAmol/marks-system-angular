import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OptionItem } from '../models/option-item.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectClassMappingService {

  constructor(private http: HttpClient) { }
  getSubjectClassMapping(classID:number) {
    return this.http.get<OptionItem[]>(`http://localhost:50299/api/subjectclassmapping/getsubjectclassmaping/${classID}`);
  }

  saveMapping(mappings:OptionItem[]){
    return this.http.post<boolean>('http://localhost:50299/api/subjectclassmapping/saveMapping',mappings);
  }
  deleteMapping(mapping:OptionItem){
    return this.http.post<true>('http://localhost:50299/api/subjectclassmapping/deleteMapping',mapping);
  }
}
