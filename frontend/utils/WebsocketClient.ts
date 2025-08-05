import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getAuthCookies } from '@/actions/getAuthCookies';

interface WebSocketClientOptions {
  url: string;
  onConnect: (client: Client) => void;
  onError: (error: any) => void;
  onClose: (client: Client) => void;
  onAuthError?: (data: boolean) => void; // Callback for 401/403 errors
  maxRetries?: number;
}

export class WebSocketClient {
  private client: Client;
  private retryCount: number = 0;
  private maxRetries: number;
  private options: WebSocketClientOptions;

  constructor(options: WebSocketClientOptions) {
    this.options = options;
    this.maxRetries = options.maxRetries || 3;

    // Initialize SockJS and Stomp client
    const socket = new SockJS(options.url);
    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 2000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // Set authentication headers asynchronously
    this.setAuthHeaders().then(() => {
      this.client.onConnect = () => {
        this.retryCount = 0; // Reset retry count on successful connection
        this.options.onConnect(this.client);
      };

      this.client.onStompError = (frame) => {
        console.error('STOMP Error:', frame);
        // Check for 401/403 errors in the STOMP frame
        if (frame.headers?.message?.includes('401') || frame.headers?.message?.includes('403')) {
          if (this.options.onAuthError) {
            this.options.onAuthError(true); // Trigger auth error callback
          }
          this.options.onError(new Error('Unauthenticated'));
        } else {
          this.options.onError(frame);
        }
      };

      this.client.onWebSocketClose = () => {
        console.log('WebSocket closed, attempting reconnect...');
        this.options.onClose(this.client);
        this.handleReconnect();
      };
    });
  }

  // Retrieve auth cookies and set headers
  private async setAuthHeaders() {
    const { accessToken, JSESSIONID } = await getAuthCookies();
    this.client.connectHeaders = {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      Cookie: `JSESSIONID=${JSESSIONID}`,
    };
  }

  // Handle reconnection with retry logic
  private handleReconnect() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`Reconnecting WebSocket, attempt ${this.retryCount}/${this.maxRetries}...`);
      this.setAuthHeaders().then(() => {
        this.client.activate();
      });
    } else {
      console.error('Max WebSocket reconnection attempts reached.');
      this.options.onError(new Error('Max reconnection attempts reached'));
    }
  }

  // Connect the WebSocket client
  public connect() {
    this.client.activate();
  }

  // Disconnect the WebSocket client
  public disconnect(onDisconnect?: () => void) {
    if (this.client.connected) {
      this.client.deactivate().then(() => {
        if (onDisconnect) onDisconnect();
      });
    }
  }

  // Get the underlying Stomp client
  public getClient(): Client {
    return this.client;
  }
}

export default WebSocketClient;
