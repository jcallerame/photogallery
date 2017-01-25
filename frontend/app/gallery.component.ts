import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ImageMetadataService } from './image-metadata.service';
import { ImageMetadata } from './image-metadata';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'gallery.component.html',
  providers: [ImageMetadataService]
})

export class GalleryComponent implements OnInit {
  imagesMetadata: ImageMetadata[];

  constructor(private imageMetadataService: ImageMetadataService) {}

  ngOnInit(): void {
    this.getImagesMetadata();
  }

  getImagesMetadata(): void {
    this.imageMetadataService.getImagesMetadata().then(
      imagesMetadata => {this.imagesMetadata = imagesMetadata; console.log('imagesMetadata: ', imagesMetadata);});
  }
}
