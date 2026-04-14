import nodemailer from 'nodemailer';

let transporter = null;

if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export const sendSupportEmail = async (ticket) => {
  if (!transporter) {
    console.log('Mail skipped: SMTP variables not configured');
    return;
  }

  try {
    // Email to Admin
    await transporter.sendMail({
      from: `"Nex Campus Support" <${process.env.SMTP_EMAIL}>`,
      to: 'jinkazamaxui@gmail.com',
      subject: `New Support Query: ${ticket.usn || ticket.name}`,
      text: `
New Support Ticket Submitted.

Name: ${ticket.name}
Email: ${ticket.email}
Phone: ${ticket.phone || 'N/A'}
USN: ${ticket.usn || 'N/A'}

Message:
${ticket.message}
      `,
    });

    // Confirmation Email to Student
    await transporter.sendMail({
      from: `"Nex Campus Support" <${process.env.SMTP_EMAIL}>`,
      to: ticket.email,
      subject: `Support Ticket Received`,
      text: `
Hi ${ticket.name},

We have received your support query. Our team will review it and get back to you shortly.

Your Message:
${ticket.message}

Best,
Nex Campus Support Team
      `,
    });
    
    console.log('Support emails sent successfully.');
  } catch (error) {
    console.error('Error sending support emails:', error);
  }
};

export const sendResetEmail = async (email, resetUrl) => {
  if (!transporter) {
    console.log('Mail skipped: SMTP variables not configured');
    console.log(`[RESET LINK]: ${resetUrl}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Nex Campus" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Password Reset Request - Nex Campus',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d1322; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #1a2333;">
          <h2 style="color: #adc6ff; margin-bottom: 20px;">Nex Campus Password Reset</h2>
          <p style="color: #c2c6d6; font-size: 16px; line-height: 1.5;">
            We received a request to reset your password. Click the button below to choose a new password. This link is valid for 10 minutes.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #adc6ff; color: #0d1322; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            If you did not request this reset, please safely ignore this email.
          </p>
        </div>
      `,
    });
    console.log('Reset email sent successfully.');
  } catch (error) {
    console.error('Error sending reset email:', error);
  }
};
