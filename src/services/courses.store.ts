import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Course, sortCoursesBySeqNo } from '../app/model/course';
import { filter, map, catchError, tap, shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../app/loading/loading.service';
import { MessagesServices } from '../app/messages/messages.services';

@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private messages: MessagesServices
  ) {
    this.loadAllCourses();
  }

 /**
  * We're using the `http` service to make a GET request to the `/api/courses` endpoint. We're then
  * using the `map` operator to transform the response into an array of courses. We're using the
  * `catchError` operator to catch any errors that occur and display a message to the user. We're using
  * the `tap` operator to update the `subject` with the courses. Finally, we're using the `loading`
  * service to show a loading indicator until the request completes
  */
  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((response) => response["payload"]),
      catchError((err) => {
        const message = "Could not load courses";
        this.messages.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      tap((courses) => this.subject.next(courses))
    );

    this.loading.showLoaderUntilCompleted(loadCourses$).subscribe();
  }

/**
 * "Return an observable of courses filtered by category and sorted by sequence number."
 *
 * The function takes a category as a parameter and returns an observable of courses
 * @param {string} category - string - the category of the courses we want to filter by
 * @returns Observable<Course[]>
 */
  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category == category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }

 /**
  * It takes a course id and a partial course object, and returns an observable of the updated course
  * @param {String} Courseid - String - The id of the course to update
  * @param changes - Partial<Course>
  * @returns Observable<any>
  */
  saveCourse(Courseid: String, changes: Partial<Course>): Observable<any> {
    const courses = this.subject.getValue();

    const index = courses.findIndex((course) => course.id == Courseid);

    const newCourse: Course = {
      ...courses[index],
      ...changes
    }

    const newCourses: Course[] = courses.slice(0)

    newCourses[index] = newCourse

    this.subject.next(newCourses);

    return this.http.put(`/api/courses/${Courseid}`, changes).pipe(
      catchError((err) => {
        const message = "Could not save courses";
        this.messages.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      shareReplay()
    );
  }
}
