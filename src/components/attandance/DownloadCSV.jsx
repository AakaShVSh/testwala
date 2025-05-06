import React from "react";
import { Button } from "@chakra-ui/react";
import Papa from "papaparse";
import { DownloadIcon } from "@chakra-ui/icons";

const DownloadCSV = ({ filteredData }) => {
  const handleDownload = () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No data available to download!");
      return;
    }

    // Format data if needed (e.g., convert timestamps, rename fields)
    const formattedData = filteredData.map((item) => ({
      WorkerName: item.name || item.workerName || "N/A",
      Date: item.date || "N/A",
      Status: item.status || "N/A",
      Contractor: item.contractor || "N/A",
      // Add more fields as needed
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
