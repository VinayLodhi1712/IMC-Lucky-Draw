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
      <div className="w-24 h-32 bg-gradient-to-b from-amber-100 via-yellow-200 to-amber-300 border-4 border-amber-400 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Inner Shadow Effect */}
        <div className="absolute inset-2 bg-gradient-to-b from-transparent via-amber-50 to-transparent rounded-xl border border-amber-300"></div>
        
        {/* Letter Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={letter}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-5xl font-black text-amber-900 drop-shadow-lg"
          >
            {letter}
          </motion.span>
        </div>
        
        {/* Highlight Effect */}
        <div className="absolute top-2 left-2 right-2 h-6 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 rounded-full blur-sm"></div>
        
        {/* Active Glow */}
        {isActive && (
          <motion.div
            className="absolute -inset-1 bg-yellow-400 rounded-2xl blur-md opacity-60"
            animate={{ opacity: [0.6, 0.8, 0.6] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
      
      {/* Base */}
      <div className="w-28 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full mx-auto mt-2 shadow-lg"></div>
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
    } else {
      setTimeout(onComplete, 2000)
    }
  }, [currentStep, onComplete])
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6">
        <p className="text-amber-700 font-bold text-xl text-center mb-2">
          🎰 Lottery Selection in Progress
        </p>
        <div className="w-32 h-1 bg-amber-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-amber-500"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / sequence.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
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
      
      {currentStep === sequence.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-lg">
            <CheckCircle className="w-6 h-6" />
            Selection Complete!
          </div>
          <p className="text-amber-600 text-sm mt-2">Final Result: G - O</p>
        </motion.div>
      )}
      
      {currentStep < sequence.length - 1 && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-amber-600">
            <Clock className="w-5 h-5 animate-pulse" />
            <span className="text-sm">Drawing in progress...</span>
          </div>
        </div>
      )}
    </div>
  )
}

const LoadingCircles = () => {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center mt-6">
      <motion.div
        className="absolute w-12 h-12 border-3 border-amber-200 border-t-amber-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
             
      <motion.div
        className="absolute w-8 h-8 border-3 border-yellow-200 border-r-yellow-600 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
             
      <motion.div
        className="absolute w-4 h-4 border-2 border-orange-200 border-b-orange-600 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

export const DigitalTumbler = ({ text }) => {
  const [showTumblers, setShowTumblers] = useState(false)
  const [sequenceComplete, setSequenceComplete] = useState(false)
  
  return (
    <div className="flex flex-col items-center justify-center py-6">
      {!showTumblers ? (
        <div className="flex flex-col items-center">
          <CountdownTimer onComplete={() => setShowTumblers(true)} />
          <p className="text-amber-700 text-lg font-medium">Initializing Draw Sequence...</p>
        </div>
      ) : !sequenceComplete ? (
        <div className="w-full">
          <LotterySequence onComplete={() => setSequenceComplete(true)} />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <p className="text-green-700 font-bold text-xl text-center mb-4">
              🏆 Selection Confirmed!
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