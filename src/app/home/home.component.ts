import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { CoursesService } from "../services/courses.service";
import { Course } from "./../model/course";
import { CourseStoreService } from "./../services/course-store.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(
    private dialog: MatDialog,
    private s: CoursesService,
    private courseStoreService: CourseStoreService
  ) {}

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses(): void {
    // this.courseStoreService.
    // const courses$ = this.coursesService.loadAllCourses().pipe(
    //   map((courses) => courses.sort(sortCoursesBySeqNo)),
    //   catchError((error) => {
    //     const message = "could not laod courses";
    //     this.messagesService.showErrors(message);
    //     console.log(message, error);
    //     // terminate the observable chain
    //     return throwError(error);
    //   })
    // );

    // const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);
    // first solution
    // this.loadingService.loadingOn();
    // const courses$ = this.coursesService.loadAllCourses().pipe(
    //   map((courses) => courses.sort(sortCoursesBySeqNo)),
    //   finalize(() => this.loadingService.loadingOff())
    // );
    this.beginnerCourses$ =
      this.courseStoreService.filterCourseByCategory("BEGINNER");
    this.advancedCourses$ =
      this.courseStoreService.filterCourseByCategory("ADVANCED");
  }

  editCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";
    dialogConfig.data = course;
    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .pipe(
        filter((val) => !!val),
        tap(() => this.reloadCourses())
      )
      .subscribe();
  }
}
