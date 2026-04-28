import { getAccessToken } from './zoho-auth';

const ZOHO_API_BASE = 'https://www.zohoapis.com/crm/v6';

export interface ZohoFile {
  id: string;
  fileName: string;
  size: number;
  status?: string;
}

export interface LeadFiles {
  files: ZohoFile[];
  recordId: string;
}

export async function getLeadFiles(recordId: string): Promise<LeadFiles> {
  const token = await getAccessToken();

  const response = await fetch(`${ZOHO_API_BASE}/Leads/${recordId}`, {
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch lead: ${response.statusText}`);
  }

  const data = await response.json();
  const fileUploadField = data.data?.[0]?.File_Upload_1 || [];

  const files: ZohoFile[] = fileUploadField.map((file: ZohoFile & { File_Name__s?: string; Size__s?: number }) => ({
    id: file.id,
    fileName: file.File_Name__s || file.fileName || 'unknown',
    size: file.Size__s || file.size || 0,
    status: file.status,
  }));

  return { files, recordId };
}

export async function downloadFile(
  recordId: string,
  fileId: string
): Promise<{ buffer: ArrayBuffer; fileName: string }> {
  const token = await getAccessToken();

  const response = await fetch(
    `${ZOHO_API_BASE}/Leads/${recordId}/Attachments/${fileId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();

  return { buffer, fileName: 'document.pdf' };
}