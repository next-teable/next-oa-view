import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { saveAs as importedSaveAs } from 'file-saver';
import { Observable } from 'rxjs';

@Injectable()
export class AttachemntService {
  constructor(public http: _HttpClient) {}

  download(storeFilename: string, downloadFilename: string) {
    this.http
      .post('/attachments/download', { storedFilename: storeFilename }, null, {
        responseType: 'blob',
      })
      .subscribe(res => {
        importedSaveAs(res, decodeURIComponent(downloadFilename));
      });
  }

  list(storedFilenames: string): Observable<any> {
    return this.http.post('/attachments/list', { storedFilenames: storedFilenames.split(',') });
  }
}
