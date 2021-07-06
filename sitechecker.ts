import { soxa } from "https://deno.land/x/soxa/mod.ts";
import { format } from "https://deno.land/std@0.91.0/datetime/mod.ts";
import { client } from "./db.ts";

export async function checkWebsite(url: string, id: number) {
  try {
    const result = await soxa.get(url);
    const status = await result.status;

    if (status === 200) {
      const websiteStatus: string = "Website is up"; 
      const currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

      //Add website up status
      await client.connect();
      const updateStatus = await client.queryObject`
      update websites set website_status=${websiteStatus},website_last_checked=${currentTime} where website_id=${id}`;
      await client.end();

    } else {
      const websiteStatus: string = "Website is down"; 
      const currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

      //Add website down status
      await client.connect();
      const updateStatus = await client.queryObject`
      update websites set website_status=${websiteStatus},website_last_checked=${currentTime} where website_id=${id}`;
      await client.end();

    }
    
  } catch(err) {
    // console.log(err);
    const websiteStatus: string = "Website is down"; 
    const currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    //Add website down status
    await client.connect();
    const updateStatus = await client.queryObject`
    update websites set website_status=${websiteStatus},website_last_checked=${currentTime} where website_id=${id}`;
    await client.end();

  }
}

export async function getAllWebsites() {
  try {
      await client.connect();

      //Get all websites
      const websites = await client.queryObject`SELECT * FROM websites`;

      const urls = await websites.rows;

      if(urls) {
        return urls;
        console.log(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
      } else { 
        console.log('No urls ' + format(new Date(), "yyyy-MM-dd HH:mm:ss"));
      }
      
  } catch(err) {
    console.log(err)
  } finally {
    await client.end();
  }
}


