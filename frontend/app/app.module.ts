import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule }   from '@angular/router';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import { GalleryComponent } from './gallery.component';
import { ImageMetadataService } from './image-metadata.service';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
   ],
  declarations: [
    AppComponent,
    GalleryComponent
  ],
  providers: [ ImageMetadataService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
