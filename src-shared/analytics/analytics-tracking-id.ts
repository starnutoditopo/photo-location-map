import { DevOrProd } from '../dev-or-prod/dev-or-prod';
import { isAlphaVersion } from '../version/is-alpha-version';

class TrackingId {
  public static dev  = 'UA-143091961-1';
  public static prod = 'UA-143091961-2';
}

export class AnalyticsTrackingId {
  public static get(): string {
    if (DevOrProd.isDev)
      return TrackingId.dev;

    return isAlphaVersion()
      ? TrackingId.dev
      : TrackingId.prod;
  }
}
