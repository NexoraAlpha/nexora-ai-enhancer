import { NextResponse } from "next/server";
import Replicate from "replicate";

export const runtime = "nodejs";
export const maxDuration = 60;

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export async function POST(req: Request) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "REPLICATE_API_TOKEN belum diisi di Environment Variables Vercel." }, { status: 500 });
    }

    const form = await req.formData();
    const mode = String(form.get("mode") || "photo");
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
    }

    if (mode !== "photo") {
      return NextResponse.json({
        error: "Video pipeline belum diaktifkan di endpoint ini. UI-nya sudah disiapkan; production sebaiknya memakai direct Storage + asynchronous GPU worker."
      }, { status: 501 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${bytes.toString("base64")}`;
    const scale = Number(form.get("scale") || 2);
    const face_enhance = String(form.get("face_enhance")) === "true";

    const output: any = await replicate.run("nightmareai/real-esrgan", {
      input: { image: dataUrl, scale, face_enhance }
    });

    const url = typeof output?.url === "function" ? output.url() : String(output);
    return NextResponse.json({ output: url });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message || "Processing gagal." }, { status: 500 });
  }
}