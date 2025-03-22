"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast, { Toaster } from "react-hot-toast";
import CheckLogin from "../_privateRoutes/checkLogin";

function WaterWinnersPage() {
  const [loading, setLoading] = useState(false);
  const [zone, setZone] = useState("");
  const [winners, setWinners] = useState([]); // Store winners

  const fetchWinner = async (position) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/water_random-winner_${position}`
      );
      const data = await response.json();

      if (response.ok) {
        toast.success(`🎉 ${position} Winner(s) Selected Successfully!`);
        console.log(data);
        setWinners((prev) => [...prev, data]); // Store the new winners
      } else {
        toast.error(data.message || "Failed to select winner.");
      }
    } catch (err) {
      console.error("Error fetching winner:", err);
      toast.error("Server Error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchZoneWinner = async () => {
    if (!zone) return toast.error("⚠️ Enter a Zone Number!");

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/water_random-zone-winners/${zone}`
      );
      const data = await response.json();

      if (response.ok) {
        toast.success(`🎉 Winners selected for Zone ${zone}!`);
        console.log(data);
        setWinners(data.winners);
      } else {
        toast.error(data.message || " Failed to select zone winners.");
      }
    } catch (err) {
      console.error("Error fetching zone winner:", err);
      toast.error("Server Error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/GenerateExcelWater");

      if (!response.ok) {
        throw new Error("Failed to generate Excel");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "water-winners.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success(" Excel file downloaded successfully!");
    } catch (err) {
      console.error("Excel Download Error:", err);
      toast.error(" Failed to download Excel.");
    } finally {
      setLoading(false);
    }
  };

  // Function to safely display data or fallback to "-"
  const safeDisplay = (value) => {
    return value !== undefined && value !== null && value !== "" ? value : "-";
  };

  // Clear all winners
  const clearWinners = () => {
    setWinners([]);
    toast.success("Winners list cleared!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Toaster position="top-right" reverseOrder={false} />

      <Card className="w-full max-w-4xl p-6 shadow-lg rounded-lg bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Water Winners Management
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={() => fetchWinner(1)}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Selecting..." : "🏆 Select 1st Winner"}
            </Button>

            <Button
              onClick={() => fetchWinner(2)}
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              {loading ? "Selecting..." : "🥈 Select 2nd Winners"}
            </Button>

            <Button
              onClick={() => fetchWinner(3)}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {loading ? "Selecting..." : "🥉 Select 3rd Winners"}
            </Button>
          </div>

          {/* Zone Selection and Excel Download in same row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Enter Zone Number"
                className="border rounded-md px-2 py-1 w-full"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
              />
              <Button
                onClick={fetchZoneWinner}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap"
              >
                {loading ? "Selecting..." : "🌎 Zone Winners"}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={downloadExcel}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? "Generating..." : "📥 Download Excel"}
              </Button>

              <Button
                onClick={clearWinners}
                disabled={loading || winners.length === 0}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                🗑️ Clear List
              </Button>
            </div>
          </div>

          {/* Winner Display with Table UI */}
          {winners.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                🏆 Winners List:
              </h3>

              <div className="rounded-md border shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100">
                      <TableHead className="font-bold">SR_NO </TableHead>
                      <TableHead className="font-bold">Name</TableHead>
                      <TableHead className="font-bold">Ward</TableHead>
                      <TableHead className="font-bold">Zone</TableHead>
                      <TableHead className="font-bold">Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {winners.map((winner, index) => (
                      <TableRow
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{safeDisplay(winner.CONNECTION)}</TableCell>
                        <TableCell>{safeDisplay(winner.NAME)}</TableCell>
                        <TableCell>{safeDisplay(winner.WARD)}</TableCell>
                        <TableCell>{safeDisplay(winner.ZONE)}</TableCell>
                        <TableCell>{safeDisplay(winner.ADDRESS)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">
                No winners selected yet. Use the buttons above to select
                winners.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default WaterWinnersPage;
