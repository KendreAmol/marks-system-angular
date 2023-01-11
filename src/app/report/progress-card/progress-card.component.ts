import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarksService } from '../../services/marks.service';
import { ReportResponce } from '../../models/report-responce.model';
import { DatePipe } from '@angular/common';
import { StudentInfo } from '../../models/student-info.model';
import { MarksResponce } from '../../models/marks-responce.model';
import { SubjectService } from '../../services/subject.service';
import { OptionItem } from '../../models/option-item.model';
import { ExamService } from '../../services/exam.service';


@Component({
  selector: 'app-progress-card',
  templateUrl: './progress-card.component.html',
  styleUrls: ['./progress-card.component.css']
})
export class ProgressCardComponent implements OnInit {
  studentID: number;
  classID: number;
  examID: number;
  dateOfBirth: string;
  reportResponce: ReportResponce = new ReportResponce();
  datePipe: DatePipe;
  markOfTypeNumber: MarksResponce[];
  markOfTypeGrade: MarksResponce[];
  sumOfObtainedMark: number;
  sumOfTotalMark: number;
  sumOfPassingMark: number;
  percentage: number;
  result: boolean;
  classification: string;
  today: Date = new Date;
  subjects: OptionItem[];
  exams: OptionItem[];
  classifications: OptionItem[];
  showClassificationTable: boolean = false;
  displayExamName: string;

  constructor(private route: ActivatedRoute,
    private marksService: MarksService,
    private subjectService: SubjectService,
    private examService: ExamService) { }

  ngOnInit() {
    this.reportResponce.StudentInfo = new StudentInfo();
    // Read Query Parameter Value
    this.route.paramMap.subscribe(params => this.examID = +params.get("examID"));

    // Read Query Parameter of parent route
    this.route.parent.paramMap.subscribe(params => {
      this.studentID = +params.get("studentID");
      this.classID = +params.get("classID");
    });

    this.marksService.getMarksByStudentIDClassIDExamID(this.studentID, this.classID, this.examID)
      .subscribe(response => {
        this.reportResponce = response;
        this.markOfTypeNumber = this.reportResponce.MarksResponse.filter(m => m.MarkType === 'Number');
        this.markOfTypeGrade = this.reportResponce.MarksResponse.filter(m => m.MarkType === 'Grade');

        this.sumOfObtainedMark = this.markOfTypeNumber.reduce((sum, cur) => sum + Number(cur.ObtainedMark), 0);
        this.sumOfTotalMark = this.markOfTypeNumber.reduce((sum, cur) => sum + Number(cur.TotalMarks), 0);
        this.sumOfPassingMark = this.markOfTypeNumber.reduce((sum, cur) => sum + Number(cur.PassingMark), 0);

        this.percentage = this.sumOfObtainedMark / this.markOfTypeNumber.length;

        this.subjectService.getSubjects().subscribe(subjects => {
          this.subjects = subjects;
          if (this.markOfTypeNumber.length === this.subjects.filter(s => s.Value === 'Number').length) {
            this.result = this.markOfTypeNumber.some(m => m.Result === 'FAIL');
            if (this.result === true) {
              this.examService.getExams().subscribe(exams => {
                this.exams = exams;
                let examName = this.exams.filter(e => e.ID === this.examID);
                this.displayExamName = examName[0].Value;
                let exam = ("" + examName[0].Value).substring(0, examName[0].Value.length - 1);
                // this.classification = this.marksService.findClass(this.percentage, exam);
                this.classification = 'FAIL';

                this.classifications = this.marksService.getClassification(exam);
                this.showClassificationTable = true;
              });
            } else {
              this.examService.getExams().subscribe(exams => {
                this.exams = exams;
                let examName = this.exams.filter(e => e.ID === this.examID);
                this.displayExamName = examName[0].Value;
                let exam = ("" + examName[0].Value).substring(0, examName[0].Value.length - 1);
                this.classification = this.marksService.findClass(this.percentage, exam);

                this.classifications = this.marksService.getClassification(exam);
                this.showClassificationTable = true;
              });
            }
          } else {
            alert('Marks not found for selected report');
            this.result = true;
          }
        });
      });
  }

  downloadProgressCard(){}

}
