import dynamic from "next/dynamic";

const HomePageContent = dynamic(
  () => import("@/components/home/HomePageContent"),
);

export default function HomePage() {
  return <HomePageContent />;
}
