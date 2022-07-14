import { MessagesService } from "./../messages/messages.service";
import { LoadingService } from "./../loading/loading.service";
import { HttpClient } from "@angular/common/http";
import { Course, sortCoursesBySeqNo } from "./../model/course";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
/// using message and loading shared service here
@Injectable({
  providedIn: "root",
})
export class CourseStoreService {
  // it has last value in memory
  private coursesSubject$ = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.coursesSubject$.asObservable();
  getCoursesValue(): Course[] {
    return this.coursesSubject$.value;
  }
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messages: MessagesService
  ) {
    this.loadAllCourses();
  }
  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((res: any) => res["payload"]),
      catchError((err) => {
        const message = "could not laod courses";
        this.messages.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      tap((courses: Course[]) => this.coursesSubject$.next(courses))
    );
    // loadCourses$.subscribe();
    // if we d not subscribe to it, nothing is gonna happend
    this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
  }

  saveCourse(
    courseId: string,
    modifiedCourse: Partial<Course>
  ): Observable<any> {
    // update data in memory
    // save data in backend
    const courses = this.coursesSubject$.value;
    const index = courses.findIndex((course) => course.id === courseId);
    const newCourse: Course = {
      ...courses[index],
      ...modifiedCourse,
    };
    // create a copy of an array with slice
    const newCourses = courses.slice(0);
    newCourses[index] = newCourse;
    // so far we update the list in UI
    this.coursesSubject$.next(newCourses);
    return this.http.put(`/api/courses/${courseId}`, newCourse).pipe(
      catchError((err) => {
        const message = "could not laod courses";
        this.messages.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      shareReplay()
    );

    // succeed
    // error
    // loading
  }
  // return Observabe even if there is error
  filterCourseByCategory(category: string): Observable<Course[]> {
    console.log(this.courses$);

    return this.courses$.pipe(
      map((courses: Course[]) =>
        courses
          .filter((course: Course) => course.category === category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }
}
