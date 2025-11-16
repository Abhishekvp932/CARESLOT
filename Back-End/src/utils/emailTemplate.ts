export function emailTemplate(title: string, body: string) {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding: 25px;">
    <div style="
      max-width: 600px; 
      margin: auto; 
      background: #ffffff; 
      padding: 25px; 
      border-radius: 12px; 
      box-shadow: 0px 4px 10px rgba(0,0,0,0.08);
    ">
      <h2 style="color:#2563eb; margin-bottom: 15px;">${title}</h2>

      <div style="font-size: 16px; line-height: 1.6; color:#333;">
        ${body}
      </div>

      <br/><br/>
      <p style="font-size: 14px; color:#888;">
        Regards,<br/>
        <b>CareSlot Team</b>
      </p>
    </div>
  </div>
  `;
}
