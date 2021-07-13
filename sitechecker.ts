import { soxa } from "https://deno.land/x/soxa/mod.ts";
import { client } from "./db.ts";

export async function checkWebsite(url: string, id: number) {
  try {
    const result = await soxa.get(url);
    const status = await result.status;
    await client.connect();

    if (status === 200) {
      const websiteStatus: string = "Website is up"; 
      const currentTime = new Date().getTime();

      //Add website up status
      const updateStatus = await client.queryObject`
      update websites set website_status=${websiteStatus},website_last_checked=${currentTime},website_status_code=${status} where website_id=${id}`;
      await client.end();

    } else {
      const websiteStatus: string = "Website is down"; 
      const currentTime = new Date().getTime();

      //Add website down status
      const updateStatus = await client.queryObject`
      update websites set website_status=${websiteStatus},website_last_checked=${currentTime},website_status_code=${status} where website_id=${id}`;
      await client.end();
    }
    
  } catch(err) {
    const websiteStatus: string = "Website is down"; 
    const currentTime = new Date().getTime();
    const status = 500;

    //Add website down status
    await client.connect();
    const updateStatus = await client.queryObject`
    update websites set website_status=${websiteStatus},website_last_checked=${currentTime},website_status_code=${status} where website_id=${id}`;
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
        await client.end();
       
      } else { 
        console.log('No urls ' + new Date().getTime());
        await client.end();
      }
      
  } catch(err) {
    await client.end();
    console.log(err)
  } 
}


