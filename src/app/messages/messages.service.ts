import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { filter } from "rxjs/operators";

@Injectable()
export class MessagesService {
  private errorsSubject$ = new BehaviorSubject<string[]>([]);
  errors$: Observable<string[]> = this.errorsSubject$
    .asObservable()
    .pipe(filter((messages) => messages && messages.length > 0));
  showErrors(...errors: string[]): void {
    this.errorsSubject$.next(errors);
  }
}
