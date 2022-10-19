import { Application, Router, send } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { home, login, register, dashboard, registerUser, loginUser, addWebsite, deleteWebsite, logout } from "./routes.ts";
import { createTables, client } from "./db.ts";
import { authenticateUser } from "./authenticate.ts";
import { checkWebsite, getAllWebsites } from "./sitechecker.ts";
import { staticFileMiddleware } from "./staticFileMiddleware.ts";
import { cron } from 'https://deno.land/x/deno_cron@v1.0.0/cron.ts';
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

const PORT = Deno.env.get('PORT');
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

// Create tables if not created
createTables(client, "connected");

//Add routes
app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticFileMiddleware);

console.log(`Server Running on port: ${PORT}`);

//Show errors that would otherwise be hidden 
app.addEventListener('error', event => {
  console.error(event.error);
})

// Run cron job every 5 minutes
cron('1 */5 * * * *', () => {
  //Check website status every 5 minutes
  (async () => {
    try {
      const beforeTime = new Date().getTime();
      const websites:any = await getAllWebsites();

      if(websites) {
        for(let i = 0; i < websites.length; i++) {
          const url:string = websites[i].website_url;
          const id:number = websites[i].website_id;

          if(url) {
            await checkWebsite(url, id);

            // Check sitecheck time
            if(i === websites.length - 1) {
              const afterTime = new Date().getTime();
              const finalTime = afterTime - beforeTime;
              const seconds = finalTime / 1000;

              console.log(`Finished check in: ${seconds} seconds`);
            }

          } else {
            console.error('cron job error')
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