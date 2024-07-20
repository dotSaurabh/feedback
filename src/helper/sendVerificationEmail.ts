import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail"; // mail format is there
import { ApiResponse } from "@/types/ApiResponse"; // custom response api

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "mystery message | Verification code ",
      react: VerificationEmail({ username: username, otp: verifyCode }),
    });
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailerror) {
    console.error("Error sending verification code successfully", emailerror);
    return { success: false, message: "failed to send verification email" };
  }
}
