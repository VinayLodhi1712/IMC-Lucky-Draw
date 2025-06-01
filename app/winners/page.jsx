// app/winners/page.jsx
"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Trophy, Award, Sparkles, Star, MapPin, Home } from "lucide-react";
import { ClipLoader } from "react-spinners";

// Dynamically import Confetti to avoid SSR issues
const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

export default function WinnersPage() {
  const [propertyWinners, setPropertyWinners] = useState([]);
  const [waterWinners, setWaterWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: undefined, height: undefined });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener('resize', handleResize);
      handleResize(); // Set initial size
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);


  useEffect(() => {
    const fetchPropertyWinners = async () => {
      try {
        const response = await fetch("http://localhost:5000/getAllPropertyWinners");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPropertyWinners(data);
      } catch (error) {
        console.error("Error fetching property winners:", error);
      }
    };

    const fetchWaterWinners = async () => {
      try {
        const response = await fetch("http://localhost:5000/getAllWaterWinners");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setWaterWinners(data);
      } catch (error) {
        console.error("Error fetching water winners:", error);
      }
    };

    Promise.all([fetchPropertyWinners(), fetchWaterWinners()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false)); // Also set loading to false on error

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000); // Confetti for 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const getWinnersByPosition = (winners, position) => {
    return winners.filter(winner => winner.POSITION === position);
  };

  const getZoneWinners = (winners) => {
    return winners.filter(winner => winner.POSITION?.startsWith("Zone "));
  };
  
  // Helper function to extract zone number for sorting
  const getZoneNumberFromPosition = (positionString) => {
    if (typeof positionString !== 'string' || !positionString.startsWith("Zone ")) {
      return Infinity; 
    }
    const num = parseInt(positionString.split(" ")[1], 10);
    return isNaN(num) ? Infinity : num;
  };

  const renderWinnerList = (winners, type) => {
    const zoneData = getZoneWinners(winners).reduce((acc, winner) => {
      const key = winner.POSITION;
      if (!acc[key]) acc[key] = { winners: [], zoneNumber: getZoneNumberFromPosition(key) };
      acc[key].winners.push(winner);
      return acc;
    }, {});
  
    const sortedZones = Object.entries(zoneData)
      .sort(([, zoneAData], [, zoneBData]) => zoneAData.zoneNumber - zoneBData.zoneNumber);

    const nameField = type === "property" ? "PROPERTY_OWNER_NAME" : "NAME";

    return (
      <div className="space-y-12">
        {/* First Prize Winner */}
        {getWinnersByPosition(winners, "1st").length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Trophy className="h-8 w-8 text-yellow-500 mr-2" />
              First Prize Winner
            </h2>
            {getWinnersByPosition(winners, "1st").map((winner, index) => (
              <div key={index} className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-6 rounded-lg shadow-lg border border-yellow-200 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 opacity-10">
                  <Trophy className="h-32 w-32 text-yellow-500" />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-full md:w-1/3 flex justify-center">
                    <div className="relative w-48 h-48">
                      <Image src="/car.png" alt="Car" layout="fill" objectFit="contain" className="drop-shadow-xl" />
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 space-y-3">
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-lg py-1 px-3">Grand Prize</Badge>
                    <h3 className="text-xl md:text-2xl font-bold">{winner[nameField]}</h3>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>Ward: {winner.WARD}, Zone: {winner.ZONE}</span>
                    </div>
                    <p className="italic text-gray-500">
                      "Congratulations on winning a brand new car! Thank you for being a responsible citizen."
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Second Prize Winners */}
        {getWinnersByPosition(winners, "2nd").length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Award className="h-8 w-8 text-gray-400 mr-2" />
              Second Prize Winners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getWinnersByPosition(winners, "2nd").map((winner, index) => (
                <Card key={index} className="overflow-hidden bg-gray-50 border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-1 bg-gradient-to-r from-gray-200 to-gray-300" />
                  <CardContent className="p-6 pt-5">
                    <div className="flex justify-center mb-4">
                      <div className="relative w-32 h-32">
                        <Image src="/scooty.png" alt="Scooty" layout="fill" objectFit="contain" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-center mb-3">{winner[nameField]}</h3>
                    <div className="flex items-center justify-center text-gray-600 text-sm">
                      <Home className="h-4 w-4 mr-1" />
                      <span>Ward: {winner.WARD}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Third Prize Winners */}
        {getWinnersByPosition(winners, "3rd").length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Award className="h-8 w-8 text-amber-700 mr-2" />
              Third Prize Winners
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {getWinnersByPosition(winners, "3rd").map((winner, index) => (
                <Card key={index} className="overflow-hidden bg-amber-50 border-amber-100 hover:shadow-md transition-shadow">
                  <div className="h-24 relative">
                    <Image src="/tv.png" alt="TV" layout="fill" objectFit="contain" className="p-2" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-center truncate" title={winner[nameField]}>
                      {winner[nameField]}
                    </h3>
                    <div className="flex items-center justify-center text-gray-600 text-xs mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>Ward: {winner.WARD}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Zone Winners */}
        {sortedZones.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Star className="h-8 w-8 text-blue-500 mr-2" />
              Zone Prize Winners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedZones.map(([position, data]) => {
                if (data.winners.length === 0) return null;
                return (
                  <Card key={position} className="overflow-hidden">
                    <div className="p-4 bg-blue-50 flex justify-between items-center border-b">
                      <h3 className="font-bold text-lg">{position}</h3>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {data.winners.length} Winner{data.winners.length === 1 ? "" : "s"}
                      </Badge>
                    </div>
                    <CardContent className="p-0">
                      <div className="p-3 grid grid-cols-5 items-center">
                        <div className="col-span-1">
                          <div className="relative w-full aspect-square">
                            <Image src="/mixer.jpeg" alt="Mixer Grinder" layout="fill" objectFit="contain" className="p-1" />
                          </div>
                        </div>
                        <div className="col-span-4 pl-3">
                          <ul className="space-y-2">
                            {data.winners.slice(0, 5).map((winner, idx) => (
                              <li key={idx} className="text-sm truncate" title={winner[nameField]}>
                                {winner[nameField]}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ClipLoader color="#3b82f6" size={60} />
        <p className="mt-4 text-lg">Loading winners...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-16"> {/* pt-24 for top padding */}
      {showConfetti && windowSize.width && windowSize.height && (
         <Confetti width={windowSize.width} height={windowSize.height} recycle={true} numberOfPieces={200} />
      )}
      
      <div className="flex flex-col items-center mb-10">
        <div className="relative w-full max-w-4xl">
          <div className="absolute -top-16 right-4 w-32 h-32 md:w-40 md:h-40 z-10">
            <Image
              src="/mayor.png" // Ensure this image is in /public/mayor.png
              alt="Mayor"
              width={160}
              height={160}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              बधाई हो सभी विजेताओं को!
            </h1>
            <p className="text-lg md:text-xl">
              Congratulations to all the winners of IMC Lucky Draw
            </p>
            <div className="mt-4 flex justify-center items-center">
              <Sparkles className="h-6 w-6 mr-2 animate-pulse" />
              <span>Tax Payment Rewards Program 2025</span>
              <Sparkles className="h-6 w-6 ml-2 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="property" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="property" className="text-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white">Property Tax Winners</TabsTrigger>
          <TabsTrigger value="water" className="text-lg data-[state=active]:bg-green-500 data-[state=active]:text-white">Water Tax Winners</TabsTrigger>
        </TabsList>
        
        <TabsContent value="property">
          {renderWinnerList(propertyWinners, "property")}
        </TabsContent>
        
        <TabsContent value="water">
          {renderWinnerList(waterWinners, "water")}
        </TabsContent>
      </Tabs>
    </div>
  );
}