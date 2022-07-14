import { concatMap, finalize, tap, timeout } from "rxjs/operators";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class LoadingService {
  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject$.asObservable();
  // second solution
  constructor() {
    console.log("loading service has been used");
  }
  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => this.loadingOn()),
      concatMap(() => obs$),
      finalize(() => this.loadingOff())
    );
  }

  loadingOn(): void {
    this.loadingSubject$.next(true);
  }
  loadingOff(): void {
    this.loadingSubject$.next(false);
  }
}
