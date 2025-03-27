export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)] relative">
      {/* Background Video */}
      <video
        src="/HomeScreenVideo.mp4"
        autoPlay
        loop
        muted
        className="w-full h-[700px] object-cover absolute top-0 z-[-1]"
      ></video>

      {/* Marquee Section */}
      <div className="fixed bottom-0 left-0 w-full bg-black text-white  overflow-hidden">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-lg px-4 w-[10%] sm:block hidden">What’s New</span>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="flex space-x-8 animate-marquee">
              {[
                "आशा के साथ “स्वच्छ वायु, स्वच्छ इंदौर” का संकल्प पूरा होने का विश्वास",
                "रिहायशी वातावरण को बेहतर बनाने हेतु सर्वोत्‍तम पद्धियों के लिए इन्‍दौर को मिला हुडको पुरस्‍कार 2024",
                "स्वच्छ सर्वेक्षण-2024 में पूरे देश में फिर से स्वच्छता में नंबर - 1 आकर इंदौर बनेगा स्‍वच्‍छता में सिरमौर",
                "इन्‍दौर में पहली बार होगा व्‍हाइट टॉपिंग सड़क का निर्माण",
                "जल संरक्षण और प्रबंधन में भी इन्‍दौर ने नया इतिहास रहा, 5वें राष्‍ट्रीय जल पुरस्‍कारों में इन्‍दौर को वेस्‍ट ज़ोन का नम्‍बर 1 जिला घोषित किया गया।",
              ].map((item, index) => (
                <span key={index} className="text-sm md:text-base">
                  <a href="/" className="text-white hover:underline mx-4">
                    <li>{item}</li>
                  </a>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
