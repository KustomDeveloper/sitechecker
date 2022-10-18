import {Context } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { renderFileToString } from "https://deno.land/x/dejs@0.9.3/mod.ts";
import { verify} from "https://deno.land/x/djwt@v2.7/mod.ts";
import { getCookies } from "https://deno.land/std@0.158.0/http/cookie.ts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";
import {key} from './routes.ts'

export async function authenticateUser(ctx: Context, next: any) {
  try {
    
    const jwt = getCookies( ctx.request.headers );
    const token: string = jwt.authorization || "";

    if(token != "" || token != null || token != undefined) {
        const payload = await verify(token, key); 
          if(payload) await next();
      } else {
        ctx.response.status = 401;
        ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/unauthorized.ejs`, {});
    }
    
  } catch(err) {
    console.error(err);
    ctx.response.status = 401;
    ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/unauthorized.ejs`, {});
  }

}
