import { OpenAPIV3 } from 'openapi-types';

export type OpenAPIController = {
  prefix?: string;
  tag?: string;
};

export type OpenAPIRoute = OpenAPIV3.OperationObject & {
  /**
   * route:
   * method path
   * @example post /login
   */
  route: string;
  /**
   * tag, if tag and tags both exists: [tag, ...tags]
   */
  tag?: string;
  // TODO:
  /**
   * type[:default][?!][desc]
   * ?: not required.
   * !: required.
   * ?? => ?
   * !! => !
   * @example
   * query: {
   *   current: 'number:1?the current page',
   *   pageSize: 'number:10?the page Size',
   *   token: 'string!the auth token',
   * }
   */
  query?: any;
  payload?: any;
  path?: any;
  formData?: any;
  /**
   * create default response that content-type = application/json
   */
  jsonBody?: any;
};

export type OpenAPISchema = OpenAPIV3.SchemaObject & {
  name: string;
};
export type OpenAPIDocument = Partial<OpenAPIV3.Document> & {
  openapi?: '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3';
};
