import React from "react";
import { Button } from "@chakra-ui/react";
import Papa from "papaparse";
import { DownloadIcon } from "@chakra-ui/icons";

const DownloadCSV = ({ filteredData }) => {
  console.log(filteredData);
  
  const handleDownload = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data available to download!");
      return;
    }

    const formattedData = filteredData.map((item) => ({
      WorkerName: item.name || item.workerName || "N/A",
      Date: item.date ? new Date(item.date).toISOString().split("T")[0] : "N/A",
      Status: item.status || "N/A",
      Duration: item.duration || "N/A",
      Amount: item.amount || "N/A", // Added amount field
    }));
    
    const csv = Papa.unparse(formattedData);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "attendance_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      leftIcon={<DownloadIcon />}
      colorScheme="teal"
      variant="solid"
      onClick={handleDownload}
    >
      Download CSV
    </Button>
  );
};

export default DownloadCSV;



/*// {
//   "short_name": "Revision Karle",
//   "name": "Create React App Sample",
//   "icons": [
//     {
//       "src": "favicon.ico",
//       "sizes": "64x64 32x32 24x24 16x16",
//       "type": "image/x-icon"
//     },
//     {
//       "src": "logo192.png",
//       "type": "image/png",
//       "sizes": "192x192"
//     },
//     {
//       "src": "logo512.png",
//       "type": "image/png",
//       "sizes": "512x512"
//     }
//   ],
//   "start_url": ".",
//   "display": "standalone",
//   "theme_color": "#000000",
//   "background_color": "#ffffff"
// }

*/