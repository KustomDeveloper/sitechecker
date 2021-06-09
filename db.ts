import { Client } from "https://deno.land/x/postgres/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

async function db_connect() {
  try {
    //DB Creds
    const client = new Client({
      database: Deno.env.get('DB'),
      user: Deno.env.get('DB_USER'),
      hostname: Deno.env.get('HOSTNAME'),
      password: Deno.env.get('PASSWORD'),
      port: Deno.env.get('DB_PORT')
    }) 

    //Connect to database
    await client.connect();

    //Create table on database if not created yet
    const result = await client.queryObject`
    CREATE TABLE IF NOT EXISTS players (player_id SERIAL PRIMARY KEY, first_name varchar (50), last_name VARCHAR (50))`;

    console.log("connected to elephantSQL db");

    await client.end();
    
  } catch(err) {
   console.log(err);
  }
}

export default db_connect;

