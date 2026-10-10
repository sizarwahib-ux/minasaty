export type UserRole = 'parent' | 'admin' | 'teacher';

export interface Student {
  id: string;
  fullName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  placeOfBirth: string;
  birthCertificateNo: string;
  registrationNumber: string;
  grade: string; // e.g. "السنة الخامسة ابتدائي"
  classroom: string; // e.g. "الفوج 1"
  academicYear: string; // "2025/2026"
  teacherName: string;
  avatarUrl?: string;
}

export interface ParentUser {
  id: string;
  fullName: string;
  nin: string; // National Identification Number
  phone: string;
  email: string;
  address: string;
  childrenIds: string[];
  isVerified: boolean;
  registeredAt: string;
}

export type CertificateStatus = 'pending' | 'processing' | 'ready_pdf' | 'ready_pickup' | 'ready' | 'rejected';
export type DeliveryMethod = 'in_person' | 'digital';

export interface UploadedCertificateFile {
  fileName: string;
  fileSize?: string;
  fileDataUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
  sourceNote?: string; // "مستخرجة من الأرضية الرقمية لوزارة التربية الوطنية وممسوحة ضوئياً"
}

export interface CertificateRequest {
  id: string;
  refNumber: string;
  studentId: string;
  studentName: string;
  parentId: string;
  parentName: string;
  purpose: string;
  deliveryMethod: DeliveryMethod;
  status: CertificateStatus;
  requestedAt: string;
  processedAt?: string;
  rejectionReason?: string;
  pickupDate?: string;
  pickupAppointmentDate?: string;
  pickupAppointmentTime?: string;
  pickupOffice?: string;
  pickupNotes?: string;
  uploadedPdf?: UploadedCertificateFile;
  academicYear: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';
export type MeetingTarget = 'principal' | 'teacher';

export interface Appointment {
  id: string;
  parentId: string;
  parentName: string;
  studentId: string;
  studentName: string;
  targetRole: MeetingTarget;
  targetName: string;
  subject: string;
  preferredDate: string;
  preferredPeriod: 'morning' | 'afternoon';
  confirmedDate?: string;
  confirmedTime?: string;
  status: AppointmentStatus;
  notes?: string;
  requestedAt: string;
}

export type InquiryCategory =
  | 'educational'
  | 'behavioral'
  | 'administrative'
  | 'health'
  | 'canteen'
  | 'transport_facilities';

export type InquiryStatus = 'new' | 'in_progress' | 'waiting_info' | 'resolved' | 'closed';

export interface InquiryResponse {
  id: string;
  authorName: string;
  authorRole: string;
  message: string;
  createdAt: string;
  isOfficial: boolean;
}

export interface Inquiry {
  id: string;
  refCode: string; // e.g. T-2026-0042
  parentId: string;
  parentName: string;
  studentId?: string;
  studentName?: string;
  category: InquiryCategory;
  subject: string;
  details: string;
  attachmentName?: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  responses: InquiryResponse[];
  satisfactionRating?: number;
  satisfactionComment?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  date: string;
  session: 'morning' | 'afternoon';
  type: 'absence' | 'lateness';
  isJustified: boolean;
  justificationReason?: string;
  justificationType?: 'medical' | 'family' | 'travel' | 'other';
  justificationDate?: string;
  justificationAttachment?: string;
  justificationStatus?: 'pending' | 'approved' | 'rejected';
  notifiedParent: boolean;
  parentAcknowledged: boolean;
  parentAcknowledgedAt?: string;
}

export interface SchoolAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  targetGrade: string; // 'all' or specific grade
  category: 'general' | 'exams' | 'schedule' | 'events';
  priority: 'normal' | 'important' | 'urgent';
  acknowledgedByParent?: boolean;
}

export interface SummonNotice {
  id: string;
  studentId: string;
  studentName: string;
  parentId: string;
  parentName: string;
  reason: string;
  scheduledDate: string;
  scheduledTime: string;
  office: string;
  sentDate: string;
  status: 'sent' | 'viewed' | 'acknowledged';
  acknowledgedAt?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  receiverRole: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface HomeworkItem {
  id: string;
  studentId?: string;
  grade: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted?: boolean;
}

export interface AcademicEvaluation {
  id: string;
  studentId: string;
  term: 1 | 2 | 3;
  subjects: {
    name: string;
    score: number;
    maxScore: number;
    remarks: string;
  }[];
  generalAverage: number;
  rank: number;
  classSize: number;
  teacherRemarks: string;
  principalDecision: string;
}

export interface SurveyVote {
  id: string;
  parentId: string;
  topic: string;
  rating: number;
  comments: string;
  date: string;
}
