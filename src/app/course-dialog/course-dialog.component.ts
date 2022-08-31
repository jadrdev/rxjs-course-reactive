import {Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import { CourseService } from '../../services/courses.services';
import { LoadingService } from '../loading/loading.service';
import { MessagesServices } from '../messages/messages.services';
import { CoursesStore } from '../../services/courses.store';

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  providers: [LoadingService, MessagesServices]
})
export class CourseDialogComponent {
  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private courses: CoursesStore,
    private messageServices: MessagesServices
  ) {
    console.log(course);

    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }




  save() {
    const changes = this.form.value;
    this.courses.saveCourse(this.course.id, changes).subscribe();

    this.dialogRef.close(changes)
  }

  close() {
    this.dialogRef.close();
  }
}
