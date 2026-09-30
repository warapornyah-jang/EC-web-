import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Award, 
  FileCheck, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Check
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { HistoricalRecord, ProjectStatus } from '../types';

interface Props {
  onSelectProject: (code: string) => void;
}

export const RegistryDatabaseView: React.FC<Props> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<HistoricalRecord[]>(() => 
    StorageService.getInstance().getProjects()
  );
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Modal for issuing COA/COE
  const [modalAction, setModalAction] = useState<{
    type: 'coa' | 'coe' | 'new_code';
    project?: HistoricalRecord;
  } | null>(null);

  const [notification, setNotification] = useState<string | null>(null);

  const refreshList = () => {
    setProjects(StorageService.getInstance().getProjects());
  };

  const years = ['all', '2569', '2568', '2567', '2566', '2565', '2564', '2563', '2562', '2561', '2560'];
  const departments = ['all', 'คณะแพทยศาสตร์วชิรพยาบาล', 'คณะวิทยาศาสตร์และเทคโนโลยีสุขภาพ', 'วิทยาลัยพัฒนาชุมชนเมือง', 'สำนักงานอธิการบดี', 'สำนักงานสภาสถาบัน'];

  const filteredProjects = projects.filter((p) => {
    const matchesYear = selectedYear === 'all' || p.year.toString() === selectedYear;
    const matchesDept = selectedDept === 'all' || p.department.includes(selectedDept) || p.sender.includes(selectedDept);
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const matchesSearch = 
      p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.docNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.researcher && p.researcher.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.coaNumber && p.coaNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.coeNumber && p.coeNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesYear && matchesDept && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleIssueCoa = (project: HistoricalRecord) => {
    const nextCoa = StorageService.getInstance().getNextCoaNumber(project.year || 2569);
    project.coaNumber = nextCoa;
    project.status = 'approved';
    project.updatedAt = new Date().toISOString().split('T')[0];
    StorageService.getInstance().saveProject(project);
    refreshList();
    setModalAction(null);
    setNotification(`ออกเลข ${nextCoa} ให้โครงการ "${project.projectCode}" สำเร็จแล้ว`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleIssueCoe = (project: HistoricalRecord) => {
    const nextCoe = StorageService.getInstance().getNextCoeNumber(project.year || 2569);
    project.coeNumber = nextCoe;
    project.status = 'approved';
    project.updatedAt = new Date().toISOString().split('T')[0];
    StorageService.getInstance().saveProject(project);
    refreshList();
    setModalAction(null);
    setNotification(`ออกเลข ${nextCoe} (หนังสือรับรองยกเว้น) ให้โครงการ "${project.projectCode}" สำเร็จแล้ว`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleExportCsv = () => {
    const headers = ['ปี พ.ศ.', 'เลขทะเบียนรับ', 'เลขที่หนังสือ', 'ลงวันที่', 'รหัสโครงการ', 'จาก/ผู้วิจัย', 'สังกัด', 'เรื่อง', 'สถานะ', 'เลขที่ COA', 'เลขที่ COE'];
    const rows = filteredProjects.map(p => [
      p.year,
      p.recvNo,
      `"${p.docNo.replace(/"/g, '""')}"`,
      p.docDate,
      p.projectCode,
      `"${(p.researcher || p.sender).replace(/"/g, '""')}"`,
      `"${p.department.replace(/"/g, '""')}"`,
      `"${p.subject.replace(/"/g, '""')}"`,
      p.status,
      p.coaNumber || '-',
      p.coeNumber || '-'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NMU_IRB_Registry_Export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 mb-2">
            <Database className="w-3.5 h-3.5" />
            สมุดทะเบียนประวัติและระบบออกเลข (Registry & Numbering Service)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            ทะเบียนประวัติการเสนอโครงร่างวิจัย (2560 - 2569)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            ดึงข้อมูลจากชีทสารบรรณและฐานข้อมูลหลัก สำนักงานอธิการบดี มหาวิทยาลัยนวมินทราธิราช
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>ส่งออก CSV / Excel</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600" />
          {notification}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ค้นหาชื่อโครงการ, ผู้วิจัย, เลขหนังสือ, หรือรหัส 69-XXX..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
            />
          </div>

          <div>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none bg-white text-slate-700 font-medium"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y === 'all' ? 'ทุกปี พ.ศ. (2560-2569)' : `ปี พ.ศ. ${y}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none bg-white text-slate-700 font-medium truncate"
            >
              <option value="all">ทุกคณะ / ส่วนงาน</option>
              <option value="วพม.">คณะแพทยศาสตร์วชิรพยาบาล (วพม.)</option>
              <option value="วทส.">คณะวิทยาศาสตร์และเทคโนโลยีสุขภาพ (วทส.)</option>
              <option value="วชม.">วิทยาลัยพัฒนาชุมชนเมือง (วชม.)</option>
              <option value="สนธ.">สำนักงานอธิการบดี (สนธ.)</option>
              <option value="สนภ.">สำนักงานสภาสถาบัน (สนภ.)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div>
            พบข้อมูลทั้งหมด <strong className="text-emerald-800 font-bold">{filteredProjects.length}</strong> รายการ
          </div>

          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-700 mr-2">สถานะ:</span>
            {[
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'approved', label: 'อนุมัติ (COA/COE)' },
              { id: 'under_review', label: 'อยู่ระหว่างพิจารณา' },
              { id: 'closed', label: 'ปิดโครงการ' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedStatus(st.id);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                  selectedStatus === st.id
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table of Records */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4 w-16 text-center">ปี/รับที่</th>
                <th className="py-3 px-4 w-32">รหัสโครงการ</th>
                <th className="py-3 px-4">ชื่อเรื่อง / โครงร่างการวิจัย</th>
                <th className="py-3 px-4 w-44">ผู้วิจัย / สังกัด</th>
                <th className="py-3 px-4 w-32">สถานะ / COA</th>
                <th className="py-3 px-4 w-28 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-500">
                      <span className="font-bold text-slate-800 block">{p.year}</span>
                      <span className="text-[10px] text-slate-400">#{p.recvNo}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onSelectProject(p.projectCode)}
                        className="font-mono font-bold text-emerald-800 hover:text-emerald-950 hover:underline block text-left"
                      >
                        {p.projectCode}
                      </button>
                      <span className="text-[10px] text-slate-400 truncate block max-w-[120px]">
                        {p.docNo}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 line-clamp-2 max-w-md">
                        {p.subject}
                      </div>
                      <span className="text-[10px] text-slate-400">ลงวันที่: {p.docDate}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 truncate max-w-[160px]">
                        {p.researcher || p.sender}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                        {p.department}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {p.coaNumber ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-mono font-bold text-[11px] border border-emerald-300 inline-block mb-1">
                          {p.coaNumber}
                        </span>
                      ) : p.coeNumber ? (
                        <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 font-mono font-bold text-[11px] border border-teal-300 inline-block mb-1">
                          {p.coeNumber}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium block">
                          {p.status === 'under_review' ? 'รอประเมิน' : p.status === 'closed' ? 'ปิดโครงการ' : 'ตรวจเอกสาร'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {!p.coaNumber && !p.coeNumber && p.status !== 'closed' ? (
                          <button
                            onClick={() => setModalAction({ type: 'coa', project: p })}
                            className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold shadow-xs transition-colors"
                            title="ออกเลข COA"
                          >
                            ออก COA
                          </button>
                        ) : (
                          <button
                            onClick={() => onSelectProject(p.projectCode)}
                            className="px-2 py-1 bg-slate-100 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold transition-colors"
                          >
                            ดูผล
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div>
              หน้า {currentPage} จาก {totalPages} (แสดงหน้าละ {itemsPerPage} รายการ)
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for COA / COE Issuance */}
      {modalAction && modalAction.project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-emerald-300 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  ออกหนังสือรับรองจริยธรรม
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {modalAction.project.projectCode}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
              ต้องการออกเลขหนังสือรับรองจริยธรรมให้แก่โครงร่างวิจัย: <br />
              <strong>"{modalAction.project.subject}"</strong>
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleIssueCoa(modalAction.project!)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>ออกเลขรับรอง COA (Certificate of Approval)</span>
              </button>

              <button
                onClick={() => handleIssueCoe(modalAction.project!)}
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Award className="w-4 h-4 text-emerald-200" />
                <span>ออกเลขรับรองยกเว้น COE (Certificate of Exemption)</span>
              </button>

              <button
                onClick={() => setModalAction(null)}
                className="w-full py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
