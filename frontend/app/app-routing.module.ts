import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent }     from './gallery.component';
import { AddPhotoComponent }    from './add-photo.component';
import { ViewPhotoComponent }   from './view-photo.component';

const routes: Routes = [
  { path: '', redirectTo: '/gallery', pathMatch: 'full' },
  { path: 'gallery',  component: GalleryComponent },
  { path: 'add-photo', component: AddPhotoComponent },
  { path: 'view-photo/:id', component: ViewPhotoComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
