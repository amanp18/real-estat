import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [cityn, setcity] = useState();
  const handleinputchange = (e) => {
    setcity(e.target.value);
  };
  const handlenavigate = () => {
    if (cityn) {
      router.push(`/city/${cityn}`);
    } else {
      alert("please enter a city name.");
    }
  };
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Enter City Name</h2>
        <input
          type="text"
          value={cityn}
          onChange={handleinputchange}
          placeholder="City Name"
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handlenavigate}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
