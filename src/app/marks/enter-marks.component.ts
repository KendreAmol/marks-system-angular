import { Component, OnInit } from '@angular/core';
import { ClassService } from '../services/class.service';
import { first, reduce } from 'rxjs/operators';
import { OptionItem } from '../models/option-item.model';
import { StudentService } from '../services/student.service';
import { SubjectService } from '../services/subject.service';
import { forkJoin } from 'rxjs';
import { GridOptions } from 'ag-grid-community';
import { Marks } from '../models/marks.model';
import { MarksService } from '../services/marks.service';
import { ErrorDialogService } from '../services/errordialog.sercive';
import { Router } from '@angular/router';
import { DisplayMarks } from '../models/display-marks.model';
import { ExamService } from '../services/exam.service';
import { ExamConfiguration } from '../models/exam-configuration.model';

@Component({
  selector: 'app-enter-marks',
  templateUrl: './enter-marks.component.html',
  styleUrls: ['./enter-marks.component.css']
})
export class EnterMarksComponent implements OnInit {
  classes: OptionItem[];
  selectedClassID: number;
  selectedClass: OptionItem;

  exams: OptionItem[];
  selectedExamID: number;
  selectedExam: OptionItem;
  examConfiguration: ExamConfiguration[] = [];

  showGrid: boolean = false;
  enableExamDD: boolean = true;
  subjects: OptionItem[] = [];
  students: OptionItem[] = [];

  marks: Marks[] = [];
  fetchedMarks: Marks[] = [];
  displayMarks: DisplayMarks[] = [];
  // ag-grid
  gridOption: GridOptions;

  constructor(private classService: ClassService,
    private studentService: StudentService,
    private subjectService: SubjectService,
    private markService: MarksService,
    private errorDialogService: ErrorDialogService,
    private examService: ExamService) {
    this.gridOption = <GridOptions>{};
    this.gridOption.columnDefs = [];
    this.gridOption.rowData = this.students;
  }

  ngOnInit() {
    forkJoin(
      this.classService.getClasses(),
      this.examService.getExams()
    )
      .subscribe(
        data => {
          this.classes = data[0];
          this.exams = data[1];
        });
  }

  classChange() {
    this.selectedClass = this.classes.find(x => x.ID == this.selectedClassID);
    this.enableExamDD = false;
    this.selectedExamID = null;
  }

  examChange() {
    this.selectedExam = this.exams.find(x => x.ID == this.selectedExamID);

    this.examService.getExamConfigurationByExamIDAndClassID(this.selectedExam.ID, this.selectedClass.ID)
      .subscribe(ec => {
        this.examConfiguration = ec;

        if (this.examConfiguration.length > 0) {
          this.showGrid = true;
          forkJoin(
            this.studentService.getStudentByClassID(this.selectedClass.ID),
            this.subjectService.getSubjectsByClassID(this.selectedClass.ID),
            this.markService.getMarksByClassIDExamID(this.selectedClass.ID, this.selectedExam.ID)
          )
            .subscribe(data => {
              this.students = data[0];
              this.subjects = data[1];
              if (this.subjects.filter(s => s.Value === 'Number').length === this.examConfiguration.length) {
                this.fetchedMarks = data[2];
                this.populateDisplayMarks();
                this.configurGrid();
              } else {
                alert('Exam configurion not found for all subjects. Please setup exam configuration');
                this.showGrid = false;
              }
            });
        } else {
          alert('Exam configurion not found for selected exam. Please setup exam configuration');
          this.showGrid = false;
        }
      });
  }

  configurGrid() {
    let marks1: Marks[] = [];
    let selectedClass = this.selectedClass;
    let selectedExam = this.selectedExam;
    let examConfiguration = this.examConfiguration;
    let subjects = this.subjects;

    let colDef = this.gridOption.columnDefs;
    colDef = [];
    colDef.push({ headerName: 'ID', field: 'StudentID', lockPosition: true, pinned: 'left' });
    colDef.push({ headerName: 'Student Name', field: 'StudentName', lockPosition: true, pinned: 'left', resizable: true });
    this.subjects.forEach(subject => {
      colDef.push(
        {
          headerName: subject.Name,
          field: subject.Name,
          editable: true,
          lockPosition: true,
          // valueParser: subject.Name === 'PT' || subject.Name === 'ICT' ? this.charParser : this.numberParser,
          valueParser: subject.Name === 'PT' || subject.Name === 'ICT' ? this.charParser : function (params) {
            // number parser
            if (isNaN(Number(params.newValue))) {
              alert('Please enter valid number');
              return '';
            } else {
              let subjectToValidateMarks = subjects.find(sub => sub.Name === params.colDef.field)
              let subjectConfiguration = examConfiguration.find(config => config.SubjectID == subjectToValidateMarks.ID);
              if (params.newValue >= 0 && params.newValue <= subjectConfiguration.TotalMark) {
                return Number(params.newValue);
              } else {
                alert('Please enter marks less than or equal to total marks');
                return '';
              }

            }
          },
          onCellValueChanged: function (event) {
            if (event.newValue !== '') {
              if (marks1.some(m => m.StudentID === event.data.StudentID && m.SubjectID === subject.ID && m.ClassID === selectedClass.ID && m.ExamID === selectedExam.ID)) {
                marks1.find(m => m.StudentID === event.data.StudentID && m.SubjectID === subject.ID).Mark = event.newValue;
              } else {
                marks1.push({ StudentID: event.data.StudentID, SubjectID: subject.ID, ClassID: selectedClass.ID, ExamID: selectedExam.ID, Mark: event.newValue });
              }
            }
          }
        });
    });

    colDef.push({
      headerName: 'Total', colId: 'total',
      valueGetter: function totalValueGetter(params) {
        return (+params.data.Marathi) + (+params.data.Hindi) + (+params.data.English) + (+params.data.Science) + (+params.data.Math) + (+params.data.History) + (+params.data.Geography);
      }
    });
    this.marks = marks1;
    this.gridOption.api.setColumnDefs(colDef);
    // this.gridOption.columnApi.setColumnPinned('StudentID', 'left');
    // this.gridOption.columnApi.setColumnPinned('StudentName', 'left');

    this.gridOption.columnApi.autoSizeAllColumns();

    this.gridOption.enterMovesDown = true;
    this.gridOption.enterMovesDownAfterEdit = true;

    // Refresh Grid data
    this.gridOption.rowData = this.displayMarks;
    this.gridOption.api.setRowData(this.gridOption.rowData)
  }

  saveMarksClick() {
    if (this.marks.length > 0) {
      this.markService.saveMarks(this.marks)
        .subscribe(
          data => {
            let reason: string;
            if (data === true) {
              reason = 'Marks has been saved successful';
            } else {
              reason = 'Something went wrong...Please try after sometime';
            }

            let msg = {};
            msg = {
              reason: reason,
              status: "success"
            };
            this.errorDialogService.openDialog(msg);
            this.selectedClassID = null;
            this.selectedExamID = null;
            this.showGrid = false;
          },
          error => {
            let data = {};
            data = {
              reason: error && error.error.ExceptionMessage ? error.error.ExceptionMessage : '',
              status: error.status
            };
            this.errorDialogService.openDialog(data);
          });
    } else {
      alert('No any changes found, Please enter marks');
    }

  }

  populateDisplayMarks() {
    this.displayMarks = [];
    this.students.forEach(student => {
      this.subjects.forEach(subject => {
        this.classes.forEach(class1 => {
          let mrk = this.fetchedMarks.find(fm => fm.StudentID === student.ID && fm.SubjectID === subject.ID && fm.ClassID === class1.ID && fm.ExamID == this.selectedExam.ID);
          if (mrk !== undefined) {
            switch (subject.Name) {
              case 'Marathi':
                if (this.displayMarks.some(s => s.StudentID === student.ID)) {
                  this.displayMarks.find(s => s.StudentID === student.ID).Marathi = mrk.Mark;
                } else {
                  this.displayMarks.push({ StudentID: student.ID, StudentName: student.Name, Marathi: mrk.Mark, Hindi: '', English: '', Science: '', Math: '', History: '', Geography: '', PT: '', ICT: '' });
                }
                break;
              case 'Hindi':
                if (this.displayMarks.some(s => s.StudentID === student.ID)) {
                  this.displayMarks.find(s => s.StudentID === student.ID).Hindi = mrk.Mark;
                } else {
                  this.displayMarks.push({ StudentID: student.ID, StudentName: student.Name, Marathi: '', Hindi: mrk.Mark, English: '', Science: '', Math: '', History: '', Geography: '', PT: '', ICT: '' });
                }
                break;
              case 'English':
                if (this.displayMarks.some(s => s.StudentID === student.ID)) {
                  this.displayMarks.find(s => s.StudentID === student.ID).English = mrk.Mark;
                } else {
                  this.displayMarks.push({ StudentID: student.ID, StudentName: student.Name, Marathi: '', Hindi: '', English: mrk.Mark, Science: '', Math: '', History: '', Geography: '', PT: '', ICT: '' });
                }
                break;
              case 'Science':
                if (this.displayMarks.some(s => s.StudentID === student.ID)) {
                  this.displayMarks.find(s => s.StudentID === student.ID).Science = mrk.Mark;
                } else {
                  this.displayMarks.push({ StudentID: student.ID, StudentName: student.Name, Marathi: '', Hindi: '', English: '', Science: mrk.Mark, Math: '', History: '', Geography: '', PT: '', ICT: '' });
                }
                break;
              case 'Math':
                if (this.displayMarks.some(s => s.StudentID === student.ID)) {
                  this.displayMarks.find(s => s.StudentID === student.ID).Math = mrk.Mark;
                } else {
                  this.displayMarks.push({ StudentID: student.ID, StudentName: student.Name, Marathi: '', Hindi: '', English: '', Science: '', Math: mrk.Mark, History: '', Geography: '', PT: '', ICT: '' });
                }
                break;
              case 'History':
                if (this.displayMarks.some(s => s.StudentID === student.ID)) {
                  this.displayMarks.find(s => s.StudentID === student.ID).History = mrk.Mark;
                } else {
                  this.displayMarks.push({ StudentID: student.ID, StudentName: student.Name, Marathi: '', Hindi: '', English: '', Science: '', Math: '', History: mrk.Mark, Geography: '', PT: '', ICT: '' });
                }
                break;
              case 'Geography':
                if (this.displayMarks.some(s => s.StudentID === student.ID)) {
                  this.displayMarks.find(s => s.StudentID === student.ID).Geography = mrk.Mark;
                } else {
                  this.displayMarks.push({ StudentID: student.ID, StudentName: student.Name, Marathi: '', Hindi: '', English: '', Science: '', Math: '', History: '', Geography: mrk.Mark, PT: '', ICT: '' });
                }
                break;
              case 'PT':
                if (this.displayMarks.some(s => s.StudentID === student.ID)) {
                  this.displayMarks.find(s => s.StudentID === student.ID).PT = mrk.Mark;
                } else {
                  this.displayMarks.push({ StudentID: student.ID, StudentName: student.Name, Marathi: '', Hindi: '', English: '', Science: '', Math: '', History: '', Geography: '', PT: mrk.Mark, ICT: '' });
                }
                break;
              case 'ICT':
                if (this.displayMarks.some(s => s.StudentID === student.ID)) {
                  this.displayMarks.find(s => s.StudentID === student.ID).ICT = mrk.Mark;
                } else {
                  this.displayMarks.push({ StudentID: student.ID, StudentName: student.Name, Marathi: '', Hindi: '', English: '', Science: '', Math: '', History: '', Geography: '', PT: '', ICT: mrk.Mark });
                }
                break;
            }
          } else {
            if (!this.displayMarks.some(s => s.StudentID === student.ID)) {
              this.displayMarks.push({ StudentID: student.ID, StudentName: student.Name, Marathi: '', Hindi: '', English: '', Science: '', Math: '', History: '', Geography: '', PT: '', ICT: '' });
            }
          }
        })
      })
    });
  }

  // numberParser(params) {
  //   console.log(this.examConfiguration);
  //   if (isNaN(Number(params.newValue))) {
  //     alert('Please enter valid number');
  //     return '';
  //   } else {
  //     console.log(params);
  //     return Number(params.newValue);
  //   }
  // }

  charParser(params) {
    if (params.newValue.search(/[^a-dA-D+]+/) === -1) {
      return params.newValue;
    } else {
      alert('Please enter valid grade');
      return '';
    }
  }
}
