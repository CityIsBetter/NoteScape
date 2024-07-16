import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response("Missing BLOB_READ_WRITE_TOKEN. Don't forget to add that to your .env file.", {
      status: 401,
    });
  }

  const contentType = req.headers.get("content-type");
  if (!contentType) {
    return new Response("Missing content-type header.", {
      status: 400,
    });
  }

  const file = await req.blob();
  const filename = req.headers.get("x-vercel-filename") || "file.txt";
  const fileType = `.${contentType.split("/")[1]}`;

  // Add timestamp to the filename to ensure uniqueness
  const timestamp = Date.now();
  const finalName = filename.includes(fileType) ? `${filename}-${timestamp}` : `${filename}-${timestamp}${fileType}`;
  const blob = await put(finalName, file, {
    contentType,
    access: "public",
  });

  return NextResponse.json(blob);
}
