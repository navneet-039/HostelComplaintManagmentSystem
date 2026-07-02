import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (to, subject, html) => {
  try {
    const response = await resend.emails.send({
      from: "HostelSync <onboarding@hostelsync.in>", 
      to,
      subject,
      html,
    });

    console.log(`Email sent → ${to}`);
    return response;
  } catch (error) {
    console.error(`Failed to send email → ${to}`, {
      message: error.message,
    });

    throw error;
  }
};

export default sendMail;