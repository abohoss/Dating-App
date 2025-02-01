import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/Member';
import { of, tap } from 'rxjs';
import { Photo } from '../_models/Photo';
import { PaginationResult } from '../_models/Paged';
import { UserParams } from '../_models/UserParams';
import { AccountService } from './account.service';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient)
  accountservice = inject(AccountService)
  paginationResult = signal<PaginationResult<Member[]> | null>(null)
  baseUrl = environment.apiUrl
  memberCache = new Map();
  user = this.accountservice.currentUser();
  userParams = signal<UserParams>(new UserParams(this.user))

  resetUserParams() {
    this.userParams.set(new UserParams(this.user))
  }
  getMembers() {
    var cached = this.memberCache.get(Object.values(this.userParams()).join('-'));
    if (cached) return this.setPaginatedresult(cached);

    let params = this.setPaginationHeaders(this.userParams().pagenumber, this.userParams().pageSize);
    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);
    return this.http.get<Member[]>(this.baseUrl + 'users/', { observe: 'response', params }).subscribe({
      next: response => {
        this.setPaginatedresult(response)
        this.memberCache.set(Object.values(this.userParams()).join('-'), response)
      }
    })
  }

  setPaginatedresult(response: HttpResponse<Member[]>) {
    this.paginationResult.set({
      items: response.body as Member[],
      pagination: JSON.parse(response.headers.get('Pagination')!)
    })
  }

  private setPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    if (pageSize && pageNumber) {
      params = params.append('pageSize', pageSize)
      params = params.append('pageNumber', pageNumber)
    }
    return params;
  }

  getMember(username: string) {
    var member: Member = [...this.memberCache.values()]
      .reduce((arr, eleme) =>
        arr.concat(eleme.body)
        , []).find((m: Member) => m.userName === username)
    if (member) return of(member)
    return this.http.get<Member>(this.baseUrl + 'users/' + username)
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users/', member).pipe(
      //   tap(() => {
      //     this.members.update(members => members.map(m => m.userName === member.userName
      //       ? member : m
      //     ))
      //   })
    )
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + 'Users/set-main-photo/' + photo.id, {}).pipe(
      //   tap(() => {
      //     this.members.update(members => members.map(m => {
      //       if (m.photos.includes(photo)) m.photoUrl = photo.url
      //       return m;
      //     }))

      //   })
    )
  }

  deletephoto(photo: Photo) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photo.id).pipe(
      //   tap(() => {
      //     this.members.update(members => members.map(m => {
      //       if (m.photos.includes(photo))
      //         m.photos = m.photos.filter(x => x.id !== photo.id)
      //       return m;
      //     }))
      //   })
    )
  }

}
