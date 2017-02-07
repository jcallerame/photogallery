import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { ImageMetadata } from './image-metadata';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'image-metadata-form-fields',
  templateUrl: 'image-metadata-form-fields.component.html',
  styleUrls: ['image-metadata-form-fields.component.css']
})

export class ImageMetadataFormFieldsComponent implements OnInit {
  @ViewChild('yearOptionsContainer') yearOptionsContainer: ElementRef;
  @ViewChild('dayOptionsContainer') dayOptionsContainer: ElementRef;
  @Input()
  imageMetadata: ImageMetadata;
  @Input()
  formErrors: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.populateYearOptions();
    this.populateDayOptions();
  }

  populateYearOptions(): void {
    let html = '<option value="">Year</option>\n';
    let now = new Date();
    let currentYear = parseInt(now.toLocaleDateString('en-US', {year: 'numeric'}));
    for (let year = currentYear; year > currentYear - 30; year--) {
      html += '<option value="' + year + '">' + year + '</option>\n';
    }
    console.log('year options html:', html);
    this.yearOptionsContainer.nativeElement.innerHTML = html;
  }

  populateDayOptions(): void {
    let html = '<option value="">Day</option>\n';
    let currentlySelectedDay = this.imageMetadata.capturedDay;
    let month = this.imageMetadata.capturedMonth;
    let numDays = 31;
    if (month == 9 || month == 4 || month == 6 || month == 11) {
      numDays = 30;
    } else if (month == 2) {
      let year = this.imageMetadata.capturedYear;
      if (year == null || (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0))) {
        numDays = 29;
      } else {
        numDays = 28;
      }
    }
    for (let day = 1; day <= numDays; day++) {
      html += '<option value="' + day + '">' + day + '</option>\n';
    }
    console.log('day options html:', html);
    this.dayOptionsContainer.nativeElement.innerHTML = html;
    if (currentlySelectedDay != null) {
      if (currentlySelectedDay > numDays) {
        currentlySelectedDay = numDays;
      }
      this.imageMetadata.capturedDay = currentlySelectedDay;
      this.dayOptionsContainer.nativeElement.value = currentlySelectedDay;
    } else {
      this.dayOptionsContainer.nativeElement.value = '';
    }
  }

  getFieldErrors(): any {
    let errors = {}
    let numNullDateFields = ((this.imageMetadata.capturedYear == null) ? 1 : 0) +
      ((this.imageMetadata.capturedMonth == null) ? 1 : 0) +
      ((this.imageMetadata.capturedDay == null) ? 1 : 0);
    if (numNullDateFields === 1 || numNullDateFields === 2) {
      errors['date'] = 'partialDate';
    }
    return errors;
  }
}
