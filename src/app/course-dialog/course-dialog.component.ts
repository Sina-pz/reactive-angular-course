import { AfterViewInit, Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment from "moment";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "./../loading/loading.service";
import { MessagesService } from "./../messages/messages.service";
import { Course } from "./../model/course";
import { CourseStoreService } from "./../services/course-store.service";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  providers: [LoadingService, MessagesService],
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    private coursesService: CoursesService,
    private courseStoreService: CourseStoreService,
    private messagesService: MessagesService,
    @Inject(MAT_DIALOG_DATA) course: Course
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngAfterViewInit() {}

  save() {
    const changes = this.form.getRawValue();
    this.courseStoreService.saveCourse(this.course.id, changes).subscribe();
    // these are not effective here bcz the dialog gonna close
    //   .pipe(
    //     catchError((err) => {
    //       const message = "could not save course";
    //       console.log(message, err);
    //       this.messagesService.showErrors(message);
    //       return throwError(err);
    //     })
    //   );
    // this.LoadingService.showLoaderUntilCompleted(saveCourse$).subscribe(
    //   (modifiedCourse: Course) => this.dialogRef.close(modifiedCourse)
    // );
    this.dialogRef.close(changes);
  }

  close() {
    this.dialogRef.close();
  }
}
