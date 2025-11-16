import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  const { png, svg, meta } = await req.json();

  const pngBuffer = Buffer.from(png, "base64");
  const svgBuffer = Buffer.from(svg, "utf-8");

  // Upload PNG
  const { data: pngUrl } = await supabase.storage
    .from("logos")
    .upload(`logo-${Date.now()}.png`, pngBuffer, {
      contentType: "image/png"
    });

  // Upload SVG
  const { data: svgUrl } = await supabase.storage
    .from("logos")
    .upload(`logo-${Date.now()}.svg`, svgBuffer, {
      contentType: "image/svg+xml"
    });

  // Save metadata
  await supabase.from("brands").insert({
    png: pngUrl?.path,
    svg: svgUrl?.path,
    metadata: meta
  });

  return NextResponse.json({ success: true });
}
