import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from './image.service';
import { ImageMetadata } from './image-metadata';

@Component({
  moduleId: module.id,
  selector: 'gallery',
  templateUrl: 'gallery.component.html',
  providers: [ImageService]
})

export class GalleryComponent implements OnInit {
  imagesMetadata: ImageMetadata[] = [];
  rows: number[] = [];
  imagesMetadataGrid: ImageMetadata[][] = [];

  constructor(private imageService: ImageService, private router: Router) {}

  ngOnInit(): void {
    this.getImagesMetadata();
  }

  getImagesMetadata(): void {
    this.imageService.getImagesMetadata().then(
      imagesMetadata => {
        this.imagesMetadata = imagesMetadata;
        console.log('imagesMetadata: ', imagesMetadata);
        //Prepare 4-column grid
        const numCols = 4;
        let numRows = Math.ceil(imagesMetadata.length / numCols);
        for (let i = 0; i < numRows; i++) {
          this.rows[i] = i;
        }
        for (let y = 0; y < numRows; y++) {
          this.imagesMetadataGrid[y] = [];
          for (let x = 0; x < numCols && (y * numCols) + x < imagesMetadata.length; x++) {
            this.imagesMetadataGrid[y][x] = imagesMetadata[y * numCols + x];
          }
        }
      }
    );
  }

  viewPhoto(imageMetadata: ImageMetadata) {
    this.router.navigate(['/view-photo', imageMetadata.id]);
  }
}
