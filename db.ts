import { Client } from "https://deno.land/x/postgres/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { format } from "https://deno.land/std@0.91.0/datetime/mod.ts";

//DB Creds
export var client = new Client({
  database: Deno.env.get('DB'),
  user: Deno.env.get('DB_USER'),
  hostname: Deno.env.get('HOSTNAME'),
  password: Deno.env.get('PASSWORD'),
  port: Deno.env.get('DB_PORT')
}) 

//Create Tables
export async function createTables(client: any, msg: any) {
  try {
    //Connect to database
    await client.connect();

    if(msg != null && typeof msg == "string") console.log(msg);
    
    //Create users table on database if not created yet
    const users_table = await client.queryObject`
    CREATE TABLE IF NOT EXISTS users (user_id SERIAL PRIMARY KEY, first_name varchar (50), last_name varchar (50), user_email varchar (50), password varchar (35))`;

    //Create websites table on database if not created yet
    const websites_table = await client.queryObject`
    CREATE TABLE IF NOT EXISTS websites (user_id integer, website_url text[], website_status varchar (50), website_last_checked varchar (200))`;

    await client.end();
    
  } catch(err) {
   console.log(err);
  }
}

//Create User
export async function createUser(client:any, first: string, last: string, email: string, password: string) {
  try{
    //Connect to database
    await client.connect();

    const addUser = await client.queryObject`
    INSERT INTO users (first_name, last_name, user_email, password) VALUES (${first}, ${last}, ${email}, ${password})`;

      //Get user id
      const getId = await client.queryObject`
      SELECT user_id FROM users WHERE user_email = ${email};`;

      const currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const url = [""];

      //Add user_id to website table
      // const addUserId = await client.queryObject`
      // INSERT INTO websites (user_id, website_url, website_status, website_last_checked) VALUES (${getId.rows[0].user_id}, ${url}, 'Website is up!', ${currentTime})`;
    
      await client.end();

  } catch(err) {
     console.log(err);
  } 
}