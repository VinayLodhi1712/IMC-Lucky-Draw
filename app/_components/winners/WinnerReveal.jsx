"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, MapPin, Zap, CheckCircle, AlertCircle, Eye } from "lucide-react"
import { WinnerGrid } from "./WinnerCard"
import { DigitalTumbler } from "./DigitalTumbler"

export function WinnerRevealView({ prize, onBack, onReveal, winners, loading, error }) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [selectedZone, setSelectedZone] = useState("")
  const [hasExistingWinners, setHasExistingWinners] = useState(false)
  const [checkingZone, setCheckingZone] = useState(false)
  const [winnerCheckMessage, setWinnerCheckMessage] = useState("")
  const [baseUrl, setBaseUrl] = useState("http://localhost:5000")

  // Check for existing winners - REAL API INTEGRATION
  useEffect(() => {
    const checkExistingWinners = async () => {
      const isWaterTax = typeof window !== "undefined" && window.location.pathname.includes("water")

      if (prize.id === "zone") {
        // For zonal prizes, don't check until a zone is selected
        if (selectedZone && selectedZone >= 1 && selectedZone <= 19) {
          setCheckingZone(true)
          try {
            // Real API call to check if this specific zone has winners
            const endpoint = isWaterTax
              ? `${baseUrl}/checkWaterZoneWinners/${selectedZone}`
              : `${baseUrl}/checkPropertyZoneWinners/${selectedZone}`

            console.log("Checking endpoint:", endpoint)
            const response = await fetch(endpoint)

            // Check if response is ok and content-type is JSON
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const contentType = response.headers.get("content-type")
            if (!contentType || !contentType.includes("application/json")) {
              throw new Error("Server returned non-JSON response. Check if API endpoint exists.")
            }

            const data = await response.json()
            setHasExistingWinners(data.hasWinners || false)
            setWinnerCheckMessage(data.message || "")
          } catch (error) {
            console.error("Error checking zone winners:", error)
            setHasExistingWinners(false)
            setWinnerCheckMessage(`Error: ${error.message}`)
          }
          setCheckingZone(false)
        } else {
          setHasExistingWinners(false)
          setWinnerCheckMessage("")
        }
      } else {
        // For non-zonal prizes, check immediately with real API
        setCheckingZone(true)
        try {
          const endpoint = isWaterTax
            ? `${baseUrl}/checkWaterWinners/${prize.apiSlug}`
            : `${baseUrl}/checkPropertyWinners/${prize.apiSlug}`

          console.log("Checking endpoint:", endpoint)
          const response = await fetch(endpoint)

          // Check if response is ok and content-type is JSON
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const contentType = response.headers.get("content-type")
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Server returned non-JSON response. Check if API endpoint exists.")
          }

          const data = await response.json()
          setHasExistingWinners(data.hasWinners || false)
          setWinnerCheckMessage(data.message || "")
        } catch (error) {
          console.error("Error checking position winners:", error)
          setHasExistingWinners(false)
          setWinnerCheckMessage(`Error: ${error.message}`)
        }
        setCheckingZone(false)
      }
    }

    checkExistingWinners()
  }, [prize, selectedZone, baseUrl])

  const handleRevealClick = () => {
    if (prize.id === "zone" && !selectedZone) {
      return
    }
    setIsRevealed(true)
    const prizeWithZone = { ...prize, zone: selectedZone }
    onReveal(prizeWithZone)
  }

  const getTumblerText = () => {
    if (prize.id === "first") return "WINNER"
    if (prize.id === "second") return "WINNERS-03"
    if (prize.id === "third") return "WINNERS-05"
    return `ZONE-${selectedZone}`
  }

  // Enhanced Zone Selector with proper scrolling and integrated winner checking
  const EnhancedZoneSelector = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-50 to-purple-50 border-3 border-indigo-300 rounded-2xl p-6 mb-6 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <MapPin className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h3 className="text-xl font-bold text-indigo-900">Zone Selection Portal</h3>
          <p className="text-indigo-700 text-sm">Select administrative zone for lucky draw</p>
        </div>
      </div>

      {/* Scrollable zone grid */}
      <div className="max-h-48 overflow-y-auto mb-4 p-2 bg-white rounded-xl border-2 border-indigo-200">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {Array.from({ length: 19 }, (_, i) => i + 1).map((zone) => (
            <motion.button
              key={zone}
              onClick={() => setSelectedZone(zone.toString())}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-lg font-bold text-sm transition-all shadow-md ${
                selectedZone === zone.toString()
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl transform scale-105 border-2 border-white"
                  : "bg-white text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400"
              }`}
            >
              {zone}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="relative">
        <input
          type="number"
          value={selectedZone}
          onChange={(e) => {
            const value = e.target.value
            // Only allow numbers between 1-19 or empty string
            if (value === "" || (Number(value) >= 1 && Number(value) <= 19)) {
              setSelectedZone(value)
            }
          }}
          placeholder="Or type zone number (1-19)"
          min="1"
          max="19"
          className="w-full p-4 border-3 border-indigo-300 rounded-xl text-center font-bold text-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 bg-white shadow-lg"
        />
        {selectedZone && !checkingZone && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <CheckCircle className="w-6 h-6 text-green-500" />
          </motion.div>
        )}
        {checkingZone && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Zone Status Indicator - This is the ONLY place we show winner status for zones */}
      {selectedZone && !checkingZone && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
              winnerCheckMessage.includes("Error")
                ? "bg-red-100 text-red-800 border-2 border-red-300"
                : hasExistingWinners
                  ? "bg-amber-100 text-amber-800 border-2 border-amber-300"
                  : "bg-green-100 text-green-800 border-2 border-green-300"
            }`}
          >
            {winnerCheckMessage.includes("Error") ? (
              <>
                <AlertCircle className="w-4 h-4" />
                API Connection Error
              </>
            ) : hasExistingWinners ? (
              <>
                <AlertCircle className="w-4 h-4" />
                Zone {selectedZone} - Winners Already Selected
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Zone {selectedZone} - Ready for Draw
              </>
            )}
          </div>
          {winnerCheckMessage && <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">{winnerCheckMessage}</p>}
        </motion.div>
      )}
    </motion.div>
  )

  // Loading indicator for checking winners (only for non-zonal prizes)
  const CheckingWinnersIndicator = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
      <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-700 p-4 rounded-xl border-2 border-blue-300">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Checking winner status...</span>
      </div>
    </motion.div>
  )

  // Winners Already Exist Alert (ONLY for non-zonal prizes)
  const NonZonalWinnersExistAlert = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-6 text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <AlertCircle className="w-5 h-5 text-amber-600" />
        <span className="text-amber-800 font-bold">{prize.title} Winners Already Selected</span>
      </div>
      <p className="text-amber-700 text-sm">{winnerCheckMessage}</p>
    </motion.div>
  )

  if (!isRevealed) {
    return (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50"
      >
        {/* Content with proper top padding to avoid header overlap */}
        <div className="pt-24 pb-8">
          <div className="container mx-auto px-4">
            {/* Back Button - Positioned below header */}
            <div className="mb-8 mt-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="bg-white/90 backdrop-blur-sm font-medium text-gray-700 hover:bg-gray-50 border-2 border-gray-300 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>

            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 text-center">
                  <motion.h1
                    className="text-3xl font-bold mb-3"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {prize.title} Lucky Draw
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                      className="inline-block ml-3"
                    >
                      <Trophy className="w-8 h-8 text-yellow-300" />
                    </motion.div>
                  </motion.h1>

                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-3 inline-block">
                    <p className="text-xl font-bold text-white">🏆 Prize: {prize.prizeName}</p>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="max-h-[60vh] overflow-y-auto p-8">
                  {/* Prize Image */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative w-full max-w-lg h-64 mx-auto mb-8"
                  >
                    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-3 border-gray-300 p-6 shadow-xl">
                      <Image
                        src={prize.image || "/placeholder.svg?height=250&width=400"}
                        alt={prize.prizeName}
                        fill
                        style={{ objectFit: "contain" }}
                        className="rounded-xl drop-shadow-lg"
                      />
                    </div>
                  </motion.div>

                  {/* Loading indicator for non-zonal prizes ONLY */}
                  {prize.id !== "zone" && checkingZone && <CheckingWinnersIndicator />}

                  {/* Zone Selection - Always show for zonal prizes (includes winner checking) */}
                  {prize.id === "zone" && <EnhancedZoneSelector />}

                  {/* Winners Exist Alert - ONLY for non-zonal prizes */}
                  {prize.id !== "zone" && hasExistingWinners && !checkingZone && <NonZonalWinnersExistAlert />}

                  {/* Action Buttons */}
                  {!checkingZone && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-center"
                    >
                      {/* Show "View Winners" button if winners already exist */}
                      {((prize.id !== "zone" && hasExistingWinners) ||
                        (prize.id === "zone" && selectedZone && hasExistingWinners)) && (
                        <Link href="/winners">
                          <Button
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-6 px-16 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-xl relative overflow-hidden group"
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                              animate={{ x: [-200, 400] }}
                              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            />
                            <div className="flex items-center gap-4 relative z-10">
                              <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
                              <span>
                                {prize.id === "zone"
                                  ? `VIEW ZONE ${selectedZone} WINNERS`
                                  : `VIEW ${prize.title.toUpperCase()} WINNERS`}
                              </span>
                            </div>
                          </Button>
                        </Link>
                      )}

                      {/* Show "Start Draw" button if no winners exist */}
                      {((prize.id !== "zone" && !hasExistingWinners) ||
                        (prize.id === "zone" && selectedZone && !hasExistingWinners)) && (
                        <Button
                          onClick={handleRevealClick}
                          disabled={prize.id === "zone" && !selectedZone}
                          size="lg"
                          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-6 px-16 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-xl relative overflow-hidden group"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                            animate={{ x: [-200, 400] }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                          <div className="flex items-center gap-4 relative z-10">
                            <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span>
                              {prize.id === "zone" ? `START ZONE ${selectedZone} DRAW` : "START OFFICIAL DRAW"}
                            </span>
                          </div>
                        </Button>
                      )}

                      {/* Show disabled button if zone not selected */}
                      {prize.id === "zone" && !selectedZone && (
                        <Button
                          disabled
                          size="lg"
                          className="bg-gray-400 text-gray-600 font-bold py-6 px-16 rounded-2xl shadow-lg text-xl cursor-not-allowed"
                        >
                          <div className="flex items-center gap-4">
                            <MapPin className="w-6 h-6" />
                            <span>SELECT ZONE TO CONTINUE</span>
                          </div>
                        </Button>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.main>
    )
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50"
    >
      {/* Content with EXTRA top padding for certificate view to avoid header overlap */}
      <div className="pt-20 pb-20">
        <div className="container mx-auto px-2">
          {/* Back Button - Positioned well below header with extra margin */}
          <div className="mb-8 mt-6">
            <Button
              onClick={onBack}
              variant="outline"
              className="bg-white/90 backdrop-blur-sm font-medium text-gray-700 hover:bg-gray-50 border-2 border-gray-300 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* FULL WIDTH container for certificates */}
          <div className="w-full max-w-none">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-8 text-center max-w-6xl mx-auto"
              >
                <motion.div
                  className="flex items-center justify-center gap-4 mb-8"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse"></div>
                  <h2 className="text-3xl font-bold text-gray-800">🎯 Official Draw in Progress</h2>
                  <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse"></div>
                </motion.div>

                <DigitalTumbler text={getTumblerText()} />
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border-l-4 border-red-500 text-red-800 p-8 rounded-2xl shadow-2xl max-w-6xl mx-auto"
              >
                <h3 className="text-2xl font-bold mb-3">⚠️ System Error</h3>
                <p className="text-lg">{error}</p>
              </motion.div>
            )}

            {winners.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white p-4 rounded-2xl text-center shadow-2xl max-w-6xl mx-auto"
                >
                  <h2 className="text-2xl font-bold mb-3">🎉 OFFICIAL WINNER ANNOUNCEMENT 🎉</h2>
                  <p className="text-green-100 text-sm">
                    Indore Municipal Corporation - {prize.id === "zone" ? `Zone ${selectedZone} ` : ""}Certified Results
                  </p>
                </motion.div>

                <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-5 w-full min-h-screen">
                  <p className="text-gray-700 text-center mb-12 text-xl font-medium">
                    🏆 Congratulations to all the selected winners! 🏆
                  </p>
                  <WinnerGrid winners={winners} prize={prize} />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.main>
  )
}
