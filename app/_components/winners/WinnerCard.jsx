"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Download, Star } from "lucide-react"

const safeDisplay = (value, fallback = "-") =>
  value !== undefined && value !== null && value !== "" ? value : fallback

const getRankText = (title) => {
  if (title.toLowerCase().includes("grand")) return "Grand Prize Winner"
  if (title.toLowerCase().includes("second")) return "Second Prize Winner"
  if (title.toLowerCase().includes("third")) return "Third Prize Winner"
  if (title.toLowerCase().includes("zonal")) return "Zonal Prize Winner"
  return "Official Winner"
}

const DownloadCertificate = ({ winner, prize }) => {
  const downloadAsPNG = async () => {
    try {
      const canvas = document.createElement("canvas")
      canvas.width = 1600
      canvas.height = 1000
      const ctx = canvas.getContext("2d")

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "#fef7ed")
      gradient.addColorStop(0.5, "#ffffff")
      gradient.addColorStop(1, "#f0fdf4")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Decorative borders
      ctx.strokeStyle = "#1e40af"
      ctx.lineWidth = 8
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

      ctx.strokeStyle = "#f59e0b"
      ctx.lineWidth = 4
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)

      // Header section
      const logoImg = new window.Image()
      logoImg.crossOrigin = "anonymous"
      logoImg.src = "/imclogo.png"
      await new Promise((resolve) => (logoImg.onload = resolve))
      ctx.drawImage(logoImg, 80, 80, 100, 100)

      ctx.fillStyle = "#1e40af"
      ctx.font = "bold 48px Arial"
      ctx.textAlign = "left"
      ctx.fillText("Indore Municipal Corporation", 200, 120)
      ctx.font = "36px Arial"
      ctx.fillText("इंदौर नगर निगम", 200, 160)

      // Mayor image
      const mayorImg = new window.Image()
      mayorImg.crossOrigin = "anonymous"
      mayorImg.src = "/mayor.png"
      await new Promise((resolve) => (mayorImg.onload = resolve))
      ctx.save()
      ctx.beginPath()
      ctx.arc(canvas.width - 150, 130, 60, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(mayorImg, canvas.width - 210, 70, 120, 120)
      ctx.restore()

      // Winner ribbon
      ctx.fillStyle = "#dc2626"
      ctx.fillRect(canvas.width - 200, 40, 160, 40)
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 20px Arial"
      ctx.textAlign = "center"
      ctx.fillText("WINNER", canvas.width - 120, 65)

      // Certificate title
      ctx.fillStyle = "#374151"
      ctx.font = "bold 36px Arial"
      ctx.textAlign = "center"
      ctx.fillText("CERTIFICATE OF RECOGNITION", canvas.width / 2, 260)

      // Winner name section
      const winnerName = safeDisplay(winner.PROPERTY_OWNER_NAME || winner.NAME).toUpperCase()
      ctx.fillStyle = "#1e40af"
      ctx.font = "bold 56px Arial"

      // Auto-adjust font size for long names
      let fontSize = 56
      ctx.font = `bold ${fontSize}px Arial`
      while (ctx.measureText(winnerName).width > canvas.width - 200 && fontSize > 32) {
        fontSize -= 2
        ctx.font = `bold ${fontSize}px Arial`
      }

      ctx.fillText(winnerName, canvas.width / 2, 350)

      // Award designation
      ctx.fillStyle = "#15803d"
      ctx.font = "bold 40px Arial"
      ctx.fillText(getRankText(prize.title), canvas.width / 2, 420)

      // Prize section
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect((canvas.width - 600) / 2, 480, 600, 220)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 3
      ctx.strokeRect((canvas.width - 600) / 2, 480, 600, 220)

      ctx.fillStyle = "#475569"
      ctx.font = "bold 28px Arial"
      ctx.fillText("AWARDED PRIZE", canvas.width / 2, 520)

      // Prize image
      const prizeImg = new window.Image()
      prizeImg.crossOrigin = "anonymous"
      prizeImg.src = prize.image
      await new Promise((resolve) => (prizeImg.onload = resolve))
      ctx.drawImage(prizeImg, (canvas.width - 160) / 2, 540, 160, 120)

      ctx.font = "bold 32px Arial"
      ctx.fillStyle = "#059669"
      ctx.fillText(prize.prizeName, canvas.width / 2, 690)

      // Details section
      ctx.fillStyle = "#f9fafb"
      ctx.fillRect(80, 750, 600, 80)
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 2
      ctx.strokeRect(80, 750, 600, 80)

      ctx.font = "24px Arial"
      ctx.fillStyle = "#374151"
      ctx.textAlign = "left"

      if (prize.id === "zone") {
        ctx.fillText(`Zone: ${safeDisplay(winner.ZONE)} | Ward: ${safeDisplay(winner.WARD)}`, 100, 780)
        ctx.fillText(`Assessment Year: ${safeDisplay(winner.ASSMENTYEAR)}`, 100, 810)
      } else {
        ctx.fillText(`Assessment Year: ${safeDisplay(winner.ASSMENTYEAR)}`, 100, 795)
      }

      // Enhanced signature section
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(canvas.width - 500, canvas.height - 100)
      ctx.lineTo(canvas.width - 80, canvas.height - 100)
      ctx.stroke()

      ctx.font = "28px Arial"
      ctx.fillStyle = "#374151"
      ctx.textAlign = "center"
      ctx.fillText("Municipal Commissioner", canvas.width - 290, canvas.height - 60)
      ctx.font = "20px Arial"
      // ctx.fillText("Indore Municipal Corporation", canvas.width - 290, canvas.height - 30)

      // Download
      const link = document.createElement("a")
      link.download = `Certificate_${safeDisplay(winner.PROPERTY_OWNER_NAME || winner.NAME).replace(/[^a-zA-Z0-9]/g, "_")}.png`
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()
    } catch (error) {
      console.error("Error downloading certificate:", error)
    }
  }

  return (
    <motion.button
      onClick={downloadAsPNG}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white rounded-lg px-4 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
    >
      <Download className="w-4 h-4 md:w-5 md:h-5" />
      Download Certificate
    </motion.button>
  )
}

export const WinnerDisplayCard = ({ winner, prize, index }) => {
  const displayName = safeDisplay(winner.PROPERTY_OWNER_NAME || winner.NAME)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 * index, type: "spring", stiffness: 100 }}
      className="relative w-full max-w-[600px] mx-auto"
    >
      {/* Winner Ribbon */}
      <div className="absolute -top-1 -right-1 z-30">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full font-bold text-xs shadow-lg border border-white"
        >
          WINNER
        </motion.div>
      </div>

      {/* Certificate Card - Responsive dimensions */}
      <div className="w-full bg-gradient-to-br from-orange-50 via-white to-green-50 rounded-xl shadow-2xl border-2 border-blue-300 relative overflow-hidden aspect-[3/2] min-h-[280px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px]">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-br-full opacity-30"></div>
        <div className="absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-bl from-green-400 to-green-600 rounded-bl-full opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-tr-full opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gradient-to-tl from-green-400 to-green-600 rounded-tl-full opacity-30"></div>

        {/* Background IMC Logo */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <Image 
            src="/imclogo.png" 
            alt="IMC Logo" 
            width={100} 
            height={100} 
            className="opacity-5 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32" 
          />
        </div>

        {/* Mayor image */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-orange-300 shadow-lg bg-white p-0.5"
          >
            <Image 
              src="/mayor.png" 
              alt="Mayor" 
              width={64} 
              height={64} 
              className="rounded-full object-cover w-full h-full" 
            />
          </motion.div>
        </div>

        <div className="relative z-10 h-full flex flex-col p-3 sm:p-4 md:p-5 lg:p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4"
          >
            <Image 
              src="/imclogo.png" 
              alt="IMC Logo" 
              width={32} 
              height={32} 
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" 
            />
            <div>
              <h2 className="text-xs sm:text-sm md:text-base font-bold text-blue-900 leading-tight">
                Indore Municipal Corporation
              </h2>
              <h3 className="text-xs sm:text-sm text-blue-700">
                इंदौर नगर निगम
              </h3>
            </div>
          </motion.div>

          {/* Main content area */}
          <div className="flex-1 flex items-center justify-between gap-2 sm:gap-3 md:gap-4 min-h-0">
            <div className="flex-1 min-w-0">
              {/* Winner Name */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-blue-900 mb-2 uppercase leading-tight"
                style={{ wordBreak: "break-word", fontSize: "clamp(0.875rem, 2vw, 1.25rem)" }}
              >
                {displayName}
              </motion.h1>

              {/* Award Title */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="mb-2 sm:mb-3"
              >
                <span className="text-xs sm:text-sm font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                  {getRankText(prize.title)}
                </span>
              </motion.div>

              {/* Prize Name */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-sm sm:text-base md:text-lg font-bold text-orange-800 mb-2 sm:mb-3 bg-orange-100 px-2 py-1 rounded inline-block leading-tight"
                style={{ fontSize: "clamp(0.75rem, 1.5vw, 1.125rem)" }}
              >
                {prize.prizeName}
              </motion.h3>

              {/* Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="text-xs text-slate-700 space-y-1 bg-slate-50 p-2 rounded"
              >
                {prize.id === "zone" && (
                  <div className="font-semibold">
                    Zone: {safeDisplay(winner.ZONE)} | Ward: {safeDisplay(winner.WARD)}
                  </div>
                )}
                <div className="font-semibold">Assessment Year: {safeDisplay(winner.ASSMENTYEAR)}</div>
              </motion.div>
            </div>

            {/* Prize Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1 + index * 0.1, type: "spring", stiffness: 100 }}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative flex-shrink-0"
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 p-1 sm:p-2 shadow-lg">
                <Image
                  src={prize.image || "/placeholder.svg?height=80&width=80"}
                  alt={prize.prizeName}
                  width={80}
                  height={80}
                  style={{ objectFit: "contain" }}
                  className="drop-shadow-lg w-full h-full"
                />
              </div>
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-500 fill-current drop-shadow-lg" />
              </motion.div>
            </motion.div>
          </div>

          {/* Footer with signature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 + index * 0.1 }}
            className="pt-2 sm:pt-3 border-t-2 border-slate-300 mt-2 sm:mt-3"
          >
            <div className="flex justify-end">
              <div className="text-right">
                <div className="w-20 sm:w-24 md:w-32 h-0.5 bg-slate-600 mb-1 ml-auto"></div>
                <p className="text-xs text-slate-700 font-bold">Municipal Commissioner</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Download Button */}
      <DownloadCertificate winner={winner} prize={prize} />
    </motion.div>
  )
}

// Enhanced Grid component with proper responsive spacing
export const WinnerGrid = ({ winners, prize }) => {
  const count = winners.length

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
      {count === 1 && (
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <WinnerDisplayCard winner={winners[0]} prize={prize} index={0} />
          </div>
        </div>
      )}

      {count === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 justify-items-center">
          {winners.map((winner, index) => (
            <WinnerDisplayCard key={winner.SR_NO || index} winner={winner} prize={prize} index={index} />
          ))}
        </div>
      )}

      {count === 3 && (
        <div className="space-y-8 sm:space-y-12 md:space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 justify-items-center">
            <WinnerDisplayCard winner={winners[0]} prize={prize} index={0} />
            <WinnerDisplayCard winner={winners[1]} prize={prize} index={1} />
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <WinnerDisplayCard winner={winners[2]} prize={prize} index={2} />
            </div>
          </div>
        </div>
      )}

      {count === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 justify-items-center">
          {winners.map((winner, index) => (
            <WinnerDisplayCard key={winner.SR_NO || index} winner={winner} prize={prize} index={index} />
          ))}
        </div>
      )}

      {count === 5 && (
        <div className="space-y-8 sm:space-y-12 md:space-y-16">
          {/* First row - 2 cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 justify-items-center">
            <WinnerDisplayCard winner={winners[0]} prize={prize} index={0} />
            <WinnerDisplayCard winner={winners[1]} prize={prize} index={1} />
          </div>
          {/* Second row - 2 cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 justify-items-center">
            <WinnerDisplayCard winner={winners[2]} prize={prize} index={2} />
            <WinnerDisplayCard winner={winners[3]} prize={prize} index={3} />
          </div>
          {/* Third row - 1 card centered */}
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <WinnerDisplayCard winner={winners[4]} prize={prize} index={4} />
            </div>
          </div>
        </div>
      )}

      {count > 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 justify-items-center">
          {winners.map((winner, index) => (
            <WinnerDisplayCard key={winner.SR_NO || index} winner={winner} prize={prize} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}