"use client";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./_context/uselanguage";

export default function Home() {
  const { t } = useLanguage();

  const prizes = [
    {
      position: t("firstPrize"),
      emoji: "🏆",
      winners: `1 ${t("winner")}`,
      prize: t("electricCar"),
      image: "/car.png",
    },
    {
      position: t("secondPrize"),
      emoji: "🥈",
      winners: `3 ${t("winners")}`,
      prize: t("electricScooty"),
      image: "/scooty.png",
    },
    {
      position: t("thirdPrize"),
      emoji: "🥉",
      winners: `5 ${t("winners")}`,
      prize: t("lcdTv"),
      image: "/tv.png",
    },
    {
      position: t("fourthPrize"),
      emoji: "🎁",
      winners: `5 ${t("winnersFromEachZone")}`,
      prize: t("mixerGrinder"),
      image: "/mixer.jpeg",
    },
  ];

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
      <div className="mt-5 mb-5 flex flex-col md:flex-row items-center justify-around bg-gray-50 sm:p-6 rounded-lg shadow-lg">
        {/* Left Side - Text */}
        <div className="md:w-1/2 text-center md:text-left">
          <p className="text-xl sm:text-3xl tracking-wider font-bold text-gray-800 text-center">
            {t("luckyDrawEvent")}
          </p>
          <p className="text-lg tracking-wide text-gray-700 mt-3 leading-relaxed w-3/4 md:w-full mx-auto text-center">
            {t("eventDescription")}
          </p>
        </div>

        {/* Image */}
        <div className="flex justify-center mt-4 md:mt-0">
          <Image
            src="/mayor.png"
            alt="Lucky Draw Event"
            width={350}
            height={250}
            className="rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* price section  */}
      <div className="mt-8 md:mt-0 md:p-8 bg-gray-50 mb-10">
        <h2 className="text-xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
          {t("prizesForWinners")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prizes.map((prize, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center bg-white p-6 rounded-xl shadow-lg"
            >
              {/* Description (Left Side) */}
              <div className="md:w-1/2 text-center md:text-left">
                <p className="text-xl font-semibold text-gray-700">
                  {prize.emoji} {prize.position}
                </p>
                <p className="text-lg text-gray-600 mt-2">
                  <span className="font-bold">{prize.winners}</span> {t("willWinA")}{" "}
                  <span className="text-blue-600 font-semibold">
                    {prize.prize}
                  </span>
                  .
                </p>
              </div>

              {/* Image (Right Side) */}
              <div className="md:w-1/2 flex justify-center mt-4 md:mt-0">
                <Image
                  src={prize.image}
                  alt={prize.prize}
                  width={250}
                  height={180}
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Section */}
      <div className="w-full bottom-0 fixed bg-black text-white overflow-hidden">
        <div className="flex items-center">
          <span className="font-semibold text-lg px-4 w-[10%] h-full sm:block hidden bg-[#FF6500]">
            {t("whatsNew")}
          </span>

          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="flex space-x-8 animate-marquee">
              {[
                'आशा के साथ "स्वच्छ वायु, स्वच्छ इंदौर" का संकल्प पूरा होने का विश्वास',
                "रिहायशी वातावरण को बेहतर बनाने हेतु सर्वोत्‍तम पद्धियों के लिए इन्‍दौर को मिला हुडको पुरस्‍कार 2024",
                "स्वच्छ सर्वेक्षण-2024 में पूरे देश में फिर से स्वच्छता में नंबर - 1 आकर इंदौर बनेगा स्‍वच्‍छता में सिरमौर",
                "इन्‍दौर में पहली बार होगा व्‍हाइट टॉपिंग सड़क का निर्माण",
                "जल संरक्षण और प्रबंधन में भी इन्‍दौर ने नया इतिहास रहा, 5वें राष्‍ट्रीय जल पुरस्‍कारों में इन्‍दौर को वेस्‍ट ज़ोन का नम्‍बर 1 जिला घोषित किया गया।",
              ].map((item, index) => (
                <span
                  key={index}
                  className="text-sm md:text-base flex items-center m-2"
                >
                  <Link href="/" className="text-white hover:underline">
                    <li>{item}</li>
                  </Link>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}