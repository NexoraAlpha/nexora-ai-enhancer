 "use client";

import { useState } from "react";

type Mode = "photo" | "video";

export default function Home() {
  const [mode, setMode] = useState<Mode>("photo");
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState("2");
  const [face, setFace] = useState(true);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState("");

  const accept = mode === "photo" ? "image/*" : "video/*";

  async function processFile() {
    if (!file) return;
    setBusy(true); setError(""); setResult("");

    // Vercel Functions reject large request bodies, so this starter intentionally
    // keeps the processing endpoint for small images. Large media should be
    // uploaded directly to object storage before processing.
    if (file.size > 4 * 1024 * 1024) {
      setBusy(false);
      setError("File terlalu besar untuk demo endpoint ini. Untuk versi production, upload langsung ke Storage lalu proses dari URL.");
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("mode", mode);
    form.append("scale", scale);
    form.append("face_enhance", String(face));

    const res = await fetch("/api/process", { method: "POST", body: form });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error || "Processing gagal."); return; }
    setResult(data.output);
  }

  return (
    <main className="shell">
      <nav>
        <div className="brand">NEXORA <span>AI</span></div>
        <div className="navtag">ENHANCER</div>
      </nav>

      <section className="hero">
        <p className="eyebrow">AI MEDIA ENHANCEMENT</p>
        <h1>Make it <em>clearer.</em><br/>Make it <em>smoother.</em></h1>
        <p className="sub">Enhance photos with AI upscaling and prepare video enhancement workflows from one clean interface.</p>
      </section>

      <div className="switcher">
        <button className={mode==="photo" ? "active":""} onClick={()=>{setMode("photo");setFile(null);setResult("");setError("");}}>PHOTO HD</button>
        <button className={mode==="video" ? "active":""} onClick={()=>{setMode("video");setFile(null);setResult("");setError("");}}>VIDEO STABLE + HD</button>
      </div>

      <section className="card">
        <label className="drop">
          <input type="file" accept={accept} onChange={e=>setFile(e.target.files?.[0] ?? null)} />
          <div className="uploadIcon">↑</div>
          <strong>{file ? file.name : `Drop your ${mode === "photo" ? "photo" : "video"} here`}</strong>
          <span>{file ? `${(file.size/1024/1024).toFixed(2)} MB` : "or tap to browse from your device"}</span>
        </label>

        {mode === "photo" && (
          <div className="options">
            <div>
              <small>UPSCALE</small>
              <div className="chips">
                {["2","4"].map(x=><button key={x} className={scale===x?"chip activeChip":"chip"} onClick={()=>setScale(x)}>{x}×</button>)}
              </div>
            </div>
            <label className="check"><input type="checkbox" checked={face} onChange={e=>setFace(e.target.checked)}/> Face enhancement</label>
          </div>
        )}

        {mode === "video" && (
          <div className="notice">
            <b>VIDEO PIPELINE</b>
            <span>UI sudah siap untuk upload → stabilization → upscale. Production version memakai direct storage + GPU worker agar video besar tidak melewati batas serverless.</span>
          </div>
        )}

        <button className="process" disabled={!file || busy} onClick={processFile}>
          {busy ? "PROCESSING..." : mode === "photo" ? "ENHANCE PHOTO" : "PREPARE VIDEO"}
        </button>

        {error && <p className="error">{error}</p>}
        {result && (
          <div className="result">
            <img src={result} alt="Enhanced result"/>
            <a href={result} target="_blank" rel="noreferrer">OPEN / DOWNLOAD RESULT ↗</a>
          </div>
        )}
      </section>

      <footer>Trade Smart. Manage Risk. Build Legacy. <span>NEXORA AI</span></footer>
    </main>
  );
}