import { createTransport } from "nodemailer";

export const sendEmail = async (to, subject, content, otp = null, name = "User") => {
  try {
    const transporter = createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let htmlTemplate;
    if (otp) {
      // OTP Email Template
      htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .otp { font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center; margin: 20px 0; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Welcome to Edubrain, ${name}!</h2>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>Thank you for registering with Edubrain. Please use the following OTP to verify your email address:</p>
            <div class="otp">${otp}</div>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Edubrain. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
      `;
    } else {
      // Use provided content for non-OTP emails (e.g., payment success)
      htmlTemplate = content;
    }

    await transporter.sendMail({
      from: `"Edubrain" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: `Hello ${name},\n\n${content.replace(/<[^>]+>/g, "")}`, // Strip HTML for plain text
      html: htmlTemplate,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};