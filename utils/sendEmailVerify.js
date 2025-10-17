import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config(); // load .env vào process.env


const resend = new Resend(process.env.RESEND_MAIL_API_KEY);

export const sendEmailVerify = async(to, username, otp) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Admin_OG💎 <onboarding@resend.dev> ",
            to,
            subject: "Verify your email for OG",
            html: `
                <h2>Hello ${username},</h2>
                <p>Your OTP code is:</p>
                <h1 style="letter-spacing: 4px;">${otp}</h1>
                <p>This OTP will expire in <b>15 minutes</b>.</p>
            `,
        });
        if (error) {
            console.error("Error sending email:", error);
            return null;
        }
        return data;
    }catch (e) {
        console.error("Send email failed:", e);
        return null;
    }
}
