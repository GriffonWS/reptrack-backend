import transporter from "./config.js";
import {
  
  verificationEmailTemplate,
  
} from "./email-templates.js";


export const sendVerificationEmail = async (email, verificationToken, name) => {
  try {
    const mailOptions = {
      from: `"Authentication" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email Address Now",
      html: verificationEmailTemplate(verificationToken, name),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending verification email", error);
    throw new Error("Error sending verification email");
  }
};