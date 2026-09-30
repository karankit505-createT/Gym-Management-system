import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Reusable function to generate and download an official PDF receipt.
 * @param {Object} payment - Payment transaction object
 * @param {Object} user - Logged-in user / member object
 */
export const generateReceipt = (payment, user = {}) => {
  if (!payment) {
    throw new Error('Payment details are missing.');
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const transactionId = payment.transaction_id || `TXN_${Date.now()}`;
  const amountFormatted = parseFloat(payment.amount || 0).toFixed(2);
  const formattedDate = payment.createdAt 
    ? new Date(payment.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleString();

  // 1. BRAND HEADER BANNER (Dark Background)
  doc.setFillColor(15, 15, 26); // #0F0F1A
  doc.rect(0, 0, 210, 42, 'F');

  // Orange Accent Bar
  doc.setFillColor(255, 69, 0); // #FF4500
  doc.rect(0, 42, 210, 3, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('IRONPULSE', 15, 21);

  doc.setTextColor(255, 69, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('FITNESS & GYM CLUB', 15, 28);

  // Title Right
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('PAYMENT RECEIPT', 195, 23, { align: 'right' });

  // 2. RECEIPT & MEMBER INFO METADATA CARDS
  const startY = 53;

  // Left Box: Receipt Info
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, startY, 86, 38, 3, 3, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('RECEIPT DETAILS', 20, startY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Transaction ID: ${transactionId}`, 20, startY + 16);
  doc.text(`Date & Time: ${formattedDate}`, 20, startY + 23);
  doc.text('Payment Status: ', 20, startY + 30);
  
  doc.setTextColor(16, 185, 129); // Emerald Green
  doc.setFont('helvetica', 'bold');
  doc.text(payment.payment_status ? payment.payment_status.toUpperCase() : 'SUCCESS', 46, startY + 30);

  // Right Box: Member Info
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(109, startY, 86, 38, 3, 3, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('MEMBER DETAILS', 114, startY + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(user.name || payment.User?.name || 'Valued Member', 114, startY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Email: ${user.email || payment.User?.email || 'N/A'}`, 114, startY + 23);
  doc.text(`Phone: ${user.phone || payment.User?.phone || 'N/A'}`, 114, startY + 30);

  // 3. TABLE OF PAYMENT DETAILS
  const planName = payment.Plan?.name || 'Gym Membership Plan';
  const duration = payment.Plan?.duration_days ? `${payment.Plan.duration_days} Days` : '30 Days';
  const startDate = payment.Membership?.start_date ? new Date(payment.Membership.start_date).toLocaleDateString() : 'N/A';
  const endDate = payment.Membership?.end_date ? new Date(payment.Membership.end_date).toLocaleDateString() : 'N/A';
  const validity = (startDate !== 'N/A' && endDate !== 'N/A') ? `${startDate} - ${endDate}` : `${duration} Full Access`;

  autoTable(doc, {
    startY: startY + 46,
    head: [['Plan Description', 'Duration', 'Validity Period', 'Amount']],
    body: [
      [planName, duration, validity, `Rs. ${amountFormatted}`]
    ],
    theme: 'striped',
    headStyles: {
      fillColor: [255, 69, 0], // #FF4500 Accent
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9.5,
      halign: 'left'
    },
    bodyStyles: {
      textColor: [30, 41, 59],
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 55 },
      1: { cellWidth: 30 },
      2: { cellWidth: 55 },
      3: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
    },
    margin: { left: 15, right: 15 }
  });

  // 4. TOTAL AMOUNT PAID BOX
  const finalY = doc.lastAutoTable.finalY + 12;

  doc.setFillColor(254, 243, 199); // Light Orange Accent Box
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(109, finalY, 86, 24, 2, 2, 'FD');

  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('TOTAL AMOUNT PAID:', 114, finalY + 9);

  doc.setTextColor(255, 69, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`Rs. ${amountFormatted}`, 190, finalY + 17, { align: 'right' });

  // 5. FOOTER
  const footerY = 265;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, footerY - 5, 195, footerY - 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('123 Fitness Boulevard, Tech District | Phone: +1 (800) 555-GYM | Email: support@ironpulse.com', 105, footerY, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Thank you for choosing IronPulse. This is a computer-generated receipt.', 105, footerY + 6, { align: 'center' });

  // Trigger direct download
  doc.save(`Receipt_${transactionId}.pdf`);
};

export default generateReceipt;
