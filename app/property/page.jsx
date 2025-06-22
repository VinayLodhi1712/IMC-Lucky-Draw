"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import CheckLogin from "../_privateRoutes/checkLogin";
import { DashboardView } from "../_components/winners/DashboardView";
import { WinnerRevealView } from "../_components/winners/WinnerReveal";
import { useWindowSize } from "@/app/hooks/use-window-size";

const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false });

const prizeData = [
  {
    id: "first",
    title: "Grand Prize",
    prizeName: "Electric Vehicle",
    winnerCount: "1 Winner",
    image: "/car.png",
    color: "bg-gradient-to-br from-yellow-400 to-amber-500",
    apiSlug: "1",
  },
  {
    id: "second",
    title: "Second Prize",
    prizeName: "Electric Scooter",
    winnerCount: "3 Winners",
    image: "/scooty.png",
    color: "bg-gradient-to-br from-slate-400 to-slate-500",
    apiSlug: "2",
  },
  {
    id: "third",
    title: "Third Prize",
    prizeName: "Smart LED Television",
    winnerCount: "5 Winners",
    image: "/tv.png",
    color: "bg-gradient-to-br from-orange-500 to-red-500",
    apiSlug: "3",
  },
  {
    id: "zone",
    title: "Zonal Prize",
    prizeName: "Premium Mixer Grinder",
    winnerCount: "5 Per Zone",
    image: "/mixer.jpeg",
    color: "bg-gradient-to-br from-emerald-500 to-teal-600",
    apiSlug: "zone",
  },
];

function PropertyWinnersPage() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [error, setError] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const triggerConfetti = () => {
    setShowConfetti(true);
  };

  const handleSelectPrize = (prize) => {
    setSelectedPrize(prize);
    setCurrentView(prize.id);
  };

  const handleGoBack = () => {
    setCurrentView("dashboard");
    setWinners([]);
    setError("");
    setSelectedPrize(null);
  };

  const handleRevealWinners = async (prize) => {
    setLoading(true);
    setError("");
    setWinners([]);

    const url =
      prize.apiSlug === "zone"
        ? `${baseUrl}/property_random-zone-winners/${prize.zone}`
        : `${baseUrl}/property_random-winner_${prize.apiSlug}`;

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to fetch winners");

      const results = Array.isArray(data) ? data : data.winners || [data];
      if (results.length === 0) throw new Error("No eligible winners found");

      setWinners(results);
      toast.success(`${prize.title} winners selected successfully!`);
      triggerConfetti();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    setLoadingExcel(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/GenerateExcel`
      );
      if (!response.ok) throw new Error("Failed to generate report");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "property-winners-report.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully!");
    } catch (err) {
      toast.error("Failed to download report");
    } finally {
      setLoadingExcel(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#22c55e",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: "500",
            padding: "16px 20px",
            minWidth: "320px",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          },
          success: {
            style: {
              background: "#22c55e",
              color: "#fff",
            },
            icon: <CheckCircle size={20} />,
          },
          error: {
            style: {
              background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
              color: "#fff",
            },
          },
        }}
      />
      {showConfetti && (
        <ReactConfetti
          width={width}
          height={height}
          numberOfPieces={200}
          recycle={false}
          gravity={0.1}
        />
      )}

      <AnimatePresence mode="wait">
        {currentView === "dashboard" ? (
          <DashboardView
            key="dashboard"
            title="Property Tax Lucky Draw Portal"
            subtitle="Select a prize category to initiate the automated lucky draw for eligible property taxpayers"
            prizes={prizeData}
            onSelectPrize={handleSelectPrize}
            onDownload={downloadExcel}
            loadingExcel={loadingExcel}
          />
        ) : (
          <WinnerRevealView
            key="reveal"
            prize={selectedPrize}
            onBack={handleGoBack}
            onReveal={handleRevealWinners}
            winners={winners}
            loading={loading}
            error={error}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default CheckLogin(PropertyWinnersPage);
