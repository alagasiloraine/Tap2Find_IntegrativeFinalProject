import { WebSocketServer } from 'ws';

class RfidWebSocketServer {
  constructor() {
    this.wss = null;
    this.clients = new Set();
  }

  initialize(server) {
    this.wss = new WebSocketServer({ 
      server, 
      path: '/api/ws/rfid' 
    });
    
    this.setup();
    console.log('✅ RFID WebSocket Server initialized');
  }

  setup() {
    this.wss.on('connection', (ws, req) => {
      console.log('🔌 RFID WebSocket client connected');
      this.clients.add(ws);

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to RFID WebSocket',
        timestamp: new Date().toISOString()
      }));

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          console.log('📨 WebSocket message received:', data);
        } catch (error) {
          console.log('📨 Raw WebSocket message:', message.toString());
        }
      });

      ws.on('close', (code, reason) => {
        console.log(`🔌 RFID WebSocket client disconnected: ${code} - ${reason}`);
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('❌ RFID WebSocket error:', error);
        this.clients.delete(ws);
      });
    });

    this.wss.on('error', (error) => {
      console.error('❌ RFID WebSocket server error:', error);
    });
  }

  broadcastToClients(data) {
    if (!this.wss) {
      console.log('❌ WebSocket server not initialized');
      return;
    }

    const message = JSON.stringify(data);
    let clientCount = 0;

    this.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(message);
        clientCount++;
      }
    });

    console.log(`📢 Broadcasted RFID to ${clientCount} clients:`, data);
    return clientCount;
  }

  getClientCount() {
    return this.clients.size;
  }
}

// Create singleton instance
const rfidWebSocketServer = new RfidWebSocketServer();
export default rfidWebSocketServer;