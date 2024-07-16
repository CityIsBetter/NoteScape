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
  if (!contentType || !contentType.startsWith("image/")) {
    return new Response("Invalid or missing content-type header.", {
      status: 400,
    });
  }

  const filename = req.headers.get("x-vercel-filename") || "file.txt";
  const fileType = `.${contentType.split("/")[1]}`;
  const timestamp = Date.now();
  const finalName = filename.includes(fileType) ? `${filename}-${timestamp}` : `${filename}-${timestamp}${fileType}`;

  try {
    const arrayBuffer = await req.arrayBuffer();
    const blob = await put(finalName, new Uint8Array(arrayBuffer), {
      contentType,
      access: "public",
    });

    return NextResponse.json(blob);
  } catch (error) {
    return new Response(`Error: ${error}`, {
      status: 500,
    });
  }
}
