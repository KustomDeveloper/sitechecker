import {RouterContext} from "https://deno.land/x/oak/mod.ts";
import {renderFileToString} from "https://deno.land/x/dejs@0.9.3/mod.ts";
import {client, createUser} from "./db.ts";
// import { create, verify, decode } from "https://deno.land/x/djwt@v2.2/mod.ts";

export const home = async (ctx: RouterContext) => {
  ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/index.ejs`, {});
}

export const register = async (ctx: RouterContext) => {
  ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/register.ejs`, {});
}

export const login = async (ctx: RouterContext) => {
  ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/login.ejs`, {});
}

export const protectedRoute = async (ctx: RouterContext) => {
  ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/protected.ejs`, {});
}

export const registerUser = async (ctx: RouterContext) => {
  try{
    const body = await ctx.request.body().value;
    const firstName = body.data.firstname;
    const lastName = body.data.lastname;
    const email = body.data.email;
    const pass = body.data.pass;

    //Check if email already exists
    await client.connect();
    const emailExists = await client.queryObject`
    SELECT user_email FROM users WHERE user_email = ${email};`;
    await client.end();

    if(emailExists.rows[0]) {
      ctx.response.body = { message: "Email already exists" };
      ctx.response.status = 400; //Bad Request

    } else {
      //Create new user
      createUser(client, firstName, lastName, email, pass);
      ctx.response.body = { message: "ok" };
      ctx.response.status = 200; //Success
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
    SELECT user_email FROM users WHERE user_email = ${email};`;

    if(emailExists.rows[0]) {

      //Get password from db
      const validPassword = await client.queryObject`
      SELECT password FROM users WHERE user_email = ${email};`;
      await client.end();

      const storedPass: any = validPassword.rows[0];
      const realPass = storedPass.password;

      if(storedPass) {
        if(pass === realPass) {
          ctx.response.body = { message: "ok" };
          ctx.response.status = 200; //Success
          console.log(200);
        } else {
          ctx.response.body = { message: "Incorrect email or password" };
          ctx.response.status = 401; //Unauthorized
          console.log("345")
        }

      } else {
        ctx.response.body = { message: "Incorrect email or password" };
        ctx.response.status = 401; //Unauthorized
        console.log("346")
      }
    
    } else {
      ctx.response.body = { message: "Incorrect email or password" };
      ctx.response.status = 401; //Unauthorized
      console.log("347")
    }

  } catch(err) {
    console.error(err);
  }
}

export const logout = async (ctx: RouterContext) => {
  ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/protected.ejs`, {});
}





// async function createToken() {
//   const jwt = await create({ 
//     alg: "HS512", 
//     typ: "JWT" 
//   }, { 
//     foo: "bar" 
//   }, "secret")
// } 


// export default routes;