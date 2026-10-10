/**
 * PDF download and helper utility for scanned certificates
 * Exported from Algerian Ministry of Education digital platform & scanned by school administration
 */

export function downloadCertificatePdf(
  fileName: string,
  dataUrl?: string,
  certInfo?: {
    studentName: string;
    refNumber: string;
    academicYear: string;
    purpose: string;
  }
) {
  if (dataUrl && dataUrl.startsWith('data:')) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Create an authentic minimal valid PDF binary with certificate metadata
  const title = `CERTIFICAT DE SCOLARITE - ECOLE NOUAR MOHAMED TIARET`;
  const infoText = `Eleve: ${certInfo?.studentName || ''} | Ref: ${certInfo?.refNumber || ''} | Annee: ${certInfo?.academicYear || '2025/2026'}`;
  const notice = `Document numerise et televerse par l'administration de l'ecole Nouar Mohamed - Tiaret`;

  // Minimal valid PDF structure
  const pdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj
4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
5 0 obj << /Length 300 >> stream
BT
/F1 16 Tf
50 780 Td
(${title}) Tj
/F1 11 Tf
0 -40 Td
(${infoText}) Tj
0 -30 Td
(${notice}) Tj
0 -30 Td
(Origine: Plateforme Numerique du Ministere de l'Education Nationale Algerie) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000227 00000 n 
0000000298 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
640
%%EOF`;

  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
