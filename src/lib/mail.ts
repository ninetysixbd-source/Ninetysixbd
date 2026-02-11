import nodemailer from "nodemailer"

// Use the same URL that NextAuth uses
const domain = process.env.NEXTAUTH_URL || process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

const transporter = process.env.EMAIL_SERVER_USER
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
        },
    })
    : null

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/reset-password?token=${token}`

    // If SMTP is configured, send real email
    if (transporter) {
        try {
            await transporter.sendMail({
                from: `"NinetySixBD" <${process.env.EMAIL_SERVER_USER}>`,
                to: email,
                subject: "Reset your password",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #333;">Reset Your Password</h2>
                        <p>You requested a password reset. Click the button below to set a new password:</p>
                        <a href="${resetLink}" 
                           style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 5px; margin: 16px 0;">
                            Reset Password
                        </a>
                        <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                        <p style="color: #999; font-size: 12px;">This link will expire in 1 hour.</p>
                    </div>
                `,
            })
            console.log(`[MAIL SERVICE] Password reset email sent to ${email}`)
        } catch (error) {
            console.error("[MAIL SERVICE] Failed to send email:", error)
            throw new Error("Failed to send password reset email")
        }
    } else {
        // Fallback: log to console when SMTP is not configured
        console.log("========================================")
        console.log(`[MAIL SERVICE] SMTP not configured - logging only`)
        console.log(`To: ${email}`)
        console.log(`Subject: Reset your password`)
        console.log(`Reset Link: ${resetLink}`)
        console.log("========================================")
    }
}

