import React from "react";
import dbConnect from "@/lib/mongodb";
import { CollectionWatch } from "@/models/CollectionWatch";
import mongoose from "mongoose";
import EditWatchClient from "./EditWatchClient";

// Fetch watch directly via Mongoose since this is a server component
async function getWatch(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await dbConnect();
  const watch = await CollectionWatch.findById(id).lean();
  if (!watch) return null;
  const { _id, __v, ...rest } = watch;
  return { ...rest, id: _id.toString() };
}

export default async function EditWatchPage({ params }) {
  const { id } = await params;
  const watch = await getWatch(id);

  if (!watch) {
    return (
      <div style={{ textAlign: "center", paddingTop: "5rem", color: "white" }}>
        <h2>Watch Not Found</h2>
      </div>
    );
  }

  return <EditWatchClient watch={watch} />;
}
