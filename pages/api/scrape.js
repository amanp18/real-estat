import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  const { city } = req.query;
  const scrapeUrl = `https://www.magicbricks.com/new-projects-${city}`;

  try {
    console.log(`Scraping URL: ${scrapeUrl}`);
    const response = await axios.get(scrapeUrl);
    const html = response.data; // Ensure you are accessing the data field

    if (!html) {
      throw new Error("HTML content is empty");
    }

    const $ = cheerio.load(html); // Ensure HTML is passed correctly
    const projects = [];

    // Example scraping logic
    $(".mghome__prjblk__txtsec").each((index, element) => {
      const projectName = $(element).find(".mghome__prjblk__prjname").text();
      const location = $(element).find(".mghome__prjblk__locname").text();
      const priceRange = $(element).find(".mghome__prjblk__price").text();
      // const builderName = $(element).find(".builder-name").text().trim();

      projects.push({ projectName, location, priceRange });
    });

    if (projects.length === 0) {
      throw new Error("No projects found during scraping");
    }

    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error during scraping:", error.message);
    res.status(500).json({ error: error.message });
  }
}
