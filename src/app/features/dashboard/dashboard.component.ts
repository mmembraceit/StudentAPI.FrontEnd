import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { StudentState } from '../../store/students/student.state';
import { LoadStudents } from '../../store/students/student.actions';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, CardModule, TagModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(Store);

  totalCount$ = this.store.select(StudentState.totalCount);
  activeCount$ = this.store.select(StudentState.students).pipe(
    map(students => students.filter(s => s.status === 'Active').length)
  );
  inactiveCount$ = this.store.select(StudentState.students).pipe(
    map(students => students.filter(s => s.status === 'Inactive').length)
  );

  ngOnInit(): void {
    this.store.dispatch(new LoadStudents(1, 100, ''));
  }
}
