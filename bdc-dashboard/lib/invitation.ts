import { prisma } from "@/lib/prisma"
import { sendInvitationEmail } from "@/lib/email"
import { UserRole, InvitationStatus } from "@prisma/client"
import { randomBytes } from "crypto"

export async function createUserInvitation({
  email,
  role = UserRole.USER,
  invitedBy,
}: {
  email: string
  role?: UserRole
  invitedBy: string
}) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // Check if there's a pending invitation
  const existingInvitation = await prisma.userInvitation.findFirst({
    where: {
      email: email.toLowerCase(),
      status: InvitationStatus.PENDING,
    },
  })

  if (existingInvitation) {
    throw new Error("Pending invitation already exists for this email")
  }

  // Generate secure token
  const token = randomBytes(32).toString("hex")
  
  // Create invitation (expires in 7 days)
  const invitation = await prisma.userInvitation.create({
    data: {
      email: email.toLowerCase(),
      token,
      role,
      invitedBy,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
    include: {
      invitedByUser: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  // Send invitation email
  await sendInvitationEmail({
    to: email,
    token,
    invitedBy: invitation.invitedByUser.name || invitation.invitedByUser.email,
  })

  return invitation
}

export async function validateInvitationToken(token: string) {
  const invitation = await prisma.userInvitation.findUnique({
    where: { token },
  })

  if (!invitation) {
    throw new Error("Invalid invitation token")
  }

  if (invitation.status !== InvitationStatus.PENDING) {
    throw new Error("Invitation is no longer valid")
  }

  if (invitation.expiresAt < new Date()) {
    // Mark as expired
    await prisma.userInvitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.EXPIRED },
    })
    throw new Error("Invitation has expired")
  }

  return invitation
}

export async function acceptInvitation({
  token,
  name,
  password,
}: {
  token: string
  name: string
  password: string
}) {
  const invitation = await validateInvitationToken(token)
  
  const bcrypt = await import("bcryptjs")
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create user and mark invitation as accepted in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: invitation.email,
        name,
        password: hashedPassword,
        role: invitation.role,
        authType: "PASSWORD",
        emailVerified: new Date(),
      },
    })

    await tx.userInvitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.ACCEPTED },
    })

    return user
  })

  return result
}