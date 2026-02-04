import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

export default function useSensorData(mode = "firebase") {
  const [sensorData, setSensorData] = useState([]);
  const [forecastData, setForecastData] = useState(null);

  const LOCAL_BASE = "http://192.168.100.7:5000";

  // --- 1. Modified Demo Generator ---
  const generateRandomData = () => {
    const turb = (1 + Math.random() * 160).toFixed(2); // Higher range to simulate alerts
    const tdsVal = (100 + Math.random() * 9500).toFixed(0);

    // Simulate the Pi's logic: if both are high, Aerator is "ON"
    const isAeratorOn = parseFloat(turb) > 100 && parseFloat(tdsVal) > 7000;

    return {
      id: Date.now().toString(),
      ph: (6.5 + Math.random() * 2).toFixed(2),
      temp: (24 + Math.random() * 6).toFixed(2),
      turbidity: turb,
      tds: tdsVal,
      aerator: isAeratorOn ? "ON" : "OFF", // Added field
      time: new Date().toLocaleTimeString(),
      rawTimestamp: Date.now(),
    };
  };

  // --- 2. Modified Local Fetch ---
  const fetchLocalData = async () => {
    try {
      const res = await fetch(`${LOCAL_BASE}/latest`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (!data || data.error) return;

      const entry = {
        id: Date.now().toString(),
        ph: parseFloat(data.ph || 0).toFixed(2),
        temp: parseFloat(data.temperature || 0).toFixed(2),
        turbidity: parseFloat(data.turbidity || 0).toFixed(2),
        tds: parseFloat(data.tds || 0).toFixed(0),
        aerator: data.aerator_status || "OFF",
        time: new Date().toLocaleTimeString(),
        rawTimestamp: data.timestamp || Date.now(),
      };

      setSensorData((prev) => [...prev.slice(-19), entry]);
    } catch (err) {}
  };

  const fetchForecast = async () => {
    try {
      const res = await fetch(`${LOCAL_BASE}/forecast`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (!data || data.error) return;

      const forecast = {
        ph: parseFloat(data.predicted_ph || 0).toFixed(2),
        temp: parseFloat(data.predicted_temperature || 0).toFixed(2),
        turbidity: parseFloat(data.predicted_turbidity || 0).toFixed(2),
        tds: parseFloat(data.predicted_tds || 0).toFixed(0),
        timestamp: data.timestamp,
      };

      setForecastData(forecast);
    } catch (err) {}
  };

  // --- 3. Main Mode Handler ---
  useEffect(() => {
    let interval;

    if (mode === "demo") {
      console.log("🎨 DEMO MODE ACTIVATED");
      interval = setInterval(() => {
        setSensorData((prev) => [...prev.slice(-19), generateRandomData()]);
      }, 3000);
      return () => clearInterval(interval);
    }

    if (mode === "firebase") {
      console.log("🔥 Firebase Mode Enabled");

      const sensorRef = ref(db, "sensor_data");
      const unsubscribe = onValue(sensorRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return setSensorData([]);

        const mapEntry = (val, key) => ({
          id: key.toString(),
          ph: parseFloat(val.ph || 0).toFixed(2),
          temp: parseFloat(val.temperature || 0).toFixed(2),
          turbidity: parseFloat(val.turbidity || 0).toFixed(2),
          tds: parseFloat(val.tds || 0).toFixed(0),
          aerator: val.aerator_status || "OFF",
          time: new Date().toLocaleTimeString(),
          rawTimestamp: val.timestamp || Date.now(),
        });

        let entries = Array.isArray(data)
          ? data.map((val, i) => mapEntry(val, i))
          : Object.entries(data).map(([key, val]) => mapEntry(val, key));

        entries.sort((a, b) => a.rawTimestamp - b.rawTimestamp);
        setSensorData(entries.slice(-20));
      });

      return () => unsubscribe();
    }

    if (mode === "local") {
      console.log("🖥 Local Flask Mode Enabled");
      fetchLocalData();
      fetchForecast();

      interval = setInterval(() => {
        fetchLocalData();
        fetchForecast();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [mode]);

  return { sensorData, forecastData };
}