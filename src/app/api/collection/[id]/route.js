import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { CollectionWatch } from "@/models/CollectionWatch";

/** GET /api/collection/[id] - fetch a single watch by MongoDB _id */
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const watch = await CollectionWatch.findById(id).lean();
    if (!watch) {
      return NextResponse.json({ success: false, error: "Watch not found" }, { status: 404 });
    }
    const { _id, __v, ...rest } = watch;
    return NextResponse.json({ success: true, watch: { ...rest, id: _id.toString() } });
  } catch (err) {
    console.error("[GET /api/collection/[id]]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** DELETE /api/collection/[id] - remove a watch by MongoDB _id */
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deleted = await CollectionWatch.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Watch not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Watch deleted" });
  } catch (err) {
    console.error("[DELETE /api/collection/[id]]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** PATCH /api/collection/[id] - update a watch by MongoDB _id */
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const updated = await CollectionWatch.findByIdAndUpdate(id, body, { new: true, lean: true });
    if (!updated) {
      return NextResponse.json({ success: false, error: "Watch not found" }, { status: 404 });
    }
    const { _id, __v, ...rest } = updated;
    return NextResponse.json({ success: true, watch: { ...rest, id: _id.toString() } });
  } catch (err) {
    console.error("[PATCH /api/collection/[id]]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}