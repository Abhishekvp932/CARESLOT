import { IMailService } from '../interface/IMail.service';
import logger from '../utils/logger';
import { transporter } from '../utils/mail';
import { emailTemplate } from '../utils/emailTemplate';

export class MailService implements IMailService {
  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<void> {
    await transporter.sendMail({
      from: `"CareSlot" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
  }

  async sendBlockDoctorMail(email: string, name: string, reason: string) {
    const subject = 'Account Suspension Notification';
    const text = `Dear Dr.${name},
Your account was temporarily blocked.
Reason: ${reason}`;

    const html = emailTemplate(
      subject,
      `
      Dear Dr.<b>${name}</b>,<br/><br/>
      We regret to inform you that your account on Our Platform has been temporarily blocked by the administrator.<br/><br/>
      <b>Reason for suspension:</b> ${reason}<br/><br/>
      If you believe this was a mistake or would like to appeal, please contact our support team at <b>careslot@gmail.com</b>.
      `
    );

    await this.sendMail(email, subject, text, html);
  }

  async sendDoctorUnBlockEmail(email: string, name: string) {
    const subject = 'Account Reinstatement Notification';
    const text = `Dear Dr.${name},
Your account has been reinstated.`;

    const html = emailTemplate(
      subject,
      `
      Dear Dr.<b>${name}</b>,<br/><br/>
      We are pleased to inform you that your account on Our Platform has been reinstated and you can now access all services as usual.<br/><br/>
      If you have questions, contact us at <b>careslot@gmail.com</b>.
      `
    );

    logger.debug(text);
    await this.sendMail(email, subject, text, html);
  }

  async sendPatientAppoinmentEmail(
    email: string,
    patientName: string,
    date: string,
    startTime: string,
    endTime: string,
    doctorName: string
  ): Promise<void> {
    const subject = 'Appointment Confirmation - CareSlot';

    const text = `Hello ${patientName},
Your appointment has been booked.`;

    const html = emailTemplate(
      subject,
      `
      Hello <b>${patientName}</b>,<br/><br/>
      Your appointment has been successfully booked.<br/><br/>

      <b>Doctor:</b> Dr.${doctorName}<br/>
      <b>Date:</b> ${date}<br/>
      <b>Time:</b> ${startTime} - ${endTime}<br/>
      <b>Status:</b> Pending Confirmation<br/><br/>

      Thank you for choosing CareSlot. We look forward to seeing you.
      `
    );

    await this.sendMail(email, subject, text, html);
  }

  async sendDoctorAppoinmentEmail(
    email: string,
    doctorName: string,
    patientName: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<void> {
    const subject = 'New Appointment Booked - CareSlot';

    const text = `Hello Dr.${doctorName},
New appointment booked.`;

    const html = emailTemplate(
      subject,
      `
      Hello Dr.<b>${doctorName}</b>,<br/><br/>
      A new appointment has been booked.<br/><br/>
      <b>Patient:</b> ${patientName}<br/>
      <b>Date:</b> ${date}<br/>
      <b>Time:</b> ${startTime} - ${endTime}<br/>
      <b>Status:</b> Pending Confirmation<br/><br/>
      Please review and confirm the appointment in your dashboard.
      `
    );

    await this.sendMail(email, subject, text, html);
  }

  async sendDoctorRejectionEmail(
    email: string,
    doctorName: string,
    reason: string
  ): Promise<void> {
    const subject = 'Application Rejected – CARESLOT';

    const text = `Dear Dr.${doctorName},
Application rejected.`;

    const html = emailTemplate(
      subject,
      `
      Dear Dr.<b>${doctorName}</b>,<br/><br/>
      We regret to inform you that your application did not meet our approval criteria.<br/><br/>
      <b>Reason for Rejection:</b> ${reason}<br/><br/>
      If you believe this decision was an error, contact <b>careslot@gmail.com</b>.
      `
    );

    await this.sendMail(email, subject, text, html);
  }

  async sendDoctorApproveEmail(email: string, doctorName: string) {
    const subject = 'Application Approved - CARESLOT';

    const text = `Dear Dr.${doctorName},
Application approved!`;

    const html = emailTemplate(
      subject,
      `
      Dear Dr.<b>${doctorName}</b>,<br/><br/>
      We are delighted to inform you that your application to join CARESLOT has been approved!<br/><br/>
      You can now start managing your appointments and connecting with patients.<br/><br/>
      If you need help, reach out to <b>careslot@gmail.com</b>.<br/><br/>
      Welcome aboard!
      `
    );

    await this.sendMail(email, subject, text, html);
  }
}
