import { IMailService } from '../interface/IMail.service';
import { transporter } from '../utils/mail';

export class MailService implements IMailService {
  async sendMail(to: string, subject: string, text: string): Promise<void> {
    await transporter.sendMail({
      from: `"CareSlot" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  }

  async sendBlockDoctorMail(email: string, name: string, reason: string) {
    const subject = 'Account Suspension Notification';
    const html = `Dear Dr.${name},

     We regret to inform you that your account on Our Platform has been temporarily blocked by the administrator.

    Reason for suspension: ${reason}

    If you believe this was a mistake or would like to appeal this decision, please contact our support team at careslot@gmail.com.

    We appreciate your understanding and cooperation.

   Best regards,
    The CARESLOT Team`;

    await this.sendMail(email, subject, html);
    return;
  }
  async sendDoctorUnBlockEmail(email: string, name: string) {
    const subject = 'Account Reinstatement Notification';
    const html = `Dear Dr.${name},

    We are pleased to inform you that your account on Our Platform has been reinstated and you can now access all services as usual.

    We appreciate your patience and cooperation during the review process.

    If you have any questions or require further assistance, please reach out to our support team at careslot@gmail.com.

   Best regards,
   The CARESLOT Team`;

    await this.sendMail(email, subject, html);
    return;
  }

  async sendPatientAppoinmentEmail(
    email: string,
    Patientname: string,
    date: string,
    startTime: string,
    endTime: string,
    doctorName: string
  ): Promise<void> {
    const subject = 'Appointment Confirmation - CareSlot';
    const html = `patient?.email,Hello ${Patientname},
                             Your appointment has been successfully booked.
         
                             Doctor : Dr.${doctorName},
                             Date:${date},
                             Time:${startTime} - ${endTime},
                             status : Pending Confirmation,
         
                             Thank you for choosing CareSlot.  
                              We look forward to seeing you.  
         
                              Best regards,  
                              CareSlot Team
                             
                             `;

    await this.sendMail(email, subject, html);
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
    const html = `Hello ${doctorName},
                 A new appointment has been booked.
         
                             Patient : ${patientName},
                             Date:${date},
                             Time:${startTime} - ${endTime},
                             status : Pending Confirmation,
                            Please review and confirm the appointment in your dashboard.
         
                              Best regards,  
                              CareSlot Team
                             
                             `;

    await this.sendMail(email, subject, html);
  }

  async sendDoctorRejectionEmail(email: string, doctorName: string, reason: string): Promise<void> {
    const subject = 'Application Rejected – CARESLOT';
    const html =`
    Dear Dr. ${doctorName},
    We regret to inform you that your application on CARESLOT has been reviewed and unfortunately did not meet our approval criteria at this time.

    Reason for Rejection: ${reason}

    If you believe this decision was made in error or would like to reapply in the future, please feel free to contact our support team at careslot@gmail.com

    Thank you for your interest in joining our platform.
    Best regards,
    The CARESLOT Team`;

    await this.sendMail(email,subject,html);
  }
  async sendDoctorApproveEmail(email: string, doctorName: string): Promise<void> {
    
    const subject = 'Applicarion Approved - CARESLOT';
    const html =`Dear Dr.${doctorName},

We are delighted to inform you that your application to join CARESLOT has been approved!

You can now start managing your appointments and connecting with patients through our platform.

If you have any questions or need assistance getting started, feel free to reach out to our support team at careslot@gmail.com.

Welcome aboard, and we look forward to supporting you on this journey!

Best regards,  
The CARESLOT Team`;

await this.sendMail(email,subject,html);
  }
}
