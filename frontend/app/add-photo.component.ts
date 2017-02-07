import { Component, ViewChild, ElementRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { ImageService } from './image.service';
import { ImageMetadata } from './image-metadata';
import { Router } from '@angular/router';
import { ImageMetadataFormFieldsComponent } from './image-metadata-form-fields.component';
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'add-photo',
  templateUrl: 'add-photo.component.html',
  styleUrls: ['add-photo.component.css', 'errors.css'],
  providers: [ImageService]
})

export class AddPhotoComponent{
  uploadedFile: any;
  imageUrl: string = null;
  imageMetadata: ImageMetadata = new ImageMetadata({});
  formErrors: any = {'general': []};

  @ViewChild(ImageMetadataFormFieldsComponent)
  private formFieldsComponent: ImageMetadataFormFieldsComponent;

  constructor(private router: Router, private imageService: ImageService) {}

  handleUpload(event: any): void {
    this.uploadedFile = event.target.files[0];
    if (!/^image\//.test(this.uploadedFile.type)) {
      //TODO: Show error message
      return;
    }
    let image = document.createElement("img");
    //image.classList.add("obj");
    //image.file = this.uploadedFile;
    let imageHolder = document.getElementById('photo-holder');
    if (imageHolder.firstChild) {
      imageHolder.removeChild(imageHolder.firstChild);
    }
    imageHolder.appendChild(image);

    image.style.maxWidth = '600px';
    image.style.maxHeight = '450px';

    let reader = new FileReader();
    reader.onload = ((aImg) => {
      return (e: any) => {
        this.imageUrl = e.target.result;
        aImg.src = this.imageUrl;
      };
    })(image);
    reader.readAsDataURL(this.uploadedFile);
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
    if (this.imageUrl == null) {
      this.formErrors['general'].push('no-photo-uploaded');
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
    let re = /^data:(image\/.*?);base64,(.*)$/;
    let matches = re.exec(this.imageUrl);
    if (matches == null) {
      //TODO: Show error
      console.log("Error: Image URL not in expected format.");
      return;
    }
    let mimeType = matches[1];
    let base64Data = matches[2];
    let blob = this.imageService.base64ToBlob(base64Data, mimeType);
    console.log("imageUrl.length:", this.imageUrl.length);
    console.log("base64Data.length:", base64Data.length);
    console.log("typeof blob:", typeof blob);
    this.imageService.addImage(mimeType, blob).then(
      imageId => {
        this.imageMetadata.id = imageId;
        this.imageService.updateImageMetadata(this.imageMetadata).then(() => {
          this.router.navigate(['/gallery']);
        });
      }
    );
  }

  handleCancel(): void {
    window.history.back();
  }
}
