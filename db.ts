import { Client } from "https://deno.land/x/postgres/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

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
    CREATE TABLE IF NOT EXISTS websites (website_id SERIAL PRIMARY KEY, user_id integer, website_url varchar (100), website_status varchar (50), website_last_checked varchar (200))`;

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
    
    await client.end();

  } catch(err) {
     console.log(err);
  } 
}