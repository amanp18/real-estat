import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import axios from "axios";

const Map = dynamic(() => import("../../components/map"), { ssr: false });

export default function City() {
  const router = useRouter();
  const ct = router.query;

  const citynms = ct.cityname;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!citynms) return;
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get(`/api/scrape?city=${citynms}`);
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [citynms]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Projects in {citynms}</h1>

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
