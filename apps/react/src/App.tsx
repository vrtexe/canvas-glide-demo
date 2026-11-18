import "./App.css";
import { useRef, useState } from "react";
import { GlideCanvas, Renderer, type GlideCanvasRef } from "@canvas-glide/react";
import { useLocalStorageBlob } from "./showcase/localStorageBlobHook";

type Tab = (typeof Tab)[keyof typeof Tab];
const Tab = Object.freeze({
  Canvas: "canvas",
  Img: "img",
  Html: "html",
} as const);
const TabValues: Tab[] = Object.values(Tab);

const TabComponentMap: Record<Tab, Renderer> = {
  [Tab.Canvas]: Renderer.Canvas,
  [Tab.Img]: Renderer.Image,
  [Tab.Html]: Renderer.Html,
} as const;

const TabLabel: Record<Tab, string> = {
  [Tab.Canvas]: "Canvas",
  [Tab.Img]: "Image",
  [Tab.Html]: "html",
} as const;

function App() {
  const [tab, setTab] = useState<Tab>("canvas");
  const file = useLocalStorageBlob("file");
  const handleRef = useRef<GlideCanvasRef>(null);

  function updateTab(tab: Tab) {
    setTab(tab);
  }

  return (
    <>
      <div className="toolbar toolbar--tabs">
        {TabValues.map((t) => (
          <button
            key={`tab-button-${t}`}
            className={`tab${t === tab ? " tab--active" : ""}`}
            onClick={() => updateTab(t)}
          >
            {TabLabel[t]}
          </button>
        ))}
      </div>

      <div className="toolbar-row">
        <div className="toolbar toolbar--controls">
          <button className="icon-btn" title="Zoom in" onClick={() => handleRef.current?.zoomIn()}>
            +
          </button>
          <button className="icon-btn" title="Zoom out" onClick={() => handleRef.current?.zoomOut()}>
            −
          </button>
          <span className="divider" />
          <button data-icon="center" onClick={() => handleRef.current?.center()}>Center</button>
          <button data-icon="fit" onClick={() => handleRef.current?.fit()}>Fit</button>
        </div>
      </div>

      <div style={{ width: "100dvw", height: "100dvh", overflow: "hidden" }}>
        <GlideCanvas ref={handleRef} renderer={TabComponentMap[tab]} image={file} />
      </div>
    </>
  );
}

export default App;
