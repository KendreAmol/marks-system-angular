import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { EducationDetails } from '../models/education-details.model';

@Component({
  selector: 'app-education-details',
  templateUrl: './education-details.component.html',
  styleUrls: ['./education-details.component.css']
})
export class EducationDetailsComponent implements OnInit {
  @Output() saveEducationDetailsBtn_Click: EventEmitter<EducationDetails[]> = new EventEmitter<EducationDetails[]>();
  educationDetailsForm: FormGroup;
  educationDetails: EducationDetails;
  listEducationDetails: EducationDetails[] = [];
  submitted: boolean = false;
  insertAt: number;  
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.educationDetails = new EducationDetails();

    this.createForm();
  }

  createForm() {
    this.educationDetailsForm = this.formBuilder.group({});
    this.educationDetailsForm.addControl('qualification', new FormControl(this.educationDetails.Qualification, [Validators.required]));
    this.educationDetailsForm.addControl('board', new FormControl(this.educationDetails.Board, [Validators.required]));
    this.educationDetailsForm.addControl('percentage', new FormControl(this.educationDetails.Percentage, [Validators.required]));
    this.educationDetailsForm.addControl('yearOfPassing', new FormControl(this.educationDetails.YearOfPassing, [Validators.required]));
  }

  get f() { return this.educationDetailsForm.controls; }

  addEducationDetails() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.educationDetailsForm.invalid) {
      return;
    }
    if (this.insertAt != null) {
      this.listEducationDetails.splice(this.insertAt, 0, this.educationDetails);
      this.insertAt = null;
    }
    else {
      this.listEducationDetails.push(this.educationDetails);
    }
    //Send education details to parent using emit method of event
    this.saveEducationDetailsBtn_Click.emit(this.listEducationDetails);

    this.educationDetails = new EducationDetails();
    this.submitted = false;
  }

  editEducationDetails(index: number) {
    this.educationDetails = this.listEducationDetails.splice(index, 1)[0];
    this.insertAt = index;
  }

  deleteEducationDetails(index: number) {
    this.listEducationDetails.splice(index, 1);

    //Send education details to parent once delete using emit method of event
    this.saveEducationDetailsBtn_Click.emit(this.listEducationDetails);
  }
}
