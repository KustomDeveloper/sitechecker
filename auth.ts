import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.2/mod.ts";

async function encryptPassword(password: string) {
  const hash = await bcrypt.hash(password);
  console.log(hash);

  let comparison = await bcrypt.compare(password, hash);
  console.log(comparison);
}

export default encryptPassword;