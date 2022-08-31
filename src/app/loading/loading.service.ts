import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from 'rxjs/operators';

@Injectable()
export class LoadingService {

  private LoadingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.LoadingSubject.asObservable();

  constructor() {
    console.log("loading service created...")
  }

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null)
      .pipe(
        tap(() => this.loadingOn()),
        concatMap(() => obs$),
        finalize(()=> this.loadingOff())
    )
  }

  loadingOn() {
    this.LoadingSubject.next(true)
  }

  loadingOff() {
    this.LoadingSubject.next(false);

  }
}
