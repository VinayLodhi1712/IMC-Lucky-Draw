"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Loader2, Download, Trash2, Users, Award, PlayCircle, Settings, Shield, Star } from "lucide-react"
import { motion } from "framer-motion"

const PrizeCard = ({ prize, onSelect, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        y: -12,
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
      className="bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl shadow-lg border-2 border-slate-200/80 overflow-hidden flex flex-col relative group"
    >
      

      <div className="p-6 flex-grow">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${prize.color} shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Award className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-800 transition-colors">
              {prize.title}
            </h3>
            <p className="text-sm text-slate-600 font-medium">{prize.prizeName}</p>
          </div>
        </div>

        <div className="relative w-full h-48 my-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4">
          <Image
            src={prize.image || "/placeholder.svg"}
            alt={prize.prizeName}
            fill
            style={{ objectFit: "contain" }}
            sizes="33vw"
            className="drop-shadow-lg"
          />

          {/* Sparkle effects */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${20 + i * 25}%`,
                right: `${10 + i * 15}%`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.8, 0.4],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center text-sm text-slate-700 space-x-2 bg-slate-100 rounded-lg p-1">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="font-semibold">{prize.winnerCount}</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-100 to-slate-50 p-2 border-t border-slate-200">
        <Button
          onClick={() => onSelect(prize)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-base py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <motion.div className="flex items-center justify-center gap-3" whileHover={{ x: 5 }}>
            <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Initiate Draw</span>
          </motion.div>
        </Button>
      </div>
    </motion.div>
  )
}

export function DashboardView({ 
  title, 
  subtitle, 
  prizes, 
  onSelectPrize, 
  onDownload, 
  loadingExcel 
}) {
  return (
    <div className="min-h-screen pt-20">
      {/* Government Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-12 mb-8 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center gap-8 mb-6">
            {/* IMC Logo */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="relative"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-full p-2 backdrop-blur-sm border border-white/20 shadow-2xl">
                <Image 
                  src="/imclogo.png" 
                  alt="IMC Logo" 
                  width={96} 
                  height={96} 
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 w-20 h-20 md:w-24 md:h-24 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
            </motion.div>
            
            {/* Title Section */}
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Indore Municipal Corporation
              </h1>
              <p className="text-blue-200 text-base md:text-lg lg:text-xl font-medium mt-2">
                इंदौर नगर निगम • Official Lucky Draw System
              </p>
            </div>
            
            {/* Mayor Image */}
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
              className="relative"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-full p-1 backdrop-blur-sm border-2 border-white/30 shadow-2xl">
                <Image 
                  src="/mayor.png" 
                  alt="Mayor" 
                  width={96} 
                  height={96} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 w-20 h-20 md:w-24 md:h-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <main className="container mx-auto px-4 pb-12">
        {/* Title Section */}
        <motion.header 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-purple-600 to-blue-800 tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.header>

        {/* System Operations Panel */}
        <motion.div 
          className="mb-12 bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-xl border-2 border-slate-200 p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Settings className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">System Operations</h3>
                <p className="text-gray-600">Manage draw results and generate reports</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Button 
                onClick={onDownload} 
                disabled={loadingExcel} 
                variant="outline" 
                className="border-2 border-green-500 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-w-[180px]"
              >
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                >
                  {loadingExcel ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  <span>Download Report</span>
                </motion.div>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Prize Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {prizes.map((prize, index) => (
            <PrizeCard 
              key={prize.id} 
              prize={prize} 
              onSelect={onSelectPrize} 
              index={index}
            />
          ))}
        </div>
      </main>
    </div>
  );
}