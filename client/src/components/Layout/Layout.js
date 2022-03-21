import { useEffect } from "react";
import { useState } from "react";
export default function Layout({ children }) {
  const [data, updateData] = useState(null);

  useEffect(() => {
    const sse = new EventSource("http://localhost:8000/events/adverts");
    function getData(data) {
      updateData(JSON.parse(data.data));
    }
    sse.onmessage = (e) => getData(e);
    sse.onerror = (err) => {
      console.log(err);
      sse.close();
    };
    return () => {
      sse.close();
    };
  }, []);

  return (
    <div className="bg-gray-100 min-w-screen min-h-screen px-4 py-2">
        <div className="border h-48 bg-white mx-24 flex justify-center items-center">
            <h1>{data && data.text}</h1>
        </div>
      {children}
    </div>
  );
}
