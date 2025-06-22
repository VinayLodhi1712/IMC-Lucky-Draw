"use client"
import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Shield, CheckCircle, Award } from "lucide-react"

export const ZoneInputForm = ({ onConfirm }) => {
  const [zone, setZone] = useState("")
  const [error, setError] = useState("")
  const [isValid, setIsValid] = useState(false)

  const handleZoneChange = (e) => {
    const value = e.target.value
    setZone(value)
    setError("")

    const zoneNum = Number(value)
    if (value && (zoneNum < 1 || zoneNum > 19)) {
      setError("Zone must be between 1 and 19")
      setIsValid(false)
    } else if (value) {
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }

  const handleConfirm = () => {
    const zoneNum = Number(zone)
    if (!zone || zoneNum < 1 || zoneNum > 19) {
      setError("Please enter a valid zone number between 1 and 19.")
      return
    }
    setError("")
    onConfirm(zone)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && isValid) {
      handleConfirm()
    }
  }

  // Solution 1: Batch state updates using useCallback and flushSync
  const handleZoneClick = useCallback((zoneNum) => {
    // Batch all state updates together
    const zoneString = zoneNum.toString()
    setZone(zoneString)
    
    // Set validation state based on the new zone
    const isValidZone = zoneNum >= 1 && zoneNum <= 19
    setIsValid(isValidZone)
    setError("")
  }, [])

  // Get input styling without causing re-renders
  const getInputClassName = () => {
    const baseClasses = "w-full text-center text-3xl font-bold p-6 border-3 rounded-xl focus:ring-4 focus:ring-blue-200/50 focus:outline-none shadow-inner"
    
    if (error) {
      return `${baseClasses} border-red-400 bg-red-50 text-red-700 transition-colors duration-200`
    } else if (isValid) {
      return `${baseClasses} border-green-400 bg-green-50 text-green-700 transition-colors duration-200`
    } else {
      return `${baseClasses} border-slate-300 bg-slate-50 text-slate-700 focus:border-blue-500 focus:bg-blue-50 transition-colors duration-200`
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center gap-8 max-w-2xl mx-auto p-10"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center relative"
      >
        {/* Government Badge */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="bg-gradient-to-r from-orange-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg"
          >
            <Shield className="w-4 h-4" />
            GOI CERTIFIED
          </motion.div>
        </div>

        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          className="mb-4 mt-8"
        >
          <Award className="w-16 h-16 text-blue-600 mx-auto" />
        </motion.div>

        <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-purple-600 to-blue-800 mb-4">
          Zone Selection Portal
        </h3>
        <p className="text-slate-600 text-xl leading-relaxed max-w-lg mx-auto">
          Please specify the administrative zone for conducting the
          <span className="font-bold text-blue-700"> Official Lucky Draw</span>
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full relative"
      >
        {/* Input Container */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur-lg"></div>

          <div className="relative bg-white border-4 border-slate-300 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <label htmlFor="zone-input" className="text-lg font-bold text-slate-700">
                Enter Zone Number (1-19)
              </label>
              {/* Solution 2: Use AnimatePresence to control mount/unmount animations better */}
              {isValid && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="ml-auto"
                  key="checkmark" // Add key to prevent re-mounting
                >
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </motion.div>
              )}
            </div>

            <input
              id="zone-input"
              type="number"
              value={zone}
              onChange={handleZoneChange}
              onKeyPress={handleKeyPress}
              placeholder="e.g., 5"
              min="1"
              max="19"
              className={getInputClassName()}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-red-600 text-base mt-4 font-semibold flex items-center gap-3 bg-red-50 p-4 rounded-xl border-2 border-red-200"
            key="error-message"
          >
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            {error}
          </motion.p>
        )}
      </motion.div>

      {/* Zone Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-2xl border-2 border-slate-200 shadow-lg"
      >
        <h4 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          Available Administrative Zones
        </h4>
        <div className="grid grid-cols-5 gap-3 text-base">
          {Array.from({ length: 19 }, (_, i) => i + 1).map((zoneNum) => (
            <motion.button
              key={zoneNum}
              onClick={() => handleZoneClick(zoneNum)}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              // Solution 3: Use layout prop to prevent layout shift animations
              layout={false}
              className={`p-4 rounded-xl font-bold transition-all duration-200 shadow-md ${
                zone === zoneNum.toString()
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl transform scale-105"
                  : "bg-white text-slate-600 hover:bg-slate-100 border-2 border-slate-200 hover:border-blue-300"
              }`}
            >
              {zoneNum}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Confirm Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full"
      >
        <Button
          onClick={handleConfirm}
          disabled={!isValid}
          size="lg"
          className={`w-full mt-6 font-bold text-xl py-8 rounded-2xl transition-all duration-300 ${
            isValid
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105"
              : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }`}
        >
          {isValid ? (
            <motion.div className="flex items-center gap-4" whileHover={{ x: 8 }}>
              <span>Confirm Zone {zone} & Proceed to Draw</span>
              <ArrowRight className="w-6 h-6" />
            </motion.div>
          ) : (
            <span>Please Select a Valid Zone</span>
          )}
        </Button>
      </motion.div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-sm text-slate-500 max-w-lg leading-relaxed"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="font-bold text-green-700 text-base">Secure & Transparent Process</span>
        </div>
        This zone selection is logged and monitored for complete transparency and compliance with government
        regulations.
      </motion.div>
    </motion.div>
  )
}