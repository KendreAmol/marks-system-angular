import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ExperienceDetails } from '../models/experience-details.model';

@Component({
  selector: 'app-experience-details',
  templateUrl: './experience-details.component.html',
  styleUrls: ['./experience-details.component.css']
})
export class ExperienceDetailsComponent implements OnInit {
  @Output() addExperienceDetailsBtn_Click: EventEmitter<ExperienceDetails[]> = new EventEmitter<ExperienceDetails[]>();
  experienceDetailsForm: FormGroup;
  experienceDetails: ExperienceDetails;
  listExperienceDetails: ExperienceDetails[] = [];
  submitted: boolean = false;
  insertAt: number;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.experienceDetails = new ExperienceDetails();
    this.createForm();
  }

  createForm() {
    this.experienceDetailsForm = this.formBuilder.group({});
    this.experienceDetailsForm.addControl('period', new FormControl(this.experienceDetails.Period, [Validators.required]));
    this.experienceDetailsForm.addControl('organization', new FormControl(this.experienceDetails.Organization, [Validators.required]));
    this.experienceDetailsForm.addControl('organizationAddress', new FormControl(this.experienceDetails.OrganizationAddress, [Validators.required]));
    this.experienceDetailsForm.addControl('designation', new FormControl(this.experienceDetails.Designation, [Validators.required]));
    this.experienceDetailsForm.addControl('reasonOfChange', new FormControl(this.experienceDetails.ReasonOfChange, [Validators.required]));
  }

  get f() { return this.experienceDetailsForm.controls; }

  addExperienceDetails() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.experienceDetailsForm.invalid) {
      return;
    }

    if (this.insertAt != null) {
      this.listExperienceDetails.splice(this.insertAt, 0, this.experienceDetails);
      this.insertAt = null;
    }
    else {
      this.listExperienceDetails.push(this.experienceDetails);
    }
    //Send education details to parent using emit method of event
    this.addExperienceDetailsBtn_Click.emit(this.listExperienceDetails);

    this.experienceDetails = new ExperienceDetails();
    this.submitted = false;

  }

  editExperienceDetails(index: number) {
    this.experienceDetails = this.listExperienceDetails.splice(index, 1)[0];
    this.insertAt = index;
  }

  deleteExperienceDetails(index: number) {
    this.listExperienceDetails.splice(index, 1);

    //Send education details to parent once delete using emit method of event
    this.addExperienceDetailsBtn_Click.emit(this.listExperienceDetails);
  }
}
