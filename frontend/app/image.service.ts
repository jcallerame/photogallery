import { Injectable } from '@angular/core';
import { ImageMetadata } from './image-metadata';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

const SERVICE_BASE_URL = 'http://localhost:8080/photogallery/rest';

@Injectable()
export class ImageService {
  private imagesMetadataUrl = SERVICE_BASE_URL + '/images-metadata';
  private imagesUrl = SERVICE_BASE_URL + '/images';

  constructor (private http: Http) {}

  getImagesMetadata(): Promise<ImageMetadata[]> {
    return this.http.get(this.imagesMetadataUrl)
      .toPromise()
      .then(response => {
        console.log("response: ", response);
        let data = response.json();
        let ims: ImageMetadata[] = [];
        for (let props of data) {
          let imageMetadata = new ImageMetadata(props);
          ims.push(imageMetadata);
        }
        return ims;
      })
      .catch(this.handleError);
  }

  getImageMetadata(id: string): Promise<ImageMetadata> {
    return this.http.get(this.imagesMetadataUrl + '/' + id)
      .toPromise()
      .then(response => {
        let imageMetadata = new ImageMetadata(response.json());
        console.log("image metadata: ", imageMetadata);
        return imageMetadata;
      })
      .catch(this.handleError);
  }

  addImage(mimeType: string, binaryImageData: Blob): Promise<string> {
    let headers = new Headers();
    headers.set("Content-Type", mimeType);
    return this.http.post(this.imagesUrl, binaryImageData, {headers: headers})
      .toPromise()
      .then(response => {
        let imageId = response.json().id;
        console.log("Image id:", imageId);
        return imageId;
      })
      .catch(this.handleError);
  }

  updateImageMetadata(imageMetadata: ImageMetadata): Promise<void> {
    return this.http.put(this.imagesMetadataUrl + '/' + imageMetadata.id, imageMetadata)
      .toPromise()
      .catch(this.handleError);
  }

  deleteImage(imageMetadata: ImageMetadata): Promise<void> {
    return this.http.delete(this.imagesUrl + '/' + imageMetadata.id)
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  // Convert a base64 string to a Blob.
  // This function adapted from code found at:
  // http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  base64ToBlob (b64Data: string, contentType: string): Blob {
    const byteCharacters = atob(b64Data);
    const byteArrays: any[] = [];
    const sliceSize = 512;

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
}
