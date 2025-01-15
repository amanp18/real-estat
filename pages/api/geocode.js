import axios from "axios";

export default async function handler(req, res) {
  const { locations } = req.body;
  const apiKey = process.env.POSITIONSTACK_API_KEY;
  const results = [];

  for (const location of locations) {
    const response = await axios.get(
      `http://api.positionstack.com/v1/forward`,
      {
        params: {
          access_key: apiKey,
          query: location,
        },
      }
    );
    const { data } = response;
    const coordinates = data?.data?.[0];
    results.push({
      location,
      lat: coordinates?.latitude,
      lng: coordinates?.longitude,
    });
  }

  res.status(200).json(results);
}
