// src/utils/websocketService.js
import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventCallbacks = new Map();
    this.reconnectionAttempts = 0;
    this.maxReconnectionAttempts = 5;
    this.reconnectionDelay = 1000;
    this.pendingSubscriptions = [];
  }

  connect(token = null) {
    // Prevent multiple connections
    if (this.socket && this.isConnected) {
      console.log('🔌 WebSocket already connected');
      return this.socket;
    }

    // Clean up existing connection
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    console.log('🔄 Initializing WebSocket connection...');

    // 🆕 OPTIMIZED CONFIGURATION
    const options = {
      withCredentials: true,
      // 🆕 CRITICAL: Force polling first for better compatibility
      transports: ['polling', 'websocket'],
      upgrade: true,
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectionAttempts,
      reconnectionDelay: this.reconnectionDelay,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      randomizationFactor: 0.5
    };

    // Add authentication if token provided
    if (token) {
      options.auth = { token };
      options.extraHeaders = {
        Authorization: `Bearer ${token}`
      };
    }

    try {
      this.socket = io('http://localhost:3000', options);

      this.setupEventHandlers();
      
      return this.socket;

    } catch (error) {
      console.error('❌ Failed to initialize WebSocket:', error);
      this.handleConnectionError(error);
      throw error;
    }
  }

  setupEventHandlers() {
    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected:', this.socket.id);
      this.isConnected = true;
      this.reconnectionAttempts = 0;
      this.emit('connected', { 
        socketId: this.socket.id,
        timestamp: new Date().toISOString()
      });
      
      // Process pending subscriptions
      this.processPendingSubscriptions();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 WebSocket disconnected:', reason);
      this.isConnected = false;
      this.emit('disconnected', { 
        reason,
        timestamp: new Date().toISOString()
      });
      
      // Auto-reconnect on server disconnect
      if (reason === 'io server disconnect') {
        console.log('🔄 Server disconnected, attempting reconnect...');
        setTimeout(() => {
          this.socket.connect();
        }, 2000);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      this.reconnectionAttempts++;
      this.isConnected = false;
      
      this.emit('connection_error', { 
        error, 
        attempt: this.reconnectionAttempts,
        timestamp: new Date().toISOString()
      });
      
      console.warn(`Connection attempt ${this.reconnectionAttempts}/${this.maxReconnectionAttempts} failed`);
    });

    this.socket.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 WebSocket reconnection attempt ${attempt}`);
      this.emit('reconnect_attempt', { attempt });
    });

    this.socket.on('reconnect', (attempt) => {
      console.log('✅ WebSocket reconnected after', attempt, 'attempts');
      this.isConnected = true;
      this.reconnectionAttempts = 0;
      this.emit('reconnected', { 
        attempt,
        timestamp: new Date().toISOString()
      });
      
      // Resubscribe to all previous subscriptions
      this.processPendingSubscriptions();
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ WebSocket reconnection error:', error);
      this.emit('reconnect_error', { error });
    });

    this.socket.on('reconnect_failed', () => {
      console.error('💥 WebSocket reconnection failed after max attempts');
      this.emit('reconnection_failed', {
        timestamp: new Date().toISOString()
      });
    });

    // Custom events from server
    this.socket.on('subscribed', (data) => {
      console.log('✅ Subscribed to room:', data.room);
      this.emit('subscribed', data);
    });

    this.socket.on('unsubscribed', (data) => {
      console.log('✅ Unsubscribed from room:', data.room);
      this.emit('unsubscribed', data);
    });

    this.socket.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
      this.emit('error', error);
    });

    // Handle all incoming real-time events
    this.socket.onAny((event, data) => {
      // console.log('📡 WebSocket event received:', event, data);
      this.emit(event, data);
    });
  }

  processPendingSubscriptions() {
    if (this.pendingSubscriptions.length > 0 && this.isConnected) {
      console.log(`🔄 Processing ${this.pendingSubscriptions.length} pending subscriptions...`);
      
      this.pendingSubscriptions.forEach(subscription => {
        if (subscription.type === 'collection') {
          this.subscribe(subscription.collection, subscription.filter);
        } else if (subscription.type === 'room') {
          this.subscribeToRoom(subscription.room);
        }
      });
      
      // Clear processed subscriptions
      this.pendingSubscriptions = [];
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Manually disconnecting WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.reconnectionAttempts = 0;
      this.pendingSubscriptions = [];
      this.emit('manual_disconnect', {
        timestamp: new Date().toISOString()
      });
    }
  }

  // Subscribe to collections
  subscribe(collection, filter = {}) {
    if (this.socket && this.isConnected) {
      this.socket.emit('subscribe', {
        collection,
        filter
      });
      console.log(`📡 Subscribed to ${collection} with filter:`, filter);
    } else {
      console.warn('⚠️ WebSocket not connected, queuing subscription');
      // Queue the subscription for when connection is restored
      this.pendingSubscriptions.push({
        type: 'collection',
        collection,
        filter
      });
      
      // Try to connect if not connected
      if (!this.socket) {
        this.connect();
      }
    }
  }

  // Subscribe to specific room
  subscribeToRoom(room) {
    if (this.socket && this.isConnected) {
      this.socket.emit('subscribe', { room });
      console.log(`📡 Subscribed to room: ${room}`);
    } else {
      console.warn('⚠️ WebSocket not connected, queuing room subscription');
      this.pendingSubscriptions.push({
        type: 'room',
        room
      });
      
      if (!this.socket) {
        this.connect();
      }
    }
  }

  // Unsubscribe from room
  unsubscribeFromRoom(room) {
    if (this.socket && this.isConnected) {
      this.socket.emit('unsubscribe', { room });
      console.log(`📡 Unsubscribed from room: ${room}`);
    }
  }

  // Send custom events to server
  send(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, {
        ...data,
        clientTimestamp: new Date().toISOString()
      });
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send event:', event);
    }
  }

  // Ping server to check connection
  ping() {
    return new Promise((resolve, reject) => {
      if (this.socket && this.isConnected) {
        this.socket.emit('ping', (response) => {
          resolve(response);
        });
        
        // Timeout after 5 seconds
        setTimeout(() => {
          reject(new Error('Ping timeout'));
        }, 5000);
      } else {
        reject(new Error('WebSocket not connected'));
      }
    });
  }

  // Event management
  on(event, callback) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event).push(callback);
  }

  off(event, callback) {
    if (this.eventCallbacks.has(event)) {
      const callbacks = this.eventCallbacks.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventCallbacks.has(event)) {
      this.eventCallbacks.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket callback for ${event}:`, error);
        }
      });
    }
  }

  // Utility methods
  getConnectionStatus() {
    return this.isConnected;
  }

  getSocketId() {
    return this.socket?.id || null;
  }

  getReconnectionAttempts() {
    return this.reconnectionAttempts;
  }

  // Health check
  async healthCheck() {
    try {
      const pingResult = await this.ping();
      return {
        connected: this.isConnected,
        socketId: this.socket?.id,
        ping: pingResult,
        pendingSubscriptions: this.pendingSubscriptions.length,
        reconnectionAttempts: this.reconnectionAttempts
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message,
        pendingSubscriptions: this.pendingSubscriptions.length,
        reconnectionAttempts: this.reconnectionAttempts
      };
    }
  }

  handleConnectionError(error) {
    this.isConnected = false;
    this.reconnectionAttempts++;
    
    console.error('🔌 Connection error details:', {
      message: error.message,
      attempt: this.reconnectionAttempts,
      maxAttempts: this.maxReconnectionAttempts
    });
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();

// Auto-initialize when imported (optional)
// websocketService.connect();

export default websocketService;