import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { StudentService } from '../../core/services/student.service';
import { Student } from '../../core/models/student.model';
import { LoadStudents, CreateStudent, UpdateStudent, DeleteStudent } from './student.actions';

export interface StudentStateModel {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

@State<StudentStateModel>({
  name: 'students',
  defaults: { students: [], isLoading: false, error: null, totalCount: 0 }
})
@Injectable()
export class StudentState {
  private readonly studentService = inject(StudentService);

  @Selector() static students(state: StudentStateModel): Student[] { return state.students; }
  @Selector() static isLoading(state: StudentStateModel): boolean { return state.isLoading; }
  @Selector() static totalCount(state: StudentStateModel): number { return state.totalCount; }
  @Selector() static error(state: StudentStateModel): string | null { return state.error; }

  @Action(LoadStudents)
  load(ctx: StateContext<StudentStateModel>, action: LoadStudents) {
    ctx.patchState({ isLoading: true, error: null });
    return this.studentService.getAll(action.page, action.pageSize, action.search).pipe(
      tap(response => ctx.patchState({
        students: response.data,
        totalCount: response.totalCount,
        isLoading: false
      })),
      catchError(err => {
        ctx.patchState({ isLoading: false, error: err.message });
        return EMPTY;
      })
    );
  }

  @Action(CreateStudent)
  create(ctx: StateContext<StudentStateModel>, action: CreateStudent) {
    return this.studentService.create(action.payload).pipe(
      tap(() => {
        const state = ctx.getState();
        ctx.dispatch(new LoadStudents(1, state.students.length || 10));
      }),
      catchError(err => {
        ctx.patchState({ error: err.message });
        return EMPTY;
      })
    );
  }

  @Action(UpdateStudent)
  update(ctx: StateContext<StudentStateModel>, action: UpdateStudent) {
    return this.studentService.update(action.id, action.payload).pipe(
      tap(updated => {
        const students = ctx.getState().students.map(s =>
          s.id === updated.id ? updated : s
        );
        ctx.patchState({ students });
      }),
      catchError(err => {
        ctx.patchState({ error: err.message });
        return EMPTY;
      })
    );
  }

  @Action(DeleteStudent)
  delete(ctx: StateContext<StudentStateModel>, action: DeleteStudent) {
    return this.studentService.delete(action.id).pipe(
      tap(() => {
        const students = ctx.getState().students.filter(s => s.id !== action.id);
        ctx.patchState({ students, totalCount: ctx.getState().totalCount - 1 });
      }),
      catchError(err => {
        ctx.patchState({ error: err.message });
        return EMPTY;
      })
    );
  }
}
