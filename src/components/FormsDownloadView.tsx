import React, { useState } from 'react';
import { 
  DownloadCloud, 
  FileText, 
  Search, 
  Download, 
  CheckCircle2, 
  FileCheck, 
  AlertCircle,
  HelpCircle,
  Eye,
  Check
} from 'lucide-react';
import { officialForms } from '../data/formsData';
import { DownloadableForm } from '../types';

export const FormsDownloadView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'initial', label: 'ยื่นคำขอแรกเริ่ม' },
    { id: 'amendment', label: 'แก้ไขเพิ่มเติม / ต่ออายุ' },
    { id: 'progress', label: 'รายงานความก้าวหน้า / ปิดโครงการ' },
    { id: 'guideline', label: 'แนวปฏิบัติ & SOPs' },
  ];

  const filteredForms = officialForms.filter((f) => {
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    const matchesSearch = 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (form: DownloadableForm) => {
    // Generate simulated official document blob download
    const dummyText = `แบบฟอร์มมาตรฐาน คณะกรรมการจริยธรรมการวิจัยในคน สำนักงานอธิการบดี มหาวิทยาลัยนวมินทราธิราช (NMU-IRB)\n\nรหัสแบบฟอร์ม: ${form.code}\nชื่อแบบฟอร์ม: ${form.title}\nเวอร์ชัน: ${form.version}\nวันที่ปรับปรุงล่าสุด: ${form.updatedDate}\n\nคำชี้แจง: ${form.description}\n\n[ เอกสารฉบับนี้ใช้สำหรับกรอกข้อมูลและยื่นเสนอต่อสำนักงานอธิการบดี มหาวิทยาลัยนวมินทราธิราช ]`;
    const blob = new Blob([dummyText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${form.code}_${form.title.substring(0, 30)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadNotice(`ดาวน์โหลด "${form.code}" เรียบร้อยแล้ว`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold border border-teal-300">
          <DownloadCloud className="w-3.5 h-3.5" />
          คลังแบบฟอร์มและเอกสารมาตรฐาน (NMU-IRB Forms Repository)
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          ดาวน์โหลดแบบฟอร์มจริยธรรมการวิจัยในคน
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          แบบฟอร์มมาตรฐานของสำนักงานอธิการบดี มหาวิทยาลัยนวมินทราธิราช ปรับปรุงตามเกณฑ์มาตรฐานจริยธรรมสากลล่าสุด
        </p>
      </div>

      {downloadNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600" />
          {downloadNotice}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาตามชื่อแบบฟอร์ม หรือรหัส เช่น NMU-IRB-01, PIS, ICF..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Forms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredForms.map((form) => (
          <div
            key={form.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-200">
                  {form.code}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                  {form.fileFormat}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-800 transition-colors leading-snug">
                {form.title}
              </h4>

              <p className="text-xs text-slate-500 leading-relaxed">
                {form.description}
              </p>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>เวอร์ชัน: {form.version}</span>
                <span>ปรับปรุง: {form.updatedDate}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ฉบับทางการ สนธ.
              </span>
              <button
                onClick={() => handleDownload(form)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลด ({form.fileFormat})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Researcher Checklist Box */}
      <div className="bg-amber-50/70 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              รายการตรวจสอบเอกสารก่อนส่งคำขอ (Pre-Submission Checklist)
            </h3>
            <p className="text-xs text-slate-600">
              เพื่อความรวดเร็วในการพิจารณา กรุณาตรวจสอบเอกสารให้ครบถ้วนก่อนยื่นผ่านระบบออนไลน์
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-amber-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>แบบเสนอโครงการวิจัย NMU-IRB-01 ลงนามครบทุกฝ่าย</span>
          </div>
          <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-amber-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>โครงร่างการวิจัยฉบับสมบูรณ์ (Full Protocol) พร้อมเอกสารอ้างอิง</span>
          </div>
          <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-amber-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>เอกสารคำชี้แจงผู้เข้าร่วมวิจัย (PIS) และหนังสือแสดงความยินยอม (ICF)</span>
          </div>
          <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-amber-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>เครื่องมือในการวิจัย เช่น แบบสอบถาม แบบประเมิน หรือคู่มือการสัมภาษณ์</span>
          </div>
          <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-amber-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>ประวัติผู้วิจัยและผู้ร่วมวิจัย (Curriculum Vitae)</span>
          </div>
          <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-amber-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>หนังสือรับรองผ่านการอบรมจริยธรรมการวิจัยในคน (GCP Certificate) ไม่เกิน 3 ปี</span>
          </div>
        </div>
      </div>
    </div>
  );
};
