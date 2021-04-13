import { Component } from '@angular/core'; import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { ActivatedRoute } from "@angular/router";
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  isiData: Observable<data[]>;
  isiDataColl: AngularFirestoreCollection<data>;
  constructor(private router: ActivatedRoute, private afs: AngularFirestore, private afStorage: AngularFireStorage) {
    this.isiDataColl = afs.collection('note_uts');
  }
  Judul: string;
  Isi: string;
  Nilai: number;
  Tanggal: string;
  ImageURL: string;

  imgSrc: string;
  selectedImage: any = null;

  ngOnInit() {
    let param = this.router.snapshot.paramMap.get("judul");

    this.isiData = this.getPostEntry(param);
    // alert(this.isiData);
  }

  getPostEntry(postTitle: string): Observable<any> {
    return this.afs.collection<any>("note_uts", ref => ref.where('judul', '==', postTitle)).valueChanges();
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

  // simpan() {
  //   console.log(this.ImageURL);
  //   if(this.Judul == null) {
  //     this.Judul = 
  //   }
  //   this.isiDataColl.doc(this.Judul).set({
  //     judul: this.Judul,
  //     isi: this.Isi,
  //     nilai: this.Nilai,
  //     tanggal: this.Tanggal,
  //     imageURL: this.ImageURL
  //   });
  // }

}

interface data {
  judul: string,
  isi: string,
  nilai: number,
  tanggal: string,
  imageURL: string
}