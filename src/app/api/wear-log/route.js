import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { WearLog } from "@/models/WearLog";
import { CollectionWatch } from "@/models/CollectionWatch";

/** GET /api/wear-log — fetch wear logs with optional filters
 *  Query params:
 *    - watch_id: filter by specific watch
 *    - from: start date (ISO)
 *    - to: end date (ISO)
 *    - limit: max results (default 200)
 */
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const watchId = searchParams.get("watch_id");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const limit = parseInt(searchParams.get("limit") || "200", 10);

    const filter = {};
    if (watchId) filter.watch_id = watchId;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const logs = await WearLog.find(filter)
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    const normalized = logs.map(({ _id, __v, ...rest }) => ({
      ...rest,
      id: _id.toString(),
      watch_id: rest.watch_id.toString(),
    }));

    return NextResponse.json({ success: true, logs: normalized });
  } catch (err) {
    console.error("[GET /api/wear-log]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** POST /api/wear-log — log a new wear entry */
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.watch_id) {
      return NextResponse.json(
        { success: false, error: "watch_id is required" },
        { status: 400 }
      );
    }

    // Verify the watch exists
    const watch = await CollectionWatch.findById(body.watch_id).lean();
    if (!watch) {
      return NextResponse.json(
        { success: false, error: "Watch not found" },
        { status: 404 }
      );
    }

    // Default date to today if not provided
    if (!body.date) {
      body.date = new Date();
    }

    const log = await WearLog.create(body);
    const { _id, __v, ...rest } = log.toObject();
    return NextResponse.json(
      { success: true, log: { ...rest, id: _id.toString(), watch_id: rest.watch_id.toString() } },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/wear-log]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
