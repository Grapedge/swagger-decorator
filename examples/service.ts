import { Context } from 'koa';
import { Route, Controller } from '../src/index';

@Controller()
export class UserService {
  @Route({
    route: 'post /login',
    responses: {},
  })
  async login(ctx: Context) {
    ctx.body = 'success';
  }
}
