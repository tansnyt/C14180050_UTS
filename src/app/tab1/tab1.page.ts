import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  isiData: Observable<data[]>;
  isiDataColl: AngularFirestoreCollection<data>;
  Judul: string;
  Isi: string;
  Nilai: number;
  Tanggal: string;
  ImageURL: string;

  imgSrc: string;
  selectedImage: any = null;

  constructor(afs: AngularFirestore, private afStorage: AngularFireStorage) {
    this.isiDataColl = afs.collection('note_uts');
    this.isiData = this.isiDataColl.valueChanges();
  }

  simpan() {
    console.log(this.ImageURL);
    this.isiDataColl.doc(this.Judul).set({
      judul: this.Judul,
      isi: this.Isi,
      nilai: this.Nilai,
      tanggal: this.Tanggal,
      imageURL: this.ImageURL
    });
  }

  uploadToStorage() {
    var filePath = `imgUts/${this.selectedImage.name}`;
    const fireRef = this.afStorage.ref(filePath);
    this.afStorage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fireRef.getDownloadURL().subscribe((url) => {
          this.ImageURL = url;
        })
      })
    ).subscribe();
    alert("Upload success!");
  }

  showPicture(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];

      this.uploadToStorage();
    } else {
      this.imgSrc = '';
      this.selectedImage = null;
    }
  }

  deleteNote(judul: string, link: string) {
    this.afStorage.refFromURL(link).delete();
    this.isiDataColl.doc(judul).delete();
  }
}

interface data {
  judul: string,
  isi: string,
  nilai: number,
  tanggal: string,
  imageURL: string
}