import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

export default function useSensorData(mode = "firebase") {
  const [sensorData, setSensorData] = useState([]);

  const fetchLocalData = async () => {
    try {
      const res = await fetch("http://192.168.254.185:5000/latest", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data && !data.error) {
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
      } else {
        console.warn("⚠️ Invalid data format:", data);
      }
    } catch (err) {
      console.error("❌ Local fetch failed:", err.message || err);
    }
  };

  useEffect(() => {
    let interval;
    if (mode === "firebase") {
      console.log("🔥 Using Firebase mode");
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
    } else {
      console.log("📡 Using Local Flask mode");
      fetchLocalData(); // First fetch
      interval = setInterval(fetchLocalData, 3000); // Poll every 3s
      return () => clearInterval(interval);
    }
  }, [mode]); // ✅ Make sure 'mode' is in the dependency array

  return sensorData;
}
