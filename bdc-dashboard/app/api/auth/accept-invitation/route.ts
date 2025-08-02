import { NextRequest, NextResponse } from 'next/server'
import { acceptInvitation } from '@/lib/invitation'
import { createAuditLog } from '@/lib/audit'

export async function POST(request: NextRequest) {
  try {
    const { token, name, password } = await request.json()

    if (!token || !name || !password) {
      return NextResponse.json(
        { message: 'Token, name, and password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 12) {
      return NextResponse.json(
        { message: 'Password must be at least 12 characters long' },
        { status: 400 }
      )
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { 
          message: 'Password must contain at least one uppercase letter, lowercase letter, number, and special character' 
        },
        { status: 400 }
      )
    }

    const user = await acceptInvitation({
      token,
      name: name.trim(),
      password,
    })

    // Create audit log
    await createAuditLog({
      userId: user.id,
      action: 'ACCOUNT_CREATED',
      resource: 'USER',
      details: { 
        email: user.email, 
        authType: 'PASSWORD',
        via: 'invitation' 
      },
      ipAddress: request.ip,
      userAgent: request.headers.get('user-agent'),
    })

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to create account' },
      { status: 400 }
    )
  }
}