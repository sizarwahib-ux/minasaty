import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  ParentUser,
  CertificateRequest,
  Appointment,
  Inquiry,
  AttendanceRecord,
  SchoolAnnouncement,
  SummonNotice,
  DirectMessage,
  AcademicEvaluation,
  HomeworkItem,
  SurveyVote,
  CertificateStatus,
  AppointmentStatus,
  InquiryStatus,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_PARENT,
  INITIAL_CERTIFICATES,
  INITIAL_APPOINTMENTS,
  INITIAL_INQUIRIES,
  INITIAL_ATTENDANCE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SUMMONS,
  INITIAL_EVALUATION,
  INITIAL_HOMEWORK,
  INITIAL_MESSAGES,
} from '../data/mockData';
import { generateRefCode } from '../utils/security';

export type ActiveRole = 'parent' | 'admin' | 'teacher' | 'public';

interface SchoolContextType {
  role: ActiveRole;
  setRole: (role: ActiveRole) => void;
  parent: ParentUser;
  students: Student[];
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  selectedStudent: Student | undefined;
  
  // Certificates
  certificates: CertificateRequest[];
  requestCertificate: (data: { studentId: string; purpose: string; deliveryMethod: 'in_person' | 'digital' }) => void;
  updateCertificateStatus: (
    id: string,
    status: CertificateStatus,
    rejectionReason?: string,
    pickupDate?: string,
    extra?: {
      pickupAppointmentDate?: string;
      pickupAppointmentTime?: string;
      pickupOffice?: string;
      pickupNotes?: string;
    }
  ) => void;
  issueCertificateAsPDF: (id: string) => void;
  uploadAndSendCertificatePdf: (
    id: string,
    fileData: { fileName: string; fileSize?: string; fileDataUrl?: string; sourceNote?: string }
  ) => void;
  scheduleCertificatePickup: (id: string, date: string, time: string, office: string, notes?: string) => void;
  rejectCertificate: (id: string, reason: string) => void;
  
  // Appointments
  appointments: Appointment[];
  requestAppointment: (data: {
    studentId: string;
    targetRole: 'principal' | 'teacher';
    targetName: string;
    subject: string;
    preferredDate: string;
    preferredPeriod: 'morning' | 'afternoon';
  }) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus, confirmedDate?: string, confirmedTime?: string, notes?: string) => void;
  
  // Inquiries
  inquiries: Inquiry[];
  submitInquiry: (data: {
    studentId?: string;
    category: Inquiry['category'];
    subject: string;
    details: string;
    attachmentName?: string;
  }) => string;
  respondToInquiry: (inquiryId: string, message: string, authorName: string, authorRole: string) => void;
  updateInquiryStatus: (inquiryId: string, status: InquiryStatus, assignedTo?: string) => void;
  rateInquiry: (inquiryId: string, rating: number, comment?: string) => void;
  
  // Attendance
  attendance: AttendanceRecord[];
  recordAttendance: (data: { studentId: string; session: 'morning' | 'afternoon'; type: 'absence' | 'lateness'; date: string }) => void;
  submitJustification: (attendanceId: string, reason: string, type: 'medical' | 'family' | 'travel' | 'other', attachment?: string) => void;
  reviewJustification: (attendanceId: string, status: 'approved' | 'rejected') => void;
  acknowledgeAttendance: (attendanceId: string) => void;
  
  // Announcements
  announcements: SchoolAnnouncement[];
  publishAnnouncement: (data: Omit<SchoolAnnouncement, 'id' | 'date'>) => void;
  acknowledgeAnnouncement: (id: string) => void;
  
  // Summons
  summons: SummonNotice[];
  createSummon: (data: { studentId: string; reason: string; scheduledDate: string; scheduledTime: string; office: string }) => void;
  acknowledgeSummon: (id: string) => void;
  
  // Academic & Homework
  evaluations: AcademicEvaluation[];
  homework: HomeworkItem[];
  addHomework: (data: Omit<HomeworkItem, 'id'>) => void;
  toggleHomeworkCompleted: (id: string) => void;
  
  // Messaging
  messages: DirectMessage[];
  sendMessage: (receiverRole: string, subject: string, message: string, senderName: string, senderRole: string) => void;
  markMessageRead: (id: string) => void;
  
  // Surveys & Profile
  surveys: SurveyVote[];
  submitSurvey: (topic: string, rating: number, comments: string) => void;
  updateParentProfile: (phone: string, email: string, address: string) => void;
  addNewChild: (data: Omit<Student, 'id'>) => void;
  
  // Quick active certificate preview modal
  previewCertificate: CertificateRequest | null;
  setPreviewCertificate: (cert: CertificateRequest | null) => void;

  // Reset to original data
  resetAllData: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'nouar_school_portal_v1';

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<ActiveRole>('parent');
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  const [selectedStudentId, setSelectedStudentId] = useState<string>(INITIAL_STUDENTS[0].id);

  const [parent, setParent] = useState<ParentUser>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_parent`);
    return saved ? JSON.parse(saved) : INITIAL_PARENT;
  });

  const [certificates, setCertificates] = useState<CertificateRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_certs`);
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATES;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_apps`);
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_inquiries`);
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_attendance`);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_announcements`);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [summons, setSummons] = useState<SummonNotice[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_summons`);
    return saved ? JSON.parse(saved) : INITIAL_SUMMONS;
  });

  const [evaluations] = useState<AcademicEvaluation[]>([INITIAL_EVALUATION]);

  const [homework, setHomework] = useState<HomeworkItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_homework`);
    return saved ? JSON.parse(saved) : INITIAL_HOMEWORK;
  });

  const [messages, setMessages] = useState<DirectMessage[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_messages`);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [surveys, setSurveys] = useState<SurveyVote[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_surveys`);
    return saved ? JSON.parse(saved) : [];
  });

  const [previewCertificate, setPreviewCertificate] = useState<CertificateRequest | null>(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_parent`, JSON.stringify(parent));
  }, [parent]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_certs`, JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_apps`, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_inquiries`, JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_attendance`, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_announcements`, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_summons`, JSON.stringify(summons));
  }, [summons]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_homework`, JSON.stringify(homework));
  }, [homework]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_messages`, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_surveys`, JSON.stringify(surveys));
  }, [surveys]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Certificate operations
  const requestCertificate = (data: {
    studentId: string;
    purpose: string;
    deliveryMethod: 'in_person' | 'digital';
  }) => {
    const student = students.find((s) => s.id === data.studentId);
    if (!student) return;
    const count = certificates.length + 1;
    const refNumber = `CERT-2026-${String(count).padStart(3, '0')}`;
    const newCert: CertificateRequest = {
      id: `cert-${Date.now()}`,
      refNumber,
      studentId: data.studentId,
      studentName: student.fullName,
      parentId: parent.id,
      parentName: parent.fullName,
      purpose: data.purpose,
      deliveryMethod: data.deliveryMethod,
      status: 'pending',
      requestedAt: new Date().toISOString().split('T')[0],
      academicYear: '2025/2026',
    };
    setCertificates((prev) => [newCert, ...prev]);
  };

  const updateCertificateStatus = (
    id: string,
    status: CertificateStatus,
    rejectionReason?: string,
    pickupDate?: string,
    extra?: {
      pickupAppointmentDate?: string;
      pickupAppointmentTime?: string;
      pickupOffice?: string;
      pickupNotes?: string;
    }
  ) => {
    setCertificates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status,
            rejectionReason: rejectionReason || c.rejectionReason,
            pickupDate: pickupDate || (status === 'ready' || status === 'ready_pdf' ? 'جاهزة للاستلام / التحميل' : c.pickupDate),
            pickupAppointmentDate: extra?.pickupAppointmentDate || c.pickupAppointmentDate,
            pickupAppointmentTime: extra?.pickupAppointmentTime || c.pickupAppointmentTime,
            pickupOffice: extra?.pickupOffice || c.pickupOffice,
            pickupNotes: extra?.pickupNotes || c.pickupNotes,
            processedAt: new Date().toISOString().split('T')[0],
          };
        }
        return c;
      })
    );
  };

  const issueCertificateAsPDF = (id: string) => {
    updateCertificateStatus(
      id,
      'ready_pdf',
      undefined,
      'تم رفع وإرسال الشهادة المدرسية بصيغة PDF وأُرسلت إلى حسابكم، جاهزة للتحميل والطباعة فوراً'
    );
  };

  const uploadAndSendCertificatePdf = (
    id: string,
    fileData: { fileName: string; fileSize?: string; fileDataUrl?: string; sourceNote?: string }
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setCertificates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: 'ready_pdf',
            processedAt: today,
            pickupDate: `تم مسح ورفع الشهادة الرسمية (${fileData.fileName}) من طرف إدارة المدرسة، وأُرسلت لحسابكم بصيغة PDF.`,
            uploadedPdf: {
              fileName: fileData.fileName,
              fileSize: fileData.fileSize || '350 KB',
              fileDataUrl: fileData.fileDataUrl,
              uploadedAt: `${today} ${new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}`,
              uploadedBy: 'أمانة مدرسة نوار محمد الابتدائية (الأرضية الرقمية لوزارة التربية)',
              sourceNote: fileData.sourceNote || 'مستخرجة من الأرضية الرقمية لوزارة التربية الوطنية وممسوحة ضوئياً بختم وتوقيع المديرة',
            },
          };
        }
        return c;
      })
    );
  };

  const scheduleCertificatePickup = (
    id: string,
    date: string,
    time: string,
    office: string,
    notes?: string
  ) => {
    const pickupDateStr = `موعد الاستلام المحدد بالمؤسسة: ${date} على الساعة ${time} (${office})`;
    updateCertificateStatus(id, 'ready_pickup', undefined, pickupDateStr, {
      pickupAppointmentDate: date,
      pickupAppointmentTime: time,
      pickupOffice: office,
      pickupNotes: notes,
    });
  };

  const rejectCertificate = (id: string, reason: string) => {
    updateCertificateStatus(id, 'rejected', reason);
  };

  // Appointment operations
  const requestAppointment = (data: {
    studentId: string;
    targetRole: 'principal' | 'teacher';
    targetName: string;
    subject: string;
    preferredDate: string;
    preferredPeriod: 'morning' | 'afternoon';
  }) => {
    const student = students.find((s) => s.id === data.studentId);
    if (!student) return;
    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      parentId: parent.id,
      parentName: parent.fullName,
      studentId: data.studentId,
      studentName: student.fullName,
      targetRole: data.targetRole,
      targetName: data.targetName,
      subject: data.subject,
      preferredDate: data.preferredDate,
      preferredPeriod: data.preferredPeriod,
      status: 'pending',
      requestedAt: new Date().toISOString().split('T')[0],
    };
    setAppointments((prev) => [newApp, ...prev]);
  };

  const updateAppointmentStatus = (
    id: string,
    status: AppointmentStatus,
    confirmedDate?: string,
    confirmedTime?: string,
    notes?: string
  ) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status,
            confirmedDate: confirmedDate ?? a.confirmedDate,
            confirmedTime: confirmedTime ?? a.confirmedTime,
            notes: notes ?? a.notes,
          };
        }
        return a;
      })
    );
  };

  // Inquiry operations
  const submitInquiry = (data: {
    studentId?: string;
    category: Inquiry['category'];
    subject: string;
    details: string;
    attachmentName?: string;
  }): string => {
    const student = data.studentId ? students.find((s) => s.id === data.studentId) : undefined;
    const refCode = generateRefCode('T');
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      refCode,
      parentId: parent.id,
      parentName: parent.fullName,
      studentId: data.studentId,
      studentName: student?.fullName,
      category: data.category,
      subject: data.subject,
      details: data.details,
      attachmentName: data.attachmentName,
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      responses: [],
    };
    setInquiries((prev) => [newInquiry, ...prev]);
    return refCode;
  };

  const respondToInquiry = (
    inquiryId: string,
    message: string,
    authorName: string,
    authorRole: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id === inquiryId) {
          const newResp = {
            id: `resp-${Date.now()}`,
            authorName,
            authorRole,
            message,
            createdAt: today,
            isOfficial: authorRole.includes('إدارة') || authorRole.includes('أستاذ'),
          };
          return {
            ...inq,
            status: 'resolved',
            updatedAt: today,
            responses: [...inq.responses, newResp],
          };
        }
        return inq;
      })
    );
  };

  const updateInquiryStatus = (inquiryId: string, status: InquiryStatus, assignedTo?: string) => {
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id === inquiryId) {
          return {
            ...inq,
            status,
            assignedTo: assignedTo || inq.assignedTo,
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return inq;
      })
    );
  };

  const rateInquiry = (inquiryId: string, rating: number, comment?: string) => {
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id === inquiryId) {
          return {
            ...inq,
            satisfactionRating: rating,
            satisfactionComment: comment,
            status: 'closed',
          };
        }
        return inq;
      })
    );
  };

  // Attendance operations
  const recordAttendance = (data: {
    studentId: string;
    session: 'morning' | 'afternoon';
    type: 'absence' | 'lateness';
    date: string;
  }) => {
    const student = students.find((s) => s.id === data.studentId);
    if (!student) return;
    const newAtt: AttendanceRecord = {
      id: `att-${Date.now()}`,
      studentId: data.studentId,
      studentName: student.fullName,
      grade: student.grade,
      date: data.date,
      session: data.session,
      type: data.type,
      isJustified: false,
      notifiedParent: true,
      parentAcknowledged: false,
    };
    setAttendance((prev) => [newAtt, ...prev]);
  };

  const submitJustification = (
    attendanceId: string,
    reason: string,
    type: 'medical' | 'family' | 'travel' | 'other',
    attachment?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setAttendance((prev) =>
      prev.map((att) => {
        if (att.id === attendanceId) {
          return {
            ...att,
            isJustified: true,
            justificationReason: reason,
            justificationType: type,
            justificationDate: today,
            justificationAttachment: attachment || 'وثيقة_تبرير_مرفقة.pdf',
            justificationStatus: 'pending',
            parentAcknowledged: true,
            parentAcknowledgedAt: `${today} ${new Date().toLocaleTimeString('ar-DZ')}`,
          };
        }
        return att;
      })
    );
  };

  const reviewJustification = (attendanceId: string, status: 'approved' | 'rejected') => {
    setAttendance((prev) =>
      prev.map((att) => {
        if (att.id === attendanceId) {
          return {
            ...att,
            justificationStatus: status,
          };
        }
        return att;
      })
    );
  };

  const acknowledgeAttendance = (attendanceId: string) => {
    setAttendance((prev) =>
      prev.map((att) => {
        if (att.id === attendanceId) {
          return {
            ...att,
            parentAcknowledged: true,
            parentAcknowledgedAt: new Date().toLocaleTimeString('ar-DZ'),
          };
        }
        return att;
      })
    );
  };

  // Announcements
  const publishAnnouncement = (data: Omit<SchoolAnnouncement, 'id' | 'date'>) => {
    const newAnn: SchoolAnnouncement = {
      id: `ann-${Date.now()}`,
      ...data,
      date: new Date().toISOString().split('T')[0],
      acknowledgedByParent: false,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const acknowledgeAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, acknowledgedByParent: true } : ann))
    );
  };

  // Summons
  const createSummon = (data: {
    studentId: string;
    reason: string;
    scheduledDate: string;
    scheduledTime: string;
    office: string;
  }) => {
    const student = students.find((s) => s.id === data.studentId);
    if (!student) return;
    const newSummon: SummonNotice = {
      id: `sum-${Date.now()}`,
      studentId: data.studentId,
      studentName: student.fullName,
      parentId: parent.id,
      parentName: parent.fullName,
      reason: data.reason,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      office: data.office,
      sentDate: new Date().toISOString().split('T')[0],
      status: 'sent',
    };
    setSummons((prev) => [newSummon, ...prev]);
  };

  const acknowledgeSummon = (id: string) => {
    setSummons((prev) =>
      prev.map((sum) =>
        sum.id === id
          ? {
              ...sum,
              status: 'acknowledged',
              acknowledgedAt: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString('ar-DZ')}`,
            }
          : sum
      )
    );
  };

  // Homework
  const addHomework = (data: Omit<HomeworkItem, 'id'>) => {
    const newHw: HomeworkItem = {
      id: `hw-${Date.now()}`,
      ...data,
      isCompleted: false,
    };
    setHomework((prev) => [newHw, ...prev]);
  };

  const toggleHomeworkCompleted = (id: string) => {
    setHomework((prev) =>
      prev.map((hw) => (hw.id === id ? { ...hw, isCompleted: !hw.isCompleted } : hw))
    );
  };

  // Messages
  const sendMessage = (
    receiverRole: string,
    subject: string,
    message: string,
    senderName: string,
    senderRole: string
  ) => {
    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: role,
      senderName,
      senderRole,
      receiverRole,
      subject,
      message,
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}`,
      read: false,
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const markMessageRead = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  };

  // Surveys & Profile
  const submitSurvey = (topic: string, rating: number, comments: string) => {
    const newVote: SurveyVote = {
      id: `surv-${Date.now()}`,
      parentId: parent.id,
      topic,
      rating,
      comments,
      date: new Date().toISOString().split('T')[0],
    };
    setSurveys((prev) => [newVote, ...prev]);
  };

  const updateParentProfile = (phone: string, email: string, address: string) => {
    setParent((prev) => ({
      ...prev,
      phone,
      email,
      address,
    }));
  };

  const addNewChild = (data: Omit<Student, 'id'>) => {
    const newId = `std-${Date.now()}`;
    const newStudent: Student = {
      id: newId,
      ...data,
    };
    setStudents((prev) => [...prev, newStudent]);
    setParent((prev) => ({
      ...prev,
      childrenIds: [...prev.childrenIds, newId],
    }));
  };

  const resetAllData = () => {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_students`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_parent`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_certs`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_apps`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_inquiries`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_attendance`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_announcements`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_summons`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_homework`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_messages`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_surveys`);

    setStudents(INITIAL_STUDENTS);
    setParent(INITIAL_PARENT);
    setCertificates(INITIAL_CERTIFICATES);
    setAppointments(INITIAL_APPOINTMENTS);
    setInquiries(INITIAL_INQUIRIES);
    setAttendance(INITIAL_ATTENDANCE);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setSummons(INITIAL_SUMMONS);
    setHomework(INITIAL_HOMEWORK);
    setMessages(INITIAL_MESSAGES);
    setSurveys([]);
  };

  return (
    <SchoolContext.Provider
      value={{
        role,
        setRole,
        parent,
        students,
        selectedStudentId,
        setSelectedStudentId,
        selectedStudent,
        certificates,
        requestCertificate,
        updateCertificateStatus,
        issueCertificateAsPDF,
        uploadAndSendCertificatePdf,
        scheduleCertificatePickup,
        rejectCertificate,
        appointments,
        requestAppointment,
        updateAppointmentStatus,
        inquiries,
        submitInquiry,
        respondToInquiry,
        updateInquiryStatus,
        rateInquiry,
        attendance,
        recordAttendance,
        submitJustification,
        reviewJustification,
        acknowledgeAttendance,
        announcements,
        publishAnnouncement,
        acknowledgeAnnouncement,
        summons,
        createSummon,
        acknowledgeSummon,
        evaluations,
        homework,
        addHomework,
        toggleHomeworkCompleted,
        messages,
        sendMessage,
        markMessageRead,
        surveys,
        submitSurvey,
        updateParentProfile,
        addNewChild,
        previewCertificate,
        setPreviewCertificate,
        resetAllData,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
