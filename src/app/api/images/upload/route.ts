import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { imageUrl } = await req.json();

  if (!imageUrl || typeof imageUrl !== "string") {
    return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
  }

  const cdnUrl = await uploadToCloudinary(imageUrl);

  if (!cdnUrl) {
    return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  }

  return NextResponse.json({ cdnUrl, originalUrl: imageUrl });
}
