export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  status: StudentStatus;
}

export type StudentStatus = 'Active' | 'Inactive' | 'Graduated';

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  status: StudentStatus;
}

export interface UpdateStudentRequest extends CreateStudentRequest {}
