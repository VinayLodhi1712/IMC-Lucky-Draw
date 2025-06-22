"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { CheckCircle, Zap, Clock } from "lucide-react"

const CountdownTimer = ({ onComplete }) => {
  const [count, setCount] = useState(3)
  
  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      onComplete()
    }
  }, [count, onComplete])
  
  return (
    <motion.div
      key={count}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-6xl font-bold text-amber-600 mb-8"
    >
      {count.toString().padStart(2, "0")}
    </motion.div>
  )
}

const TumblerColumn = ({ letter, delay = 0, isActive = false }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="relative"
    >
      {/* Tumbler Container */}
      <div className="w-24 h-32 bg-white border-2 border-gray-300 rounded-lg shadow-lg relative">
        {/* Letter Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={letter}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-bold text-gray-800"
          >
            {letter}
          </motion.span>
        </div>
        
        {/* Active Glow */}
        {isActive && (
          <motion.div
            className="absolute -inset-1 bg-blue-400 rounded-lg blur-sm opacity-50"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
      
      {/* Base */}
      <div className="w-28 h-3 bg-gray-400 rounded-full mx-auto mt-2"></div>
    </motion.div>
  )
}

const LotterySequence = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const sequence = [
    { left: "0", right: "3" },
    { left: "0", right: "2" },
    { left: "0", right: "1" },
    { left: "G", right: "O" }
  ]
  
  useEffect(() => {
    if (currentStep < sequence.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 1500)
      return () => clearTimeout(timer)
    } else if (currentStep === sequence.length - 1 && sequence[currentStep].left === "G" && sequence[currentStep].right === "O") {
      // Only complete after GO appears
      setTimeout(onComplete, 1000)
    }
  }, [currentStep, onComplete])
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6">
        <p className="text-gray-700 font-bold text-xl text-center">
          🎰 Official Draw in Progress
        </p>
      </div>
      
      {/* Tumblers showing the sequence */}
      <div className="flex gap-8 mb-6">
        <TumblerColumn 
          letter={sequence[currentStep].left} 
          delay={0} 
          isActive={currentStep < sequence.length - 1}
        />
        <TumblerColumn 
          letter={sequence[currentStep].right} 
          delay={0.2} 
          isActive={currentStep < sequence.length - 1}
        />
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Clock className="w-5 h-5 animate-pulse" />
          <span className="text-sm">
            {currentStep === sequence.length - 1 ? "Finalizing selection..." : "Drawing in progress..."}
          </span>
        </div>
      </div>
    </div>
  )
}

const LoadingCircles = () => {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center mt-6">
      <motion.div
        className="absolute w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
             
      <motion.div
        className="absolute w-8 h-8 border-4 border-gray-200 border-r-green-600 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
             
      <motion.div
        className="absolute w-4 h-4 border-2 border-gray-200 border-b-red-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

export const DigitalTumbler = ({ text }) => {
  const [sequenceComplete, setSequenceComplete] = useState(false)
  
  return (
    <div className="flex flex-col items-center justify-center py-6">
      {!sequenceComplete ? (
        <div className="w-full">
          <LotterySequence onComplete={() => setSequenceComplete(true)} />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <p className="text-green-700 font-bold text-xl text-center mb-4">
              🏆 Winner Selected!
            </p>
          </div>
          <div className="flex gap-8 mb-4">
            <TumblerColumn letter="G" delay={0} />
            <TumblerColumn letter="O" delay={0.2} />
          </div>
          <LoadingCircles />
          <p className="text-gray-600 text-sm mt-4 font-medium">Processing Final Results...</p>
        </div>
      )}
    </div>
  )
}