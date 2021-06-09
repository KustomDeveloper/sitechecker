import {Application, Router} from "https://deno.land/x/oak/mod.ts";
// import router from "./routes.ts";
import db_connect from "./db.ts";
import encryptPassword from "./auth.ts";

// import {
//   viewEngine,
//   engineFactory,
//   adapterFactory,
// } from "https://deno.land/x/view_engine/mod.ts";

const PORT = 8000;

const app = new Application(); 
const router = new Router();

//Connect to db
db_connect();

//Routes
router
.get('/', async (ctx) => {
  const body = await Deno.readTextFile(Deno.cwd() + './views/index.html')
  ctx.response.body = body;
})
.get('/2', (ctx) => {
  ctx.response.body = "Hello World 2!";
})
.get('/3', (ctx) => {
  ctx.response.body = "Hello World 3!";
})

app.use(router.routes());
app.use(router.allowedMethods());


//encryptPassword('testing');

console.log(`Server Running on port: ${PORT}`);

app.listen({port: PORT});
