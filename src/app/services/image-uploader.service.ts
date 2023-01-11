import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { ImageUploaderResponse } from '../models/image-uploader-response.model';
import { Models } from '../models/models.enum';



@Injectable({
  providedIn: 'root'
})
export class ImageUploaderService {

  constructor(private http: HttpClient) { }

  upload(fileToUpload: File,model: string) {
    const uploadData = new FormData();
    uploadData.append('custPic', fileToUpload,fileToUpload.name);

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers = headers.append('Model',model);

    return this.http.post<ImageUploaderResponse>("http://localhost:50299/api/image-uplaod", uploadData, { headers: headers });
  }
}
