import swagger from '../src/index';
import Koa from 'koa';

const app = new Koa();

swagger.mapRoutes('./');

app.use((ctx) => (ctx.body = swagger.getJson()));
app.listen(3000);
