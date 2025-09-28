import { useEffect, useCallback } from 'react';
import { eventBus, EventBusEvents } from '../events/eventBus';

interface MessagePayload {
  type: string;
  data: any;
  timestamp: number;
  source: string;
}

interface NotificationOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export const useAppMessaging = (appName: string) => {
  // Function to send notifications to all apps
  const sendNotification = useCallback((options: NotificationOptions) => {
    eventBus.emit('notification:show', options);
  }, []);

  // Function to clear all notifications
  const clearNotifications = useCallback(() => {
    eventBus.emit('notification:clear', undefined);
  }, []);

  // Function to broadcast a custom message
  const broadcastMessage = useCallback((type: string, data: any) => {
    const payload: MessagePayload = {
      type,
      data,
      timestamp: Date.now(),
      source: appName
    };

    // We can create a generic messaging event
    console.log(`[${appName}] Broadcasting message:`, payload);

    // For demonstration, we'll use console.log
    // In a real implementation, you might have a general 'app:message' event
  }, [appName]);

  // Function to update breadcrumbs
  const updateBreadcrumbs = useCallback((breadcrumbs: Array<{ label: string; path: string }>) => {
    eventBus.emit('nav:breadcrumb-update', { breadcrumbs });
  }, []);

  // Function to trigger route change notifications
  const notifyRouteChange = useCallback((route: string) => {
    eventBus.emit('nav:route-change', { route, module: appName });
  }, [appName]);

  // Function to listen for specific events (returns unsubscribe function)
  const addEventListener = useCallback(<K extends keyof EventBusEvents>(
    event: K,
    callback: (data: EventBusEvents[K]) => void
  ) => {
    return eventBus.on(event, callback);
  }, []);

  // Function to emit events with source tracking
  const emitEvent = useCallback(<K extends keyof EventBusEvents>(
    event: K,
    data: EventBusEvents[K]
  ) => {
    console.log(`[${appName}] Emitting event: ${event}`);
    eventBus.emit(event, data);
  }, [appName]);

  // Get event bus statistics for debugging
  const getEventStats = useCallback(() => {
    return {
      activeEvents: eventBus.getActiveEvents(),
      totalEvents: eventBus.getActiveEvents().length
    };
  }, []);

  return {
    // Notification functions
    sendNotification,
    clearNotifications,

    // General messaging
    broadcastMessage,
    emitEvent,

    // Navigation helpers
    updateBreadcrumbs,
    notifyRouteChange,

    // Event listener helper
    addEventListener,

    // Debugging
    getEventStats,

    // Direct access to event bus for advanced usage
    eventBus
  };
};