import { useEffect } from "react";
import { useState } from "react";

function App() {
  const [arrivalInfo, setArrivalInfo] = useState({ services: [], bus_stop_id: "" });
  const [loading, setLoading] = useState(false);

  const options = [
    "18141",
    "18131",
  ];

  const onOptionChangeHandler = (event) => {
    setArrivalInfo({ ...arrivalInfo, bus_stop_id: event.target.value });
  };

  const fetchArrivalData = async () => {
    const response = await fetch(`https://sg-bus-arrival.sigma-schoolsc1.repl.co/?id=${arrivalInfo.bus_stop_id}`);
    const data = await response.json();
    setArrivalInfo(data);
    setLoading(false);
  }

  useEffect(() => {
    if (arrivalInfo.bus_stop_id) {
      setLoading(true);
      fetchArrivalData();
      const timerId = setInterval(() => {
        console.log("fetching bus data");
        fetchArrivalData();
      }, 5000); // Refreshes every 5 seconds

      // Cleanup function to clear the interval
      return () => clearInterval(timerId);
    }

  }, [arrivalInfo.bus_stop_id]);

  return (
    <div>
      <h1>Bus Arrival Times</h1>
      <select onChange={onOptionChangeHandler}>
        <option value="">Select a Bus Stop ID</option>

        {options.map((option, index) => (
          <option key={index}>
            {option}
          </option>
        ))}
      </select>
      {loading && <p>Loading...</p>}
      <h2>Bus Stop ID {arrivalInfo.bus_stop_id}</h2>
      <ul>
        {arrivalInfo.services.map((arrival, index) => (
          <li key={index}>
            Bus {arrival.bus_no} {arrival.next_bus_mins <= 0 ? "arrived" : `arriving in ${arrival.next_bus_mins} minutes`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
