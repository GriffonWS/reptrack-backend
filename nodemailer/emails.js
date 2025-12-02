import transporter from "./config.js";
import { invitationEmailTemplate } from "./email-templates.js";

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