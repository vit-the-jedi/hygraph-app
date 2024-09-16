"use client";
import LinkStatusDashboard from "../components/LinkStatusDashboard.jsx";
import HelperInfo from "../components/HelperInfo.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorIcon from '@mui/icons-material/Error';

import { useState, useEffect } from "react";


export default function UploadDocs({ config }) {
  //const { data, error, isLoading } = useSWR(['/api/upload', linkValues ], fetcher);
  const query = new URLSearchParams({ params: config.links });
  const url = config.baseURL + "/api/upload";
  const [data, setData] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      console.log("fetching data");
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
    <h3 className="text-lg">
      <div className="flex align-center justify-center mt-5">
        <CircularProgress />
      </div>
    </h3>
  </div>;
  if (!data) return 
  <div className="flex align-center justify-center mt-5">
    <ErrorIcon />
    <h3 className="text-lg text-rose-500">Error Uploading Documents</h3>
</div>
  if(!isLoading) return (
    <div>
      <div>
        <LinkStatusDashboard articleStatusInfo={data} />
        {errorMessages.length > 0 && <HelperInfo errors={errorMessages} />}
      </div>
    </div>
  );
}
