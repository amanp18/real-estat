import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  const { city } = req.query;
  const url = `https://www.magicbricks.com/new-projects-${city}`;
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const projects = [];

    $('.mb-project-card').each((_, el) => {
      const projectName = $(el).find('.project-title').text().trim();
      const location = $(el).find('.project-location').text().trim();
      const priceRange = $(el).find('.price-range').text().trim();
      const builderName = $(el).find('.builder-name').text().trim();
      projects.push({ projectName, location, priceRange, builderName });
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error scraping data' });
  }
}
