import { NextRequest, NextResponse } from 'next/server'
import { auth, storage } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For now, check against localStorage (replace with database in production)
    const users = storage.get('users') || []
    const user = users.find((u: any) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create session (in production, use JWT tokens)
    const session = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: new Date().toISOString()
    }

    // Store session in localStorage (replace with secure session management)
    storage.set('currentSession', session)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      session
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 