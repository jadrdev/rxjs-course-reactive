import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { CourseService } from '../../services/courses.services';
import { LoadingService } from '../loading/loading.service';
import { MessagesServices } from '../messages/messages.services';
import { CoursesStore } from '../../services/courses.store';


@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(private coursesStore: CoursesStore) { }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {

    this.beginnerCourses$ = this.coursesStore.filterByCategory("BEGINNER")

    this.advancedCourses$ = this.coursesStore.filterByCategory("ADVANCED")


  }

}

