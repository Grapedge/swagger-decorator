# Swagger Decorator

Generate JSON or Yaml for Swagger Docs.

*This package is currently under development*

## Get Started

```js
// service.ts
import { Controller, Route } from 'swagger-decorator';
import { KoaPostContext } from 'types/koa';

@Controller({
  prefix: '/api/v1',
  tag: 'User',
})
export class UserService {
  @Route({
    route: 'post /login',
    responses: {
      token: {
        content: {
          'application/json': {
            schema: {
              type: 'string',
              example: '23333',
            },
          },
        },
        description: 'login',
      },
    },
  })
  async auth(ctx: KoaPostContext) {
    ctx.body = '23333';
  }
}

// app.ts
// search all .ts/.js files and map routes
swagger.mapRoutes(__dirname + '/service', {
  router: router,
});
// merge swagger options
swagger.merge({
  openapi: '3.0.0',
  info: {
    title: 'Test',
    version: 'v1.0',
    license: {
      name: 'MIT',
    },
  },
});
// getJson or get Yaml
router.get('/', (ctx) => {
  ctx.body = swagger.getJson();
});

```

The router only needs to meet the IRouter, so non-Koa libraries can also be used:

```ts
type HttpMethod =
  | 'get'
  | 'post'
  | 'patch'
  | 'options'
  | 'head'
  | 'put'
  | 'link'
  | 'unlink'
  | 'delete';

type IRouter = {
  get: (path, handler) => any
  post: (path, handler) => any
  // [key in HttpMethod]
  ...
};
```

## Usage

TODO

## TODO
- [ ] Provide abbreviations for commonly used content, for example, a query params: `pageSize: 'integer=10?[minimum=1]: the max length of response list'` means that:

```YAML
- in: query
  name: pageSize
  required: false
  schema:
    type: integer
    minimum: 1
  description: the max length of response list
```


## LICENSE

MIT
