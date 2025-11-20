// services/realtimeService.js
import { Server } from 'socket.io';
import { getDB } from '../db.js';

class RealtimeService {
  constructor() {
    this.io = null;
    this.changeStreams = new Map();
    this.connectedClients = new Map();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
      },
      // 🆕 CRITICAL FIXES FOR CONNECTION ISSUES
      allowEIO3: true, // Allow Engine.IO v3 compatibility
      transports: ['websocket', 'polling'], // Explicitly allow both
      pingTimeout: 60000,
      pingInterval: 25000,
      connectTimeout: 45000,
      maxHttpBufferSize: 1e8
    });

    this.setupConnectionHandlers();
    console.log('✅ Real-time service initialized');
    return this.io;
  }

  setupConnectionHandlers() {
    this.io.on('connection', (socket) => {
      console.log('🔌 Client connected for real-time updates:', socket.id);

      // Store client information
      this.connectedClients.set(socket.id, {
        id: socket.id,
        connectedAt: new Date(),
        rooms: new Set()
      });

      // Join specific rooms based on client needs
      socket.on('subscribe', (data) => {
        this.handleSubscription(socket, data);
      });

      // Leave rooms
      socket.on('unsubscribe', (data) => {
        this.handleUnsubscription(socket, data);
      });

      // Handle ping/pong for connection health
      socket.on('ping', (callback) => {
        if (typeof callback === 'function') {
          callback({ 
            status: 'pong', 
            timestamp: new Date().toISOString(),
            clientId: socket.id 
          });
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('🔌 Client disconnected:', socket.id, 'Reason:', reason);
        this.cleanupClient(socket.id);
      });

      socket.on('error', (error) => {
        console.error('Socket error for client', socket.id, ':', error);
      });
    });

    // Handle server-level errors
    this.io.engine.on("connection_error", (err) => {
      console.error('🔌 Server connection error:', err);
    });
  }

  handleSubscription(socket, data) {
    try {
      const { room, collection, filter = {} } = data;
      
      if (!room && !collection) {
        socket.emit('error', { message: 'Room or collection required for subscription' });
        return;
      }

      const targetRoom = room || this.getRoomName(collection, filter);
      socket.join(targetRoom);
      
      // Track the subscription
      const client = this.connectedClients.get(socket.id);
      if (client) {
        client.rooms.add(targetRoom);
      }

      console.log(`📡 Client ${socket.id} joined room: ${targetRoom}`);
      
      // Send confirmation
      socket.emit('subscribed', { 
        room: targetRoom, 
        success: true,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Subscription error:', error);
      socket.emit('error', { message: 'Subscription failed', error: error.message });
    }
  }

  handleUnsubscription(socket, data) {
    const { room, collection, filter = {} } = data;
    const targetRoom = room || this.getRoomName(collection, filter);
    
    socket.leave(targetRoom);
    
    const client = this.connectedClients.get(socket.id);
    if (client) {
      client.rooms.delete(targetRoom);
    }

    console.log(`📡 Client ${socket.id} left room: ${targetRoom}`);
    socket.emit('unsubscribed', { room: targetRoom, success: true });
  }

  cleanupClient(clientId) {
    this.connectedClients.delete(clientId);
  }

  getRoomName(collection, filter = {}) {
    const filterString = JSON.stringify(filter);
    return `collection:${collection}:filter:${filterString}`;
  }

  // Watch a specific collection for changes
  async watchCollection(collectionName, pipeline = []) {
    try {
      const db = getDB();
      if (!db) {
        console.error('❌ Database not available for collection watching');
        return false;
      }

      // Don't watch if already watching
      if (this.changeStreams.has(collectionName)) {
        console.log(`👀 Already watching collection: ${collectionName}`);
        return true;
      }

      const collection = db.collection(collectionName);
      
      const changeStream = collection.watch([
        ...pipeline,
        { 
          $match: { 
            operationType: { $in: ['insert', 'update', 'delete', 'replace'] } 
          } 
        }
      ], { 
        fullDocument: 'updateLookup',
        maxAwaitTimeMS: 5000
      });

      changeStream.on('change', (change) => {
        this.handleCollectionChange(collectionName, change);
      });

      changeStream.on('error', (error) => {
        console.error(`❌ Change stream error for ${collectionName}:`, error);
        this.changeStreams.delete(collectionName);
        this.retryWatching(collectionName);
      });

      changeStream.on('close', () => {
        console.log(`🔒 Change stream closed for ${collectionName}`);
        this.changeStreams.delete(collectionName);
      });

      this.changeStreams.set(collectionName, changeStream);
      console.log(`✅ Now watching collection: ${collectionName}`);
      return true;

    } catch (error) {
      console.error(`❌ Failed to watch collection ${collectionName}:`, error);
      this.retryWatching(collectionName);
      return false;
    }
  }

  handleCollectionChange(collectionName, change) {
    if (!this.io) return;

    // Log only in development for performance
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 ${collectionName} change:`, change.operationType);
    }

    // Emit to collection-specific room (for all documents in collection)
    const collectionRoom = this.getRoomName(collectionName, {});
    this.emitToRoom(collectionRoom, `${collectionName}_changed`, {
      operation: change.operationType,
      document: change.fullDocument,
      id: change.documentKey._id,
      collection: collectionName,
      timestamp: new Date().toISOString()
    });

    // Emit to document-specific room (for specific document updates)
    if (change.documentKey && change.documentKey._id) {
      const docRoom = this.getRoomName(collectionName, { _id: change.documentKey._id.toString() });
      this.emitToRoom(docRoom, `${collectionName}_changed`, {
        operation: change.operationType,
        document: change.fullDocument,
        id: change.documentKey._id,
        collection: collectionName,
        timestamp: new Date().toISOString()
      });
    }

    // Emit operation-specific events
    switch (change.operationType) {
      case 'insert':
        this.emitToRoom(collectionRoom, `${collectionName}_inserted`, change.fullDocument);
        break;
      case 'update':
        this.emitToRoom(collectionRoom, `${collectionName}_updated`, change.fullDocument);
        break;
      case 'delete':
        this.emitToRoom(collectionRoom, `${collectionName}_deleted`, change.documentKey._id);
        break;
    }
  }

  retryWatching(collectionName, attempt = 1) {
    const maxRetries = 3;
    const retryDelay = Math.min(1000 * Math.pow(2, attempt), 30000);

    if (attempt <= maxRetries) {
      console.log(`🔄 Retrying to watch ${collectionName} in ${retryDelay}ms (attempt ${attempt}/${maxRetries})`);
      
      setTimeout(async () => {
        await this.watchCollection(collectionName);
      }, retryDelay);
    } else {
      console.error(`🚨 Giving up on watching ${collectionName} after ${maxRetries} attempts`);
    }
  }

  // Batch watch multiple collections
  async watchCollections(collectionNames) {
    const results = [];
    for (const collectionName of collectionNames) {
      const success = await this.watchCollection(collectionName);
      results.push({ collection: collectionName, success });
    }
    return results;
  }

  // Enhanced emission methods
  emitToAll(event, data) {
    if (this.io) {
      this.io.emit(event, {
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  }

  emitToRoom(room, event, data) {
    if (this.io) {
      this.io.to(room).emit(event, {
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  }

  emitToClient(clientId, event, data) {
    if (this.io) {
      this.io.to(clientId).emit(event, {
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Stop watching a collection
  stopWatching(collectionName) {
    const changeStream = this.changeStreams.get(collectionName);
    if (changeStream) {
      changeStream.close();
      this.changeStreams.delete(collectionName);
      console.log(`🛑 Stopped watching: ${collectionName}`);
    }
  }

  // Get service status
  getStatus() {
    return {
      connectedClients: this.connectedClients.size,
      watchedCollections: Array.from(this.changeStreams.keys()),
      totalRooms: this.io ? this.io.sockets.adapter.rooms.size : 0,
      clientCount: this.getClientCount()
    };
  }

  // Get connected client count
  getClientCount() {
    return this.io ? this.io.engine.clientsCount : 0;
  }

  // Get Socket.io instance
  getIO() {
    return this.io;
  }

  // Check if collection is being watched
  isWatching(collectionName) {
    return this.changeStreams.has(collectionName);
  }

  // Manual event emission for custom updates
  emitManualUpdate(collectionName, event, data, filter = {}) {
    const room = this.getRoomName(collectionName, filter);
    this.emitToRoom(room, event, {
      collection: collectionName,
      ...data,
      manual: true,
      timestamp: new Date().toISOString()
    });
  }
}

export default new RealtimeService();