import WristTimeClient from "./WristTimeClient";

export const metadata = {
  title: "Wrist-Time Tracker — Horological Vault",
  description: "Track your daily watch wearing habits with a calendar heatmap, wear log timeline, and frequency analytics.",
};

export default function WristTimePage() {
  return <WristTimeClient />;
}
