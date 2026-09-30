import React, { useState } from 'react';
import { 
  FileCheck, 
  Send, 
  CheckCircle2, 
  Paperclip, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  User, 
  Building, 
  FileText, 
  Sparkles,
  Upload,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DigitalSignaturePad } from './DigitalSignaturePad';
import { StorageService } from '../services/storageService';
import { ReviewType, SubmissionData } from '../types';

interface Props {
  onSuccessTrack: (code: string) => void;
}

export const SubmissionView: React.FC<Props> = ({ onSuccessTrack }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [newProjectCode, setNewProjectCode] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Form State
  const [titleThai, setTitleThai] = useState('');
  const [titleEnglish, setTitleEnglish] = useState('');
  const [academicTitle, setAcademicTitle] = useState('ผู้ช่วยศาสตราจารย์ ดร.');
  const [researcherName, setResearcherName] = useState('วราพร ยะหะยอ');
  const [faculty, setFaculty] = useState('สำนักงานอธิการบดี');
  const [department, setDepartment] = useState('กองบริหารงานวิจัยและวิเทศสัมพันธ์');
  const [email, setEmail] = useState('waraporn.yah@nmu.ac.th');
  const [phone, setPhone] = useState('02-244-3000');
  const [coInvestigators, setCoInvestigators] = useState('');

  const [reviewType, setReviewType] = useState<ReviewType>('expedited');
  const [fundingSource, setFundingSource] = useState('ทุนอุดหนุนการวิจัย มหาวิทยาลัยนวมินทราธิราช');
  const [budgetAmount, setBudgetAmount] = useState('150,000');
  const [vulnerables, setVulnerables] = useState<string[]>([]);

  // Attached files simulation
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; type: string; uploadedAt: string }[]>([
    { name: 'โครงร่างการวิจัย_ฉบับสมบูรณ์_NMU.pdf', size: '2.4 MB', type: 'PDF', uploadedAt: 'เพิ่งอัปโหลด' },
    { name: 'เอกสารชี้แจงผู้เข้าร่วมวิจัย_PIS_Form.docx', size: '420 KB', type: 'DOCX', uploadedAt: 'เพิ่งอัปโหลด' },
    { name: 'หนังสือแสดงความยินยอม_ICF_Form.docx', size: '380 KB', type: 'DOCX', uploadedAt: 'เพิ่งอัปโหลด' },
  ]);

  // Digital Signature State
  const [signatureData, setSignatureData] = useState<string>('');
  const [signerPosition, setSignerPosition] = useState('หัวหน้าโครงการวิจัย');
  const [pin, setPin] = useState('123456');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleVulnerable = (item: string) => {
    if (vulnerables.includes(item)) {
      setVulnerables(vulnerables.filter(v => v !== item));
    } else {
      setVulnerables([...vulnerables, item]);
    }
  };

  const handleNextStep = () => {
    setFormError(null);
    if (currentStep === 1) {
      if (!titleThai.trim() || !researcherName.trim() || !email.trim()) {
        setFormError('กรุณากรอกชื่อโครงการวิจัย ชื่อหัวหน้าโครงการ และอีเมลให้ครบถ้วน');
        return;
      }
    } else if (currentStep === 2) {
      if (!fundingSource.trim()) {
        setFormError('กรุณาระบุแหล่งทุนวิจัย');
        return;
      }
    } else if (currentStep === 3) {
      if (attachedFiles.length === 0) {
        setFormError('กรุณาแนบไฟล์โครงร่างการวิจัยอย่างน้อย 1 ไฟล์');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!agreeTerms) {
      setFormError('กรุณาทำเครื่องหมายยินยอมรับรองความถูกต้องของข้อมูลตามหลักจริยธรรม');
      return;
    }

    if (!pin || pin.length < 4) {
      setFormError('กรุณากำหนดรหัส PIN อย่างน้อย 4 หลัก เพื่อใช้สำหรับติดตามสถานะ');
      return;
    }

    // Generate project code format 69-001-000-000 up to 69-999-999-999
    const assignedCode = StorageService.getInstance().getNextProjectCode(2569);
    setNewProjectCode(assignedCode);

    const submissionPayload: SubmissionData = {
      id: `sub-${Date.now()}`,
      projectCode: assignedCode,
      titleThai,
      titleEnglish,
      principalInvestigator: researcherName,
      academicTitle,
      faculty,
      department,
      email,
      phone,
      coInvestigators,
      reviewType,
      fundingSource,
      budgetAmount,
      vulnerablePopulations: vulnerables,
      submissionDate: new Date().toISOString(),
      digitalSignature: signatureData,
      signerName: `${academicTitle} ${researcherName}`,
      signerPosition,
      pin,
      status: 'submitted',
      progressNotes: ['ยื่นคำขอออนไลน์สำเร็จเมื่อ ' + new Date().toLocaleString('th-TH')],
      reviewersCount: reviewType === 'fullboard' ? 3 : 2,
      attachedFiles
    };

    StorageService.getInstance().createNewSubmission(submissionPayload);

    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-300 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold border border-amber-300">
            ระบบออกรหัสโครงการอัตโนมัติเรียบร้อยแล้ว
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            ยื่นคำขอรับการพิจารณาสำเร็จ!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            คณะกรรมการจริยธรรมในคน สำนักงานอธิการบดี ได้รับข้อมูลและเอกสารโครงร่างวิจัยของท่านเรียบร้อยแล้ว
          </p>
        </div>

        {/* Assigned Project Code Display */}
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 space-y-3">
          <div className="text-xs text-emerald-800 font-semibold">รหัสโครงการสำหรับติดตามสถานะ</div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-950 tracking-wider">
              {newProjectCode}
            </span>
            <button
              onClick={() => copyToClipboard(newProjectCode)}
              className="p-2 bg-white hover:bg-emerald-100 rounded-xl text-emerald-800 border border-emerald-200 transition-colors"
              title="คัดลอกรหัสโครงการ"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-center gap-1.5 font-mono">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>รหัสผ่าน / PIN ที่ท่านตั้งไว้: <strong>{pin}</strong></span>
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs text-amber-900 space-y-2">
          <div className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-700" />
            การดำเนินการขั้นถัดไป:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
            <li>ระบบได้จำลองส่งอีเมลยืนยันการรับเอกสารไปยัง <strong className="text-slate-900">{email}</strong> แล้ว</li>
            <li>เจ้าหน้าที่สำนักงานอธิการบดีจะตรวจเอกสารภายใน 3-5 วันทำการ</li>
            <li>ท่านสามารถเข้าตรวจสอบผลการประเมินได้ตลอด 24 ชม. ผ่านเมนู "ติดตามโครงการ"</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => onSuccessTrack(newProjectCode)}
            className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>ไปที่หน้าติดตามสถานะโครงการ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
              setTitleThai('');
            }}
            className="px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-all"
          >
            ยื่นคำขอโครงการอื่นเพิ่ม
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
          <FileCheck className="w-3.5 h-3.5" />
          ระบบยื่นคำขอรับพิจารณาจริยธรรมการวิจัยในคน (NMU-IRB Online)
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          ส่งคำขอรับการพิจารณาจริยธรรมการวิจัยในคน
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          กรอกข้อมูลโครงร่างวิจัย แนบเอกสารประกอบ และลงนามแบบดิจิทัลผ่านระบบ พร้อมออกเลขโครงการ 69-XXX อัตโนมัติ
        </p>
      </div>

      {/* Progress Steps Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-emerald-100 shadow-xs">
        <div className="flex items-center justify-between">
          {[
            { num: 1, title: 'ข้อมูลนักวิจัยและโครงการ' },
            { num: 2, title: 'ประเภทและรายละเอียดวิจัย' },
            { num: 3, title: 'เอกสารแนบโครงร่าง' },
            { num: 4, title: 'ลงนามดิจิทัลและส่งคำขอ' }
          ].map((st, i) => (
            <div key={st.num} className="flex-1 flex items-center">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                    currentStep === st.num
                      ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                      : currentStep > st.num
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {currentStep > st.num ? <Check className="w-4 h-4" /> : st.num}
                </div>
                <div className="hidden md:block text-left">
                  <div className={`text-xs font-bold ${currentStep >= st.num ? 'text-slate-900' : 'text-slate-400'}`}>
                    ขั้นตอนที่ {st.num}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[130px]">{st.title}</div>
                </div>
              </div>
              {i < 3 && <div className={`flex-1 h-0.5 mx-3 hidden sm:block ${currentStep > st.num ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Form Error Notice */}
      {formError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>{formError}</div>
        </div>
      )}

      {/* Step Contents */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-md">
        {/* STEP 1: Basic & PI Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-bold text-slate-900">ขั้นตอนที่ 1: ข้อมูลนักวิจัยและชื่อโครงการ</h3>
              <p className="text-xs text-slate-500">กรุณากรอกข้อมูลหัวหน้าโครงการและชื่อโครงร่างการวิจัยทั้งภาษาไทยและอังกฤษ</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อโครงการวิจัย (ภาษาไทย) *
                </label>
                <textarea
                  rows={2}
                  value={titleThai}
                  onChange={(e) => setTitleThai(e.target.value)}
                  placeholder="เช่น การพัฒนาโมเดลปัญญาประดิษฐ์เพื่อประเมินความเสี่ยงสุขภาพของชุมชนเมืองในกรุงเทพมหานคร"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อโครงการวิจัย (ภาษาอังกฤษ)
                </label>
                <textarea
                  rows={2}
                  value={titleEnglish}
                  onChange={(e) => setTitleEnglish(e.target.value)}
                  placeholder="e.g. Development of Artificial Intelligence Model for Urban Health Risk Assessment in Bangkok"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">คำนำหน้านาม / ตำแหน่งทางวิชาการ</label>
                  <select
                    value={academicTitle}
                    onChange={(e) => setAcademicTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white"
                  >
                    <option>อาจารย์</option>
                    <option>อาจารย์ ดร.</option>
                    <option>ผู้ช่วยศาสตราจารย์</option>
                    <option>ผู้ช่วยศาสตราจารย์ ดร.</option>
                    <option>รองศาสตราจารย์</option>
                    <option>รองศาสตราจารย์ ดร.</option>
                    <option>ศาสตราจารย์</option>
                    <option>นายแพทย์ / แพทย์หญิง</option>
                    <option>นาย / นาง / นางสาว</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อ-นามสกุล หัวหน้าโครงการวิจัย (PI) *</label>
                  <input
                    type="text"
                    value={researcherName}
                    onChange={(e) => setResearcherName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">คณะ / ส่วนงานสังกัด *</label>
                  <select
                    value={faculty}
                    onChange={(e) => setFaculty(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none bg-white"
                  >
                    <option>คณะแพทยศาสตร์วชิรพยาบาล (วพม.)</option>
                    <option>คณะพยาบาลศาสตร์เกื้อการุณย์ (พยม.)</option>
                    <option>คณะวิทยาศาสตร์และเทคโนโลยีสุขภาพ (วทส.)</option>
                    <option>วิทยาลัยพัฒนาชุมชนเมือง (วชม.)</option>
                    <option>วิทยาลัยพัฒนามหานคร (วมน.)</option>
                    <option>สำนักงานอธิการบดี (สนธ.)</option>
                    <option>สำนักงานสภาสถาบัน (สนภ.)</option>
                    <option>หน่วยงานภายนอก / สถาบันร่วมวิจัย</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ภาควิชา / ฝ่าย / งาน</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">อีเมลติดต่อ (สำหรับรับแจ้งเตือนผล) *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">รายชื่อผู้ร่วมวิจัย (ถ้ามี)</label>
                <input
                  type="text"
                  value={coInvestigators}
                  onChange={(e) => setCoInvestigators(e.target.value)}
                  placeholder="เช่น อ.ดวงพร เทพมณี, ผศ.ชัชพล มงคลิก"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Review Type & Vulnerabilities */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-bold text-slate-900">ขั้นตอนที่ 2: ประเภทการพิจารณาและรายละเอียดวิจัย</h3>
              <p className="text-xs text-slate-500">เลือกประเภทการขอรับการพิจารณาตามเกณฑ์ความเสี่ยงต่ออาสาสมัคร</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">ประเภทการขอรับการพิจารณา (Review Classification) *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'exempt' as ReviewType,
                      title: 'Exempt (ยกเว้น)',
                      badge: 'ออกเลข COE',
                      desc: 'การวิจัยที่มีความเสี่ยงไม่เกินความเสี่ยงในชีวิตประจำวัน เช่น งานวิจัยข้อมูลทุติยภูมิ งานวิจัยแบบสอบถามที่ไม่เปิดเผยตัวตน'
                    },
                    {
                      id: 'expedited' as ReviewType,
                      title: 'Expedited (เร่งด่วน)',
                      badge: 'ออกเลข COA',
                      desc: 'ความเสี่ยงต่ำ ไม่เกินความเสี่ยงในชีวิตประจำวัน เช่น การเจาะเลือดปริมาณน้อย การสัมภาษณ์พฤติกรรมสุขภาพ'
                    },
                    {
                      id: 'fullboard' as ReviewType,
                      title: 'Full Board (เต็มคณะ)',
                      badge: 'ออกเลข COA',
                      desc: 'ความเสี่ยงมากกว่าความเสี่ยงต่ำ การทดลองยา เครื่องมือแพทย์ หรือกลุ่มเปราะบาง เข้าประชุมคณะกรรมการเต็มชุด'
                    }
                  ].map((rt) => (
                    <div
                      key={rt.id}
                      onClick={() => setReviewType(rt.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        reviewType === rt.id
                          ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                          : 'border-slate-200 hover:border-emerald-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="font-bold text-slate-900 text-sm">{rt.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                            {rt.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{rt.desc}</p>
                      </div>
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className={`w-4 h-4 ${reviewType === rt.id ? 'text-emerald-700' : 'text-slate-300'}`} />
                        <span>{reviewType === rt.id ? 'เลือกประเภทนี้' : 'เลือก'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">แหล่งทุนสนับสนุนการวิจัย</label>
                  <input
                    type="text"
                    value={fundingSource}
                    onChange={(e) => setFundingSource(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">งบประมาณโครงการ (บาท)</label>
                  <input
                    type="text"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">กลุ่มเปราะบางที่เกี่ยวข้อง (Vulnerable Populations)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'เด็กและเยาวชน (ต่ำกว่า 18 ปี)',
                    'สตรีมีครรภ์ หรือทารกในครรภ์',
                    'ผู้สูงอายุ หรือผู้ป่วยติดเตียง',
                    'ผู้มีความบกพร่องทางสติปัญญา',
                    'นักศึกษา หรือผู้ใต้บังคับบัญชา',
                    'ไม่มีกลุ่มเปราะบาง (บุคคลทั่วไป)'
                  ].map((vul) => (
                    <label
                      key={vul}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-emerald-50/50 cursor-pointer text-xs font-medium text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={vulnerables.includes(vul)}
                        onChange={() => toggleVulnerable(vul)}
                        className="rounded text-emerald-700 focus:ring-emerald-500"
                      />
                      <span>{vul}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Attachments */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-bold text-slate-900">ขั้นตอนที่ 3: เอกสารแนบโครงร่างการวิจัย</h3>
              <p className="text-xs text-slate-500">แนบไฟล์โครงร่างวิจัยฉบับสมบูรณ์ เอกสารชี้แจง (PIS) และแบบยินยอม (ICF)</p>
            </div>

            <div className="border-2 border-dashed border-emerald-200 rounded-2xl p-6 text-center bg-emerald-50/30 hover:bg-emerald-50/60 transition-colors">
              <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-800">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</div>
              <p className="text-xs text-slate-500 mt-1">รองรับไฟล์ PDF, DOCX, XLSX ขนาดไม่เกิน 25 MB ต่อไฟล์</p>
              <button
                type="button"
                onClick={() => {
                  setAttachedFiles([
                    ...attachedFiles,
                    {
                      name: `เอกสารเพิ่มเติม_${Date.now().toString().slice(-4)}.pdf`,
                      size: '1.2 MB',
                      type: 'PDF',
                      uploadedAt: 'เพิ่งอัปโหลด'
                    }
                  ]);
                }}
                className="mt-3 px-4 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-300 rounded-xl shadow-xs"
              >
                + จำลองเพิ่มไฟล์แนบ
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700">รายการไฟล์ที่แนบในคำขอนี้ ({attachedFiles.length} ไฟล์):</h4>
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Paperclip className="w-4 h-4 text-emerald-700" />
                    <div>
                      <span className="font-bold text-slate-800 block">{file.name}</span>
                      <span className="text-[11px] text-slate-400">{file.size} • {file.type} • {file.uploadedAt}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-rose-600 font-bold px-2 py-1 rounded"
                  >
                    ลบ
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Digital Signature & PIN */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-bold text-slate-900">ขั้นตอนที่ 4: การลงนามแบบดิจิทัล และยืนยันความปลอดภัย</h3>
              <p className="text-xs text-slate-500">ลงลายมือชื่อดิจิทัลและตั้งรหัส PIN เพื่อใช้ติดตามผลการประเมินโครงการ</p>
            </div>

            {/* Digital Signature Component */}
            <DigitalSignaturePad
              signerName={`${academicTitle} ${researcherName}`}
              onSignatureComplete={(dataUrl) => setSignatureData(dataUrl)}
            />

            {/* PIN for tracking */}
            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-800" />
                <h4 className="font-bold text-amber-950 text-xs sm:text-sm">
                  กำหนดรหัสผ่าน / PIN สำหรับติดตามผลโครงการนี้ (4-6 หลัก) *
                </h4>
              </div>
              <p className="text-xs text-amber-800">
                รหัสผ่านนี้ใช้ในการยืนยันตัวตนเมื่อท่านเข้าตรวจสอบสถานะโครงการที่หน้า "ติดตามโครงการ" เพื่อความปลอดภัยของข้อมูล
              </p>
              <div className="max-w-xs">
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="เช่น 123456"
                  className="w-full text-center text-lg font-mono font-bold tracking-widest px-4 py-2.5 bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <span className="block text-[11px] text-slate-500 mt-1">รหัสตั้งต้นแนะนำ: 123456</span>
              </div>
            </div>

            {/* Declaration Terms */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500"
                />
                <span className="leading-relaxed">
                  ข้าพเจ้าขอรับรองว่าข้อมูลและเอกสารโครงร่างวิจัยที่ระบุข้างต้นเป็นความจริงทุกประการ และจะดำเนินการวิจัยตามหลักจริยธรรมการวิจัยในคนสากล 
                  (Declaration of Helsinki และ ICH-GCP) และจะไม่เริ่มดำเนินการวิจัยกับมนุษย์จนกว่าจะได้รับหนังสือรับรอง (COA/COE) จากคณะกรรมการจริยธรรมฯ สำนักงานอธิการบดี
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>
          ) : <div />}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <span>ถัดไป</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-8 py-3 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
              <span>ลงนามดิจิทัลและส่งคำขอทันที</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
