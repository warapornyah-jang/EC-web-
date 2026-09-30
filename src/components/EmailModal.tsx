import React, { useState } from 'react';
import { Mail, Check, X, Send, Clock, Building, ShieldCheck } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { EmailLog } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  defaultProjectCode?: string;
}

export const EmailModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultEmail = 'waraporn.yah@nmu.ac.th',
  defaultProjectCode = '69-001-000-000'
}) => {
  const [recipient, setRecipient] = useState(defaultEmail);
  const [projectCode, setProjectCode] = useState(defaultProjectCode);
  const [emailSubject, setEmailSubject] = useState(`[NMU-IRB] แจ้งความคืบหน้าการพิจารณาจริยธรรมการวิจัย โครงการ ${defaultProjectCode}`);
  const [emailContent, setEmailContent] = useState(
    `เรียน นักวิจัยโครงการรหัส ${defaultProjectCode}\n\nคณะกรรมการจริยธรรมการวิจัยในคน สำนักงานอธิการบดี มหาวิทยาลัยนวมินทราธิราช ขอแจ้งความคืบหน้าการพิจารณาโครงร่างการวิจัยของท่าน\n\nสถานะปัจจุบัน: ผ่านการพิจารณาและออกใบรับรองจริยธรรม (COA) เรียบร้อยแล้ว\n\nท่านสามารถเข้าสู่ระบบติดตามสถานะเพื่อดาวน์โหลดใบรับรองฉบับดิจิทัลได้ทันที\n\nด้วยความเคารพอย่างสูง\nสำนักงานคณะกรรมการจริยธรรมการวิจัยในคน\nสำนักงานอธิการบดี มหาวิทยาลัยนวมินทราธิราช\nโทร. 02-244-3000 ต่อ 3500-3504\nอีเมล: irb@nmu.ac.th`
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');

  if (!isOpen) return null;

  const handleSend = () => {
    StorageService.getInstance().sendEmailNotification({
      to: recipient,
      projectCode,
      subject: emailSubject,
      statusType: 'approved',
      body: emailContent
    });
    setStatusMessage('ส่งอีเมลแจ้งเตือนเรียบร้อยแล้ว (จำลองการส่งไปยังเซิร์ฟเวอร์เมลมหาวิทยาลัย)');
    setTimeout(() => {
      setStatusMessage(null);
      setActiveTab('history');
    }, 1200);
  };

  const emailLogs: EmailLog[] = StorageService.getInstance().getEmailLogs();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                ระบบแจ้งเตือนผ่านอีเมลสำหรับนักวิจัย (Email Notification)
              </h3>
              <p className="text-xs text-emerald-100">
                สำนักงานคณะกรรมการจริยธรรมการวิจัยในคน มหาวิทยาลัยนวมินทราธิราช
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-100 px-5 pt-3 bg-slate-50 gap-2">
          <button
            onClick={() => setActiveTab('compose')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'compose'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            เขียน / ทดสอบส่งอีเมล
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            ประวัติการส่งอีเมล ({emailLogs.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'compose' ? (
            <>
              {statusMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  {statusMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    อีเมลผู้รับ (นักวิจัย)
                  </label>
                  <input
                    type="email"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    placeholder="example@nmu.ac.th"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    รหัสโครงการอ้างอิง
                  </label>
                  <input
                    type="text"
                    value={projectCode}
                    onChange={(e) => setProjectCode(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none font-mono"
                    placeholder="69-001-000-000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  หัวข้ออีเมล (Subject)
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ข้อความราชการในอีเมล (Official Message Body)
                </label>
                <textarea
                  rows={8}
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none font-mono bg-slate-50/50"
                />
              </div>

              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  อีเมลจะถูกส่งผ่านระบบ SMTP Gateway ของมหาวิทยาลัยนวมินทราธิราช โดยมีลายมือชื่อดิจิทัลและรหัสอ้างอิงความปลอดภัย ป้องกันอีเมลปลอมแปลง
                </span>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {emailLogs.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  ยังไม่มีประวัติการส่งอีเมลในระบบ
                </div>
              ) : (
                emailLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-emerald-800">ถึง: {log.to}</span>
                      <span>{new Date(log.timestamp).toLocaleString('th-TH')}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800">{log.subject}</div>
                    <div className="text-xs text-slate-600 whitespace-pre-line line-clamp-3 bg-white p-2.5 rounded-xl border border-slate-100 font-mono">
                      {log.body}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-emerald-700">
                      <Check className="w-3.5 h-3.5" /> ส่งสำเร็จ (250 OK) • รหัสโครงการ: {log.projectCode}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-emerald-700" />
            สำนักงานอธิการบดี มหาวิทยาลัยนวมินทราธิราช
          </div>
          {activeTab === 'compose' ? (
            <button
              onClick={handleSend}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all"
            >
              <Send className="w-4 h-4" />
              ส่งอีเมลแจ้งเตือนเดี๋ยวนี้
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('compose')}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-all"
            >
              เขียนอีเมลใหม่
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
