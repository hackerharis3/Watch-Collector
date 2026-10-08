import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { WearLog } from "@/models/WearLog";

/** GET /api/wear-log/[id] — fetch a single wear log */
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const log = await WearLog.findById(id).lean();
    if (!log) {
      return NextResponse.json({ success: false, error: "Wear log not found" }, { status: 404 });
    }
    const { _id, __v, ...rest } = log;
    return NextResponse.json({
      success: true,
      log: { ...rest, id: _id.toString(), watch_id: rest.watch_id.toString() },
    });
  } catch (err) {
    console.error("[GET /api/wear-log/[id]]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** PATCH /api/wear-log/[id] — update a wear log entry */
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const updated = await WearLog.findByIdAndUpdate(id, body, { new: true, lean: true });
    if (!updated) {
      return NextResponse.json({ success: false, error: "Wear log not found" }, { status: 404 });
    }
    const { _id, __v, ...rest } = updated;
    return NextResponse.json({
      success: true,
      log: { ...rest, id: _id.toString(), watch_id: rest.watch_id.toString() },
    });
  } catch (err) {
    console.error("[PATCH /api/wear-log/[id]]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** DELETE /api/wear-log/[id] — remove a wear log entry */
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deleted = await WearLog.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Wear log not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Wear log deleted" });
  } catch (err) {
    console.error("[DELETE /api/wear-log/[id]]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
