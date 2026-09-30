export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconType: 'sheet' | 'doc' | 'pdf' | 'folder' | 'generic';
}

export const NMU_DRIVE_FOLDER_ID = '105Vza8PRLtyw2wSs3qXVmdr-_4TXUkO2';
export const NMU_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${NMU_DRIVE_FOLDER_ID}`;

export const fallbackDriveFiles: DriveFileItem[] = [
  {
    id: 'sheet-registry-main',
    name: 'ทะเบียนรับและประวัติการเสนอโครงร่างวิจัย 2560-2569 (สำนักงานอธิการบดี).xlsx',
    mimeType: 'application/vnd.google-apps.spreadsheet',
    size: '1.4 MB',
    modifiedTime: '2026-09-20T10:30:00Z',
    webViewLink: NMU_DRIVE_FOLDER_URL,
    iconType: 'sheet'
  },
  {
    id: 'sheet-coa-coe-log',
    name: 'สมุดคุมการออกเลขหนังสือรับรอง COA และ COE ประจำปี 2568-2569.xlsx',
    mimeType: 'application/vnd.google-apps.spreadsheet',
    size: '850 KB',
    modifiedTime: '2026-09-22T08:15:00Z',
    webViewLink: NMU_DRIVE_FOLDER_URL,
    iconType: 'sheet'
  },
  {
    id: 'doc-sop-nmu-irb',
    name: 'คู่มือวิธีปฏิบัติงานมาตรฐาน (SOPs) คณะกรรมการจริยธรรมการวิจัยในคน NMU-IRB.pdf',
    mimeType: 'application/pdf',
    size: '3.2 MB',
    modifiedTime: '2026-08-15T04:20:00Z',
    webViewLink: NMU_DRIVE_FOLDER_URL,
    iconType: 'pdf'
  },
  {
    id: 'doc-announcement-2568',
    name: 'ประกาศมหาวิทยาลัยนวมินทราธิราช เรื่อง หลักเกณฑ์และอัตราค่าธรรมเนียมการพิจารณาจริยธรรม.pdf',
    mimeType: 'application/pdf',
    size: '620 KB',
    modifiedTime: '2026-07-10T09:00:00Z',
    webViewLink: NMU_DRIVE_FOLDER_URL,
    iconType: 'pdf'
  },
  {
    id: 'folder-template-forms',
    name: 'โฟลเดอร์รวมแบบฟอร์มเปล่าคำขอรับการพิจารณา (Word/PDF)',
    mimeType: 'application/vnd.google-apps.folder',
    modifiedTime: '2026-09-01T03:00:00Z',
    webViewLink: NMU_DRIVE_FOLDER_URL,
    iconType: 'folder'
  }
];

export async function fetchDriveFolderFiles(accessToken: string | null): Promise<DriveFileItem[]> {
  if (!accessToken) {
    return fallbackDriveFiles;
  }

  try {
    const query = encodeURIComponent(`'${NMU_DRIVE_FOLDER_ID}' in parents and trashed = false`);
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,size,modifiedTime,webViewLink)&pageSize=25`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json'
        }
      }
    );

    if (!res.ok) {
      // If folder query fails (e.g. permission or specific folder access), query user's accessible recent drive files
      const fallbackRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?pageSize=15&fields=files(id,name,mimeType,size,modifiedTime,webViewLink)&orderBy=modifiedTime desc`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json'
          }
        }
      );
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        if (data.files && data.files.length > 0) {
          return data.files.map(mapGoogleFileToItem);
        }
      }
      return fallbackDriveFiles;
    }

    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files.map(mapGoogleFileToItem);
    }
  } catch (err) {
    console.warn('Error fetching Google Drive API, using cached registry documents:', err);
  }

  return fallbackDriveFiles;
}

function mapGoogleFileToItem(f: any): DriveFileItem {
  let iconType: DriveFileItem['iconType'] = 'generic';
  if (f.mimeType?.includes('spreadsheet') || f.name?.endsWith('.xlsx') || f.name?.endsWith('.csv')) {
    iconType = 'sheet';
  } else if (f.mimeType?.includes('document') || f.name?.endsWith('.docx')) {
    iconType = 'doc';
  } else if (f.mimeType?.includes('pdf') || f.name?.endsWith('.pdf')) {
    iconType = 'pdf';
  } else if (f.mimeType?.includes('folder')) {
    iconType = 'folder';
  }

  const sizeKb = f.size ? `${Math.round(parseInt(f.size, 10) / 1024)} KB` : undefined;

  return {
    id: f.id,
    name: f.name,
    mimeType: f.mimeType,
    size: sizeKb,
    modifiedTime: f.modifiedTime,
    webViewLink: f.webViewLink || NMU_DRIVE_FOLDER_URL,
    iconType
  };
}
