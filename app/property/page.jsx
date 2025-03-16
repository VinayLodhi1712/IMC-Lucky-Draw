"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast, { Toaster } from "react-hot-toast";

export default function RandomWinnerPage() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [error, setError] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [zone, setZone] = useState(""); // For Zone Selection

  const fetchWinner = async (position) => {
    setLoading(true);
    setError("");
    setSelectedPosition(position.toString());

    try {
      const response = await fetch(
        `http://localhost:5000/property_random-winner_${position}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch winner(s)");
      }

      setWinners(Array.isArray(data) ? data : [data]);
      toast.success(`✅ ${position} place winner(s) selected!`);
    } catch (err) {
      setError(err.message);
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchZoneWinners = async () => {
    if (!zone) {
      toast.error("Please select a zone!");
      return;
    }

    setLoading(true);
    setError("");
    setSelectedPosition(`Zone ${zone}`);

    try {
      const response = await fetch(
        `http://localhost:5000/property_random-zone-winners/${zone}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to fetch winners for Zone ${zone}`
        );
      }

      setWinners(data.winners || []);
      toast.success(`✅ Zone ${zone} winners selected!`);
    } catch (err) {
      setError(err.message);
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    setLoadingExcel(true);
    try {
      const response = await fetch("http://localhost:5000/GenerateExcel");

      if (!response.ok) {
        throw new Error("Failed to generate Excel");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "property-winners.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("✅ Excel file downloaded successfully!");
    } catch (err) {
      console.error("Excel Download Error:", err);
      toast.error("❌ Failed to download Excel.");
    } finally {
      setLoadingExcel(false);
    }
  };
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
            Property Winners Management
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Buttons for 1st, 2nd, 3rd place winners */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={() => fetchWinner(1)}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading && selectedPosition === "1"
                ? "Selecting..."
                : "🏆 1st Place Winner"}
            </Button>

            <Button
              onClick={() => fetchWinner(2)}
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              {loading && selectedPosition === "2"
                ? "Selecting..."
                : "🥈 2nd Place Winners"}
            </Button>

            <Button
              onClick={() => fetchWinner(3)}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {loading && selectedPosition === "3"
                ? "Selecting..."
                : "🥉 3rd Place Winners"}
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
                onClick={fetchZoneWinners}
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


          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* Winner Display with Table UI */}
          {winners.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-center mb-2">
                🎉 {selectedPosition} Winner(s)
              </h3>

              <div className="rounded-md border shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100">
                      <TableHead className="font-bold">SR No</TableHead>
                      <TableHead className="font-bold">Position</TableHead>
                      <TableHead className="font-bold">Owner Name</TableHead>
                      <TableHead className="font-bold">Partner</TableHead>
                      <TableHead className="font-bold">Ward</TableHead>
                      <TableHead className="font-bold">Zone</TableHead>
                      <TableHead className="font-bold">Year</TableHead>
                      <TableHead className="font-bold">Tax Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {winners.map((winner, index) => (
                      <TableRow
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <TableCell className="font-medium">
                          {winner.SR_NO}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {winner.POSITION}
                          </span>
                        </TableCell>
                        <TableCell>{winner.PROPERTY_OWNER_NAME}</TableCell>
                        <TableCell>{winner.PARTNER}</TableCell>
                        <TableCell>{winner.WARD}</TableCell>
                        <TableCell>{winner.ZONE}</TableCell>
                        <TableCell>{winner.ASSMENTYEAR}</TableCell>
                        <TableCell>
                          ₹{parseFloat(winner.TAX_AMT).toLocaleString("en-IN")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
