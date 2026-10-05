import React from "react";
import dbConnect from "@/lib/mongodb";
import { CollectionWatch } from "@/models/CollectionWatch";
import AnalyticsClient from "./AnalyticsClient";

export const metadata = {
  title: "Analytics — Horological Vault",
  description: "Visualize and analyze your watch collection data.",
};

export default async function AnalyticsPage() {
  await dbConnect();
  
  // Fetch only owned watches for analytics
  const rawWatches = await CollectionWatch.find({ in_collection: true })
    .sort({ createdAt: -1 })
    .lean();

  const watches = rawWatches.map(w => {
    const { _id, __v, ...rest } = w;
    return { ...rest, id: _id.toString() };
  });

  return <AnalyticsClient watches={watches} />;
}
