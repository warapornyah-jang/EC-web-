import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  Search, 
  FileText, 
  DownloadCloud, 
  Database, 
  FolderGit2, 
  Server, 
  Mail, 
  Wifi, 
  WifiOff, 
  CheckCircle2,
  Sparkles,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logout } from '../services/firebaseAuth';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  onOpenEmailModal: () => void;
  isOnline: boolean;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  user,
  setUser,
  onOpenEmailModal,
  isOnline
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const navItems = [
    { id: 'home', label: 'หน้าหลัก', icon: Sparkles },
    { id: 'tracking', label: 'ติดตามโครงการ', icon: Search, badge: '69-XXX' },
    { id: 'submission', label: 'ยื่นคำขอรับพิจารณา', icon: FileText, highlight: true },
    { id: 'forms', label: 'ดาวน์โหลดแบบฟอร์ม', icon: DownloadCloud },
    { id: 'registry', label: 'ทะเบียน & ออกเลข COA/COE', icon: Database },
    { id: 'drive', label: 'Google Drive & ชีท', icon: FolderGit2 },
    { id: 'architecture', label: 'ความปลอดภัย & สำรองข้อมูล', icon: Server }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Banner (University & Gov Identity) */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white text-xs py-1.5 px-4 sm:px-8 border-b border-emerald-700/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-medium tracking-wide flex items-center gap-1.5 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              มหาวิทยาลัยนวมินทราธิราช • Navamindradhiraj University
            </span>
            <span className="hidden md:inline text-emerald-300/60">|</span>
            <span className="hidden md:inline text-emerald-100">
              สำนักงานคณะกรรมการจริยธรรมการวิจัยในคน สำนักงานอธิการบดี (NMU-IRB)
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1 text-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">การเข้ารหัสลับ</span> AES-256
            </div>

            <div className="flex items-center gap-1">
              {isOnline ? (
                <span className="flex items-center gap-1 text-emerald-300">
                  <Wifi className="w-3 h-3" /> ออนไลน์ & ซิงค์อัตโนมัติ
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-300 bg-amber-900/40 px-2 py-0.5 rounded">
                  <WifiOff className="w-3 h-3" /> โหมดออฟไลน์
                </span>
              )}
            </div>

            <button
              onClick={onOpenEmailModal}
              className="text-amber-300 hover:text-white flex items-center gap-1 font-semibold transition-colors"
              title="ระบบแจ้งเตือนผ่านอีเมล"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">แจ้งเตือนอีเมล</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Navamindradhiraj University Emblem Emblem Style */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 p-0.5 shadow-md group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white rounded-[14px] flex flex-col items-center justify-center p-1 border border-amber-200">
                <span className="text-[10px] font-extrabold text-emerald-900 leading-none">NMU</span>
                <span className="text-[9px] font-bold text-amber-600 leading-none tracking-tighter">IRB</span>
                <span className="text-[7px] text-slate-500 font-medium scale-90">สนธ.</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full"></div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base sm:text-lg text-emerald-950 tracking-tight leading-tight group-hover:text-emerald-800 transition-colors">
                  คณะกรรมการจริยธรรมในคน
                </h1>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md text-[10px] font-bold border border-amber-200">
                  NMU-IRB
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                สำนักงานอธิการบดี มหาวิทยาลัยนวมินทราธิราช
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 relative ${
                    isActive
                      ? 'bg-emerald-100/80 text-emerald-900 font-bold shadow-xs'
                      : item.highlight
                      ? 'bg-emerald-700 text-white hover:bg-emerald-800 font-semibold shadow-xs'
                      : 'text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 font-mono font-bold border border-amber-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Account / Sign In with Google */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 p-1.5 pl-3 rounded-2xl">
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-950 truncate max-w-[140px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium">
                    {user.email?.endsWith('@nmu.ac.th') ? 'อาจารย์/นักวิจัย NMU' : 'ผู้ใช้งานที่ยืนยันแล้ว'}
                  </div>
                </div>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    className="w-8 h-8 rounded-xl border border-emerald-300 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  title="ออกจากระบบ"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="gsi-material-button text-xs font-semibold py-2 px-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all flex items-center gap-2 bg-white"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span>{isLoggingIn ? 'กำลังเชื่อมต่อ...' : 'เข้าสู่ระบบ @nmu.ac.th'}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
              aria-label="เปิดเมนู"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-left text-sm font-semibold flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-200'
                      : item.highlight
                      ? 'bg-emerald-700 text-white'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-emerald-800" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <div className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-emerald-800" />
                  <span className="text-xs font-bold text-slate-800">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-600 font-medium px-2 py-1 rounded bg-white"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 flex items-center justify-center gap-2 shadow-xs"
              >
                <span>เข้าสู่ระบบด้วย Google Workspace (@nmu.ac.th)</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenEmailModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-amber-700" />
              <span>ระบบแจ้งเตือนผ่านอีเมลสำหรับนักวิจัย</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
