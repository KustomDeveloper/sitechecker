import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { home, login, register, dashboard, registerUser, loginUser, addWebsite, deleteWebsite, logout } from "./routes.ts";
import { createTables, client } from "./db.ts";
import { authenticateUser } from "./authenticate.ts";
import { checkWebsite, getAllWebsites } from "./sitechecker.ts";
import { staticFileMiddleware } from "./staticFileMiddleware.ts";
import {cron} from 'https://deno.land/x/deno_cron/cron.ts';

const PORT = 8000;
const app = new Application(); 
const router = new Router();

//Routes
router
.get('/', home)
.get('/login', login)
.get('/register', register)
.get('/dashboard', authenticateUser, dashboard)

.post('/logout', logout)
.post('/login-user', loginUser)
.post('/register-user', registerUser)
.post('/add-website', addWebsite)

.delete('/delete-website', deleteWebsite)

//Create tables if not created
// createTables(client, "connected");

//Add routes
app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticFileMiddleware);

// (async () => {
//   await client.connect();
//   console.log(client);
//   await client.end();
// })()


//encryptPassword('testing');
console.log(`Server Running on port: ${PORT}`);



//Show errors that would otherwise be hidden 
app.addEventListener('error', event => {
  console.log(event.error);
})

// Run cron job every 5 minutes
cron('1 */5 * * * *', () => {
  //Check website status every 5 minutes
  (async () => {
    try {
      const websites:any = await getAllWebsites();
      if(websites) {
        for(let i=0; i < websites.length; i++) {
          let url:string = websites[i].website_url;
          let id:number = websites[i].website_id;

          if(url) {
            await checkWebsite(url, id);
          } else {
            console.log('error')
          }
        }
      }
    } catch(err) {
      console.error(err);
    }
    
  })();
  
})

//Start server
app.listen({port: PORT});