"use client";

import React from "react";
import { useRouter } from "next/navigation";
import WatchForm from "@/components/collection/WatchForm";

export default function EditWatchClient({ watch }) {
  const router = useRouter();

  const handleCancel = () => {
    router.push(`/collection/${watch.id}`);
  };

  const handleSuccess = (updatedWatch) => {
    router.push(`/collection/${updatedWatch.id || updatedWatch._id}`);
    router.refresh();
  };

  return (
    <div className="container" style={{ paddingTop: "var(--space-2xl)", paddingBottom: "var(--space-4xl)" }}>
      <WatchForm 
        initialWatch={watch}
        onCancel={handleCancel} 
        onSuccess={handleSuccess} 
      />
    </div>
  );
}
