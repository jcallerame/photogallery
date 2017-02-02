import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ImageService } from './image.service';
import { ImageMetadata } from './image-metadata';
import { Router } from '@angular/router';

import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'view-photo',
  templateUrl: 'view-photo.component.html',
  styleUrls: ['view-photo.component.css'],
  providers: [ImageService]
})

export class ViewPhotoComponent implements OnInit {
  imageMetadata: ImageMetadata;

  constructor(private imageService: ImageService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.imageService.getImageMetadata(params['id']))
      .subscribe((imageMetadata: ImageMetadata) => this.imageMetadata = imageMetadata);
  }
}
