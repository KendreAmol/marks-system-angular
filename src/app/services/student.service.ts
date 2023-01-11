import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/student.class';
import { OptionItem } from '../models/option-item.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }
  getStudents() {
    return this.http.get<Student[]>(`http://localhost:50299/api/student`);
  }

  getStudentByStudentID(id: number) {
    return this.http.get<Student>(`http://localhost:50299/api/getstudentbyid/` + id);
  }

  getStudentByClassID(id: number) {
    return this.http.get<OptionItem[]>(`http://localhost:50299/api/student/getStudentsbyclassid/` + id);
  }

  addStudent(student: Student, imagePath: string) {
    student.ImagePath = imagePath;
    return this.http.post<boolean>(`http://localhost:50299/api/addstudent/`, student);
  }

  editStudent(id: number, student: Student) {
    student.ID = id;
    return this.http.post<boolean>(`http://localhost:50299/api/editstudent/`, student);
  }

  deleteStudent(id: number) {
    return this.http.post<boolean>(`http://localhost:50299/api/deletestudent/`, id);
  }
  
}
