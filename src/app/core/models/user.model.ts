import { Notification } from './notification.model';

export interface User {
  uid?: any;
  email: string;
  photoURL?: string;
  displayName?: string;
  school?: string;
  field?: string;
  posted?: number;

  pinned?: any;
  notifications?: Notification[];
  answered?: number;
  asked?: number;
  exam?: string;
}
