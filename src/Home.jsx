import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { firestore } from "./Firebase/Firebase";
import {
  arrayUnion,
  onSnapshot,
  addDoc,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

import Input from "antd/es/input/Input";
import { Button, Upload } from "antd";
import IMAGES from "./assets/images";

const Home = () => {
  const chatRef = useRef(null);
  const [user, setUserData] = useState({});
  const [data, setData] = useState([]);
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessages] = useState({ messages: [] });
  const [sendMsg, setSendMsg] = useState("");
  const [currentUser, setCurrentUser] = useState([]);

  const navigate = useNavigate();
  const id = localStorage.getItem("uid");
  const { id: uidUrl } = useParams();

  useEffect(() => {
    getCurrentUser();
    getUsers();
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [message]);


  // Run when uid url will be available 
  useEffect(() => {
    if (!uidUrl) return;
    const docRef = doc(firestore, "users", id, "chat", uidUrl);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setMessages(snap.data());
      } else {
        setMessages({ messages: null });
      }
    });

    return () => unsub();
  }, [uidUrl]);


  const getCurrentUser = async () => {
    try {
      const ref = doc(firestore, "users", id);
      const snap = await getDoc(ref);
      const userData = snap.data().values;

      const chatRef = collection(firestore, "users", id, "chat");
      const chatSnap = await getDocs(chatRef);

      let chatList = [];

      chatSnap.forEach((doc) => {
        chatList.push({
          chatId: doc.id,
          ...doc.data(),
        });
      });

      setUserData(userData);
      setCurrentUser(chatList);

    } catch (err) {
      console.log("Error fetching user + chat:", err);
    }
  };


  const getUsers = async () => {
    try {
      const ref = collection(firestore, "users");
      const snapshot = await getDocs(ref);

      const allUsers = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));

      setData(allUsers);
    } catch (err) {
      console.log(err);
    }
  };


  //  Set the messages in the firesote
  const selectChatUser = async (otherUser) => {
    let userMsg = sendMsg;
    setSendMsg("");
    if (!sendMsg.trim()) return;
    const otherUserId = otherUser?.id;
    const myRef = doc(firestore, "users", id, "chat", otherUserId);
    const theirRef = doc(firestore, "users", otherUserId, "chat", id);

    try {
      await setDoc(
        myRef,
        {
          values: {
            uidData: otherUser.values,
            uid: id
          },
          messages: arrayUnion({
            send: userMsg,
            time: Date.now()
          })
        },
        { merge: true }
      );

      await setDoc(
        theirRef,
        {
          values: {
            uidData: user,
            uid: otherUserId
          },
          messages: arrayUnion({
            recieved: userMsg,
            time: Date.now()
          })
        },
        { merge: true }
      );


    } catch (err) {
      console.log("send error:", err);
    }
  }


  const formatTime = (ms) => {
    const d = new Date(ms);
    let hours = d.getHours();
    let minutes = d.getMinutes();
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours}.${minutes.toString().padStart(2, "0")}`;
  }
  return (
    <>
      <div className="container-xxl">
        <div className="row">
          <div className="col-md-1 col-12 cont-1 d-flex align-items-center flex-row flex-md-column  justify-content-between justify-content-md-start">
            <div className="d-flex flex-column align-items-center ">
              <div
                onClick={() => navigate(`/edit/${id}`, { state: user })}
                className="iiii mt-0 mt-md-5"
              >
                <img
                  src={user?.image}
                  alt="user-image"
                  className="img-fluid rounded-circle"
                />
              </div>
              <h6 className="mb-0 mt-1 text-center" style={{ fontSize: "13px" }}>
                {user?.name}
              </h6>
            </div>

            <div className="d-flex flex-column align-items-center mt-0 mt-md-5 ">
              <div
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/users")}
              >
                <img src={IMAGES.CONTACT} alt="" className="img-fluid" />
              </div>
              <h6 className="mt-1 text-center" style={{ fontSize: "13px" }}>
                Users
              </h6>
            </div>

            <div className="d-block d-md-none pointer" onClick={() => setIsChatSidebarOpen(!false)}>
              <img src={IMAGES.CHAT} alt="" className="img-fluid" />
            </div>
          </div>

          {/* USERS LIST */}
          <div className="col-md-5">
            <div className="d-none d-md-block mt-4">
              <div className="d-flex justify-content-between mb-2 pe-2">
                <h5 className="m-0 ms-tag fs-3 fw-bold mt-1">Messages</h5>
              </div>

              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Search here..."
                  className="w-100 rounded-5 border border-1 brown"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    border: "1px solid #ccc",
                    height: "45px",
                    paddingLeft: "12px",
                    boxShadow: "unset"
                  }}
                />
              </div>

              {data.map((item, idx) => (
                item?.id === localStorage.getItem("uid") ? null :
                  <div
                    onClick={() => navigate(`/chat/${item?.id}`)}
                    className="user-container brown pointer"
                    key={idx}
                  >
                    <div className="messangers mt-2 align-items-center">
                      <div className="image">
                        <img
                          src={item?.values?.image}
                          alt="user-image"
                          className="img-fluid rounded-circle"
                        />
                      </div>

                      <div className="d-flex justify-content-between align-items-center w-100">
                        <span className="w-75">
                          <h5 className="mb-1 fs-6">{item?.values?.name}</h5>
                          <p className="m-0 one-line w-75 text-secondary">
                            Last message preview...
                          </p>
                        </span>

                        <span className="d-flex flex-column justify-content-center ">
                          <h6
                            className="m-1 text-secondary fw-semibold"
                            style={{ fontSize: "14px" }}
                          >
                            09:15AM
                          </h6>
                          <p className="ms-btn mb-0">4</p>
                        </span>
                      </div>
                    </div>
                  </div>

              ))}
            </div>
          </div>

          {/* CHAT SECTION */}

          {data.map((item, idx) =>
            uidUrl === item?.id ? (
              <div className=" col-md-6 border-2 position-relative chat-section" key={idx} u>
                <div className="container-fluid">
                  <div className="row gap-2">

                    <div className="col-12 py-2 d-flex justify-content-around align-items-center brown d-none d-md-block">
                      <div className="mt-2 d-flex gap-2 align-items-center">
                        <div className="online-user-image">
                          <img
                            src={item.values?.image}
                            alt=""
                            className="img-fluid rounded-circle"
                          />
                        </div>

                        <span>
                          <div className="d-flex gap-5 ">
                            <p className="mb-0 fw-bolder">
                              {item.values?.name}
                            </p>
                            <p className="mb-0 online">Online</p>

                          </div>
                          <p className="mb-0 fst-normal text-secondary">
                            {item.values?.email}
                          </p>
                        </span>
                      </div>
                    </div>

                    {/* MESSAGES LIST */}
                    <div className="col-12 coooot position-relative  pt-3" ref={chatRef}>
                      {message?.messages?.map((value, index) => (
                        <div key={index} className="row p-0 m-0">
                          {value?.recieved && (
                            <div className="col-6 mb-1">
                              <p className=" msg-scond-prson  d-flex flex-column gap-1">{value.recieved}
                                <span className="time">{formatTime(value?.time)}</span>
                              </p>
                            </div>
                          )}
                          {value?.send && (
                            <div className="row justify-content-end p-0 m-0">
                              <span className="col-6 mb-1 right">
                                <p className="msg-user d-flex flex-column justify-content-end">{value.send}
                                  <span className="time">{formatTime(value?.time)}</span></p>
                              </span>
                            </div>
                          )}
                        </div>

                      ))}

                    </div>

                  </div>
                </div>
                {/* MESSAGE INPUT */}
                <div className="chat-section-input">
                  <div className="d-flex justify-content-center  align-items-center">
                    <Upload>
                      <Button className="border-0">
                        <img src={IMAGES.CLIP} alt="" className="img-fluid" />
                      </Button>
                    </Upload>

                    <form className="w-100 d-flex">
                      <div className="position-relative send-input">
                        <Input
                          value={sendMsg}
                          onChange={(e) => setSendMsg(e.target.value)}
                          className="py-2 fw-bold border-secondary rounded-pill"
                          size="large"
                          placeholder="Enter message"
                        />
                        <button
                          className="send-img"
                          onClick={(e) => {
                            e.preventDefault();
                            selectChatUser(item);
                          }}
                        >
                          <img src={IMAGES.SEND} className="img-fluid" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ) : null
          )}
          < div className={` d-block d-md-none chat-sidebar m-0 ${isChatSidebarOpen ? "open" : ""}`}>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-sm btn-close border border-1 border-dark p-2 "
                onClick={() => setIsChatSidebarOpen(false)}
              ></button>
            </div>
            {data.map((item, idx) => (
              <div
                onClick={() => navigate(`/chat/${item?.id}`)}
                className="user-container brown pointer brown"
                key={idx}
              >
                <div className="messangers align-items-center " >
                  <div className="image">
                    <img
                      src={item?.values?.image}
                      alt="user-image"
                      className="img-fluid rounded-circle"
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center ">
                    <span>
                      <h5 className="mb-1 fs-6">{item?.values?.name}</h5>
                      <p className="m-0 one-line w-75 text-secondary">
                        Last message preview...
                      </p>
                    </span>

                    <span className="d-flex flex-column justify-content-center">
                      <h6
                        className="m-1 text-secondary fw-semibold"
                        style={{ fontSize: "14px" }}
                      >
                        09:15AM
                      </h6>
                      <p className="ms-btn mb-0">4</p>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div >


        </div>
      </div >
    </>
  );
};

export default Home;
