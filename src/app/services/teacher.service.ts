import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Teacher } from '../models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient) { }

  getTeachers() {
    return this.http.get<Teacher[]>(`http://localhost:50299/api/teacher`);
  }

  getTeacherByTeacherID(id: number) {
    return this.http.get<Teacher>(`http://localhost:50299/api/getteacherbyid/` + id);
  }
  
  addTeacher(teacher: Teacher,imagePath:string) {
    teacher.ImagePath = imagePath;
    return this.http.post<boolean>(`http://localhost:50299/api/addteacher/`, teacher);
  }

  editTeacher(id: number, teacher: Teacher) {
    teacher.ID = id;
    return this.http.post<boolean>(`http://localhost:50299/api/editteacher/`, teacher);
  }

  deleteTeacher(id: number) {
    return this.http.post<boolean>(`http://localhost:50299/api/deleteteacher/`, id);
  }
}
