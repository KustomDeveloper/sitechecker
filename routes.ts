import {Router} from "https://deno.land/x/oak/mod.ts";
import fetchData from "./data.ts";
import {client, create_user} from "./db.ts";

const router = new Router();

//Routes
router
.get('/', async ({ response } : { response: any } ) => {
  const body = await Deno.readTextFile(Deno.cwd() + './views/index.html')
  response.body = body;
})
.get('/register', async ({ response } : { response: any } ) => {
  const body = await Deno.readTextFile(Deno.cwd() + './views/register.html')
  response.body = body;
})
.get('/3', async ({ response } : { response: any } ) => {
  response.body = "Hello World 3!";
})

//Post
.post('/register-user', async ({ response } : { response: any } ) => {
   console.log(typeof response);
  //create_user(client, "Dan", "Jones", "Danr@gmail.com", ["http://dan.com"]);
})

export default router;