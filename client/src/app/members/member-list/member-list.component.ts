import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { MemberCardsComponent } from "../member-cards/member-cards.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountService } from '../../_services/account.service';
import { UserParams } from '../../_models/UserParams';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardsComponent, PaginationModule, FormsModule, ButtonsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  accountService = inject(AccountService);
  memberservice = inject(MembersService);

  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }]
  ngOnInit(): void {
    if (!this.memberservice.paginationResult()) {
      this.loadMembers();
    }
  }

  resetFilters() {
    this.memberservice.resetUserParams();
    this.loadMembers();
  }

  loadMembers() {
    this.memberservice.getMembers()
    console.log(this.memberservice.paginationResult()?.pagination?.itemsPerPage)
  }
  pageChanged(event: any) {
    if (this.memberservice.userParams().pagenumber !== event.page) {
      this.memberservice.userParams().pagenumber = event.page;
      this.loadMembers();
    }
  }


}
