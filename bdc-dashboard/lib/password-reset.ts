import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import { randomBytes } from "crypto"
import bcrypt from "bcryptjs"

export async function createPasswordResetRequest(email: string) {
  // Check if user exists and uses password auth
  const user = await prisma.user.findUnique({
    where: { 
      email: email.toLowerCase(),
      authType: "PASSWORD",
      status: "ACTIVE",
    },
  })

  if (!user) {
    // Don't reveal if user exists or not for security
    return { success: true }
  }

  // Invalidate any existing reset tokens
  await prisma.passwordReset.updateMany({
    where: {
      email: email.toLowerCase(),
      used: false,
    },
    data: {
      used: true,
    },
  })

  // Generate secure token
  const token = randomBytes(32).toString("hex")
  
  // Create password reset record (expires in 1 hour)
  await prisma.passwordReset.create({
    data: {
      email: email.toLowerCase(),
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  })

  // Send reset email
  await sendPasswordResetEmail({
    to: email,
    token,
  })

  return { success: true }
}

export async function validatePasswordResetToken(token: string) {
  const resetRequest = await prisma.passwordReset.findUnique({
    where: { token },
  })

  if (!resetRequest) {
    throw new Error("Invalid reset token")
  }

  if (resetRequest.used) {
    throw new Error("Reset token has already been used")
  }

  if (resetRequest.expiresAt < new Date()) {
    throw new Error("Reset token has expired")
  }

  return resetRequest
}

export async function resetPassword({
  token,
  newPassword,
}: {
  token: string
  newPassword: string
}) {
  const resetRequest = await validatePasswordResetToken(token)
  
  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12)

  // Update user password and mark token as used in a transaction
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { email: resetRequest.email },
      data: { password: hashedPassword },
    })

    await tx.passwordReset.update({
      where: { id: resetRequest.id },
      data: { used: true },
    })
  })

  return { success: true }
}