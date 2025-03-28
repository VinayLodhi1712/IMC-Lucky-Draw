// import { FaTrophy } from "react-icons/fa";
// import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)] relative">
      {/* Background Video */}
      <video
        src="https://res.cloudinary.com/dqe7okgzb/video/upload/f_auto,q_auto/v1743139328/HomeScreenVideo_iureq4.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-[800px] object-cover z-[-1]"
      ></video>

      {/* overview section  */}
      <div className="mt-5 mb-5">
        <p className="text-2xl tracking-wider font-bold text-center text-[#212529]">
          Lucky Draw Event
        </p>
        <p className="text-lg tracking-wider text-center text-[#212529] w-3/4 m-auto mt-2">
          Indore Municipal Corporation (IMC) is organizing a special Lucky Draw
          Event to encourage timely payment of advance property tax and water
          tax. Citizens who have paid their advance property tax and water tax
          are eligible to participate in this exciting lucky draw and stand a
          chance to win amazing prizes.
        </p>
      </div>

      {/* price section  */}
      <div className="overflow-x-auto">
        <p className="text-2xl tracking-wider font-bold text-center text-[#212529]">
          Prices
        </p>

        {/* first  */}
        <div>
          <p className="text-lg tracking-wider text-center text-[#212529] w-full mt-2">
            1<sup>st</sup>
            first position winner will win a electric car
          </p>
         
        </div>
      </div>

      {/* Marquee Section */}
      <div className="w-full bg-black text-white  overflow-hidden">
        <div className="flex items-center">
          <span className="font-semibold text-lg px-4 w-[10%] h-full sm:block hidden bg-[#FF6500]">
            What’s New
          </span>

          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="flex space-x-8 animate-marquee">
              {[
                "आशा के साथ “स्वच्छ वायु, स्वच्छ इंदौर” का संकल्प पूरा होने का विश्वास",
                "रिहायशी वातावरण को बेहतर बनाने हेतु सर्वोत्‍तम पद्धियों के लिए इन्‍दौर को मिला हुडको पुरस्‍कार 2024",
                "स्वच्छ सर्वेक्षण-2024 में पूरे देश में फिर से स्वच्छता में नंबर - 1 आकर इंदौर बनेगा स्‍वच्‍छता में सिरमौर",
                "इन्‍दौर में पहली बार होगा व्‍हाइट टॉपिंग सड़क का निर्माण",
                "जल संरक्षण और प्रबंधन में भी इन्‍दौर ने नया इतिहास रहा, 5वें राष्‍ट्रीय जल पुरस्‍कारों में इन्‍दौर को वेस्‍ट ज़ोन का नम्‍बर 1 जिला घोषित किया गया।",
              ].map((item, index) => (
                <span
                  key={index}
                  className="text-sm md:text-base flex items-center m-2"
                >
                  <a href="/" className="text-white hover:underline">
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
