import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { home, login, register, dashboard, registerUser, loginUser, logout } from "./routes.ts";
import { createTables, client } from "./db.ts";
import { authenticateUser } from "./authenticate.ts";
import encryptPassword from "./auth.ts";
import checkWebsite from "./sitechecker.ts";
import { staticFileMiddleware } from "./staticFileMiddleware.ts";

const PORT = 8000;
const app = new Application(); 

const router = new Router();

//Routes
router
// .get('/css/:path+', async (ctx) => {
//   await send(ctx, ctx.request.url.pathname, {
//     root: Deno.cwd(),
//   })
// })
.get('/', home)
.get('/login', login)
.get('/register', register)
.get('/dashboard', authenticateUser, dashboard)
.get('/logout', logout)

.post('/login-user', loginUser)
.post('/register-user', registerUser, ()=> {

})

//Create tables
// createTables(client, "connected");

//Website checker
//checkWebsite('http://kustomdesigner.com');

//Add routes
app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticFileMiddleware);

//encryptPassword('testing');
console.log(`Server Running on port: ${PORT}`);

//Show errors that would otherwise be hidden 
app.addEventListener('error', event => {
  console.log(event.error);
})

//Start server
app.listen({port: PORT});