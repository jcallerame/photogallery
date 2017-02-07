import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from './image.service';
import { ImageMetadata } from './image-metadata';
import { CookieService } from 'angular2-cookie/core';
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'gallery',
  templateUrl: 'gallery.component.html',
  styleUrls: ['gallery.component.css'],
  providers: [ImageService, CookieService]
})

export class GalleryComponent implements OnInit {
  imagesMetadata: ImageMetadata[] = null;
  numPages: number;
  numRows: number = 3;
  numCols: number = 4;
  currentPage: number = 1;
  rows: number[] = [];
  imagesMetadataGrid: ImageMetadata[][][] = [];
  selectedImage: ImageMetadata;
  sortBy: string;

  constructor(private imageService: ImageService, private cookieService: CookieService,
    private router: Router) {}

  ngOnInit(): void {
    $('#photo-table-container').width((this.numCols * 200) + ((this.numCols - 1) * 20));
    let sortBy = this.cookieService.get('sortBy');
    this.sortBy = (sortBy == null) ? 'dateDesc' : sortBy;
    this.getImagesMetadata();
  }

  getImagesMetadata(): void {
    this.imageService.getImagesMetadata().then(
      imagesMetadata => {
        this.imagesMetadata = imagesMetadata;
        console.log('imagesMetadata: ', imagesMetadata);
        this.sortImagesMetadata();
        this.arrangeImagesMetadata();
      }
    );
  }

  arrangeImagesMetadata(): void {
    //Prepare 4-column grid
    for (let i = 0; i < this.numRows; i++) {
      this.rows[i] = i;
    }
    this.numPages = Math.ceil(this.imagesMetadata.length / (this.numRows * this.numCols));
    let numImagesPerPage = this.numRows * this.numCols;
    for (let p = 0; p < this.numPages; p++) {
      this.imagesMetadataGrid[p] = [];
      for (let y = 0; y < this.numRows; y++) {
        this.imagesMetadataGrid[p][y] = [];
        for (let x = 0; x < this.numCols &&
            (p * numImagesPerPage) + (y * this.numCols) + x < this.imagesMetadata.length; x++) {
          this.imagesMetadataGrid[p][y][x] = this.imagesMetadata[(p * numImagesPerPage) +
            (y * this.numCols) + x];
        }
      }
    }
    console.log('imagesMetadataGrid:', this.imagesMetadataGrid);
  }

  viewPhoto(imageMetadata: ImageMetadata) {
    this.router.navigate(['/view-photo', imageMetadata.id]);
  }

  showControls(imageMetadata: ImageMetadata) {
    let controlsId = 'controls-' + imageMetadata.id;
    let controls = document.getElementById(controlsId);
    controls.style.visibility = 'visible';
  }

  hideControls(imageMetadata: ImageMetadata) {
    let controlsId = 'controls-' + imageMetadata.id;
    let controls = document.getElementById(controlsId);
    controls.style.visibility = 'hidden';
  }

  showDeletePhotoModal(imageMetadata: ImageMetadata) {
    this.selectedImage = imageMetadata;
    let overlay = $('#overlay');
    let deleteModal = $('#delete-modal');
    $(overlay).show();
    $(deleteModal).show();
  }

  deletePhoto() {
    if (this.selectedImage != null) {
      this.imageService.deleteImage(this.selectedImage).then(() => {
        this.getImagesMetadata();
        let overlay = $('#overlay');
        let deleteModal = $('#delete-modal');
        $(deleteModal).hide();
        $(overlay).hide();
      });
    }
  }

  goToFirstPage(): void {
    this.currentPage = 1;
  }

  goToLastPage(): void {
    this.currentPage = this.numPages;
  }

  goToNextPage(): void {
    this.currentPage = (this.currentPage >= this.numPages) ? this.numPages - 1 :
      this.currentPage + 1;
  }

  goToPreviousPage(): void {
    this.currentPage = (this.currentPage <= 1) ? 1 : this.currentPage - 1;
  }

  changeSorting(e: any): void {
    console.log("sorting:", e.target.value);
    this.cookieService.put('sortBy', this.sortBy);
    if (this.imagesMetadata != null) {
      this.sortImagesMetadata();
      this.arrangeImagesMetadata();
    }
  }

  sortImagesMetadata(): void {
    let sortFunc: any;
    if (this.sortBy === 'title') {
      sortFunc = (a: any, b: any) => this.byTitle(a, b);
    } else if (this.sortBy === 'dateDesc') {
      sortFunc = (a: any, b: any) => this.byDate(a, b, true);
    } else if (this.sortBy === 'dateAsc') {
      sortFunc = (a: any, b: any) => this.byDate(a, b, false);
    } else if (this.sortBy === 'location') {
      sortFunc = (a: any, b: any) => this.byLocation(a, b);
    }
    this.imagesMetadata.sort(sortFunc);
  }

  byTitle(a: ImageMetadata, b: ImageMetadata) {
    let av = a.title;
    let bv = b.title;
    if (av == null && bv == null) {
      return 0;
    } else if (av == null) {
      return 1;
    } else if (bv == null) {
      return -1;
    } else {
      return av.localeCompare(bv);
    }
  }

  byLocation(a: ImageMetadata, b: ImageMetadata) {
    let av = a.location;
    let bv = b.location;
    if (av == null && bv == null) {
      return 0;
    } else if (av == null) {
      return 1;
    } else if (bv == null) {
      return -1;
    } else {
      return av.localeCompare(bv);
    }
  }

  byDate(a: ImageMetadata, b: ImageMetadata, desc: boolean) {
    let dir = (desc) ? -1 : 1;
    if (a.capturedYear == null || a.capturedMonth == null || a.capturedDay == null) {
      if (b.capturedYear == null || b.capturedMonth == null || b.capturedDay == null) {
        return 0;
      } else {
        return 1;
      }
    } else if (b.capturedYear == null || b.capturedMonth == null || b.capturedDay == null) {
      return -1;
    }
    if (a.capturedYear < b.capturedYear) {
      return -dir;
    } else if (a.capturedYear > b.capturedYear) {
      return dir;
    } else {
      if (a.capturedMonth < b.capturedMonth) {
        return -dir;
      } else if (a.capturedMonth > b.capturedMonth) {
        return dir;
      } else {
        if (a.capturedDay < b.capturedDay) {
          return -dir;
        } else if (a.capturedDay > b.capturedDay) {
          return dir;
        } else {
          return 0;
        }
      }
    }
  }
}
