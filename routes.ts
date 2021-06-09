import {Router} from "https://deno.land/x/oak/mod.ts";

const router = new Router;

// Define main routes
router
.get('/', (ctx) => {
  ctx.render('../frontend/index.ejs');
})
.get('/2', (ctx) => {
  ctx.response.body = "Hello World 2!";
})
.get('/3', (ctx) => {
  ctx.response.body = "Hello World 3!";
})

export default router;