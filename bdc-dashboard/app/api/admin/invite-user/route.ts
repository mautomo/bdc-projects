import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createUserInvitation } from '@/lib/invitation'
import { createAuditLog } from '@/lib/audit'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { email, role } = await request.json()

    if (!email || !role) {
      return NextResponse.json(
        { message: 'Email and role are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['USER', 'ADMIN', 'SUPER_ADMIN']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role' },
        { status: 400 }
      )
    }

    // Only super admins can create other super admins
    if (role === 'SUPER_ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { message: 'Only super admins can create super admin accounts' },
        { status: 403 }
      )
    }

    const invitation = await createUserInvitation({
      email: email.toLowerCase(),
      role: role as UserRole,
      invitedBy: session.user.id,
    })

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'INVITE_USER',
      resource: 'USER',
      details: { 
        invitedEmail: email,
        role: role,
        invitationId: invitation.id 
      },
      ipAddress: request.ip,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    return NextResponse.json({
      message: 'Invitation sent successfully',
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
      },
    })
  } catch (error: any) {
    console.error('Failed to invite user:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to send invitation' },
      { status: 400 }
    )
  }
}