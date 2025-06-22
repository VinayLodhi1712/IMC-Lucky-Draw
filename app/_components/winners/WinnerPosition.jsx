"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Trophy, Users, Shield } from "lucide-react"
import { WinnerGrid } from "./WinnerCard"
import Image from "next/image"
import * as XLSX from 'xlsx'

export function WinnerPositionView({ position, winners, onBack }) {
  const [loadingExcel, setLoadingExcel] = useState(false)

  const downloadPositionReport = () => {
    setLoadingExcel(true)
    
    try {
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      
      // Prepare header data
      const headerData = [
        [`${position.position} - ${position.prize.prizeName} Winners`],
        [`Lucky Draw - ${position.type === "property" ? "Property Tax" : "Water Tax"} Category`],
        [`Total Winners: ${winners.length}`],
        [`Generated on: ${new Date().toLocaleDateString()}`],
        [], // Empty row
        // Column headers based on your data structure
        ['S.No.', 'Property Owner Name', 'Partner/Phone', 'Ward', 'Zone', 'Tax Amount', 'Assessment Year', 'Serial No.']
      ]
      
      // Function to safely get value from winner object
      const getValue = (winner, key, fallback = '') => {
        if (winner && winner[key] !== undefined && winner[key] !== null) {
          return winner[key].toString()
        }
        return fallback
      }
      
      // Prepare winners data using the correct field names from your data
      const winnersData = winners.map((winner, index) => {
        console.log(`Processing Winner ${index + 1}:`, winner) // Keep some debug
        
        return [
          index + 1, // Running S.No.
          getValue(winner, 'PROPERTY_OWNER_NAME'),
          getValue(winner, 'PARTNER'),
          getValue(winner, 'WARD'),
          getValue(winner, 'ZONE'),
          getValue(winner, 'TAX_AMT'),
          getValue(winner, 'ASSMENTYEAR'),
          getValue(winner, 'SR_NO')
        ]
      })
      
      console.log("Final Excel data:", winnersData) // Debug final data
      
      // Combine header and winners data
      const sheetData = [...headerData, ...winnersData]
      
      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(sheetData)
      
      // Set column widths
      const colWidths = [
        { wch: 8 },  // S.No.
        { wch: 25 }, // Property Owner Name
        { wch: 15 }, // Partner/Phone
        { wch: 10 }, // Ward
        { wch: 10 }, // Zone
        { wch: 12 }, // Tax Amount
        { wch: 15 }, // Assessment Year
        { wch: 10 }  // Serial No.
      ]
      ws['!cols'] = colWidths
      
      // Style the header rows
      const range = XLSX.utils.decode_range(ws['!ref'])
      
      // Style title rows (rows 0-3)
      for (let R = 0; R <= 3; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
          const cell_address = XLSX.utils.encode_cell({ r: R, c: C })
          if (!ws[cell_address]) continue
          ws[cell_address].s = {
            font: { bold: true, sz: R < 2 ? 14 : 12 },
            alignment: { horizontal: 'center' }
          }
        }
      }
      
      // Style the column headers (row 5)
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cell_address = XLSX.utils.encode_cell({ r: 5, c: C })
        if (!ws[cell_address]) continue
        ws[cell_address].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "E0E0E0" } },
          alignment: { horizontal: 'center' }
        }
      }
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, `${position.position} Winners`)
      
      // Generate filename
      const filename = `${position.position.replace(/\s+/g, "-")}-${position.type}-winners-report.xlsx`
      
      // Download the file
      XLSX.writeFile(wb, filename)
      
      console.log("Excel file generated successfully!")
      
    } catch (error) {
      console.error("Error generating Excel file:", error)
      console.error("Error details:", error.message)
      alert("Error generating Excel file. Please check console for details.")
    } finally {
      setLoadingExcel(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm font-medium text-gray-700 hover:bg-gray-50 border-2 border-gray-300 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Winners List
          </Button>

          <Button
            onClick={downloadPositionReport}
            disabled={loadingExcel}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Download className="w-5 h-5 mr-2" />
            {loadingExcel ? "Generating..." : `Download ${position.position} Report`}
          </Button>
        </div>
        {/* Position Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white p-8 rounded-2xl text-center shadow-2xl mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Trophy className="w-8 h-8 text-yellow-300" />
            <h2 className="text-3xl font-bold">🎉 {position.position} Winners 🎉</h2>
            <Trophy className="w-8 h-8 text-yellow-300" />
          </div>
          <p className="text-green-100 text-xl mb-4">
            {position.prize.prizeName} • {position.type === "property" ? "Property Tax" : "Water Tax"} Category
          </p>
          <div className="flex items-center justify-center gap-4 text-green-200">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">
                {winners.length} Winner{winners.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Government Certified</span>
            </div>
          </div>
        </motion.div>
        {/* Prize Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative w-full max-w-lg h-64 mx-auto mb-12"
        >
          <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-3 border-gray-300 p-6 shadow-xl">
            <Image
              src={position.prize.image || "/placeholder.svg?height=250&width=400"}
              alt={position.prize.prizeName}
              fill
              style={{ objectFit: "contain" }}
              className="rounded-xl drop-shadow-lg"
            />
          </div>
        </motion.div>
        {/* Winners Certificates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Official Winner Certificates</h3>
            <p className="text-gray-600">Download individual certificates for each winner</p>
          </div>

          <WinnerGrid winners={winners} prize={position.prize} />
        </motion.div>
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-center text-slate-500"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-700">Certified & Transparent</span>
          </div>
          <p className="text-sm">Government of India Approved Lucky Draw System • All results are final and verified</p>
        </motion.div>
      </div>
    </div>
  )
}