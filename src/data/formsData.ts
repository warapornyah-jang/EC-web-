import { DownloadableForm } from '../types';

export const officialForms: DownloadableForm[] = [
  {
    id: 'form-01',
    code: 'NMU-IRB-01',
    title: 'แบบเสนอโครงการวิจัยเพื่อขอรับการพิจารณาจริยธรรมการวิจัยในคน (Initial Submission Form)',
    category: 'initial',
    version: 'Version 4.2 (ปรับปรุง 2568)',
    updatedDate: '15 มกราคม 2568',
    description: 'แบบฟอร์มหลักสำหรับการเสนอโครงร่างวิจัยใหม่ทุกประเภท (ชีวการแพทย์ และ สังคม-พฤติกรรมศาสตร์)',
    fileFormat: 'DOCX',
    downloadUrl: '#form-01'
  },
  {
    id: 'form-02',
    code: 'NMU-IRB-02',
    title: 'เอกสารชี้แจงผู้เข้าร่วมการวิจัย (Participant Information Sheet: PIS)',
    category: 'initial',
    version: 'Version 3.1',
    updatedDate: '10 กุมภาพันธ์ 2568',
    description: 'เทมเพลตมาตรฐานระบุวัตถุประสงค์ ขั้นตอน ประโยชน์ ความเสี่ยง และสิทธิของผู้เข้าร่วมวิจัยด้วยภาษาที่เข้าใจง่าย',
    fileFormat: 'DOCX',
    downloadUrl: '#form-02'
  },
  {
    id: 'form-03',
    code: 'NMU-IRB-03',
    title: 'หนังสือแสดงความยินยอมเข้าร่วมการวิจัย (Informed Consent Form: ICF)',
    category: 'initial',
    version: 'Version 3.0',
    updatedDate: '10 กุมภาพันธ์ 2568',
    description: 'หนังสือแสดงความยินยอมโดยสมัครใจ พร้อมแบบยินยอมสำหรับผู้เยาว์ (Assent Form) และผู้ปกครอง',
    fileFormat: 'DOCX',
    downloadUrl: '#form-03'
  },
  {
    id: 'form-04',
    code: 'NMU-IRB-04',
    title: 'แบบขอแก้ไขเพิ่มเติมโครงการวิจัย (Protocol Amendment Form)',
    category: 'amendment',
    version: 'Version 2.5',
    updatedDate: '5 สิงหาคม 2567',
    description: 'ใช้ยื่นเมื่อต้องการเปลี่ยนระเบียบวิธีวิจัย เครื่องมือ นักวิจัยร่วม หรือปรับขยายระยะเวลาดำเนินงาน',
    fileFormat: 'DOCX',
    downloadUrl: '#form-04'
  },
  {
    id: 'form-05',
    code: 'NMU-IRB-05',
    title: 'แบบขอต่ออายุการรับรองโครงการวิจัย (Continuing Review / Renewal Form)',
    category: 'amendment',
    version: 'Version 2.3',
    updatedDate: '12 กันยายน 2567',
    description: 'ยื่นล่วงหน้าอย่างน้อย 30 วันก่อนใบรับรอง COA สิ้นอายุ เพื่อขอต่อเวลาการดำเนินงานวิจัย',
    fileFormat: 'DOCX',
    downloadUrl: '#form-05'
  },
  {
    id: 'form-06',
    code: 'NMU-IRB-06',
    title: 'แบบรายงานความก้าวหน้า / เหตุการณ์ไม่พึงประสงค์ (Progress & SAE Deviation Report)',
    category: 'progress',
    version: 'Version 2.1',
    updatedDate: '20 พฤศจิกายน 2567',
    description: 'รายงานความคืบหน้ารอบ 6 เดือน/1 ปี หรือรายงานเหตุการณ์ไม่พึงประสงค์ที่เกิดขึ้นระหว่างการวิจัย',
    fileFormat: 'DOCX',
    downloadUrl: '#form-06'
  },
  {
    id: 'form-07',
    code: 'NMU-IRB-07',
    title: 'แบบรายงานสรุปและขอปิดโครงการวิจัย (Final Study Closure Report)',
    category: 'progress',
    version: 'Version 2.0',
    updatedDate: '1 ธันวาคม 2567',
    description: 'ใช้สำหรับส่งรายงานฉบับสมบูรณ์เมื่อโครงการสิ้นสุด หรือต้องการขอยุติโครงการก่อนกำหนด',
    fileFormat: 'DOCX',
    downloadUrl: '#form-07'
  },
  {
    id: 'form-08',
    code: 'NMU-IRB-GL01',
    title: 'แนวปฏิบัติและเกณฑ์การจำแนกประเภทการพิจารณาจริยธรรม (Review Classification Guideline)',
    category: 'guideline',
    version: 'ฉบับปี 2568-2569',
    updatedDate: '2 มกราคม 2568',
    description: 'เกณฑ์การพิจารณา Exempt (ยกเว้น), Expedited (เร่งด่วน) และ Full Board (คณะกรรมการเต็มชุด)',
    fileFormat: 'PDF',
    downloadUrl: '#form-08'
  }
];
