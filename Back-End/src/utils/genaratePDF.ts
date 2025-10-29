import PDFDocument from 'pdfkit';
import { PrescriptionDTO } from '../types/PrescriptionDTO';

export const generatePrescriptionPDF = async (data: PrescriptionDTO): Promise<Buffer> => {
  const doc = new PDFDocument({ 
    margin: 60,
    size: 'A4'
  });
  const chunks: Buffer[] = [];

  doc.on('data', (chunk) => chunks.push(chunk));

  doc.fontSize(18)
     .font('Helvetica-Bold')
     .text('CareSlot Hospital', { align: 'center' });
  
  doc.fontSize(10)
     .font('Helvetica')
     .text('123 Health Lane, Wellness City, India', { align: 'center' });

  doc.moveDown(2);

  doc.fontSize(10)
     .font('Helvetica')
     .text(`Date: ${new Date().toLocaleDateString('en-US', { 
       month: '2-digit',
       day: '2-digit', 
       year: 'numeric'
     })}`, doc.page.width - 200, doc.y - 10, {
       width: 140,
       align: 'left'
     });

  doc.moveDown(1);


  doc.fontSize(11)
     .font('Helvetica')
     .text(`Doctor: Dr. ${data.doctor.name}`, 60);


  doc.text(`Patient: ${data.patient.name}`, 60, doc.y);

 
  const date = new Date(data.appoinment.slot.date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
  
  const timeString = data.appoinment.slot.startTime;
  const time = new Date(`1970-01-01T${timeString}:00`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  doc.text(`Appointment Date: ${date} at ${time}`, 60, doc.y);

  doc.moveDown(1);

 
  doc.text(`Diagnosis: ${data.diagnosis || 'General consultation'}`, 60, doc.y);

  
  doc.text(`Notes: ${data.advice || 'Follow general health guidelines'}`, 60, doc.y);

  doc.moveDown(1);


  doc.fontSize(11)
     .font('Helvetica')
     .text('Medicines', 60, doc.y, { underline: true });

  doc.moveDown(0.3);

  
  if (data.medicines && data.medicines.trim()) {
    const medicines = data.medicines.split('\n').filter(m => m.trim());
    doc.fontSize(11).font('Helvetica');
    
    medicines.forEach((medicine, index) => {
      const medicineText = medicine.trim();
      doc.text(`${index + 1}. ${medicineText}`, 60, doc.y, {
        width: doc.page.width - 120
      });
      doc.moveDown(0.2);
    });
  } else {
    doc.fontSize(11)
       .font('Helvetica')
       .text('No medication prescribed', 60);
  }

  
  const signatureY = doc.page.height - 350;
  doc.y = Math.max(doc.y + 60, signatureY);

  doc.fontSize(11)
     .font('Helvetica')
     .fillColor('#000000')
     .text(`Dr. ${data.doctor.name}`, doc.page.width - 200, doc.y, {
       width: 140,
       align: 'left'
     });

  doc.moveDown(2);


  doc.fontSize(8)
     .font('Helvetica')
     .fillColor('#666666')
     .text('CareSlot Hospital', doc.page.width - 200, doc.y, {
       width: 140,
       align: 'left'
     });

  doc.text('+91 9876543210', doc.page.width - 200, doc.y, {
    width: 140,
    align: 'left'
  });

  doc.text('support@careslot.com', doc.page.width - 200, doc.y, {
    width: 140,
    align: 'left'
  });

  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
};