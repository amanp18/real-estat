import axios from "axios";
import cheerio from "cheerio";

export default async function handler(req, res) {
  const { city } = req.query;
  const scrapeUrl = `https://www.magicbricks.com/new-projects-${city}`;

  try {
    console.log(`Scraping URL: ${scrapeUrl}`);

    const response = await axios.get(scrapeUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const html = response.data;

    if (!html) {
      throw new Error("HTML content is empty");
    }

    const $ = cheerio.load(html);
    const projects = [];

    // Find all project cards
    $(".projdis__prjcard").each((index, element) => {
      try {
        // Extract image URL
        const imageUrl =
          $(element).find(".mghome__prjblk__imgsec__img").attr("src") || "";

        // Extract project details
        const projectSection = $(element).find(".mghome__prjblk__txtsec");
        const projectName = projectSection
          .find(".mghome__prjblk__prjname")
          .text()
          .trim();
        const location = projectSection
          .find(".mghome__prjblk__locname")
          .text()
          .trim();
        const priceRange = projectSection
          .find(".mghome__prjblk__price")
          .text()
          .trim();

        // Extract BHK and possession info
        const bhkInfo = projectSection
          .find(".mghome__prjblk__bhk")
          .text()
          .trim();

        // Extract project URL
        const projectUrl =
          projectSection.find(".mghome__prjblk__prjname").attr("href") || "";

        // Extract amenities count (if available)
        const amenitiesText = $(element)
          .find(
            ".mghome__linkblks__card--amenities .mghome__linkblks__card__txt"
          )
          .text()
          .trim();
        const amenitiesCount =
          amenitiesText.match(/All (\d+) Amenities/)?.[1] || "0";

        // Only push if we have at least the basic information
        if (projectName || location || priceRange) {
          projects.push({
            projectName,
            location,
            priceRange,
            bhkInfo,
            imageUrl,
            projectUrl,
            amenitiesCount: parseInt(amenitiesCount),
            scrapedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error(`Error processing project ${index}:`, err);
        // Continue with next project instead of failing completely
      }
    });

    if (projects.length === 0) {
      throw new Error("No projects found during scraping");
    }

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
