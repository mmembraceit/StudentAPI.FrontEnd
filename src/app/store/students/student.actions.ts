import { CreateStudentRequest, UpdateStudentRequest } from '../../core/models/student.model';

export class LoadStudents {
  static readonly type = '[Students] Load All';
  constructor(public page = 1, public pageSize = 10, public search = '') {}
}

export class CreateStudent {
  static readonly type = '[Students] Create';
  constructor(public payload: CreateStudentRequest) {}
}

export class UpdateStudent {
  static readonly type = '[Students] Update';
  constructor(public id: string, public payload: UpdateStudentRequest) {}
}

export class DeleteStudent {
  static readonly type = '[Students] Delete';
  constructor(public id: string) {}
}
