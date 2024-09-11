import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/Member';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient)

  basUrl = environment.apiUrl

  getMembers() {
    return this.http.get<Member[]>(this.basUrl + 'users/')
  }

  getMember(username: string) {
    return this.http.get<Member>(this.basUrl + 'users/' + username)
  }



}
