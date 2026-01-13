import transporter from "./config.js";
import { invitationEmailTemplate, welcomeEmailTemplate, forgotPasswordEmailTemplate } from "./email-templates.js";

export const sendInvitationEmail = async (email, userName, uniqueId, setupLink, tokenExpiry) => {
  try {
    const mailOptions = {
      from: `"RepTrack" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "You're Invited to Join RepTrack!",
      html: invitationEmailTemplate(userName, uniqueId, setupLink, tokenExpiry),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Invitation email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending invitation email", error);
    throw new Error("Error sending invitation email");
  }
};

export const sendWelcomeEmail = async (email, userName, uniqueId, userEmail, password, androidLink, iosLink) => {
  try {
    const mailOptions = {
      from: `"RepTrack" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to RepTrack - Your Login Credentials",
      html: welcomeEmailTemplate(userName, uniqueId, userEmail, password, androidLink, iosLink),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending welcome email", error);
    throw new Error("Error sending welcome email");
  }
};

export const sendForgotPasswordEmail = async (email, userName, uniqueId, tempPassword) => {
  try {
    const mailOptions = {
      from: `"RepTrack" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "RepTrack - Password Reset",
      html: forgotPasswordEmailTemplate(userName, uniqueId, email, tempPassword),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Forgot password email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending forgot password email", error);
    throw new Error("Error sending forgot password email");
  }
};