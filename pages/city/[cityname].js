import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import axios from "axios";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function City() {
  const router = useRouter();
  const { cityName } = router.query;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cityName) return;
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get(`/api/scrape?city=${cityName}`);
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [cityName]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Projects in {cityName}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <ul>
            {projects.map((project, index) => (
              <li key={index}>{project.projectName}</li>
            ))}
          </ul>
          <Map projects={projects} />
        </div>
      )}
    </div>
  );
}
