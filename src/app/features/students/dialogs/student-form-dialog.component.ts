import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { Student } from '../../../core/models/student.model';
import { CreateStudent, UpdateStudent } from '../../../store/students/student.actions';

@Component({
  selector: 'app-student-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, DatePickerModule],
  templateUrl: './student-form-dialog.component.html',
  styleUrl: './student-form-dialog.component.css'
})
export class StudentFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  student: Student | null = null;
  isEditMode = false;

  statusOptions = [
    { label: 'Activo', value: 'Active' },
    { label: 'Inactivo', value: 'Inactive' }
  ];

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName:  ['', [Validators.required, Validators.minLength(2)]],
    email:     ['', [Validators.required, Validators.email]],
    dateOfBirth: [null as Date | null, Validators.required],
    status:    ['Active', Validators.required]
  });

  ngOnInit(): void {
    this.student = this.config.data?.student ?? null;
    this.isEditMode = !!this.student;

    if (this.student) {
      this.form.patchValue({
        firstName: this.student.firstName,
        lastName: this.student.lastName,
        email: this.student.email,
        dateOfBirth: new Date(this.student.dateOfBirth),
        status: this.student.status
      });
    }
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && (c.dirty || c.touched));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, dateOfBirth, status } = this.form.value;
    const payload = {
      firstName: firstName!,
      lastName: lastName!,
      email: email!,
      dateOfBirth: (dateOfBirth as Date).toISOString().split('T')[0],
      status: status as 'Active' | 'Inactive'
    };

    const action = this.isEditMode
      ? new UpdateStudent(this.student!.id, payload)
      : new CreateStudent(payload);

    this.store.dispatch(action).subscribe(() => this.ref.close(true));
  }

  cancel(): void {
    this.ref.close(false);
  }
}
