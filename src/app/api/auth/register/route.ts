import { NextRequest, NextResponse } from 'next/server'
import { validateEmail, validatePassword, validateName, storage } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate names
    if (!validateName(firstName) || !validateName(lastName)) {
      return NextResponse.json(
        { error: 'Names must be at least 2 characters long' },
        { status: 400 }
      )
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'Password does not meet requirements', details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Check if user already exists
    const users = storage.get('users') || []
    const existingUser = users.find((u: unknown) => {
      if (typeof u === 'object' && u !== null && 'email' in u) {
        const userObj = u as { email: string }
        return userObj.email === email
      }
      return false
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      password, // In production, hash this password
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save user
    users.push(newUser)
    storage.set('users', users)

    // Create session
    const session = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: new Date().toISOString()
    }

    storage.set('currentSession', session)

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      },
      session
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 