import { Component, ViewChild, ElementRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { ImageService } from './image.service';
import { ImageMetadata } from './image-metadata';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ImageMetadataFormFieldsComponent } from './image-metadata-form-fields.component';
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'edit-photo-info',
  templateUrl: 'edit-photo-info.component.html',
  styleUrls: ['edit-photo-info.component.css', 'errors.css'],
  providers: [ImageService]
})

export class EditPhotoInfoComponent implements OnInit {
  imageMetadata: ImageMetadata;
  formErrors: any = {'general': []};
  @ViewChild(ImageMetadataFormFieldsComponent)
  private formFieldsComponent: ImageMetadataFormFieldsComponent;

  constructor(private router: Router, private route: ActivatedRoute, private imageService: ImageService) {}

  ngOnInit(): void {
    this.route.params.switchMap((params: Params) => this.imageService.getImageMetadata(params['id']))
      .subscribe((imageMetadata: ImageMetadata) => this.imageMetadata = imageMetadata);
  }

  validate(): boolean {
    let hasFieldErrors = false;
    this.formErrors = this.formFieldsComponent.getFieldErrors();
    if (!$.isEmptyObject(this.formErrors)) {
      hasFieldErrors = true;
    }
    if (this.formErrors['general'] === undefined) {
      this.formErrors['general'] = [];
    }
    if (hasFieldErrors) {
      this.formErrors['general'].push('field-errors');
    }
    return (this.formErrors['general'].length === 0);
  }

  handleSubmit(): void {
    if (!this.validate()) {
      return;
    }
    this.imageService.updateImageMetadata(this.imageMetadata).then(() => {
      this.router.navigate(['/view-photo', this.imageMetadata.id]);
    });
  }

  handleCancel(): void {
    window.history.back();
  }
}
