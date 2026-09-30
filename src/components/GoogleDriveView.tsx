import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  ExternalLink, 
  RefreshCw, 
  FileSpreadsheet, 
  FileText, 
  Folder, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Download,
  AlertCircle
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  fetchDriveFolderFiles, 
  DriveFileItem, 
  NMU_DRIVE_FOLDER_ID, 
  NMU_DRIVE_FOLDER_URL 
} from '../services/googleDriveService';
import { googleSignIn, getAccessToken } from '../services/firebaseAuth';

interface Props {
  user: User | null;
  setUser: (u: User | null) => void;
}

export const GoogleDriveView: React.FC<Props> = ({ user, setUser }) => {
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('เพิ่งซิงค์เมื่อสักครู่');
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const token = await getAccessToken();
      const items = await fetchDriveFolderFiles(token);
      setFiles(items);
      setLastSyncTime(new Date().toLocaleTimeString('th-TH'));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [user]);

  const handleManualSync = async () => {
    setSyncStatusMsg('กำลังดึงข้อมูลล่าสุดจาก Google Drive & Google Sheets...');
    await loadFiles();
    setTimeout(() => {
      setSyncStatusMsg('ซิงโครไนซ์ข้อมูลไฟล์และชีทสำเร็จแล้ว');
      setTimeout(() => setSyncStatusMsg(null), 3000);
    }, 800);
  };

  const handleGoogleConnect = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
          <FolderGit2 className="w-3.5 h-3.5" />
          Google Workspace & Cloud Storage Integration
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          คลาวด์ไดรฟ์และชีทสารบรรณกลาง (Google Drive & Sheets)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          เชื่อมโยงโฟลเดอร์เอกสารอ้างอิงของคณะกรรมการจริยธรรมการวิจัยในคน สำนักงานอธิการบดี มหาวิทยาลัยนวมินทราธิราช
        </p>
      </div>

      {syncStatusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {syncStatusMsg}
        </div>
      )}

      {/* Folder Connection Banner */}
      <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  โฟลเดอร์สารบรรณ NMU-IRB Drive
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                  เชื่อมต่อแล้ว
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 mt-0.5 break-all">
                ID: {NMU_DRIVE_FOLDER_ID}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleManualSync}
              disabled={isLoading}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isLoading ? 'animate-spin' : ''}`} />
              <span>ดึงข้อมูลชีทล่าสุด</span>
            </button>

            <a
              href={NMU_DRIVE_FOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span>เปิดใน Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Sync Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200/60 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>ซิงค์ล่าสุดเมื่อ: {lastSyncTime}</span>
          </div>

          <div className="flex items-center gap-2 text-emerald-800 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>เชื่อมต่อผ่าน Google Workspace OAuth Scopes (Drive & Sheets)</span>
          </div>
        </div>
      </div>

      {/* Account Status Card */}
      {!user && (
        <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs sm:text-sm">
                เข้าสู่ระบบด้วยบัญชีมหาวิทยาลัย (@nmu.ac.th) เพื่อสิทธิเข้าถึงระดับสูงสุด
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                การเข้าสู่ระบบจะช่วยให้ท่านสามารถเปิดดูเอกสารที่มีการจำกัดสิทธิเฉพาะบุคลากร NMU ได้โดยตรง
              </p>
            </div>
          </div>
          <button
            onClick={handleGoogleConnect}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-all shrink-0"
          >
            เข้าสู่ระบบด้วย Google
          </button>
        </div>
      )}

      {/* Files List in the Drive Folder */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              รายการเอกสารและชีทที่อ้างอิง ({files.length} รายการ)
            </h4>
            <p className="text-xs text-slate-500">
              เอกสารคุมการออกเลขโครงการ, COA, COE และแบบฟอร์มกลาง
            </p>
          </div>
          <span className="text-xs text-slate-400">อัปเดตอัตโนมัติ</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 bg-slate-50/70 hover:bg-emerald-50/40 rounded-2xl border border-slate-200/80 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:border-emerald-300">
                  {file.iconType === 'sheet' ? (
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  ) : file.iconType === 'pdf' ? (
                    <FileText className="w-5 h-5 text-rose-500" />
                  ) : file.iconType === 'folder' ? (
                    <Folder className="w-5 h-5 text-amber-500" />
                  ) : (
                    <FileText className="w-5 h-5 text-blue-500" />
                  )}
                </div>

                <div className="min-w-0">
                  <h5 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                    {file.name}
                  </h5>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    {file.size && <span>{file.size}</span>}
                    {file.modifiedTime && (
                      <span>แก้ไข: {new Date(file.modifiedTime).toLocaleDateString('th-TH')}</span>
                    )}
                    <span className="text-emerald-700 font-medium">พร้อมใช้งาน</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-3">
                <a
                  href={file.webViewLink || NMU_DRIVE_FOLDER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-500 hover:text-emerald-800 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all flex items-center gap-1 text-xs font-semibold"
                  title="เปิดดูไฟล์ใน Drive"
                >
                  <span className="hidden sm:inline">เปิดดู</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
