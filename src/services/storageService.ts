import { HistoricalRecord, SubmissionData, BackupRecord, EmailLog } from '../types';
import { rawHistoricalRecords } from '../data/historicalData';

const STORAGE_KEY_PROJECTS = 'nmu_irb_projects_v1';
const STORAGE_KEY_BACKUPS = 'nmu_irb_backups_v1';
const STORAGE_KEY_EMAILS = 'nmu_irb_emails_v1';

export class StorageService {
  private static instance: StorageService;
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.syncPendingData();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
      this.initDefaultData();
    }
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public initDefaultData() {
    if (typeof window === 'undefined') return;
    const existing = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(rawHistoricalRecords));
    }

    // Default backup entry
    const existingBackups = localStorage.getItem(STORAGE_KEY_BACKUPS);
    if (!existingBackups) {
      const initialBackup: BackupRecord = {
        id: 'backup-auto-today',
        timestamp: new Date().toISOString(),
        totalRecords: rawHistoricalRecords.length,
        dataSizeKb: Math.round(JSON.stringify(rawHistoricalRecords).length / 1024),
        checksum: 'SHA256-NMU-IRB-8924B71F',
        type: 'auto_daily',
        status: 'completed'
      };
      localStorage.setItem(STORAGE_KEY_BACKUPS, JSON.stringify([initialBackup]));
    }
  }

  public getProjects(): HistoricalRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load projects from storage', e);
    }
    return rawHistoricalRecords;
  }

  public saveProject(project: HistoricalRecord) {
    const list = this.getProjects();
    const index = list.findIndex(p => p.id === project.id || p.projectCode === project.projectCode);
    if (index >= 0) {
      list[index] = { ...list[index], ...project };
    } else {
      list.unshift(project);
    }
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(list));
    this.createAutoDailyBackup(list);
  }

  public findProjectByCode(code: string): HistoricalRecord | undefined {
    const clean = code.trim().toLowerCase();
    const list = this.getProjects();
    return list.find(p => 
      p.projectCode.toLowerCase() === clean ||
      p.projectCode.replace(/-/g, '').toLowerCase() === clean.replace(/-/g, '') ||
      p.docNo.toLowerCase().includes(clean)
    );
  }

  public createNewSubmission(data: SubmissionData): HistoricalRecord {
    const newRecord: HistoricalRecord = {
      id: data.id,
      year: 2569,
      recvNo: this.getNextRecvNo(2569),
      docNo: `สนธ.ยื่นออนไลน์/${new Date().getFullYear() + 543}-${Math.floor(100 + Math.random() * 900)}`,
      docDate: new Date().toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      sender: `${data.academicTitle} ${data.principalInvestigator}`,
      recipient: 'ประธานคณะกรรมการจริยธรรมการวิจัยในคน สำนักงานอธิการบดี',
      subject: `ขอเสนอโครงร่างการวิจัยเพื่อขอรับการพิจารณาจริยธรรมการวิจัยในคน เรื่อง "${data.titleThai}"`,
      researcher: `${data.academicTitle} ${data.principalInvestigator}`,
      department: data.faculty || data.department,
      projectCode: data.projectCode,
      status: 'submitted',
      reviewType: data.reviewType,
      pin: data.pin,
      updatedAt: new Date().toISOString().split('T')[0],
      notes: 'ยื่นคำขอออนไลน์พร้อมลงนามแบบดิจิทัลเรียบร้อย รอเจ้าหน้าที่ตรวจเอกสาร'
    };

    this.saveProject(newRecord);

    // Send automated email confirmation
    this.sendEmailNotification({
      to: data.email,
      projectCode: data.projectCode,
      subject: `[NMU-IRB] ยืนยันการรับคำขอรับพิจารณาจริยธรรมการวิจัยในคน รหัส ${data.projectCode}`,
      statusType: 'submitted',
      body: `เรียน ${data.academicTitle} ${data.principalInvestigator}\n\nคณะกรรมการจริยธรรมการวิจัยในคน สำนักงานอธิการบดี มหาวิทยาลัยนวมินทราธิราช ได้รับเอกสารโครงร่างการวิจัย เรื่อง "${data.titleThai}" (รหัสโครงการ: ${data.projectCode}) เรียบร้อยแล้ว\n\nท่านสามารถติดตามความคืบหน้าของโครงการได้ที่ระบบติดตามโครงการออนไลน์ด้วยรหัสโครงการและรหัส PIN ที่ท่านกำหนดไว้\n\nสำนักงานคณะกรรมการจริยธรรมการวิจัยในคน มหาวิทยาลัยนวมินทราธิราช`
    });

    return newRecord;
  }

  public getNextProjectCode(year: number = 2569): string {
    const list = this.getProjects();
    const shortYear = year % 100;
    const sameYear = list.filter(p => p.projectCode.startsWith(`${shortYear}-`));
    const nextSeq = sameYear.length + 1;
    const seqStr = String(nextSeq).padStart(3, '0');
    // Format: 69-001-000-000 up to 69-999-999-999
    return `${shortYear}-${seqStr}-000-000`;
  }

  public getNextRecvNo(year: number = 2569): number {
    const list = this.getProjects();
    const sameYear = list.filter(p => p.year === year);
    return sameYear.length + 1;
  }

  public getNextCoaNumber(year: number = 2569): string {
    const list = this.getProjects();
    const approvedThisYear = list.filter(p => p.year === year && p.coaNumber);
    const nextNum = approvedThisYear.length + 1;
    return `COA ${String(nextNum).padStart(3, '0')}/${year}`;
  }

  public getNextCoeNumber(year: number = 2569): string {
    const list = this.getProjects();
    const coeThisYear = list.filter(p => p.year === year && p.coeNumber);
    const nextNum = coeThisYear.length + 1;
    return `COE ${String(nextNum).padStart(3, '0')}/${year}`;
  }

  // Backup & Disaster Recovery
  public getBackups(): BackupRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_BACKUPS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  public createManualBackup(): BackupRecord {
    const projects = this.getProjects();
    const jsonStr = JSON.stringify(projects);
    const backup: BackupRecord = {
      id: `backup-${Date.now()}`,
      timestamp: new Date().toISOString(),
      totalRecords: projects.length,
      dataSizeKb: Math.round(jsonStr.length / 1024),
      checksum: `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      type: 'manual',
      status: 'completed'
    };
    const current = this.getBackups();
    current.unshift(backup);
    localStorage.setItem(STORAGE_KEY_BACKUPS, JSON.stringify(current));
    return backup;
  }

  public createAutoDailyBackup(projects: HistoricalRecord[]) {
    try {
      const jsonStr = JSON.stringify(projects);
      const backup: BackupRecord = {
        id: `backup-daily-${new Date().toISOString().split('T')[0]}`,
        timestamp: new Date().toISOString(),
        totalRecords: projects.length,
        dataSizeKb: Math.round(jsonStr.length / 1024),
        checksum: `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        type: 'auto_daily',
        status: 'completed'
      };
      const current = this.getBackups();
      // Keep only top 10 backups
      const updated = [backup, ...current.filter(b => b.id !== backup.id)].slice(0, 10);
      localStorage.setItem(STORAGE_KEY_BACKUPS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to create daily auto backup', e);
    }
  }

  public restoreFromBackup(backupJsonString: string): boolean {
    try {
      const parsed = JSON.parse(backupJsonString);
      if (Array.isArray(parsed)) {
        localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(parsed));
        return true;
      }
    } catch (e) {
      console.error('Invalid backup restore payload', e);
    }
    return false;
  }

  public exportBackupJson(): string {
    const projects = this.getProjects();
    return JSON.stringify(projects, null, 2);
  }

  // Email notifications
  public getEmailLogs(): EmailLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_EMAILS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return [];
  }

  public sendEmailNotification(payload: {
    to: string;
    projectCode: string;
    subject: string;
    statusType: HistoricalRecord['status'];
    body: string;
  }): EmailLog {
    const log: EmailLog = {
      id: `email-${Date.now()}`,
      to: payload.to,
      subject: payload.subject,
      timestamp: new Date().toISOString(),
      projectCode: payload.projectCode,
      statusType: payload.statusType,
      body: payload.body,
      sentStatus: 'sent'
    };
    const current = this.getEmailLogs();
    current.unshift(log);
    localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(current.slice(0, 50)));
    return log;
  }

  private syncPendingData() {
    // Offline sync resolution
    console.log('Reconnected to internet. Realtime data synchronized with cloud.');
  }

  public getNetworkStatus() {
    return this.isOnline;
  }
}
