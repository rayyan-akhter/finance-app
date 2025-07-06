import { io, Socket } from 'socket.io-client'
import { toast } from 'react-hot-toast'

export interface RealtimeEvent {
  type: 'transaction' | 'balance' | 'notification' | 'market_update'
  data: any
  timestamp: string
}

export interface RealtimeConfig {
  url: string
  autoConnect?: boolean
  reconnection?: boolean
  reconnectionAttempts?: number
  reconnectionDelay?: number
}

class RealtimeService {
  private socket: Socket | null = null
  private isConnected = false
  private eventListeners: Map<string, Function[]> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  constructor(private config: RealtimeConfig) {
    this.config = {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      ...config
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.config.url, {
          autoConnect: this.config.autoConnect,
          reconnection: this.config.reconnection,
          reconnectionAttempts: this.config.reconnectionAttempts,
          reconnectionDelay: this.config.reconnectionDelay,
          transports: ['websocket', 'polling']
        })

        this.socket.on('connect', () => {
          this.isConnected = true
          this.reconnectAttempts = 0
          console.log('Connected to real-time server')
          toast.success('Connected to real-time updates')
          resolve()
        })

        this.socket.on('disconnect', (reason) => {
          this.isConnected = false
          console.log('Disconnected from real-time server:', reason)
          
          if (reason === 'io server disconnect') {
            // Server disconnected us, try to reconnect
            this.socket?.connect()
          }
        })

        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error)
          this.reconnectAttempts++
          
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            toast.error('Failed to connect to real-time server')
            reject(error)
          } else {
            toast.error(`Connection failed, retrying... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
          }
        })

        this.socket.on('reconnect', (attemptNumber) => {
          console.log('Reconnected after', attemptNumber, 'attempts')
          toast.success('Reconnected to real-time updates')
        })

        // Handle custom events
        this.socket.on('transaction_update', (data) => {
          this.emitLocal('transaction_update', data)
        })

        this.socket.on('balance_update', (data) => {
          this.emitLocal('balance_update', data)
        })

        this.socket.on('notification', (data) => {
          this.emitLocal('notification', data)
          toast(data.message, {
            icon: data.type === 'success' ? '✅' : data.type === 'error' ? '❌' : 'ℹ️',
            duration: 4000
          })
        })

        this.socket.on('market_update', (data) => {
          this.emitLocal('market_update', data)
        })

      } catch (error) {
        console.error('Failed to initialize real-time connection:', error)
        reject(error)
      }
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
      console.log('Disconnected from real-time server')
    }
  }

  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)?.push(callback)
  }

  off(event: string, callback?: Function): void {
    if (!callback) {
      this.eventListeners.delete(event)
    } else {
      const listeners = this.eventListeners.get(event)
      if (listeners) {
        const index = listeners.indexOf(callback)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }
    }
  }

  private emitLocal(event: string, data: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error)
        }
      })
    }
  }

  emit(event: string, data: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data)
    } else {
      console.warn('Socket not connected, cannot emit event:', event)
    }
  }

  get connected(): boolean {
    return this.isConnected
  }

  // Convenience methods for common events
  onTransactionUpdate(callback: (data: any) => void): void {
    this.on('transaction_update', callback)
  }

  onBalanceUpdate(callback: (data: any) => void): void {
    this.on('balance_update', callback)
  }

  onNotification(callback: (data: any) => void): void {
    this.on('notification', callback)
  }

  onMarketUpdate(callback: (data: any) => void): void {
    this.on('market_update', callback)
  }

  // Send transaction
  sendTransaction(transaction: any): void {
    this.emit('new_transaction', transaction)
  }

  // Update balance
  updateBalance(balance: any): void {
    this.emit('update_balance', balance)
  }

  // Join user room
  joinUserRoom(userId: string): void {
    this.emit('join_user_room', { userId })
  }

  // Leave user room
  leaveUserRoom(userId: string): void {
    this.emit('leave_user_room', { userId })
  }
}

// Create singleton instance
const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
export const realtimeService = new RealtimeService({
  url: wsUrl,
  autoConnect: false, // We'll connect manually when needed
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
})

export default realtimeService 