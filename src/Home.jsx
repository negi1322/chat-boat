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
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import Input from "antd/es/input/Input";
import {
  Button,
  Upload,
  Flex,
  Modal,
  Dropdown,
  Space,
  notification,
} from "antd";
import IMAGES from "./assets/images";
import { toast } from "react-toastify";
import Loader from "./Reused/Loader";
import AutoPopup from "./Reused/Popup";
const Home = () => {
  const chatRef = useRef(null);
  const [user, setUserData] = useState({});
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessages] = useState({ messages: [] });
  const [sendMsg, setSendMsg] = useState("");
  const [currentUser, setCurrentUser] = useState([]);
  const [open, setOpen] = useState(false);
  const [openResponsive, setOpenResponsive] = useState(false);
  const navigate = useNavigate();
  const id = localStorage.getItem("uid");
  const { id: uidUrl } = useParams();
  const [openNotification, setOpenNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotifications] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showNoFriends, setShowNoFriends] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    getCurrentUser();
    getUsers();
  }, []);

  // Run when uid url will be available
  useEffect(() => {
    if (!uidUrl) return;
    const docRef = doc(firestore, "users", id, "chat", uidUrl);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setMessages(snap.data());
        setTimeout(() => {
          if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        }, 50);
      } else {
        setMessages({ messages: [] });
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
      const notiRef = collection(firestore, "users", id, "notification");
      const chatSnap = await getDocs(chatRef);
      const notiSnap = await getDocs(notiRef);
      let chatList = [];
      let notiList = [];
      chatSnap.forEach((doc) => {
        chatList.push({
          chatId: doc.id,
          ...doc.data(),
        });
      });

      notiSnap.forEach((doc) => {
        notiList.push({
          ...doc.data(),
        });
      });
      setUserData(userData);
      setCurrentUser(chatList);
      setNotifications(notiList);
    } catch (err) {
      console.log("Error fetching user + chat:", err);
    }
  };

  const getUsers = async () => {
    setLoader(true);
    try {
      const ref = collection(firestore, "users", id, "friends");
      const snapshot = await getDocs(ref);
      const friends = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setData(friends);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

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
            uidData: otherUser,
            uid: id,
          },
          messages: arrayUnion({
            send: userMsg,
            time: Date.now(),
          }),
        },
        { merge: true }
      );

      await setDoc(
        theirRef,
        {
          values: {
            uidData: user,
            uid: otherUserId,
          },
          messages: arrayUnion({
            recieved: userMsg,
            time: Date.now(),
          }),
        },
        { merge: true }
      );
    } catch (err) {
      console.log("send error:", err);
    }
  };

  const formatTime = (ms) => {
    const d = new Date(ms);
    let hours = d.getHours();
    let minutes = d.getMinutes();
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours}.${minutes.toString().padStart(2, "0")}`;
  };

  const showLoading = () => {
    setOpenNotification(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const items = [
    {
      key: "1",
      label: <span className="fs-6 fw-medium text-black">{user?.name}</span>,
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <span
          className="d-flex justify-content-between"
          onClick={() => navigate(`/edit/${id}`, { state: user })}
        >
          Edit Profile <i className="bi bi-person-fill fs-6"></i>
        </span>
      ),
    },
    {
      key: "3",
      label: (
        <span
          className="d-flex justify-content-between"
          onClick={() => navigate(`/users`, { state: user })}
        >
          Users <i className="bi bi-people-fill fs-6"></i>
        </span>
      ),
    },
    {
      key: "4",
      label: (
        <span onClick={showLoading} className="d-flex justify-content-between">
          Notifications <i className="bi bi-bell-fill"></i>
        </span>
      ),
    },
    {
      key: "5",
      label: (
        <span
          onClick={() => {
            const isConfirmed = window.confirm(
              "Are you sure you want to log out?"
            );
            if (!isConfirmed) return;
            localStorage.clear();
            navigate("/login");
          }}
          className="d-flex justify-content-between"
        >
          Log Out <i className="bi bi-arrow-right-square-fill"></i>
        </span>
      ),
    },
  ];

  const acceptRequest = async (value) => {
    const senderId = value?.values?.id;
    const myRef = doc(firestore, "users", id, "friends", senderId);
    const theirRef = doc(firestore, "users", senderId, "friends", id);
    const deleteRef = doc(firestore, "users", id, "notification", senderId);

    try {
      await Promise.all([
        setDoc(myRef, { ...value?.values }),
        setDoc(theirRef, { ...user, id }),
        deleteDoc(deleteRef),
      ]);

      toast.success("Friend request accepted");
      navigate(`/chat/${senderId}`);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const rejectRequest = async (value) => {
    try {
      const senderId = value?.values?.id;
      if (!senderId) return;

      const deleteRef = doc(firestore, "users", id, "notification", senderId);

      await deleteDoc(deleteRef);

      toast.warning("Friend request rejected");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject request");
    }
  };

  const filteredUsers = data?.filter((item) => {
    return (
      item?.id !== localStorage.getItem("uid") &&
      item?.name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  useEffect(() => {
    if (!data) return;

    setShowNoFriends(false);

    const timer = setTimeout(() => {
      if (data.length === 0) {
        setShowNoFriends(true);
        setShowPopup(true);
      }
    }, 1300);

    return () => clearTimeout(timer);
  }, [data]);

  if (loader) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 ">
        <Loader />;
      </div>
    );
  }

  return (
    <>
      {showNoFriends && (
        <AutoPopup open={showPopup} onClose={() => setShowPopup(false)}>
          <div className=" container-sm">
            <div className="row gap-3 gap-md-0 align-items-center justify-content-between">
              <div className="col-12 col-md-5">
                <img
                  src={IMAGES.IMAGE}
                  alt=""
                  className="img-fluid rounded-4"
                />
              </div>
              <div className="col-12 col-md-6">
                <h4 className="mb-2 fw-bolder fs-3 👋">Welcome to Messanger</h4>
                <p>Chat instantly, share moments, and never miss a message.</p>

                <div>
                  <ul className="d-flex flex-column gap-2 list-unstyled">
                    <li className="fs-6 fw-medium">⚙️ Go to Settings</li>
                    <li className="fs-6 fw-medium">👤 Select users</li>
                    <li className="fs-6 fw-medium"> ➕ Add a friend</li>
                    <li className="fs-6 fw-medium">
                      ⏳ Wait for them to accept & start chatting
                    </li>
                  </ul>

                  <p className="mb-1   fw-medium text-danger">
                    Note: This popup will remain visible until you add a friend.
                  </p>
                </div>
                <button
                  className="btn btn-primary mt-2 w-100 rounded-pill"
                  onClick={() => setShowPopup(false)}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </AutoPopup>
      )}
      <div className="container-fluid">
        <Modal
          title={
            <p className="fs-3">
              Notifications <i className="bi bi-bell-fill"></i>
            </p>
          }
          loading={loading}
          open={openNotification}
          onCancel={() => setOpenNotification(false)}
        >
          <div
            className="d-flex flex-column gap-1 overflow-y-scroll"
            style={{ scrollbarWidth: "none" }}
          >
            {notification.length === 0 ? (
              <div className="text-center">
                <p className="p fw-medium fs-4 mt-3">No Notification yet</p>
              </div>
            ) : (
              notification.map((values, key) => (
                <div
                  key={key}
                  className="rounded-pill p-2 d-flex align-items-center gap-3 justify-content-around border-bottom"
                >
                  <span className="notifi-image">
                    <img
                      src={values?.values?.image}
                      alt=""
                      className="img-fluid notifi-user-image"
                    />
                  </span>

                  <span className="fw-bolder">
                    {values?.values?.name} sent you a friend request
                  </span>

                  <span className="d-flex gap-3">
                    <button
                      className="border-0 bg-transparent"
                      onClick={() => acceptRequest(values)}
                    >
                      <i className="bi bi-check-circle text-success fs-5"></i>
                    </button>
                    <button
                      className="border-0 bg-transparent"
                      onClick={() => rejectRequest(values)}
                    >
                      <i className="bi bi-x-circle text-danger fs-5"></i>
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>
        </Modal>

        <div className="row ">
          {/* USERS LIST */}
          <div className="col-md-5 border border-1 ">
            <div>
              <div className="d-flex justify-content-between align-items-center py-1 py-md-2">
                <div className=" order-md-1">
                  <Dropdown menu={{ items }} styles={{ width: "50%" }}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <i className="bi bi-gear"></i>
                      </Space>
                    </a>
                  </Dropdown>
                </div>

                <h5 className="m-0 ms-tag fs-md-3 fs-5 fw-bold mt-1 text-primary">
                  Messaanger
                </h5>

                <Flex
                  vertical
                  gap="middle"
                  align="flex-start"
                  className=" d-block d-md-none"
                >
                  {/* Basic */}
                  <Modal
                    title="Modal 1000px width"
                    centered
                    open={open}
                    onOk={() => setOpen(false)}
                    onCancel={() => setOpen(false)}
                    width={1000}
                  ></Modal>

                  {/* Responsive */}
                  <span onClick={() => setOpenResponsive(true)}>
                    <i className="bi bi-chat-left-dots-fill fs-1 text-primary fw-bolder"></i>
                  </span>

                  <Modal
                    centered
                    open={openResponsive}
                    onOk={() => setOpenResponsive(false)}
                    onCancel={() => setOpenResponsive(false)}
                    width={{
                      xs: "90%",
                      sm: "80%",
                      md: "70%",
                      lg: "60%",
                      xl: "50%",
                      xxl: "40%",
                    }}
                  >
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
                          boxShadow: "unset",
                        }}
                      />
                    </div>
                    <div>
                      {/* If no users left */}
                      {filteredUsers?.length === 0 ? (
                        <h4 className="text-center text-secondary mt-3">
                          No users found
                        </h4>
                      ) : (
                        filteredUsers.map((item, idx) => (
                          <div
                            onClick={() => navigate(`/chat/${item?.id}`)}
                            className="user-container pointer"
                            key={idx}
                          >
                            <div className="messangers my-2 align-items-center rounded-pill border">
                              <div className="image">
                                <img
                                  src={item?.image}
                                  alt="user-image"
                                  className="img-fluid rounded-circle"
                                />
                              </div>

                              <div className="d-flex justify-content-between align-items-center">
                                <span>
                                  <p className="m-0 fw-semibold user-msg text-capitalize">
                                    {item?.name}
                                  </p>
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </Modal>
                </Flex>
              </div>

              <div className="mt-3 d-none d-md-block">
                <input
                  type="text"
                  placeholder="Search here..."
                  className="w-100 rounded-5 border border-1 brown mb-2"
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

              <div className="user-container-scroll d-none d-md-block ">
                {filteredUsers.map((item, idx) =>
                  item?.id === localStorage.getItem("uid") ? null : (
                    <div
                      onClick={() => navigate(`/chat/${item?.id}`)}
                      className="user-container pointer d-none d-md-block border rounded-pill p-1 mb-2  "
                      key={idx}
                    >
                      <div className="messangers  align-items-center">
                        <div className="image">
                          <img
                            src={item?.image}
                            alt="image"
                            className="img-fluid rounded-circle"
                          />
                        </div>

                        <div className="d-flex justify-content-between align-items-center ">
                          <span className="w-100">
                            <h5 className="fs-6 m-0 fw-semibold">
                              {item?.name}
                            </h5>
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* CHAT SECTION */}
          {data.map((item, idx) =>
            uidUrl === item?.id ? (
              <div
                className=" col-md-7  col-12 border-2 position-relative"
                key={idx}
              >
                <div className="container-fluid p-0">
                  <div className="row border-0">
                    <div className=" col-12 py-2 d-flex  align-items-center ">
                      <div className="mt-2 d-flex gap-2 align-items-center">
                        <div className="online-user-image">
                          <img
                            src={item?.image}
                            alt=""
                            className="img-fluid rounded-circle"
                          />
                        </div>

                        <span>
                          <div className="d-flex gap-5 ">
                            <p className="mb-0 fw-bolder user-msg">
                              {item?.name}
                            </p>
                            <p className="mb-0 online user-msg">Online</p>
                          </div>
                          <p className="mb-0 fst-normal text-secondary user-msg">
                            {item?.email}
                          </p>
                        </span>
                      </div>
                    </div>

                    {/* MESSAGES LIST */}
                    <div
                      className="col-12 coooot position-relative pt-2 p-0"
                      ref={chatRef}
                    >
                      {message?.messages?.map((value, index) => (
                        <div key={index} className="row p-0 m-0">
                          {value?.recieved && (
                            <div className="col-10 mb-1 col-md-7 d-flex justify-content-start">
                              <p className=" msg-scond-prson  d-flex flex-column  text-start ">
                                {value.recieved}
                                <span className="time text-end">
                                  {formatTime(value?.time)}
                                </span>
                              </p>
                            </div>
                          )}
                          {value?.send && (
                            <div className="row justify-content-end p-0 m-0">
                              <span className="col-10 col-md-7 mb-1  d-flex justify-content-end text-end">
                                <p className="msg-user d-flex flex-column justify-content-end py-2">
                                  {value.send}
                                  <span className="time text-start ">
                                    {formatTime(value?.time)}
                                  </span>
                                </p>
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* MESSAGE INPUT */}
                <div className="chat-section-input ">
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
        </div>
      </div>
    </>
  );
};

export default Home;
