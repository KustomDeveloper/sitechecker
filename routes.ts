import { RouterContext } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs@0.9.3/mod.ts";
import { client, createUser } from "./db.ts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";
import { create, decode, verify } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { setCookie, getCookies, deleteCookie } from "https://deno.land/std@0.159.0/http/cookie.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

//JWT key
export const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"]
);

export const rawKey = await crypto.subtle.exportKey('raw', key);

/* 
* Controllers
*/ 
export const home = async (ctx: RouterContext) => {
  ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/index.ejs`, {});
}

export const register = async (ctx: RouterContext) => {
  ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/register.ejs`, {});
}

export const login = async (ctx: RouterContext) => {
  ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/login.ejs`, {});
}

export const dashboard = async (ctx: RouterContext) => {
  try {
    const jwt = getCookies( ctx.request.headers );

    const token: string = jwt.authorization || "";  

    //Decode jwt token
    const [header, payload, signature ] = decode(token);

    //Define object
    const data: any = payload as object;

    //Get user id
    const userId = data[Object.keys(data)[0]]

    //Connect and get website urls
    await client.connect();

    const websites = await client.queryObject`
      SELECT * FROM websites WHERE user_id = ${userId}`;

    await client.end();

    const urls = await websites.rows;

    ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/dashboard.ejs`, {urls});
   
    } catch(err) {
      console.error(err)
    }
}

export const registerUser = async (ctx: RouterContext) => {
  try{
    const body = await ctx.request.body().value;
    const firstName = body.data.firstname;
    const lastName = body.data.lastname;
    const email = body.data.email;
    const pass = body.data.pass;

    if(firstName !== '' || lastName !== '' || email !== '' || pass !== '') {
      //Force password length
      if(pass.length >= 7) {
            //Check if email already exists
            await client.connect();
            const emailExists = await client.queryObject`
            SELECT user_email FROM users WHERE user_email = ${email}`;
            await client.end();

            if(emailExists.rows[0]) {
              ctx.response.body = { message: "Email already exists" };
              ctx.response.status = 400; //Bad Request

            } else {
              //Encrypt Password
              const hashedPass = await bcrypt.hash(pass);

              //Create new user
              createUser(client, firstName, lastName, email, hashedPass);
              ctx.response.body = { message: "ok" };
              ctx.response.status = 200; //Success
            } 
      } else {
        ctx.response.body = { message: "Password must be at least 7 characters" };
        ctx.response.status = 400; //Bad request
      }

    } else {
      ctx.response.body = { message: "Registration Error" };
      ctx.response.status = 400; //Bad request
    }

  } catch(err) {
    console.error(err);
    ctx.response.body = { message: "Registration Error" };
    ctx.response.status = 400; //Bad request
  }
}

export const loginUser = async (ctx: RouterContext) => {
  try {
    const body = await ctx.request.body().value;
    const email = body.data.email;
    const pass = body.data.pass;

    //Check if email exists
    await client.connect();
    const emailExists = await client.queryObject`
    SELECT user_email FROM users WHERE user_email = ${email}`;

    if(emailExists.rows[0]) {
      //Get password from database
      const validPassword = await client.queryObject`
      SELECT password FROM users WHERE user_email = ${email}`;
      
      //Get object containing password
      const storedPass: any = validPassword.rows[0];
    
      if(storedPass) {
        //Get password from object
        const realPass = storedPass.password;

        const comparePass = await bcrypt.compare(pass, realPass);

        if(comparePass) {
          //Get user id
          const getId = await client.queryObject`
          SELECT user_id FROM users WHERE user_email = ${email}`;

          const userId: any = getId.rows[0];

          //Create token
          const jwt = await create({ alg: "HS512", typ: "JWT" }, { user_id: userId.user_id }, key);

          //Set http only cookie with jwt token 
          setCookie(ctx.response.headers, { name: "authorization", value: jwt }); 

          //close db connection
          await client.end();

          //Send valid response
          ctx.response.status = 200; //Success

          ctx.response.body = { 
            message: "ok",
          };

        } else {
          //close db connection
          await client.end();

          ctx.response.body = { message: "Incorrect email or password" };
          ctx.response.status = 401; //Unauthorized
        }

      } else {
        //close db connection
        await client.end();

        ctx.response.body = { message: "Incorrect email or password" };
        ctx.response.status = 401; //Unauthorized
      }
    
    } else {
      //close db connection
      await client.end();

      ctx.response.body = { message: "Incorrect email or password" };
      ctx.response.status = 401; //Unauthorized
    }

  } catch(err) {
    console.error(err);
  }
}

export const logout = async (ctx: RouterContext) => {
  try {
    const body = await ctx.request.body().value;
    const logout = body.data.logout;

    if(logout) {
      deleteCookie(ctx.response.headers, "authorization"); 

      //Send ok response
      ctx.response.body = { message: "ok" };
      ctx.response.status = 200; //ok
    } 

  } catch(err) {
    console.error(err);
  } 
}

export const addWebsite = async (ctx: RouterContext) => {
  try{
    const body = await ctx.request.body().value;
    const website = body.data.website;

    if(website) {

      //Get cookie values
      const jwt = getCookies(ctx.request.headers);
      const token: string = jwt.authorization || ""; 
      
      //Decode jwt token
      const [header, payload, signature] = decode(token);

      //Define object
      const data: any = payload as object;

      //Get user id
      const userId = data[Object.keys(data)[0]]
      
      //Get current date/time
      const currentTime = new Date().getTime();

      await client.connect();
      
      //Add website to db
      const addUrl = await client.queryObject`INSERT INTO websites (user_id, website_url, website_status, website_last_checked ) VALUES (${userId}, ${website}, 'unknown', ${currentTime})`;

      //close db connection
      await client.end();

      ctx.response.body = { message: "ok" };
      ctx.response.status = 200; //ok

    }

  } catch(err) {
    ctx.response.body = { message: "error" };
    ctx.response.status = 500; //err
  }

}
export const deleteWebsite = async (ctx: RouterContext) => {
  try{
    const body = await ctx.request.body().value;
    const website_id = body.data.website_id;

    if(website_id) {
      //Get cookie values
      const jwt = getCookies(ctx.request.headers);
      const token: string = jwt.authorization || ""; 
      
      //Decode jwt token
      const [header, payload, signature] = decode(token);

      // console.log(header, payload, signature);

      //Define object
      const data: any = payload as object;

      //Get user id
      const user_id = data[Object.keys(data)[0]];

      await client.connect();
      
      //Delete website from DB
      const deleteWebsite = await client.queryObject`DELETE FROM websites where website_id = ${website_id} AND user_id = ${user_id}`;


        if(deleteWebsite)  {
          await client.end();
          ctx.response.body = { message: "ok" };
          ctx.response.status = 200; //ok

        } else {
          await client.end();
          ctx.response.body = { message: "You must be authorized to delete the website" };
          ctx.response.status = 401; //err
        }
        
    } 

  } catch(err) {
    ctx.response.body = { message: "You must be authorized to delete the website" };
    ctx.response.status = 401; //err
  }

}