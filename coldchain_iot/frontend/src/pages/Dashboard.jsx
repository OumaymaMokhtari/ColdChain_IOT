import { useEffect, useState } from "react";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import TemperatureChart from "../components/TemperatureChart";
import HumidityChart from "../components/HumidityChart";

function Dashboard() {
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      api.get("mesures/all/")
        .then(res => setMeasurements(res.data))
        .catch(err => console.error(err));
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("MEASUREMENTS:", measurements);
  }, [measurements]);

  const latest = measurements[0];

  return (
    <div style={{ padding: "30px" }}>
      <h1>Cold Chain Dashboard</h1>

      {latest && (
        <div style={{ display: "flex", gap: "20px" }}>
          <StatCard title="Température" value={latest.temperature} unit="°C" />
          <StatCard title="Humidité" value={latest.humidity} unit="%" />
          <StatCard title="Mesures" value={measurements.length} />
        </div>
      )}

      {measurements.length > 0 && (
        <>
          <h2 style={{ marginTop: "40px" }}>Température dans le temps</h2>
          <TemperatureChart measurements={measurements.slice().reverse()} />

          <h2 style={{ marginTop: "40px" }}>Humidité dans le temps</h2>
          <HumidityChart measurements={measurements.slice().reverse()} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
