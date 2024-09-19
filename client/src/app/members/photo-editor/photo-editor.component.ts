import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../_models/Member';
import { DecimalPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../_services/account.service';
import { environment } from '../../../environments/environment';
import { MembersService } from '../../_services/members.service';
import { Photo } from '../../_models/Photo';
@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, FileUploadModule, DecimalPipe, NgStyle],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit {
  private accountservice = inject(AccountService)
  private memberservice = inject(MembersService)
  member = input.required<Member>();
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl
  memberChange = output<Member>();
  ngOnInit(): void {
    this.intitializeUploader()
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo) {
    this.memberservice.setMainPhoto(photo).subscribe({
      next: _ => {
        const user = this.accountservice.currentUser()
        if (user) {
          user.photoUrl = photo.url;
          this.accountservice.setCurrentUser(user);
        }
        const updatedMember = { ...this.member() }
        updatedMember.photoUrl = photo.url;
        updatedMember.photos.forEach(p => {
          if (p.isMain) { p.isMain = false }
          if (p.id === photo.id) { p.isMain = true }
        });
        this.memberChange.emit(updatedMember)
      }
    })
  }

  deletephoto(photo: Photo) {
    this.memberservice.deletephoto(photo).subscribe({
      next: _ => {
        const updatedMember = { ...this.member() }
        updatedMember.photos = updatedMember.photos.filter(x => x.id !== photo.id)
        console.log(updatedMember.photos.length)
        this.memberChange.emit(updatedMember)
      }
    })
  }

  intitializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'Users/add-photo',
      authToken: 'Bearer ' + this.accountservice.currentUser()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      autoUpload: false,
      removeAfterUpload: true,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, Response, status, headers) => {
      const photo = JSON.parse(Response)
      const updatedmember = { ...this.member() }
      updatedmember.photos.push(photo);
      this.memberChange.emit(updatedmember);
    }
  }



}
