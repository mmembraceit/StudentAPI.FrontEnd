import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { Student, StudentStatus } from '../../../core/models/student.model';

@Component({
  selector: 'app-student-detail-dialog',
  standalone: true,
  imports: [DatePipe, ButtonModule, TagModule, AvatarModule, DividerModule],
  templateUrl: './student-detail-dialog.component.html',
  styleUrl: './student-detail-dialog.component.css'
})
export class StudentDetailDialogComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  student: Student = this.config.data.student;

  getSeverity(status: StudentStatus): 'success' | 'warn' {
    return status === 'Active' ? 'success' : 'warn';
  }

  close(): void {
    this.ref.close();
  }
}
