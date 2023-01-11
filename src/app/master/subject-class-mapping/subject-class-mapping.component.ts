import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { OptionItem } from '../../models/option-item.model';
import { ClassService } from '../../services/class.service';
import { SubjectClassMappingService } from '../../services/subject-class-mapping.service';
import { SubjectService } from '../../services/subject.service';
import { forkJoin } from 'rxjs';
import { ErrorDialogService } from '../../services/errordialog.sercive';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-subject-class-mapping',
  templateUrl: './subject-class-mapping.component.html',
  styleUrls: ['./subject-class-mapping.component.css']
})
export class SubjectClassMappingComponent implements OnInit {
  subjectClassMappingForm: FormGroup;
  submitted: boolean = false;
  subjectClassMapping: OptionItem;
  subjectClassMappings: OptionItem[];
  newsubjectClassMappings: OptionItem[] = [];
  showMappingPannel: boolean = false;
  enblSaveMappingBtn: boolean = false;
  classes: OptionItem[];
  subjects: OptionItem[];

  constructor(private formBuilder: FormBuilder,
    private classService: ClassService,
    private subjectService: SubjectService,
    private mappingServcie: SubjectClassMappingService,
    private errorDialogService: ErrorDialogService) { }

  ngOnInit() {
    this.subjectClassMapping = new OptionItem();
    forkJoin(
      this.subjectService.getSubjects(),
      this.classService.getClasses()
    ).subscribe(results => {
      this.subjects = results[0];
      this.classes = results[1];
    });
    this.createForm();
  }

  createForm() {
    this.subjectClassMappingForm = this.formBuilder.group({});
    this.subjectClassMappingForm.addControl('class', new FormControl(this.subjectClassMapping.Name, [Validators.required]));
    this.subjectClassMappingForm.addControl('subject', new FormControl(this.subjectClassMapping.Value, [Validators.required]));
  }
  get f() { return this.subjectClassMappingForm.controls; }

  onClassChange() {
    this.mappingServcie.getSubjectClassMapping(+this.subjectClassMapping.Name).
      subscribe(mapping => {
        this.showMappingPannel = true;
        this.subjectClassMappings = mapping;
      });
  }

  addMapping() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.subjectClassMappingForm.invalid) {
      return;
    }

    if (this.subjectClassMappings.some(scm => scm.Value.ID === this.subjectClassMapping.Value.ID)) {
      alert('Subject ' + this.subjectClassMapping.Value.Name + ' is already mapped');
      return;
    } else {
      this.subjectClassMappings.push(this.subjectClassMapping);
      this.newsubjectClassMappings.push(this.subjectClassMapping);

      let classID = this.subjectClassMapping.Name;
      this.subjectClassMapping = new OptionItem();
      this.subjectClassMapping.Name = classID;

      this.enblSaveMappingBtn = true;
      this.submitted = false;
    }
  }

  saveMappings() {
    this.mappingServcie.saveMapping(this.newsubjectClassMappings)
      .subscribe(
        data => {
          this.subjectClassMapping = new OptionItem();
          this.newsubjectClassMappings = [];
          this.showMappingPannel = false;
          this.enblSaveMappingBtn = false;
          let reason: string;
          if (data === true) {
            reason = 'Mapping has been saved successfully';
          } else {
            reason = 'Something went wrong...Please try after sometime';
          }

          let msg = {};
          msg = {
            reason: reason,
            status: "success"
          };
          this.errorDialogService.openDialog(msg);
        },
        error => {
          this.enblSaveMappingBtn = false;
          let data = {};
          data = {
            reason: error && error.error.ExceptionMessage ? error.error.ExceptionMessage : '',
            status: error.status
          };
          this.errorDialogService.openDialog(data);
        });


  }

  deleteMapping(index: number) {
    if (confirm('Are you sure you want to remove selecetd Mapping')) {
      // delete from new items array
      this.newsubjectClassMappings.splice(index, 1);
      // delete from original array
      let deleteMapping = this.subjectClassMappings.splice(index, 1)[0];
      // // delete from new items array
      // let id = this.newsubjectClassMappings.indexOf(deleteMapping);
      // this.newsubjectClassMappings.splice(id, 1);

      this.mappingServcie.deleteMapping(deleteMapping)
        .subscribe(
          data => {
            this.onClassChange();

            let reason: string;
            if (data === true) {
              reason = 'Mapping has been deleted successfully';
            } else {
              reason = 'Something went wrong...Please try after sometime';
            }

            let msg = {};
            msg = {
              reason: reason,
              status: "success"
            };
            this.errorDialogService.openDialog(msg);
          },
          error => {
            let reason: string;
            if (error instanceof HttpErrorResponse) {
              if (error.status === 404) {
                reason = 'Record Not Found in Database. Please add this subject and then save.'
              }
              else {
                reason = error && error.error.ExceptionMessage ? error.error.ExceptionMessage : ''
              }
            }

            let data = {};
            data = {
              reason: reason,
              status: error.status
            };
            this.errorDialogService.openDialog(data);
          });
    }
  }


}
