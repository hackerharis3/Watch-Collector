"use client";

import React from "react";
import { useRouter } from "next/navigation";
import WatchForm from "@/components/collection/WatchForm";

export default function AddWatchPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push("/collection");
  };

  const handleSuccess = (newWatch) => {
    router.push(`/collection/${newWatch.id || newWatch._id}`);
  };

  return (
    <div className="container" style={{ paddingTop: "var(--space-2xl)", paddingBottom: "var(--space-4xl)" }}>
      <WatchForm 
        onCancel={handleCancel} 
        onSuccess={handleSuccess} 
      />
    </div>
  );
}
