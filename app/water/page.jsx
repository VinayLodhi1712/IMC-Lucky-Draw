"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Import react-confetti with dynamic import to avoid SSR issues
const ReactConfetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

function WaterWinnersPage() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [error, setError] = useState("");
  const [zoneError, setZoneError] = useState("");
  const [activeTab, setActiveTab] = useState("first");
  const [zone, setZone] = useState("");

  // Confetti state
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiProps, setConfettiProps] = useState({
    width: 0,
    height: 0,
    numberOfPieces: 0,
    initialVelocityY: 15,
    gravity: 0.5,
    run: false,
  });
  // Update window size on resize
  useEffect(() => {
    function updateDimensions() {
      setConfettiProps(prev => ({
        ...prev,
        width: window.innerWidth,
        height: document.documentElement.scrollHeight
      }));
    }

    window.addEventListener('resize', updateDimensions);
    window.addEventListener('scroll', updateDimensions);
    
    // Initial call to set dimensions
    updateDimensions();
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('scroll', updateDimensions);
    };
  }, []);

  const triggerConfetti = () => {
    setConfettiProps(prev => ({
      ...prev,
      numberOfPieces: 500,  
      gravity: 0.3,
      run: true
    }));
    setShowConfetti(true);
  };

  const fetchWinner = async (position) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/water_random-winner_${position}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch winner(s)");
      }

      setWinners(Array.isArray(data) ? data : [data]);
      toast.success(`${position} place winner(s) selected!`);

      // Trigger confetti
      triggerConfetti();
    } catch (err) {
      setError(err.message);
      toast.error(`${err.message}`);
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

    try {
      const response = await fetch(
        `http://localhost:5000/water_random-zone-winners/${zone}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to fetch winners for Zone ${zone}`
        );
      }

      setWinners(data.winners || []);
      toast.success(`Zone ${zone} winners selected!`);

      // Trigger confetti
      triggerConfetti();
    } catch (err) {
      setError(err.message);
      toast.error(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    setLoadingExcel(true);
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
      toast.success("Excel file downloaded successfully!");
    } catch (err) {
      console.error("Excel Download Error:", err);
      toast.error("Failed to download Excel.");
    } finally {
      setLoadingExcel(false);
    }
  };

  const clearWinners = () => {
    setWinners([]);
    toast.success("Winners list cleared!");
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setWinners([]);
  };

  const handleChange = (e) => {
    const value = Number(e.target.value);

    if (value < 1 || value > 19) {
      setZoneError("Zone number must be between 1 and 19");
    } else {
      setZoneError("");
    }

    setZone(value);
  };

  // Function to safely display data or fallback to "-"
  const safeDisplay = (value) => {
    return value !== undefined && value !== null && value !== "" ? value : "-";
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Confetti effect */}
      {showConfetti && (
        <ReactConfetti
          width={confettiProps.width}
          height={confettiProps.height}
          recycle={false}
          numberOfPieces={confettiProps.numberOfPieces}
          gravity={confettiProps.gravity}
          run={confettiProps.run}
          initialVelocityY={10}
          confettiSource={{
            x: 0,
            y: 0,
            w: confettiProps.width,
            h: 0
          }}
          onConfettiComplete={(confetti) => {
            if (confetti.totalPieces === 0) {
              setShowConfetti(false);
              setConfettiProps(prev => ({
                ...prev,
                numberOfPieces: 0,
                run: false
              }));
            }
          }}
        />
      )}

      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center my-6">
          Water Winners Management
        </h1>

        {/* Top Actions Row */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={downloadExcel}
            disabled={loadingExcel}
            className="bg-green-600 hover:bg-green-700"
          >
            {loadingExcel ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "📥 Download Excel"
            )}
          </Button>

          <Button
            onClick={clearWinners}
            disabled={winners.length === 0}
            className="bg-red-600 hover:bg-red-700"
          >
            🗑️ Clear List
          </Button>
        </div>

        {/* Tabs Interface */}
        <Tabs
          defaultValue="first"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="first" className="text-lg py-3">
              🏆 First Place
            </TabsTrigger>
            <TabsTrigger value="second" className="text-lg py-3">
              🥈 Second Place
            </TabsTrigger>
            <TabsTrigger value="third" className="text-lg py-3">
              🥉 Third Place
            </TabsTrigger>
            <TabsTrigger value="zone" className="text-lg py-3">
              🌎 Zone Winners
            </TabsTrigger>
          </TabsList>

          <TabsContent value="first">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                First Place Winners
              </h2>
              <Button
                onClick={() => fetchWinner(1)}
                disabled={loading}
                className="mb-6 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Selecting...
                  </>
                ) : (
                  "Select 1st Place Winner"
                )}
              </Button>
              {renderWinnersTable("1st Place")}
            </div>
          </TabsContent>

          <TabsContent value="second">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Second Place Winners
              </h2>
              <Button
                onClick={() => fetchWinner(2)}
                disabled={loading}
                className="mb-6 bg-yellow-600 hover:bg-yellow-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Selecting...
                  </>
                ) : (
                  "Select 2nd Place Winners"
                )}
              </Button>
              {renderWinnersTable("2nd Place")}
            </div>
          </TabsContent>

          <TabsContent value="third">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Third Place Winners
              </h2>
              <Button
                onClick={() => fetchWinner(3)}
                disabled={loading}
                className="mb-6 bg-orange-600 hover:bg-orange-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Selecting...
                  </>
                ) : (
                  "Select 3rd Place Winners"
                )}
              </Button>
              {renderWinnersTable("3rd Place")}
            </div>
          </TabsContent>

          <TabsContent value="zone">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Zone Winners</h2>
              <div className="flex gap-4 mb-6">
                <div className="flex flex-col gap-1 w-full max-w-xs">
                  <input
                    type="number"
                    placeholder="Enter Zone Number"
                    className="border rounded-md px-4 py-2 w-full"
                    value={zone}
                    onChange={handleChange}
                  />

                  {zoneError && (
                    <p className="text-red-500 text-sm">{zoneError}</p>
                  )}
                </div>

                <Button
                  onClick={() => !zoneError && fetchZoneWinners()}
                  disabled={loading || !!zoneError}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Selecting...
                    </>
                  ) : (
                    "Select Zone Winners"
                  )}
                </Button>
              </div>
              {renderWinnersTable(`Zone ${zone}`)}
            </div>
          </TabsContent>
        </Tabs>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-center mt-4 p-4 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );

  // Helper function to render winners table
  function renderWinnersTable(position) {
    if (winners.length === 0) {
      return (
        <div className="text-gray-500 italic text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No winners selected yet.</p>
          <p className="text-sm mt-2">
            Use the button above to select winners.
          </p>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-center mb-4">
          🎉 {position} Winner(s)
        </h3>

        <div className="rounded-md border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead className="font-bold">SR No</TableHead>
                <TableHead className="font-bold">Connection</TableHead>
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
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {safeDisplay(winner.CONNECTION)}
                    </span>
                  </TableCell>
                  <TableCell>{safeDisplay(winner.NAME)}</TableCell>
                  <TableCell>{safeDisplay(winner.WARD)}</TableCell>
                  <TableCell>{safeDisplay(winner.ZONE)}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {safeDisplay(winner.ADDRESS)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

export default WaterWinnersPage;
