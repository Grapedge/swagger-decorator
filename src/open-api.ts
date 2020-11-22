import yaml from 'yamljs';
import {
  OpenAPIController,
  OpenAPIDocument,
  OpenAPIRoute,
  OpenAPISchema,
} from './types/swagger';
import merge from 'lodash.merge';
import path from 'path';
import fs from 'fs';
import { IRouter, RouteHandler } from './types/router';
import { HttpMethod } from './types/http';


class SwaggerDecorator {
  private document: OpenAPIDocument;
  private router?: IRouter;
  private prefix?: string;

  private shouldAddRouterPrefix?: boolean;
  constructor() {
    this.document = Object.create(null);
    this.document.info = {
      title: 'App',
      version: '1.0.0',
    };
    this.document.paths = {};
    this.document.components = {};
  }

  push(
    method: HttpMethod,
    path: string,
    route: OpenAPIRoute,
    handler?: RouteHandler
  ) {
    const fixed = `${this.prefix ? this.prefix + '/' : ''}${path}`;
    path = this.shouldAddRouterPrefix ? fixed : path;
    this.merge({
      paths: {
        [path]: {
          [method]: route,
        },
      },
    });

    if (this.router && handler) {
      this.router[method](path, handler);
      console.log(`[route]${method} ${path}`);
    }
  }

  define(schema: OpenAPISchema) {
    this.merge({
      components: {
        [schema.name]: schema,
      },
    });
  }

  merge(doc: OpenAPIDocument) {
    this.document = merge(this.document, doc);
  }

  private _find(dir: string, test: RegExp, nested: boolean) {
    const files = fs.readdirSync(dir);
    const res: string[] = [];
    for (const file of files) {
      const filePath = path.resolve(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        res.push(...this._find(filePath, test, nested));
      } else if (test.test(file)) {
        res.push(filePath);
      }
    }
    return res;
  }

  mapRoutes(
    dir: string,
    options?: {
      router?: IRouter;
      test?: RegExp;
      nested?: boolean;
      prefix?: string;
      shouldAddRouterPrefix?: boolean;
    }
  ) {
    const { test = /\.(ts|js)$/i, nested = true, router } = options || {};
    this.router = router;
    this.shouldAddRouterPrefix = this.shouldAddRouterPrefix || false;
    // find all files
    const files = this._find(dir, test, nested);
    files.forEach((file) => require(file));
  }

  getYaml() {
    return yaml.stringify(this.document);
  }
  getJson() {
    return JSON.stringify(this.document);
  }
}

const swagger = new SwaggerDecorator();

/**
 * define schema
 * @param schema
 */
export function Schema(schema: OpenAPISchema) {
  swagger.define(schema);
}

export function Controller({ prefix = '', tag }: OpenAPIController = {}) {
  return function <T extends new (...args: any[]) => {}>(target: T) {
    const routes: {
      _route: OpenAPIRoute;
      (...rest: any): any;
    }[] = Object.values(Object.getOwnPropertyDescriptors(target.prototype))
      .map((item) => item.value)
      .filter((value) => value._route);
    for (const handler of routes) {
      const route = handler._route;
      const [method, path] = route.route.split(' ').filter(Boolean);
      if (tag) {
        route.tags = route.tags ? [tag, ...route.tags] : [tag];
      }
      swagger.push(
        method as HttpMethod,
        `${prefix || ''}${path}`,
        route,
        handler
      );
    }
  };
}

export function Route(route: OpenAPIRoute) {
  return function (_t: any, _n: string, des: PropertyDescriptor) {
    des.value._route = route;
  };
}

export default swagger;
