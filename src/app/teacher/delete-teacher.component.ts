import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Teacher } from '../models/teacher.model';
import { TeacherService } from '../services/teacher.service';
import { first } from 'rxjs/operators';
import { ConfirmationDialogService } from '../services/confirmation-dialog.service';

@Component({
  selector: 'app-delete-teacher',
  templateUrl: './delete-teacher.component.html',
  styleUrls: ['./delete-teacher.component.css']
})
export class DeleteTeacherComponent implements OnInit {
  teacherID: number;
  teacherDetails: Teacher;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private teacherService: TeacherService,
    private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit() {
    // Read Query Paramer Value
    this.route.paramMap.subscribe(params => {
      this.teacherID = +params.get("id");
    });

    this.teacherDetails = new Teacher();
    this.getTeacherDetails(this.teacherID);
  }

  getTeacherDetails(id: number) {
    this.teacherService.getTeacherByTeacherID(id).pipe(first()).subscribe(teacher => {
      this.teacherDetails = teacher;
    });
  }

  deleteTeacher(id: number) {
    this.teacherService.deleteTeacher(id).pipe(first()).subscribe(result => {
      let res = result;
      if (res !== undefined && res === true) {
        this.router.navigate(["teacherlist"]);
      }
    });
  }

  public openConfirmationDialog(teacherID: number) {
    
    this.confirmationDialogService.confirm('S2D', 'Are you sure do you want to delete teacher... ?')
      .then((confirmed) => {
        if(confirmed === true){
          this.deleteTeacher(teacherID);
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
}
