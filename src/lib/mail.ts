import nodemailer from "nodemailer"

// Use the same URL that NextAuth uses
const domain = process.env.NEXTAUTH_URL || process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

// Configure email transporter based on available environment variables
// Priority: Resend > SendGrid > Gmail SMTP
const createTransporter = () => {
    // Option 1: Resend (Modern, developer-friendly)
    if (process.env.RESEND_API_KEY) {
        return nodemailer.createTransport({
            host: "smtp.resend.com",
            port: 465,
            secure: true,
            auth: {
                user: "resend",
                pass: process.env.RESEND_API_KEY,
            },
        })
    }

    // Option 2: SendGrid (Production-ready)
    if (process.env.SENDGRID_API_KEY) {
        return nodemailer.createTransport({
            host: "smtp.sendgrid.net",
            port: 587,
            secure: false,
            auth: {
                user: "apikey",
                pass: process.env.SENDGRID_API_KEY,
            },
        })
    }

    // Option 3: Gmail SMTP (Quick setup)
    if (process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        })
    }

    return null
}

const transporter = createTransporter()

// Get the appropriate "from" address based on the email service
const getFromAddress = () => {
    if (process.env.EMAIL_FROM) {
        return process.env.EMAIL_FROM
    }
    if (process.env.EMAIL_SERVER_USER) {
        return `"NinetySixBD" <${process.env.EMAIL_SERVER_USER}>`
    }
    return '"NinetySixBD" <noreply@ninetysixbd.com>'
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/reset-password?token=${token}`

    // If SMTP is configured, send real email
    if (transporter) {
        try {
            const info = await transporter.sendMail({
                from: getFromAddress(),
                to: email,
                subject: "Reset your password - NinetySixBD",
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
                            <tr>
                                <td align="center">
                                    <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                        <!-- Header -->
                                        <tr>
                                            <td style="padding: 40px 40px 20px; text-align: center; background-color: #000; border-radius: 8px 8px 0 0;">
                                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-family: Arial, sans-serif;">NinetySixBD</h1>
                                            </td>
                                        </tr>
                                        
                                        <!-- Content -->
                                        <tr>
                                            <td style="padding: 40px;">
                                                <h2 style="margin: 0 0 20px; color: #333; font-size: 24px; font-family: Arial, sans-serif;">Reset Your Password</h2>
                                                <p style="margin: 0 0 20px; color: #666; font-size: 16px; line-height: 1.5; font-family: Arial, sans-serif;">
                                                    You requested a password reset for your NinetySixBD account. Click the button below to set a new password:
                                                </p>
                                                
                                                <!-- Button -->
                                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                                                    <tr>
                                                        <td align="center">
                                                            <a href="${resetLink}" style="display: inline-block; background-color: #000; color: #fff; padding: 14px 40px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif;">
                                                                Reset Password
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>
                                                
                                                <p style="margin: 20px 0 0; color: #999; font-size: 14px; line-height: 1.5; font-family: Arial, sans-serif;">
                                                    If the button doesn't work, copy and paste this link into your browser:
                                                </p>
                                                <p style="margin: 10px 0; color: #666; font-size: 13px; word-break: break-all; font-family: Arial, sans-serif;">
                                                    ${resetLink}
                                                </p>
                                            </td>
                                        </tr>
                                        
                                        <!-- Footer -->
                                        <tr>
                                            <td style="padding: 30px 40px; background-color: #f8f8f8; border-radius: 0 0 8px 8px;">
                                                <p style="margin: 0 0 10px; color: #666; font-size: 14px; font-family: Arial, sans-serif;">
                                                    <strong>Didn't request this?</strong> You can safely ignore this email.
                                                </p>
                                                <p style="margin: 0; color: #999; font-size: 12px; font-family: Arial, sans-serif;">
                                                    This link will expire in 1 hour for security reasons.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Footer Text -->
                                    <table width="600" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
                                        <tr>
                                            <td style="text-align: center; color: #999; font-size: 12px; font-family: Arial, sans-serif;">
                                                © ${new Date().getFullYear()} NinetySixBD. All rights reserved.
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                `,
                // Plain text fallback
                text: `
Reset Your Password

You requested a password reset for your NinetySixBD account.

Click this link to reset your password:
${resetLink}

If you didn't request this, you can safely ignore this email.
This link will expire in 1 hour for security reasons.

© ${new Date().getFullYear()} NinetySixBD. All rights reserved.
                `.trim(),
            })

            console.log(`[MAIL SERVICE] ✅ Password reset email sent successfully`)
            console.log(`[MAIL SERVICE] → To: ${email}`)
            console.log(`[MAIL SERVICE] → Message ID: ${info.messageId}`)

        } catch (error) {
            console.error("[MAIL SERVICE] ❌ Failed to send email:", error)
            // Log detailed error for debugging
            if (error instanceof Error) {
                console.error("[MAIL SERVICE] Error message:", error.message)
                console.error("[MAIL SERVICE] Error stack:", error.stack)
            }
            throw new Error("Failed to send password reset email")
        }
    } else {
        // Fallback: log to console when SMTP is not configured
        console.warn("========================================")
        console.warn("[MAIL SERVICE] ⚠️  SMTP not configured")
        console.warn("[MAIL SERVICE] Email would be sent to:", email)
        console.warn("[MAIL SERVICE] Reset Link:", resetLink)
        console.warn("[MAIL SERVICE]")
        console.warn("[MAIL SERVICE] To enable email sending, configure one of:")
        console.warn("[MAIL SERVICE] 1. Gmail: EMAIL_SERVER_USER + EMAIL_SERVER_PASSWORD")
        console.warn("[MAIL SERVICE] 2. SendGrid: SENDGRID_API_KEY")
        console.warn("[MAIL SERVICE] 3. Resend: RESEND_API_KEY")
        console.warn("========================================")
    }
}

