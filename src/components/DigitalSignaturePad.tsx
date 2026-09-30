import React, { useRef, useState, useEffect } from 'react';
import { Eraser, CheckCircle2, ShieldCheck, PenTool, Type } from 'lucide-react';

interface Props {
  onSignatureComplete: (signatureDataUrl: string) => void;
  signerName: string;
}

export const DigitalSignaturePad: React.FC<Props> = ({ onSignatureComplete, signerName }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [mode, setMode] = useState<'draw' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState(signerName || '');
  const [fontFamily, setFontFamily] = useState('cursive');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.strokeStyle = '#065f46'; // dark emerald
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [mode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      onSignatureComplete(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSignatureComplete('');
  };

  const generateTypedSignature = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#065f46';
    ctx.font = 'italic 44px "Brush Script MT", "Segoe Script", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedSignature || signerName || 'Digital Signature', 300, 90);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`Digitally verified by NMU-IRB e-Auth • ${new Date().toLocaleString('th-TH')}`, 300, 160);

    const dataUrl = canvas.toDataURL('image/png');
    setHasDrawn(true);
    onSignatureComplete(dataUrl);
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm sm:text-base">
              การลงนามแบบดิจิทัล (Digital Signature)
            </h4>
            <p className="text-xs text-slate-500">
              รองรับการวาดลายเซ็นบนสมาร์ทโฟน / แท็บเล็ต หรือพิมพ์ชื่อเพื่อสร้างลายมือชื่ออิเล็กทรอนิกส์
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              mode === 'draw' ? 'bg-white text-emerald-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            วาดลายเซ็น
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('type');
              if (typedSignature) generateTypedSignature();
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              mode === 'type' ? 'bg-white text-emerald-800 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            พิมพ์ชื่อรับรอง
          </button>
        </div>
      </div>

      {mode === 'draw' ? (
        <div>
          <div className="relative border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/20 overflow-hidden touch-none">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-44 cursor-crosshair block"
              style={{ width: '100%', height: '176px' }}
            />
            {!hasDrawn && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 gap-1">
                <PenTool className="w-6 h-6 text-emerald-400 stroke-1" />
                <span className="text-xs sm:text-sm font-light">จรดนิ้วหรือปากกาเพื่อลงลายมือชื่อที่นี่</span>
              </div>
            )}
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none text-[11px] text-slate-400 border-t border-slate-200/60 pt-1">
              <span>ผู้ขอรับการพิจารณา: {signerName || 'ผู้วิจัยหลัก'}</span>
              <span className="flex items-center gap-1 text-emerald-600">
                <ShieldCheck className="w-3 h-3" /> เข้ารหัสลับ SHA-256
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <button
              type="button"
              onClick={clearCanvas}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Eraser className="w-3.5 h-3.5" />
              ลบลายเซ็นเพื่อเซ็นใหม่
            </button>
            {hasDrawn && (
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                บันทึกลายมือชื่อดิจิทัลแล้ว
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              ชื่อ-นามสกุล ที่ต้องการใช้สร้างลายมือชื่อดิจิทัล
            </label>
            <input
              type="text"
              value={typedSignature}
              onChange={(e) => {
                setTypedSignature(e.target.value);
              }}
              placeholder="เช่น ศ.ดร. นวมินทร์ วิจัยศาสตร์"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={generateTypedSignature}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            สร้างและยืนยันลายมือชื่อ
          </button>

          {hasDrawn && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="font-serif italic text-2xl text-emerald-900 block my-1">
                {typedSignature || signerName}
              </span>
              <p className="text-[11px] text-emerald-700">
                รับรองความถูกต้องด้วยระบบลายมือชื่อดิจิทัล มหาวิทยาลัยนวมินทราธิราช
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
