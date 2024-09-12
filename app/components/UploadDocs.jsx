"use client";
import LinkStatusDashboard from "../components/LinkStatusDashboard.jsx";
import HelperInfo from "../components/HelperInfo.jsx";

import { useState, useEffect } from "react";

console.log("render");

export default function UploadDocs({ config }) {
  //const { data, error, isLoading } = useSWR(['/api/upload', linkValues ], fetcher);
  const query = new URLSearchParams({ params: config.links });
  const url = config.baseURL + "/api/upload";
  const [data, setData] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const res = await fetch(`${url}?${query.toString()}`, {cache: "no-store"});
      const resJSON = await res.json();
      setData(resJSON);
      setErrorMessages(resJSON.filter((item) => item.errors).map((item) => item.errors));
      setIsLoading(false);
    }
    fetchData();
    
  }, []);

  if (isLoading) return <div>
    <h3 className="text-lg">Loading...</h3>
  </div>;
  if (!data) return <div>
    <h3 className="text-lg text-rose-500">Error uploading documents</h3>
    </div>;
  if(!isLoading) return (
    <div>
      <div>
        <LinkStatusDashboard articleStatusInfo={data} />
        {errorMessages.length > 0 && <HelperInfo errors={errorMessages} />}
      </div>
    </div>
  );
}
