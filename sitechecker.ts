import { soxa } from 'https://deno.land/x/soxa/mod.ts';
import { format } from "https://deno.land/std@0.91.0/datetime/mod.ts";


async function checkWebsite(url: string) {
  try{
    const result = await soxa.get(url);
    if (result.status == 200) console.log('Website is up!') 
    
    // current date & time in YYYY-MM-DD hh:mm:ss format
    const currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    console.log(currentTime);

    } catch {
      console.log('Website is down!')
    }
}

export default checkWebsite;