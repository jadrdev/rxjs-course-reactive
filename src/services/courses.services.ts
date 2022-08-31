import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Course } from '../app/model/course';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Lesson } from '../app/model/lesson';

@Injectable({
  providedIn: "root",
})
export class CourseService {
  constructor(private http: HttpClient) {}

  loadAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
      shareReplay()
    );
  }

  loadCourseById(courseid: number) {
    return this.http.get<Course>(`/api/courses/${courseid}`)
      .pipe(
        shareReplay()
      )
  };

  loadAllCoursesLessons(courseid: number): Observable<Lesson[]> {
     return this.http
      .get<Lesson[]>("/api/lessons", {
        params: {
          pageSize: "10000",
          courseid: courseid.toString()
        },
      })
      .pipe(
        map((res) => res["payload"]),
        shareReplay()
      );
  }


  saveCourse(courseid: string, changes: Partial<Course>): Observable<any> {
    return this.http
      .put(`/api/courses/${courseid}`, changes)
      .pipe(shareReplay());
  }

  searchLessons(search: string): Observable<Lesson[]> {
    return this.http
      .get<Lesson[]>("/api/lessons", {
        params: {
          filter: search,
          pageSize: "100",
        },
      })
      .pipe(
        map((res) => res["payload"]),
        shareReplay()
      );
  }
}
