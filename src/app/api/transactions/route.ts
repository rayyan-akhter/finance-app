import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/utils'

// GET - Fetch transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get transactions from storage (replace with database in production)
    const transactions = storage.get(`transactions_${userId}`) || []

    // Apply pagination
    const paginatedTransactions = transactions
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      transactions: paginatedTransactions,
      total: transactions.length,
      limit,
      offset
    })

  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const { userId, name, amount, type, category, date, description } = await request.json()

    // Validate input
    if (!userId || !name || !amount || !type || !category) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      )
    }

    // Validate amount
    if (isNaN(amount) || amount === 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Validate type
    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      )
    }

    // Create new transaction
    const newTransaction = {
      id: Date.now().toString(),
      userId,
      name,
      amount: parseFloat(amount),
      type,
      category,
      date: date || new Date().toISOString(),
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Get existing transactions
    const transactions = storage.get(`transactions_${userId}`) || []
    transactions.push(newTransaction)
    storage.set(`transactions_${userId}`, transactions)

    // Update user balance (simplified - in production, use proper balance calculation)
    const userBalance = storage.get(`balance_${userId}`) || 0
    const newBalance = type === 'income' ? userBalance + newTransaction.amount : userBalance - newTransaction.amount
    storage.set(`balance_${userId}`, newBalance)

    return NextResponse.json({
      success: true,
      transaction: newTransaction,
      newBalance
    }, { status: 201 })

  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update transaction
export async function PUT(request: NextRequest) {
  try {
    const { id, userId, name, amount, type, category, date, description } = await request.json()

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Transaction ID and User ID are required' },
        { status: 400 }
      )
    }

    // Get existing transactions
    const transactions = storage.get(`transactions_${userId}`) || []
    const transactionIndex = transactions.findIndex((t: any) => t.id === id)

    if (transactionIndex === -1) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Update transaction
    const updatedTransaction = {
      ...transactions[transactionIndex],
      name: name || transactions[transactionIndex].name,
      amount: amount ? parseFloat(amount) : transactions[transactionIndex].amount,
      type: type || transactions[transactionIndex].type,
      category: category || transactions[transactionIndex].category,
      date: date || transactions[transactionIndex].date,
      description: description || transactions[transactionIndex].description,
      updatedAt: new Date().toISOString()
    }

    transactions[transactionIndex] = updatedTransaction
    storage.set(`transactions_${userId}`, transactions)

    return NextResponse.json({
      success: true,
      transaction: updatedTransaction
    })

  } catch (error) {
    console.error('Update transaction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete transaction
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Transaction ID and User ID are required' },
        { status: 400 }
      )
    }

    // Get existing transactions
    const transactions = storage.get(`transactions_${userId}`) || []
    const transactionIndex = transactions.findIndex((t: any) => t.id === id)

    if (transactionIndex === -1) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Remove transaction
    const deletedTransaction = transactions[transactionIndex]
    transactions.splice(transactionIndex, 1)
    storage.set(`transactions_${userId}`, transactions)

    // Update user balance
    const userBalance = storage.get(`balance_${userId}`) || 0
    const newBalance = deletedTransaction.type === 'income' 
      ? userBalance - deletedTransaction.amount 
      : userBalance + deletedTransaction.amount
    storage.set(`balance_${userId}`, newBalance)

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully',
      newBalance
    })

  } catch (error) {
    console.error('Delete transaction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 