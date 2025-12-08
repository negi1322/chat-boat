import { useNavigate } from "react-router-dom";
import IMAGES from "./assets/images";
import React, { useEffect, useState } from "react";
import { firestore } from "./Firebase/Firebase";
import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
const Home = () => {
  const [user, setUserData] = useState([]);
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate()
  const id = localStorage.getItem("uid");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const ref = doc(firestore, "users", `${id}`);
      const snap = await getDoc(ref);
      setUserData(snap?.data()?.values)
    } catch (err) {
      console.log("Error fetching data", err);
    }
  };
  return (
    <>
      <div className="container-xxl">
        <div className="row">
          <div className="col-md-1 cont-1 d-flex align-items-center flex-column ">
            <div className="d-flex flex-column align-items-center " >
              <div onClick={() => navigate(`/edit/${id}`, { state: user })} className="iiii mt-5">
                <img
                  src={user?.image}
                  alt="user-image"
                  className="img-fluid rounded-circle"
                />
              </div>
              <h6 className="mb-0 mt-1 text-center" style={{ fontSize: "13px" }}>{user?.name}</h6>
            </div>

            <div className="d-flex flex-column align-items-center mt-5 " >
              <i style={{cursor : "pointer"}} className="bi bi-person-circle fs-1 img-fluid rounded-circle " onClick={()=> navigate("/users")}></i>
              <h6 className="mb-0 text-center" style={{ fontSize: "13px" }}>Users</h6>
            </div>
          </div>

          <div className="col-md-5 ">
            <div className=" d-none d-md-block mt-4  ">
              <div className="d-flex justify-content-between mb-2 pe-2">
                <h5 className="m-0 ms-tag fs-3 fw-bold mt-1">Messages</h5>
              </div>
              <div className="mt-3 ">
                <input
                  type="text"
                  placeholder="Search here..."
                  className=" w-100 rounded-5 border border-1 brown"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    border: "1px solid #ccc",
                    height: "45px",
                    paddingLeft: "12px",
                    boxShadow: "unset",
                  }}
                />
              </div>

              <div className="user-container brown">
                <div className="messangers mt-2 align-items-center">
                  <div className="image">
                    <img
                      src={user?.image}
                      alt="user-image"
                      className="img-fluid rounded-circle"
                    />
                  </div>

                  <div className="d-flex  justify-content-between align-items-center">
                    <span>
                      <h5 className="mb-1 fs-6">Pardeep singh negi</h5>
                      <p className="m-0 one-line w-75 text-secondary">
                        asdfdasfsasadfasmkdsaknsakdfkkndksafkksad
                      </p>
                    </span>
                    <span className="d-flex flex-column justify-content-center">
                      <h6 className="m-1 text-secondary  fw-semibold" style={{ fontSize: " 14px" }}>09:15AM</h6>
                      <p
                        className=" ms-btn mb-0"
                      >
                        4
                      </p>
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          <div className="col-md-6 p-0 ">
            <div className=" container-xxl p-0 brown py-2 px-1">
              <div className="d-flex justify-content-around align-items-center">
                <div className=" mt-2 d-flex gap-2 align-items-center">
                  <div>
                    <div className="online-user-image">
                      <img src={user?.image} alt="" className="img-fluid rounded-circle" />
                    </div>
                  </div>
                  <span>
                    <div className="d-flex gap-5">
                      <p className="mb-0 fw-bolder"> {user?.name}</p>
                      <p className="m-0 fw-bold  text-primary">Online</p>
                    </div>
                    <p className="mb-0 fst-normal text-secondary">{user?.email}</p>
                  </span>
                </div>
                <div>
                  <button className=" rounded-pill btn btn-primary btn-sm" >View Profile</button>
                </div>
                <div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>


      <div className=" d-flex gap-3 justify-content-between align-items-center order-2 order-md-3 mb-2 mb-md-0">
        <div
          className="icon-box d-md-none d-block"
          onClick={() => setIsChatSidebarOpen(true)}
          style={{ cursor: "pointer" }}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="20"
              fill="currentColor"
              className="bi bi-chat-dots"
              viewBox="0 0 16 16"
            >
              <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
              <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2" />
            </svg>
          </span>
        </div>

        {/* User Image */}

      </div>



      {/*  Chat Sidebar */}
      < div className={`chat-sidebar ${isChatSidebarOpen ? "open" : ""}`}>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-sm btn-close border border-1 border-dark p-2 "
            onClick={() => setIsChatSidebarOpen(false)}
          ></button>
        </div>
        <div>
          <div className=" rounded-3 bg-white mt-4  ">
            <div className="d-flex justify-content-between mb-2 pe-2">
              <h5 className="m-0">Messages</h5>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </span>
            </div>

            <div className="d-flex gap-3 border-bottom border-1 pb-2">
              <span className="select-cat">All messages</span>
              <span className="select-cat">Friends</span>
            </div>
            {/* 
            <div className="day-btn mt-3">
              <p className="fw-medium fs-5 m-0">{`✨ Happy ${today}`}</p>
            </div> */}

            <div className="border-bottom border-1 mt-4 messangers">
              <div className="row">
                <span className="col-2 p-0">
                  <img
                    style={{ width: "50px", height: "50px" }}
                    src={user?.image}
                    alt="user-image"
                    className="img-fluid rounded-circle"
                  />
                </span>

                <div className="d-flex flex-column col-9 p-0 mb-3">
                  <span className="d-flex justify-content-between">
                    <h5 className="mb-0">Pardeep singh negi</h5>
                    <p className="m-0">09:15AM</p>
                  </span>

                  <span className="d-flex justify-content-between">
                    <p className="m-0 one-line w-75">
                      asdfdasfsasadfasmkdsaknsakdfkkndksafkksad
                    </p>
                    <p
                      className="orange rounded-circle d-flex justify-content-center align-items-center m-0"
                      style={{
                        width: "24px",
                        height: "24px",
                        fontSize: "12px",
                        color: "white",
                      }}
                    >
                      4
                    </p>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default Home;
