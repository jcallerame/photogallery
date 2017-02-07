import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule }   from '@angular/router';
import { HttpModule }    from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { AppComponent }  from './app.component';
import { GalleryComponent } from './gallery.component';
import { AddPhotoComponent } from './add-photo.component';
import { ViewPhotoComponent } from './view-photo.component';
import { EditPhotoInfoComponent } from './edit-photo-info.component';
import { ImageMetadataFormFieldsComponent } from './image-metadata-form-fields.component';
import { ModalsComponent } from './modals.component';
import { ImageService } from './image.service';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule
   ],
  declarations: [
    AppComponent,
    GalleryComponent,
    AddPhotoComponent,
    EditPhotoInfoComponent,
    ImageMetadataFormFieldsComponent,
    ViewPhotoComponent,
    ModalsComponent
  ],
  providers: [ ImageService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
