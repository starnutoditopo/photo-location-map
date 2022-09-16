import { EnvironmentDetector } from '../environment/environment-detector';
import { ProcessIdentifier } from '../process/process-identifier';
import { ProxyRequire } from '../require/proxy-require';
import { AnalyticsInterface } from './analytics-interface';
import { AnalyticsIpcChannelName, GoogleAnalytics4IpcRenderer } from './analytics-ipc';
import { AnalyticsMain } from './analytics-main';
import { AnalyticsRenderer } from './analytics-renderer';


let analytics: AnalyticsInterface;

if (ProcessIdentifier.isElectronMain) {
  const analyticsMain = new AnalyticsMain();
  ProxyRequire.electron.ipcMain.on(AnalyticsIpcChannelName.universalAnalyticsTrackEvent, (event, category, action, label, value) => {
    analyticsMain.trackEvent(category, action, label, value);
  });
  analytics = analyticsMain;
} else {
  GoogleAnalytics4IpcRenderer.configureIpc();
  analytics = new AnalyticsRenderer();
}

export const setUserAgentForAnalytics = (userAgent: string) => {
  if (analytics instanceof AnalyticsMain) {
    analytics.setUserAgent(userAgent);
  } else {
    throw new Error('setUserAgentForAnalytics cannot be called in renderer process. Call it in main process.');
  }
};

export class Analytics {
  public static trackEvent(category: string, action: string, label?: string, value?: string | number): void {
    if (EnvironmentDetector.isUnitTest)
      return;

    analytics.trackEvent(category, action, label, value);
  }
}
