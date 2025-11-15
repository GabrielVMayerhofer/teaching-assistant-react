import { Status, Evaluation } from './Evaluation';
import { Student } from './Student';

export interface ApprovalCounts {
  [Status.APPROVED]: number;
  [Status.REJECTED]: number;
  [Status.IN_PROGRESS]: number;
  totalStudents: number;
}

export interface StudentReportData {
  student: Student;
  status: Status;
  evaluations: Evaluation[];
}

export interface ApprovalSummaryReportResponse {
  summary: ApprovalCounts;
  details: StudentReportData[];
}