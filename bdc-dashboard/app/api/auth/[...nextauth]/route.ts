import { NextResponse } from 'next/server'

// Disable NextAuth completely - redirect to simple login
export async function GET() {
  return NextResponse.redirect(new URL('/simple-login', process.env.NEXTAUTH_URL || 'https://bdcapp.vandoko.com'))
}

export async function POST() {
  return NextResponse.redirect(new URL('/simple-login', process.env.NEXTAUTH_URL || 'https://bdcapp.vandoko.com'))
}