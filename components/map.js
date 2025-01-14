import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function Map({ projects }) {
  return (
    <MapContainer
      center={[20, 78]}
      zoom={5}
      style={{ height: "500px", width: "100%" }}
    >
      {/* 1. Add a tile layer for the map */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 2. Map over projects and create markers */}
      {projects.map((project, index) => {
        if (!project.lat || !project.lng) return null; // Skip projects without coordinates.
        return (
          <Marker key={index} position={[project.lat, project.lng]}>
            <Popup>
              <strong>{project.projectName}</strong>
              <br />
              {project.builderName}
              <br />
              {project.priceRange}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
