import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from './image.service';
import { ImageMetadata } from './image-metadata';
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'modals',
  templateUrl: 'modals.component.html',
  styleUrls: ['modals.component.css']
})

export class ModalsComponent {
  @Output()
  deletePhoto: EventEmitter<string> = new EventEmitter();

  closeModal(): void {
    $('#overlay').hide();
    $('.modal').hide();
  }

  handleDeletePhoto(): void {
    this.deletePhoto.emit('complete');
  }
}
