import React, { useState } from 'react';
import { 
  FileCheck, 
  Search, 
  DownloadCloud, 
  ArrowRight, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  FolderGit2, 
  Sparkles,
  BookOpen,
  HelpCircle,
  Award
} from 'lucide-react';
import { StorageService } from '../services/storageService';

interface Props {
  onNavigate: (tab: string) => void;
  onTrackProject: (code: string) => void;
}

export const HomeView: React.FC<Props> = ({ onNavigate, onTrackProject }) => {
  const [quickTrackCode, setQuickTrackCode] = useState('');
  const projects = StorageService.getInstance().getProjects();

  const totalCount = projects.length;
  const approvedCount = projects.filter(p => p.status === 'approved').length;
  const underReviewCount = projects.filter(p => p.status === 'under_review' || p.status === 'submitted' || p.status === 'document_checking').length;
  const coaCount = projects.filter(p => p.coaNumber).length;

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackCode.trim()) {
      onTrackProject(quickTrackCode.trim());
    }
  };

  const faculties = [
    { name: 'คณะแพทยศาสตร์วชิรพยาบาล (วพม.)', desc: 'งานวิจัยทางคลินิก วิทยาศาสตร์การแพทย์ และสุขภาวะเขตเมือง', tag: 'วพม.' },
    { name: 'คณะพยาบาลศาสตร์เกื้อการุณย์ (พยม.)', desc: 'งานวิจัยการพยาบาล ผู้สูงอายุ การดูแลผู้ป่วย และสาธารณสุข', tag: 'พยม.' },
    { name: 'คณะวิทยาศาสตร์และเทคโนโลยีสุขภาพ (วทส.)', desc: 'นวัตกรรมสุขภาพ ปฏิบัติการฉุกเฉินการแพทย์ และเทคโนโลยีการแพทย์', tag: 'วทส.' },
    { name: 'วิทยาลัยพัฒนาชุมชนเมือง (วชม.)', desc: 'การจัดการเมือง สิ่งแวดล้อมชุมชนเมือง และการพัฒนาคุณภาพชีวิต', tag: 'วชม.' },
    { name: 'วิทยาลัยพัฒนามหานคร (วมน.)', desc: 'นโยบายสาธารณะ การบริหารเมืองหลวง และเศรษฐกิจเมือง', tag: 'วมน.' },
    { name: 'สำนักงานอธิการบดี & บุคลากร (สนธ.)', desc: 'งานวิจัยสถาบัน งานวิจัยเพื่อการพัฒนางานประจำสู่งานวิจัย (R2R)', tag: 'สนธ.' }
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white shadow-xl border border-emerald-700/50">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-amber-300 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            ระบบบริการออนไลน์และติดตามสถานะจริยธรรมวิจัย พ.ศ. 2569
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
            ระบบคณะกรรมการจริยธรรมในคน <br className="hidden sm:inline" />
            <span className="text-amber-300 font-black">
              มหาวิทยาลัยนวมินทราธิราช
            </span>
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed mb-8 font-light">
            สำนักงานอธิการบดี มหาวิทยาลัยนวมินทราธิราช มุ่งมั่นยกระดับมาตรฐานจริยธรรมการวิจัยในคนตามหลักสากล (Belmont Report, Declaration of Helsinki, GCP) 
            ด้วยระบบส่งคำขอออนไลน์ การลงนามดิจิทัล ติดตามสถานะแบบเรียลไทม์ และแจ้งเตือนผ่านอีเมล
          </p>

          {/* Quick Track Input Bar */}
          <form 
            onSubmit={handleQuickTrack}
            className="bg-white p-2 rounded-2xl shadow-xl max-w-2xl flex flex-col sm:flex-row items-center gap-2 border-2 border-amber-300/40"
          >
            <div className="flex items-center gap-3 px-3 w-full sm:w-auto flex-1">
              <Search className="w-5 h-5 text-emerald-800 shrink-0" />
              <input
                type="text"
                value={quickTrackCode}
                onChange={(e) => setQuickTrackCode(e.target.value)}
                placeholder="ป้อนรหัสโครงการ เช่น 69-001-000-000 หรือ 68-001..."
                className="w-full text-slate-800 text-sm font-medium placeholder:text-slate-400 focus:outline-none py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
            >
              <span>ตรวจสอบสถานะ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-emerald-200">
            <span className="font-medium text-amber-300">ตัวอย่างค้นหาด่วน:</span>
            {['69-002-000-000', '69-003-000-000', '68-001-050-001', '68-007-010-007'].map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => onTrackProject(ex)}
                className="font-mono bg-emerald-800/80 hover:bg-emerald-700 px-2 py-0.5 rounded text-white border border-emerald-600/60 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Core Action Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div 
          onClick={() => onNavigate('submission')}
          className="group cursor-pointer bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-emerald-800 transition-colors">
              ยื่นคำขอรับพิจารณาออนไลน์
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ส่งโครงร่างวิจัยใหม่ พร้อมลงนามแบบดิจิทัลผ่านสมาร์ทโฟน รวดเร็ว ปลอดภัย และออกเลขโครงการอัตโนมัติ
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
            <span>เริ่มยื่นคำขอใหม่</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('tracking')}
          className="group cursor-pointer bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-amber-800 transition-colors">
              ติดตามสถานะโครงการ (69-XXX)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              ป้อนเลข 69-001-000-000 ถึง 69-999-999-999 พร้อมระบบยืนยันรหัสผ่าน ดูรายงานสรุปผลประเมินทันที
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
            <span>ตรวจสถานะผลการประเมิน</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('forms')}
          className="group cursor-pointer bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <DownloadCloud className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-teal-800 transition-colors">
              ดาวน์โหลดแบบฟอร์มจริยธรรม
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              แบบเสนอโครงการ (NMU-IRB-01), เอกสารชี้แจง (PIS), หนังสือยินยอม (ICF), แบบต่ออายุ และแบบปิดโครงการ
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
            <span>แบบฟอร์มมาตรฐาน</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('drive')}
          className="group cursor-pointer bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-emerald-200">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-emerald-800 transition-colors">
              Google Drive & ชีทกลาง
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              เชื่อมต่อโฟลเดอร์เอกสารอ้างอิงและชีทสารบรรณกลาง ออกเลข COA และ COE บันทึกประวัติอย่างเป็นระบบ
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>เข้าดูโฟลเดอร์เอกสาร</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* Live Statistics Counter */}
      <section className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-amber-50/50 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-emerald-950">
              สถิติการดำเนินงานด้านจริยธรรมการวิจัยในคน (NMU-IRB Registry)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              ข้อมูลสรุปจากฐานข้อมูลหลัก ตั้งแต่ปี พ.ศ. 2560 ถึง 2569
            </p>
          </div>
          <button
            onClick={() => onNavigate('registry')}
            className="px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>ดูสมุดทะเบียนประวัติทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900 block font-mono">
              {totalCount}
            </span>
            <span className="text-xs font-medium text-slate-600 mt-1 block">โครงการสะสมในระบบ</span>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 block font-mono">
              {approvedCount}
            </span>
            <span className="text-xs font-medium text-slate-600 mt-1 block">ผ่านการรับรอง (Approved)</span>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 block font-mono">
              {underReviewCount}
            </span>
            <span className="text-xs font-medium text-slate-600 mt-1 block">อยู่ระหว่างการพิจารณา</span>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-800 block font-mono">
              {coaCount}
            </span>
            <span className="text-xs font-medium text-slate-600 mt-1 block">ออกเลข COA แล้ว</span>
          </div>
        </div>
      </section>

      {/* 5-Step Workflow Diagram */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" /> ขั้นตอนการทำงานที่เป็นมาตรฐาน (SOPs)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            5 ขั้นตอนการขอรับการพิจารณาจริยธรรมการวิจัยในคน
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            กระบวนการที่รวดเร็ว โปร่งใส และสามารถตรวจสอบย้อนหลังได้ทุกขั้นตอน
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            { step: '01', title: 'ยื่นคำขอออนไลน์', desc: 'กรอกแบบฟอร์ม แนบโครงร่าง PIS/ICF และลงนามดิจิทัล' },
            { step: '02', title: 'ตรวจสอบเอกสาร', desc: 'เจ้าหน้าที่ สนธ. ตรวจความสมบูรณ์และจัดประเภท (Exempt/Expedited/Full)' },
            { step: '03', title: 'ส่งผู้ทรงคุณวุฒิ', desc: 'Reviewers ผู้เชี่ยวชาญประเมินตามเกณฑ์มาตรฐานจริยธรรมสากล' },
            { step: '04', title: 'ประชุมคณะกรรมการ', desc: 'พิจารณาข้อเสนอแนะและมีมติรับรอง หรือให้ปรับปรุงแก้ไข' },
            { step: '05', title: 'ออกใบรับรอง COA/COE', desc: 'ลงนามรับรอง ออกเลขและส่งอีเมลแจ้งเตือนนักวิจัยทันที' }
          ].map((item, idx) => (
            <div key={idx} className="relative bg-emerald-50/40 rounded-2xl p-5 border border-emerald-100 flex flex-col justify-between">
              <div>
                <span className="text-2xl font-black text-amber-500 font-mono block mb-2">
                  {item.step}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>มีระบบแจ้งเตือน</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Committee Meetings & Announcements */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meeting Schedule */}
        <div className="lg:col-span-1 bg-gradient-to-br from-white to-amber-50/30 rounded-3xl p-6 border border-amber-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  ปฏิทินการประชุมคณะกรรมการ
                </h3>
                <p className="text-xs text-slate-500">สำนักงานอธิการบดี พ.ศ. 2569</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-xs">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-800">การประชุมครั้งที่ 10/2569</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                    รอบถัดไป
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-800">15 ตุลาคม 2569</div>
                <div className="text-xs text-rose-600 font-medium mt-1">
                  ปิดรับข้อเสนอโครงร่าง: 30 กันยายน 2569
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-xs opacity-80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700">การประชุมครั้งที่ 11/2569</span>
                </div>
                <div className="text-sm font-bold text-slate-800">19 พฤศจิกายน 2569</div>
                <div className="text-xs text-slate-500 mt-1">
                  ปิดรับข้อเสนอโครงร่าง: 5 พฤศจิกายน 2569
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800">
            <strong>หมายเหตุ:</strong> โครงการประเภท Exempt และ Expedited สามารถพิจารณาได้ต่อเนื่องตลอดทั้งเดือน
          </div>
        </div>

        {/* Faculties & Institutes */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                ส่วนงานในสังกัดมหาวิทยาลัยนวมินทราธิราชที่รองรับการยื่นคำขอ
              </h3>
              <p className="text-xs text-slate-500">
                นักวิจัย อาจารย์ บุคลากร และนักศึกษาสามารถส่งคำขอผ่านระบบกลางได้โดยตรง
              </p>
            </div>
            <Award className="w-6 h-6 text-emerald-700 hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {faculties.map((fac, i) => (
              <div key={i} className="p-3.5 bg-slate-50/70 hover:bg-emerald-50/60 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{fac.name}</h4>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white text-emerald-800 border border-slate-200">
                    {fac.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{fac.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
