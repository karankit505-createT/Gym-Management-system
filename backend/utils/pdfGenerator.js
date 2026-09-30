const PDFDocument = require('pdfkit');

const generateInvoicePDF = (payment, user, plan, membership, res) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Invoice_${payment.transaction_id}.pdf`);

  doc.pipe(res);

  // Header / Brand
  doc
    .fillColor('#FF4500')
    .fontSize(24)
    .text('IRONPULSE GYM & FITNESS', 50, 45, { align: 'left' })
    .fillColor('#666666')
    .fontSize(10)
    .text('123 Fitness Boulevard, Tech District', 50, 75)
    .text('Email: support@ironpulse.com | Phone: +1 (800) 555-GYM', 50, 90)
    .moveDown();

  // Invoice Title
  doc
    .fillColor('#111111')
    .fontSize(18)
    .text('INVOICE / PAYMENT RECEIPT', 50, 125, { align: 'right' });

  // Divider Line
  doc
    .strokeColor('#FF4500')
    .lineWidth(2)
    .moveTo(50, 150)
    .lineTo(545, 150)
    .stroke();

  // Details Grid
  const detailsTop = 170;

  doc
    .fontSize(10)
    .fillColor('#333333')
    .text(`Invoice ID: INV-${payment.id}`, 50, detailsTop)
    .text(`Transaction ID: ${payment.transaction_id}`, 50, detailsTop + 15)
    .text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 50, detailsTop + 30)
    .text(`Payment Status: ${payment.payment_status.toUpperCase()}`, 50, detailsTop + 45);

  doc
    .text(`Billed To:`, 320, detailsTop)
    .font('Helvetica-Bold')
    .text(`${user.name}`, 320, detailsTop + 15)
    .font('Helvetica')
    .text(`Email: ${user.email}`, 320, detailsTop + 30)
    .text(`Phone: ${user.phone}`, 320, detailsTop + 45);

  // Membership Details Box
  const tableTop = 250;
  doc
    .rect(50, tableTop, 495, 25)
    .fill('#FF4500');

  doc
    .fillColor('#FFFFFF')
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('Plan Name', 60, tableTop + 7)
    .text('Duration', 220, tableTop + 7)
    .text('Validity Period', 330, tableTop + 7)
    .text('Amount (INR)', 460, tableTop + 7, { align: 'right' });

  const itemTop = tableTop + 35;
  doc
    .fillColor('#222222')
    .font('Helvetica')
    .fontSize(10)
    .text(plan.name, 60, itemTop)
    .text(`${plan.duration_days} Days`, 220, itemTop)
    .text(`${membership ? membership.start_date : 'N/A'} to ${membership ? membership.end_date : 'N/A'}`, 330, itemTop)
    .font('Helvetica-Bold')
    .text(`INR ${parseFloat(payment.amount).toFixed(2)}`, 460, itemTop, { align: 'right' });

  // Divider Line
  doc
    .strokeColor('#DDDDDD')
    .lineWidth(1)
    .moveTo(50, itemTop + 30)
    .lineTo(545, itemTop + 30)
    .stroke();

  // Total Section
  const totalTop = itemTop + 45;
  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .text('Total Amount Paid:', 320, totalTop)
    .fillColor('#FF4500')
    .fontSize(14)
    .text(`INR ${parseFloat(payment.amount).toFixed(2)}`, 460, totalTop, { align: 'right' });

  // Footer / Thank You
  doc
    .fillColor('#888888')
    .fontSize(10)
    .text('Thank you for being a valued member of IronPulse Gym!', 50, 480, { align: 'center' })
    .text('This is a computer-generated receipt and requires no physical signature.', 50, 495, { align: 'center' });

  doc.end();
};

module.exports = { generateInvoicePDF };
