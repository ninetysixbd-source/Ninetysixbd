import nodemailer from "nodemailer"

// Use the same URL that NextAuth uses
const domain = process.env.NEXTAUTH_URL || process.env.AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/reset-password?token=${token}`

    // TODO: Configure SMTP transporter using env variables for production
    // For now, we will log to console for development verification.

    console.log("========================================")
    console.log(`[MAIL SERVICE]`)
    console.log(`To: ${email}`)
    console.log(`Subject: Reset your password`)
    console.log(`Reset Link: ${resetLink}`)
    console.log("========================================")

    // Example Transporter for reference:
    /*
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
        },
    })

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    })
    */
}
