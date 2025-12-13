import { useState } from "react";
import Home from "./Home";
import Loader from "./Reused/Loader";
const Chat = () => {
  const [loader, setLoader] = useState(false);
  if (loader) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 ">
        <Loader />;
      </div>
    );
  }

  return (
    <>
      <Home />
    </>
  );
};
export default Chat;
