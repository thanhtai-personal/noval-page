import dynamic from "next/dynamic";

// Dynamically import the client-side ProfilePageContent component
const ProfilePageContent = dynamic(
  () => import("@/components/profile/ProfilePageContent"),
  { ssr: false }
);

export default function ProfilePage() {
  return <ProfilePageContent />;
}
