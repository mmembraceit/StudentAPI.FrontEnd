import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { StudentState } from '../../../store/students/student.state';
import { LoadStudents, DeleteStudent } from '../../../store/students/student.actions';
import { Student, StudentStatus } from '../../../core/models/student.model';
import { StudentFormDialogComponent } from '../dialogs/student-form-dialog.component';
import { StudentDetailDialogComponent } from '../dialogs/student-detail-dialog.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    AsyncPipe, DatePipe, ReactiveFormsModule,
    TableModule, ButtonModule, InputTextModule,
    TagModule, ToastModule, TooltipModule,
    IconFieldModule, InputIconModule
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly dialogService = inject(DialogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);

  students$ = this.store.select(StudentState.students);
  isLoading$ = this.store.select(StudentState.isLoading);
  totalCount$ = this.store.select(StudentState.totalCount);

  searchControl = new FormControl('');
  currentPage = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.store.dispatch(new LoadStudents(1, this.pageSize, ''));

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.currentPage = 1;
      this.store.dispatch(new LoadStudents(1, this.pageSize, value ?? ''));
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const page = Math.floor((event.first ?? 0) / (event.rows ?? this.pageSize)) + 1;
    this.currentPage = page;
    this.pageSize = event.rows ?? this.pageSize;
    this.store.dispatch(new LoadStudents(page, this.pageSize, this.searchControl.value ?? ''));
  }

  openCreate(): void {
    const ref = this.dialogService.open(StudentFormDialogComponent, {
      header: 'Nuevo Estudiante',
      width: '550px',
      data: { student: null }
    });
    ref?.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result) this.store.dispatch(new LoadStudents(this.currentPage, this.pageSize, this.searchControl.value ?? ''));
    });
  }

  openEdit(student: Student): void {
    const ref = this.dialogService.open(StudentFormDialogComponent, {
      header: 'Editar Estudiante',
      width: '550px',
      data: { student }
    });
    ref?.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result) this.store.dispatch(new LoadStudents(this.currentPage, this.pageSize, this.searchControl.value ?? ''));
    });
  }

  openDetail(student: Student): void {
    this.dialogService.open(StudentDetailDialogComponent, {
      header: 'Detalle del Estudiante',
      width: '480px',
      data: { student }
    });
  }

  confirmDelete(student: Student): void {
    this.confirmationService.confirm({
      message: `¿Deseas eliminar a <strong>${student.firstName} ${student.lastName}</strong>?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-trash',
      accept: () => this.store.dispatch(new DeleteStudent(student.id))
    });
  }

  getSeverity(status: StudentStatus): 'success' | 'warn' {
    return status === 'Active' ? 'success' : 'warn';
  }
}
