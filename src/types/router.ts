import { HttpMethod } from './http';

export type RouteHandler = (...rest: any) => any;
export type MapRoute = (route: string, ...handler: RouteHandler[]) => any;

export type IRouter = {
  [key in HttpMethod]: MapRoute;
};
