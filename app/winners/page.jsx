"use client"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Trophy, Sparkles, Star, MapPin, Home, ArrowLeft, Eye } from "lucide-react"
import { ClipLoader } from "react-spinners"
import Link from "next/link"
import { WinnerPositionView } from "../_components/winners/WinnerPosition"

const Confetti = dynamic(() => import("react-confetti"), { ssr: false })

// Prize data mapping
const prizeData = {
  "1st": {
    id: "first",
    title: "Grand Prize",
    prizeName: "Electric Vehicle",
    image: "/car.png",
    color: "bg-gradient-to-br from-yellow-400 to-amber-500",
  },
  "2nd": {
    id: "second",
    title: "Second Prize",
    prizeName: "Electric Scooter",
    image: "/scooty.png",
    color: "bg-gradient-to-br from-slate-400 to-slate-500",
  },
  "3rd": {
    id: "third",
    title: "Third Prize",
    prizeName: "Smart LED Television",
    image: "/tv.png",
    color: "bg-gradient-to-br from-orange-500 to-red-500",
  },
  zone: {
    id: "zone",
    title: "Zonal Prize",
    prizeName: "Premium Mixer Grinder",
    image: "/mixer.jpeg",
    color: "bg-gradient-to-br from-emerald-500 to-teal-600",
  },
}

export default function WinnersPage() {
  const [propertyWinners, setPropertyWinners] = useState([])
  const [waterWinners, setWaterWinners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({ width: undefined, height: undefined })
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [selectedWinners, setSelectedWinners] = useState([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      }
      window.addEventListener("resize", handleResize)
      handleResize()
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const fetchPropertyWinners = async () => {
      try {
        const response = await fetch("http://localhost:5000/getAllPropertyWinners")
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        setPropertyWinners(data)
      } catch (error) {
        console.error("Error fetching property winners:", error)
      }
    }

    const fetchWaterWinners = async () => {
      try {
        const response = await fetch("http://localhost:5000/getAllWaterWinners")
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        setWaterWinners(data)
      } catch (error) {
        console.error("Error fetching water winners:", error)
      }
    }

    Promise.all([fetchPropertyWinners(), fetchWaterWinners()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false))

    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const getWinnersByPosition = (winners, position) => {
    return winners.filter((winner) => winner.POSITION === position)
  }

  const getZoneWinners = (winners) => {
    return winners.filter((winner) => winner.POSITION?.startsWith("Zone "))
  }

  const getZoneNumberFromPosition = (positionString) => {
    if (typeof positionString !== "string" || !positionString.startsWith("Zone ")) {
      return Number.POSITIVE_INFINITY
    }
    const num = Number.parseInt(positionString.split(" ")[1], 10)
    return isNaN(num) ? num : num
  }

  const getAvailableZones = (winners) => {
    const zoneWinners = getZoneWinners(winners)
    const zones = [
      ...new Set(
        zoneWinners.map((winner) => {
          const match = winner.POSITION?.match(/Zone (\d+)/)
          return match ? Number.parseInt(match[1]) : null
        }),
      ),
    ]
      .filter(Boolean)
      .sort((a, b) => a - b)
    return zones
  }

  const handlePositionClick = (position, winners, prize, type) => {
    setSelectedPosition({ position, prize, type })
    setSelectedWinners(winners)
  }

  const handleZoneClick = (zoneNumber, winners, prize, type) => {
    const zoneWinners = winners.filter((winner) => winner.POSITION === `Zone ${zoneNumber}`)
    setSelectedPosition({
      position: `Zone ${zoneNumber}`,
      prize: { ...prize, title: `Zone ${zoneNumber} Prize` },
      type,
    })
    setSelectedWinners(zoneWinners)
  }

  const handleBackToList = () => {
    setSelectedPosition(null)
    setSelectedWinners([])
  }

  const renderPositionCard = (position, winners, prize, type) => {
    if (winners.length === 0) return null

    return (
      <motion.div
        key={position}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="group"
      >
        <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${prize.color} shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Trophy className="w-6 h-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{prize.title}</h3>
                <p className="text-gray-600">{prize.prizeName}</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                {winners.length} Winner{winners.length > 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="relative w-full h-32 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2">
              <Image
                src={prize.image || "/placeholder.svg"}
                alt={prize.prizeName}
                fill
                style={{ objectFit: "contain" }}
                className="drop-shadow-lg"
              />
            </div>

            <Button
              onClick={() => handlePositionClick(position, winners, prize, type)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <motion.div className="flex items-center justify-center gap-3" whileHover={{ x: 5 }}>
                <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>View Winners</span>
              </motion.div>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }
  
  const renderZoneCards = (winners, type) => {
    const availableZones = getAvailableZones(winners)
    if (availableZones.length === 0) return null

    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Star className="h-8 w-8 text-blue-500" />
          <h2 className="text-2xl font-bold">Zone Prize Winners</h2>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{availableZones.length} Zones</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableZones.map((zoneNumber) => {
            const zoneWinners = winners.filter((winner) => winner.POSITION === `Zone ${zoneNumber}`)
            const zonePrize = {
              ...prizeData.zone,
              title: `Zone ${zoneNumber} Prize`,
            }

            return (
              <motion.div
                key={zoneNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${zonePrize.color} shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Trophy className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">Zone {zoneNumber} Prize</h3>
                        <p className="text-gray-600">{zonePrize.prizeName}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {zoneWinners.length} Winner{zoneWinners.length > 1 ? "s" : ""}
                      </Badge>
                    </div>

                    <div className="relative w-full h-32 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2">
                      <Image
                        src={zonePrize.image || "/placeholder.svg"}
                        alt={zonePrize.prizeName}
                        fill
                        style={{ objectFit: "contain" }}
                        className="drop-shadow-lg"
                      />
                    </div>

                    <Button
                      onClick={() => handleZoneClick(zoneNumber, winners, prizeData.zone, type)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <motion.div className="flex items-center justify-center gap-3" whileHover={{ x: 5 }}>
                        <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>View Winners</span>
                      </motion.div>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    )
  }


  const renderWinnerList = (winners, type) => {
    return (
      <div className="space-y-12">
        {/* Position Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {renderPositionCard("1st", getWinnersByPosition(winners, "1st"), prizeData["1st"], type)}
          {renderPositionCard("2nd", getWinnersByPosition(winners, "2nd"), prizeData["2nd"], type)}
          {renderPositionCard("3rd", getWinnersByPosition(winners, "3rd"), prizeData["3rd"], type)}
        </div>

        {/* Zone Winners */}
        {renderZoneCards(winners, type)}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ClipLoader color="#3b82f6" size={60} />
        <p className="mt-4 text-lg">Loading winners...</p>
      </div>
    )
  }

  if (selectedPosition) {
    return <WinnerPositionView position={selectedPosition} winners={selectedWinners} onBack={handleBackToList} />
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      {" "}
      {/* Increased pt-32 to avoid navbar collision */}
      {showConfetti && windowSize.width && windowSize.height && (
        <Confetti width={windowSize.width} height={windowSize.height} recycle={true} numberOfPieces={200} />
      )}
      {/* Your Original Green Banner with Mayor Image */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative w-full max-w-4xl">
          <div className="absolute -top-8 right-4 w-24 h-24 md:w-32 md:h-32 z-10">
            {" "}
            {/* Adjusted positioning */}
            <Image
              src="/mayor.png"
              alt="Mayor"
              width={128}
              height={128}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </div>
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-4">
              <Sparkles className="h-8 w-8 animate-pulse" />
              बधाई हो सभी विजेताओं को!
              <Sparkles className="h-8 w-8 animate-pulse" />
            </h1>
            <p className="text-lg md:text-xl">Congratulations to all the winners of IMC Lucky Draw 2025</p>
            <div className="mt-4 flex justify-center items-center">
              <Trophy className="h-6 w-6 mr-2" />
              <span>Government Certified Results</span>
            </div>
          </div>
        </div>
      </div>
      <Tabs defaultValue="property" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger
            value="property"
            className="text-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            <Home className="w-5 h-5 mr-2" />
            Property Tax Winners
          </TabsTrigger>
          <TabsTrigger
            value="water"
            className="text-lg data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Water Tax Winners
          </TabsTrigger>
        </TabsList>
        <TabsContent value="property">{renderWinnerList(propertyWinners, "property")}</TabsContent>
        <TabsContent value="water">{renderWinnerList(waterWinners, "water")}</TabsContent>
      </Tabs>
    </div>
  )
}
