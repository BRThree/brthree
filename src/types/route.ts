import { RouteObject } from 'react-router-dom';

export interface RouteMeta {
  /**
   * antd menu selectedKeys
   */
  key: string;
  /**
   * menu label, i18n
   */
  label: string;
  /**
   * hide
   */
  hide?: boolean;
  /**
   * disable in menu
   */
  disabled?: boolean;
}

export type AppRouteObject = {
  order?: number;
  meta?: RouteMeta;
  children?: AppRouteObject[];
} & Omit<RouteObject, 'children'>;
