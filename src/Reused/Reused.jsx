import React from "react";
export const Btn = ({ text, onClick, type = "button", isLoading = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="btn rounded-4  text-black fw-bold mb-2 w-100 border border-1 border-secondary  bg-transparent"
      disabled={isLoading}
      style={{
        color: "rgba(57, 69, 109, 1)",
        padding: "10px auto",
      }}
    >
      {isLoading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          Loading...
        </>
      ) : (
        text
      )}
    </button>
  );
};