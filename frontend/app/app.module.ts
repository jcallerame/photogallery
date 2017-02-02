import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule }   from '@angular/router';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import { GalleryComponent } from './gallery.component';
import { AddPhotoComponent } from './add-photo.component';
import { ViewPhotoComponent } from './view-photo.component';
import { ImageService } from './image.service';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
   ],
  declarations: [
    AppComponent,
    GalleryComponent,
    AddPhotoComponent,
    ViewPhotoComponent
  ],
  providers: [ ImageService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
