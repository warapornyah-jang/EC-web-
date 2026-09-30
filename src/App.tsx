/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { TrackingView } from './components/TrackingView';
import { SubmissionView } from './components/SubmissionView';
import { FormsDownloadView } from './components/FormsDownloadView';
import { RegistryDatabaseView } from './components/RegistryDatabaseView';
import { GoogleDriveView } from './components/GoogleDriveView';
import { ArchitectureSecurityView } from './components/ArchitectureSecurityView';
import { EmailModal } from './components/EmailModal';
import { initAuth } from './services/firebaseAuth';
import { StorageService } from './services/storageService';
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  HeartHandshake
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [trackingCode, setTrackingCode] = useState<string>('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailModalProps, setEmailModalProps] = useState<{ code?: string; email?: string }>({});
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // Initialize Auth state listener
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
      },
      () => {
        setUser(null);
      }
    );

    // Network connectivity listener
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      if (unsubscribe) unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleTrackProject = (code: string) => {
    setTrackingCode(code);
    setActiveTab('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEmailModal = (code?: string, email?: string) => {
    setEmailModalProps({ code, email });
    setIsEmailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        setUser={setUser}
        onOpenEmailModal={() => handleOpenEmailModal()}
        isOnline={isOnline}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onTrackProject={handleTrackProject}
          />
        )}

        {activeTab === 'tracking' && (
          <TrackingView
            initialCode={trackingCode}
            onOpenEmailModal={(code, email) => handleOpenEmailModal(code, email)}
          />
        )}

        {activeTab === 'submission' && (
          <SubmissionView
            onSuccessTrack={(code) => handleTrackProject(code)}
          />
        )}

        {activeTab === 'forms' && (
          <FormsDownloadView />
        )}

        {activeTab === 'registry' && (
          <RegistryDatabaseView
            onSelectProject={handleTrackProject}
          />
        )}

        {activeTab === 'drive' && (
          <GoogleDriveView
            user={user}
            setUser={setUser}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureSecurityView />
        )}
      </main>

      {/* Email Notification Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        defaultProjectCode={emailModalProps.code}
        defaultEmail={emailModalProps.email}
      />

      {/* Official Footer */}
      <footer className="bg-emerald-950 text-white mt-auto border-t-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Col 1: About */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-emerald-950 flex flex-col items-center justify-center font-bold text-xs p-1 shadow">
                  <span className="leading-none text-emerald-900 font-black">NMU</span>
                  <span className="leading-none text-amber-600 text-[9px] font-bold">IRB</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight text-white">
                    คณะกรรมการจริยธรรมในคน
                  </h3>
                  <p className="text-xs text-emerald-200">
                    สำนักงานอธิการบดี มหาวิทยาลัยนวมินทราธิราช
                  </p>
                </div>
              </div>
              <p className="text-xs text-emerald-100/80 leading-relaxed max-w-lg">
                มุ่งมั่นส่งเสริมการวิจัยที่มีคุณค่าทางวิชาการและปกป้องสิทธิ ความปลอดภัย และสวัสดิภาพของผู้เข้าร่วมการวิจัย
                ตามหลักจริยธรรมการวิจัยในคนระดับสากล ได้แก่ Belmont Report, Declaration of Helsinki, CIOMS Guidelines และ ICH-GCP
              </p>
              <div className="flex items-center gap-3 text-xs text-amber-300 font-semibold pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> เข้ารหัสลับข้อมูล AES-256
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <HeartHandshake className="w-4 h-4" /> มาตรฐานสากล
                </span>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="font-bold text-sm text-amber-300 mb-3">บริการและระบบงาน</h4>
              <ul className="space-y-2 text-xs text-emerald-100/90 font-medium">
                <li>
                  <button 
                    onClick={() => { setActiveTab('tracking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-amber-300 transition-colors text-left"
                  >
                    ติดตามสถานะโครงการ (69-XXX)
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('submission'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-amber-300 transition-colors text-left"
                  >
                    ยื่นคำขอรับการพิจารณาออนไลน์
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('forms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-amber-300 transition-colors text-left"
                  >
                    ดาวน์โหลดแบบฟอร์ม NMU-IRB
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('registry'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-amber-300 transition-colors text-left"
                  >
                    สมุดทะเบียนประวัติ (2560-2569)
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('drive'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-amber-300 transition-colors text-left"
                  >
                    Google Drive & สารบรรณชีท
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('architecture'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-amber-300 transition-colors text-left"
                  >
                    สถาปัตยกรรม & กู้คืนข้อมูลฉุกเฉิน
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Contact */}
            <div>
              <h4 className="font-bold text-sm text-amber-300 mb-3">ติดต่อสำนักงาน</h4>
              <div className="space-y-2 text-xs text-emerald-100/90">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    สำนักงานอธิการบดี มหาวิทยาลัยนวมินทราธิราช อาคารสารพัดช่าง เกษมราษฎร์ แขวงวชิรพยาบาล เขตดุสิต กรุงเทพฯ 10300
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>โทรศัพท์: 02-244-3000 ต่อ 3500-3504</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>อีเมล: irb@nmu.ac.th</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>จันทร์ - ศุกร์: 08.30 - 16.30 น. (เว้นวันหยุดราชการ)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300 gap-4">
            <div>
              © 2569 มหาวิทยาลัยนวมินทราธิราช (Navamindradhiraj University). สงวนลิขสิทธิ์ทั้งหมด
            </div>
            <div className="flex items-center gap-4 text-emerald-200">
              <span className="hover:text-amber-300 cursor-pointer">นโยบายความเป็นส่วนตัว (PDPA)</span>
              <span>•</span>
              <span className="hover:text-amber-300 cursor-pointer">มาตรฐานวิธีปฏิบัติงาน (SOPs)</span>
              <span>•</span>
              <span className="hover:text-amber-300 cursor-pointer">ระบบประเมินจริยธรรมออนไลน์ v2.5</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
