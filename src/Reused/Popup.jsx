import React, { useEffect } from "react";
import AOS from "aos";

const AutoPopup = ({ open, onClose, children }) => {
  useEffect(() => {
    AOS.init({ duration: 1500 });
  }, []);
  if (!open) return null;

  return (
    <div style={overlayStyle} data-aos="zoom-in">
      <div style={popupStyle}>{children}</div>
    </div>
  );
};

export default AutoPopup;

/* styles */
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const popupStyle = {
  width: "55%",
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  minWidth: "300px",
  position: "relative",
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  border: "none",
  background: "transparent",
  fontSize: "18px",
  cursor: "pointer",
};
