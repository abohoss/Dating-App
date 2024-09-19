import { Component, HostListener, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { Member } from '../../_models/Member';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, FormsModule, PhotoEditorComponent],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  member?: Member;
  accountservice = inject(AccountService);
  memberservice = inject(MembersService);
  private toastr = inject(ToastrService)
  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(): void {
    const user = this.accountservice.currentUser();
    if (!user) return;
    this.memberservice.getMember(user.username).subscribe({
      next: member => this.member = member
    })
  }
  updateMember() {
    this.memberservice.updateMember(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success("updated succesfully")
        this.editForm?.reset(this.member);
      }
    });
  }

  onMemberChange(event: Member) {
    this.member = event;
  }
}
