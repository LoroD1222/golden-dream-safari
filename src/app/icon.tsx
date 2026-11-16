import {ImageResponse} from "next/og";

export const size = {width: 64, height: 64};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", color: "#141210", background: "linear-gradient(150deg,#ffd064,#ef8a33 55%,#0b0907)", fontSize: 26, fontWeight: 800}}>GD</div>, size);
}
