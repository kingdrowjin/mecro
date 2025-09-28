type EventCallback = (data: any) => void;

interface EventBusEvents {
  // Authentication events
  'auth:login': { user: any; token: string };
  'auth:logout': void;
  'auth:token-refresh': { token: string };

  // User events
  'user:profile-updated': { user: any };
  'user:role-changed': { userId: string; newRole: string };

  // Navigation events
  'nav:route-change': { route: string; module: string };
  'nav:breadcrumb-update': { breadcrumbs: Array<{ label: string; path: string }> };

  // Notification events
  'notification:show': {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  };
  'notification:clear': void;

  // Booking events
  'booking:created': { bookingId: string; booking: any };
  'booking:updated': { bookingId: string; booking: any };
  'booking:cancelled': { bookingId: string };

  // General events
  'app:theme-changed': { theme: 'light' | 'dark' };
  'app:language-changed': { language: string };
}

class EventBus {
  private events: Map<string, Set<EventCallback>> = new Map();
  private isDebugMode = process.env.NODE_ENV === 'development';

  private log(message: string, data?: any) {
    if (this.isDebugMode) {
      console.log(`[EventBus] ${message}`, data || '');
    }
  }

  on<K extends keyof EventBusEvents>(
    event: K,
    callback: (data: EventBusEvents[K]) => void
  ): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const callbacks = this.events.get(event)!;
    callbacks.add(callback as EventCallback);

    this.log(`Subscribed to event: ${event}`, { totalListeners: callbacks.size });

    // Return unsubscribe function
    return () => {
      callbacks.delete(callback as EventCallback);
      if (callbacks.size === 0) {
        this.events.delete(event);
      }
      this.log(`Unsubscribed from event: ${event}`, { totalListeners: callbacks.size });
    };
  }

  emit<K extends keyof EventBusEvents>(
    event: K,
    data: EventBusEvents[K]
  ): void {
    const callbacks = this.events.get(event);

    if (!callbacks || callbacks.size === 0) {
      this.log(`No listeners for event: ${event}`, data);
      return;
    }

    this.log(`Emitting event: ${event}`, {
      data,
      listenerCount: callbacks.size
    });

    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[EventBus] Error in event listener for ${event}:`, error);
      }
    });
  }

  off<K extends keyof EventBusEvents>(
    event: K,
    callback?: (data: EventBusEvents[K]) => void
  ): void {
    if (!callback) {
      // Remove all listeners for this event
      this.events.delete(event);
      this.log(`Removed all listeners for event: ${event}`);
      return;
    }

    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback as EventCallback);
      if (callbacks.size === 0) {
        this.events.delete(event);
      }
      this.log(`Removed listener for event: ${event}`, {
        remainingListeners: callbacks.size
      });
    }
  }

  once<K extends keyof EventBusEvents>(
    event: K,
    callback: (data: EventBusEvents[K]) => void
  ): () => void {
    const unsubscribe = this.on(event, (data) => {
      callback(data);
      unsubscribe();
    });

    return unsubscribe;
  }

  // Get all active events (for debugging)
  getActiveEvents(): string[] {
    return Array.from(this.events.keys());
  }

  // Get listener count for an event
  getListenerCount<K extends keyof EventBusEvents>(event: K): number {
    return this.events.get(event)?.size || 0;
  }

  // Clear all events
  clear(): void {
    this.events.clear();
    this.log('Cleared all event listeners');
  }
}

// Create singleton instance
const eventBus = new EventBus();

export { eventBus, EventBus };
export type { EventBusEvents };