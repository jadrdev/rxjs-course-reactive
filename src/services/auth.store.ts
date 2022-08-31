import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from "../app/model/user";
import { map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const AUTH_DATA = "auth_data"

@Injectable({
  providedIn: 'root'
})
export class AuthStore {

  private subjet = new BehaviorSubject<User>(null)
  user$: Observable<User> = this.subjet.asObservable()

  isLogedIn$: Observable<boolean>
  isLogedOut$: Observable<boolean>

  constructor(
    private http: HttpClient
  ) {
    this.isLogedIn$ = this.user$.pipe(map(user => !!user))

    this.isLogedOut$ = this.user$.pipe(map(LoggedIn => !LoggedIn))

    const user = localStorage.getItem(AUTH_DATA)

    if (user) {
      this.subjet.next(JSON.parse(user))
    }


  }



  login(email: string, password: string): Observable<User> {
    return this.http.post<User>('/api/login', { email, password })
      .pipe(
        tap(user => {
          this.subjet.next(user)
          localStorage.setItem(AUTH_DATA, JSON.stringify(user))
        }),
        shareReplay()
      )
  }

  logout() {
    this.subjet.next(null)
    localStorage.removeItem(AUTH_DATA)
  }
}
