import { Injectable } from '@angular/core';
import { ImageMetadata } from './image-metadata';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ImageMetadataService {
  private imagesMetadataUrl = 'http://localhost:8080/photogallery/rest/images-metadata';

  constructor (private http: Http) {}
  getImagesMetadata(): Promise<ImageMetadata[]> {
    return this.http.get(this.imagesMetadataUrl)
      .toPromise()
      .then(response => {
        var data = response.json() as ImageMetadata[];
        console.log("response: ", response);
        return data;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
