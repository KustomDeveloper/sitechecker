import {Application, Router} from "https://deno.land/x/oak/mod.ts";
import {
  home, 
  login, 
  register, 
  protectedRoute, 
  registerUser, 
  loginUser, 
  logout
} from "./routes.ts";
import {createTables, client, createUser} from "./db.ts";
import encryptPassword from "./auth.ts";
import checkWebsite from "./sitechecker.ts";

const PORT = 8000;
const app = new Application(); 

const router = new Router();

//Routes
router
.get('/', home)
.get('/login', login)
.get('/register', register)
.get('/protected', protectedRoute)
.get('/logout', logout)

.post('/login-user', loginUser)
.post('/register-user', registerUser)


//Create tables
// createTables(client, "connected");

//Create user
createUser(client, "Michael", "Hicks", "kustomdesigner@gmail.com", "jklasjdklasjdljasld");

//Website checker
//checkWebsite('http://kustomdesigner.com');

//Add routes
app.use(router.routes());
app.use(router.allowedMethods());

//encryptPassword('testing');
console.log(`Server Running on port: ${PORT}`);

//Show errors that would otherwise be hidden 
app.addEventListener('error', event => {
  console.log(event.error);
})

//Start server
app.listen({port: PORT});