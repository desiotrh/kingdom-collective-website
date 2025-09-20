export type SupportedInputFormat = 'jpg' | 'png' | 'heic' | 'doc' | 'docx' | 'txt' | 'rtf' | 'html' | 'csv';
export type SupportedOutputFormat = 'pdf' | 'pdfa';

export interface DocumentConversionOptions {
  outputFormat: SupportedOutputFormat;
  enableOCR: boolean;
  dpi: number;
  compression: 'low' | 'medium' | 'high';
  batesStamping?: {
    prefix: string;
    startNumber: number;
    position: 'top-right' | 'bottom-right' | 'bottom-center';
  };
  coverSheet?: {
    caseNumber: string;
    partyName: string;
    documentTitle: string;
  };
}

export interface ConvertedDocument {
  filename: string;
  blob: Blob;
  metadata: {
    pageCount: number;
    fileSize: number;
    isSearchable: boolean;
    complianceLevel: 'PDF/A-1b' | 'PDF/A-2b' | 'standard';
  };
}

export const COURT_READY_PRESET: DocumentConversionOptions = {
  outputFormat: 'pdfa',
  enableOCR: true,
  dpi: 300,
  compression: 'medium',
};

export function generateCourtFilename(
  caseNumber: string,
  party: string,
  exhibitId: string,
  date: Date = new Date()
): string {
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9_-]/g, '_');
  
  return `${sanitize(caseNumber)}_${sanitize(party)}_${sanitize(exhibitId)}_${dateStr}.pdf`;
}

export interface PrintAction {
  type: 'print' | 'email' | 'save' | 'share';
  copies?: number;
  destination?: 'device' | 'cloud' | 'email';
  emailAddress?: string;
  folderPath?: string;
}

export const QUICK_ACTIONS: PrintAction[] = [
  { type: 'print', copies: 3 },
  { type: 'email', destination: 'email' },
  { type: 'save', destination: 'device', folderPath: 'Case Documents' },
];
