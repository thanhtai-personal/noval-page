import dynamic from "next/dynamic";

const HomePageContent = dynamic(
  () => import("@/components/home/HomePageContent"),
  { ssr: false }
  
);

export default function HomePage() {
  return <HomePageContent />;
}
