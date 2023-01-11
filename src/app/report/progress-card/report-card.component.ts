import { Component, OnInit } from '@angular/core';
import { ExamService } from '../services/exam.service';
import { OptionItem } from '../models/option-item.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.css']
})
export class ReportCardComponent implements OnInit {
  classID: number;
  exams: OptionItem[] = [];

  constructor(private examService: ExamService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.classID = +params['classID'];
    });

    this.examService.getExams().subscribe(respense => {
      this.exams = respense;

      // Create route from exam short name from DB
      this.exams.forEach(element => {
        element.Name = './' + element.Value as string + 'report/' + element.ID;
        element.Name = element.Name.toLocaleLowerCase();
      });
    });
  }

  backNevigation() {
    this.router.navigate(['/report'], { queryParams: { classID: this.classID } });
  }
}
