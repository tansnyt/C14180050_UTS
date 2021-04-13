import { Injectable } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FotoService {

  constructor(private af: AngularFirestoreModule) { }

}

export interface Photo {
  filePath: string;
  webviewPath: string;
  dataImage: File;
}