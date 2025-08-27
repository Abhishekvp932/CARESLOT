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
}
