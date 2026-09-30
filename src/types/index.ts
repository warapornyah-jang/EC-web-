export type ReviewType = 'exempt' | 'expedited' | 'fullboard';

export type ProjectStatus = 
  | 'submitted'          // ยื่นคำขอแล้ว
  | 'document_checking'  // กำลังตรวจเอกสาร
  | 'under_review'       // ส่งผู้ทรงคุณวุฒิประเมิน
  | 'revision_requested' // ให้แก้ไขตามข้อเสนอแนะ
  | 'resubmitted'        // ส่งเอกสารแก้ไขแล้ว
  | 'approved'           // อนุมัติแล้ว (ออก COA/COE)
  | 'rejected'           // ไม่อนุมัติ
  | 'renewal'            // ต่ออายุโครงการ
  | 'amendment'          // แก้ไขเพิ่มเติม
  | 'closed'             // ปิดโครงการแล้ว
  | 'cancelled';         // ยกเลิก

export interface HistoricalRecord {
  id: string;
  year: number;          // พ.ศ. เช่น 2560 - 2569
  recvNo: number;        // เลขทะเบียนรับ
  docNo: string;         // ที่ (เลขที่หนังสือ)
  docDate: string;       // ลงวันที่
  sender: string;        // จาก
  recipient: string;     // ถึง
  subject: string;       // เรื่อง
  researcher: string;    // ผู้วิจัย/ผู้เสนอ
  department: string;    // ส่วนงาน (วพม., วทส., วชม., สนธ., สนภ., ฯลฯ)
  projectCode: string;   // รหัสโครงการ เช่น 69-001-000-001
  status: ProjectStatus;
  coaNumber?: string;    // เลขที่ COA เช่น COA 001/2569
  coeNumber?: string;    // เลขที่ COE เช่น COE 001/2569
  reviewType: ReviewType;
  pin: string;           // รหัสผ่าน 4-6 หลัก สำหรับติดตาม
  updatedAt: string;
  notes?: string;
  driveUrl?: string;
}

export interface SubmissionData {
  id: string;
  projectCode: string;
  titleThai: string;
  titleEnglish: string;
  principalInvestigator: string;
  academicTitle: string;
  department: string;
  faculty: string;
  email: string;
  phone: string;
  coInvestigators?: string;
  reviewType: ReviewType;
  fundingSource: string;
  budgetAmount: string;
  vulnerablePopulations: string[];
  submissionDate: string;
  digitalSignature: string; // Base64 data URL
  signerName: string;
  signerPosition: string;
  pin: string;
  status: ProjectStatus;
  coaNumber?: string;
  coeNumber?: string;
  progressNotes: string[];
  reviewersCount: number;
  approvedDate?: string;
  expiryDate?: string;
  attachedFiles: {
    name: string;
    size: string;
    type: string;
    uploadedAt: string;
  }[];
}

export interface DownloadableForm {
  id: string;
  code: string;
  title: string;
  category: 'initial' | 'amendment' | 'progress' | 'guideline';
  version: string;
  updatedDate: string;
  description: string;
  fileFormat: 'DOCX' | 'PDF';
  downloadUrl: string;
}

export interface BackupRecord {
  id: string;
  timestamp: string;
  totalRecords: number;
  dataSizeKb: number;
  checksum: string;
  type: 'auto_daily' | 'manual';
  status: 'completed' | 'in_progress' | 'failed';
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  timestamp: string;
  projectCode: string;
  statusType: ProjectStatus;
  body: string;
  sentStatus: 'sent' | 'pending';
}
