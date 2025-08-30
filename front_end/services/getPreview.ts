"use server";
import ogs from "open-graph-scraper";


export const getWebsitePreview = async (url: string) => {

    if (!url || typeof url !== "string") {
        return "Invalid URL";
    }

    const options = { url };
    const { result }:any = await ogs(options);

    const passUrlData = {
      image: result.ogImage?.[0]?.url,
      favicon: result.favicon,
      url,
    };

    return passUrlData;

}