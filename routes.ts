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

    console.log(firstName, lastName, email, pass);

    createUser(client, firstName, lastName, email, pass);
  } catch(err) {
    console.error(err);
  }
}

export const loginUser = async (ctx: RouterContext, response: any) => {
    const body = await ctx.request.body().value;
    const email = body.data.email;
    const pass = body.data.pass;

    console.log(email, pass);
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