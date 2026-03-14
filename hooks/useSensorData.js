import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";


export default function useSensorData(mode = "firebase") {
 const [sensorData, setSensorData] = useState([]);
 const [forecastData, setForecastData] = useState(null);


 const LOCAL_BASE = "http://192.168.100.7:5000";


 // demo generator
 const generateRandomData = () => {
   const turb = (1 + Math.random() * 160).toFixed(2);
   const tdsVal = (100 + Math.random() * 9500).toFixed(0);


   const isAeratorOn = parseFloat(turb) > 100 && parseFloat(tdsVal) > 7000;


   return {
     id: Date.now().toString(),
     ph: (6.5 + Math.random() * 2).toFixed(2),
     temp: (24 + Math.random() * 6).toFixed(2),
     turbidity: turb,
     tds: tdsVal,
     aerator: isAeratorOn ? "ON" : "OFF",
     time: new Date().toLocaleTimeString(),
     rawTimestamp: Date.now(),
   };
 };


 // local fetch (last 20 readings)
    const fetchLocalData = async () => {
      try {
        const res = await fetch(`${LOCAL_BASE}/history`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (!data || data.error) return;

        const entries = data.map((d) => ({
          id: Date.now().toString() + Math.random(), // unique key
          ph: parseFloat(d.ph || 0).toFixed(2),
          temp: parseFloat(d.temperature || 0).toFixed(2),
          turbidity: parseFloat(d.turbidity || 0).toFixed(2),
          tds: parseFloat(d.tds || 0).toFixed(0),
          aerator: d.aerator_status || "OFF",
          time: new Date(d.timestamp).toLocaleTimeString(),
          rawTimestamp: new Date(d.timestamp).getTime(),
        }));

        const sortedEntries = entries.sort((a, b) => a.rawTimestamp - b.rawTimestamp);

        setSensorData(sortedEntries.slice(-20));

      } catch (err) {
        console.log("Local fetch failed:", err.message);
      }
    };


 // fetch forecast
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


 // main mode
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
         time: new Date(val.timestamp).toLocaleTimeString(),
         rawTimestamp: new Date(val.timestamp).getTime(),
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

