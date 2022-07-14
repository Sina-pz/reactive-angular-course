import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map, shareReplay, tap } from "rxjs/operators";
import { User } from "./../model/user";

const AUTH_DATA = "auth_data";
@Injectable({
  providedIn: "root",
})
export class AuthStoreService {
  private userSubject$ = new BehaviorSubject<User>(null);
  user$: Observable<User> = this.userSubject$.asObservable();
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = this.user$.pipe(map((user: User) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));

    const user = localStorage.getItem(AUTH_DATA);
    if (user) {
      this.userSubject$.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>("/api/login", { email, password }).pipe(
      tap((user: User) => {
        localStorage.setItem(AUTH_DATA, JSON.stringify(user));
        return this.userSubject$.next(user);
      }),
      shareReplay()
    );
  }

  logout() {
    this.userSubject$.next(null);
    localStorage.removeItem(AUTH_DATA);
  }
  // we need list of user and for wich we need to save them credential in local storage and do not ask backend for auth
}
