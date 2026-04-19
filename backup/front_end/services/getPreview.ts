"use server";
import ogs from "open-graph-scraper";
import axios from 'axios';
import * as cheerio from 'cheerio';



export const getWebsitePreview = async (url: string) => {

  //cheerio
  /* try {

    console.log("Send Request for get Website Data");
    const targetUrl = 'https://www.ibm.com/think/topics/prompt-engineering'; // Replace with your target URL
    const { data: htmlContent } = await axios.get(url);
    const $ = cheerio.load(htmlContent);

    //console.log("\n\n[Response]: ", $);
    const title =
      $('meta[property="og:title"]').attr("content") || $("title").text();
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content");
    const image =
      $('meta[property="og:image"]').attr("content") ||
      $('link[rel="icon"]').attr("href");

    const passUrlData = {
      image: image,
      title: title,
      url,
    };

    console.log("\n\n[WEBSITE DATA]: ", passUrlData)
    return passUrlData;

  } catch (error) {
    console.log("Some issue in get preview package Error: ", error)
    throw error;
  } */


    //OPEN GRAPH SCRAPER
  try {
   
    if (!url || typeof url !== "string") {
        return "Invalid URL";
    }

    //const options = { url, timeout: 20000 };
    const options = { url, timeout: 2000 };
    const { result }:any = await ogs(options);

    const passUrlData = {
      image: result.ogImage?.[0]?.url,
      favicon: result.favicon,
      url,
    };

    console.log("\n\n[WEBSITE DATA]: ", passUrlData)
    return passUrlData;
    
  } catch (error) {

    const passUrlData = {
      image: "https://cdn.dribbble.com/userupload/6508149/file/original-c4197a5bf25a4356aa2bac6f82073eb2.jpg?resize=1504x1128&vertical=center",
      favicon: "http://localhost:3000/favicon.ico",
      url,
    };

    return passUrlData;
    console.log("Some issue in get preview package Error: ", error)
    throw error;
  }

}