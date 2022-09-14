import { AnalyticsInterface } from './analytics-interface';
import { ProxyRequire } from '../require/proxy-require';
import { AnalyticsIpcChannelName } from './analytics-ipc-channel-name';

export class AnalyticsRenderer implements AnalyticsInterface {
  trackEvent(category: string, action: string, label?: string, value?: string | number): void {
    // Send an event to Google Analytics 4
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });

    // Send an event to Universal Analytics
    ProxyRequire.electron.ipcRenderer.send(
      AnalyticsIpcChannelName.trackEvent,
      category, action, label, value);
  }
}
