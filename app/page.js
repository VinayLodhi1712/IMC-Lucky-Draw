export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      <video
        src="/HomeScreenVideo.mp4"
        autoPlay
        loop
        muted
        className="w-full absolute top-0  z-[-1]"
      ></video>
    </div>
  );
}
