import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

//bit.io DB
const config = Deno.env.get('DB_CONNECTION_STRING');
export const client = new Client(config);

//Create Tables
export async function createTables(client: any, msg: any) {
  try {

    if(msg != null && typeof msg == "string") console.log(msg);

    //Create users table on database if not created yet
    await client.connect();
    
    const users_table = await client.queryObject`
    CREATE TABLE IF NOT EXISTS users (user_id SERIAL PRIMARY KEY, first_name varchar (50), last_name varchar (50), user_email varchar (50), password varchar (200))`;

    //Create websites table on database if not created yet
    const websites_table = await client.queryObject`
    CREATE TABLE IF NOT EXISTS websites (website_id SERIAL PRIMARY KEY, user_id integer, website_url varchar (100), website_status varchar (50), website_last_checked varchar (200), website_status_code varchar (50))`;

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