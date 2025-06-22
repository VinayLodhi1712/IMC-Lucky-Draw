"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Translation data
const translations = {
  en: {
    // Navbar
    home: "HOME",
    property: "PROPERTY", 
    water: "WATER",
    winners: "WINNERS",
    login: "LOGIN",
    logout: "LOGOUT",
    confirmLogout: "Confirm Logout",
    areYouSure: "Are you sure you want to log out?",
    cancel: "Cancel",
    
    // Home page
    luckyDrawEvent: "🎉 Lucky Draw Event 🎉",
    eventDescription: "Indore Municipal Corporation (IMC) is organizing a special Lucky Draw Event to encourage timely payment of advance property tax and water tax. Citizens who have paid their advance property tax and water tax are eligible to participate in this exciting lucky draw and stand a chance to win amazing prizes.",
    prizesForWinners: "🎉 Prizes for Lucky Draw Winners",
    firstPrize: "1st Prize",
    secondPrize: "2nd Prize", 
    thirdPrize: "3rd Prize",
    fourthPrize: "4th Prize",
    winner: "Winner",
    winners: "Winners",
    winnersFromEachZone: "Winners from each zone",
    willWinA: "will win a",
    electricCar: "Electric Car",
    electricScooty: "Electric Scooty",
    lcdTv: "LCD TV",
    mixerGrinder: "Mixer Grinder",
    whatsNew: "What's New"
  },
  hi: {
    // Navbar  
    home: "होम",
    property: "संपत्ति",
    water: "पानी", 
    winners: "विजेता",
    login: "लॉगिन",
    logout: "लॉगआउट",
    confirmLogout: "लॉगआउट की पुष्टि करें",
    areYouSure: "क्या आप वाकई लॉग आउट करना चाहते हैं?",
    cancel: "रद्द करें",
    
    // Home page
    luckyDrawEvent: "🎉 लकी ड्रॉ इवेंट 🎉",
    eventDescription: "इंदौर नगर निगम (आईएमसी) एडवांस प्रॉपर्टी टैक्स और वाटर टैक्स के समय पर भुगतान को प्रोत्साहित करने के लिए एक विशेष लकी ड्रॉ इवेंट का आयोजन कर रहा है। जिन नागरिकों ने अपना एडवांस प्रॉपर्टी टैक्स और वाटर टैक्स का भुगतान किया है, वे इस रोमांचक लकी ड्रॉ में भाग लेने के पात्र हैं और अद्भुत पुरस्कार जीतने का मौका पा सकते हैं।",
    prizesForWinners: "🎉 लकी ड्रॉ विजेताओं के लिए पुरस्कार",
    firstPrize: "प्रथम पुरस्कार",
    secondPrize: "द्वितीय पुरस्कार",
    thirdPrize: "तृतीय पुरस्कार", 
    fourthPrize: "चतुर्थ पुरस्कार",
    winner: "विजेता",
    winners: "विजेता",
    winnersFromEachZone: "प्रत्येक जोन से विजेता",
    willWinA: "को मिलेगा",
    electricCar: "इलेक्ट्रिक कार",
    electricScooty: "इलेक्ट्रिक स्कूटी",
    lcdTv: "एलसीडी टीवी",
    mixerGrinder: "मिक्सर ग्राइंडर",
    whatsNew: "नया क्या है"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "hi")) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "hi" : "en");
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isHindi: language === "hi"
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};