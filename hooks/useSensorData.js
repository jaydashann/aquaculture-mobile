import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

export default function useSensorData(mode = "firebase") {
  const [sensorData, setSensorData] = useState([]);
  const [forecastData, setForecastData] = useState(null);

  const LOCAL_BASE = "http://192.168.100.7:5000";

  //---------------------------------------
  // 🔥 DEMO MODE: Random data generator
  //---------------------------------------
  const generateRandomData = () => {
    return {
      id: Date.now().toString(),
      ph: (6.5 + Math.random() * 2).toFixed(2), // 6.5–8.5
      temp: (24 + Math.random() * 6).toFixed(2), // 24–30°C
      turbidity: (1 + Math.random() * 5).toFixed(2), // 1–6 NTU
      tds: (100 + Math.random() * 300).toFixed(0), // 100–400 mg/L
      time: new Date().toLocaleTimeString(),
      rawTimestamp: Date.now(),
    };
  };

  //---------------------------------------
  // 🔥 Local Flask Fetch: Sensor
  //---------------------------------------
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
        time: new Date().toLocaleTimeString(),
        rawTimestamp: data.timestamp || Date.now(),
      };

      setSensorData((prev) => [...prev.slice(-19), entry]);
    } catch (err) {}
  };

  //---------------------------------------
  // 🔥 Local Flask Fetch: Forecast
  //---------------------------------------
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

  //---------------------------------------
  // 🔥 MAIN MODE HANDLER
  //---------------------------------------
  useEffect(() => {
    let interval;

    //--------------------------------------------------
    // 📡 DEMO MODE — generate random data every 3 sec
    //--------------------------------------------------
    if (mode === "demo") {
      console.log("🎨 DEMO MODE ACTIVATED");
      interval = setInterval(() => {
        setSensorData((prev) => [...prev.slice(-19), generateRandomData()]);
      }, 3000);
      return () => clearInterval(interval);
    }

    //--------------------------------------------------
    // 🌩 FIREBASE MODE
    //--------------------------------------------------
    if (mode === "firebase") {
      console.log("🔥 Firebase Mode Enabled");

      const sensorRef = ref(db, "sensor_data");
      const unsubscribe = onValue(sensorRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return setSensorData([]);

        let entries = Array.isArray(data)
          ? data.map((val, i) => ({
              id: i.toString(),
              ph: parseFloat(val.ph || 0).toFixed(2),
              temp: parseFloat(val.temperature || 0).toFixed(2),
              turbidity: parseFloat(val.turbidity || 0).toFixed(2),
              tds: parseFloat(val.tds || 0).toFixed(0),
              time: new Date().toLocaleTimeString(),
              rawTimestamp: val.timestamp || Date.now(),
            }))
          : Object.entries(data).map(([key, val]) => ({
              id: key,
              ph: parseFloat(val.ph || 0).toFixed(2),
              temp: parseFloat(val.temperature || 0).toFixed(2),
              turbidity: parseFloat(val.turbidity || 0).toFixed(2),
              tds: parseFloat(val.tds || 0).toFixed(0),
              time: new Date().toLocaleTimeString(),
              rawTimestamp: val.timestamp || Date.now(),
            }));

        entries.sort((a, b) => a.rawTimestamp - b.rawTimestamp);
        setSensorData(entries.slice(-20));
      });

      return () => unsubscribe();
    }

    //--------------------------------------------------
    // 🖥 LOCAL FLASK MODE
    //--------------------------------------------------
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

  //---------------------------------------
  return { sensorData, forecastData };
}
