import {Application, send} from "https://deno.land/x/oak/mod.ts";
import router from "./routes.ts";
import {createTables, client, createUser} from "./db.ts";
import encryptPassword from "./auth.ts";
import checkWebsite from "./sitechecker.ts";

const PORT = 8000;
const app = new Application(); 

//Create tables
// createTables(client, "connected");

//Create user
createUser(client, "Johnny", "Appleseed", "jappleseed5@gmail.com");

//Website checker
//checkWebsite('http://kustomdesigner.com');

//Add routes
app.use(router.routes());
app.use(router.allowedMethods());

//encryptPassword('testing');
//console.log(`Server Running on port: ${PORT}`);

//Start server
app.listen({port: PORT});
