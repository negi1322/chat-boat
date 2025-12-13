import { Query, getDocs, collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "./Firebase/Firebase";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import IMAGES from "./assets/images";
import { Card } from "antd";
import Loader from "./Reused/Loader";
const Users = () => {
  const [user, setUserData] = useState([]);
  const [search, setSearch] = useState("");
  const userData = JSON.parse(localStorage.getItem("user"));
  const id = localStorage.getItem("uid");
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoader(true);
    try {
      const ref = collection(firestore, "users");
      const snapshot = await getDocs(ref);

      const allUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserData(allUsers);
    } catch (err) {
      toast.error(err);
    } finally {
      setLoader(false);
    }
  };

  const filteredUsers = user.filter((item) =>
    item?.values?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const sendRequest = async (sender) => {
    const otherUserId = sender?.id;
    const myRef = doc(firestore, "users", otherUserId, "notification", id);
    try {
      await setDoc(myRef, {
        values: {
          ...state,
          id,
        },
      });
      toast.success("Request message sent!");
    } catch (err) {
      toast.error("request not send try later");
    }
  };

  if (loader) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 ">
        <Loader />;
      </div>
    );
  }
  return (
    <>
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div className="col-4 d-none d-md-block">
            <img src={IMAGES.USERS} alt="" className="img-fluid" />
          </div>

          <div className=" col-md-8 col-12">
            <div className="my-3  ">
              <input
                type="text"
                placeholder="Search Peoples..."
                className=" w-100 rounded-5 border border-1 brown ps-5"
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
            <div className="grid-container">
              <div key={id} className="wrapper">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((index, id) => (
                    <Card
                      hoverable
                      cover={
                        <img
                          draggable={false}
                          alt=" No image set"
                          className="img-fluid rounded-3 img-user mt-2"
                          src={index?.values?.image}
                        />
                      }
                    >
                      <div className="d-flex  align-items-center">
                        <span className="fw-bolder">{index?.values?.name}</span>
                        <i
                          onClick={() => sendRequest(index)}
                          className={`text-primary fs-4 pointer end-0 position-absolute me-2 ${
                            localStorage.getItem("uid") === index?.id
                              ? ""
                              : "bi bi-person-plus-fill"
                          }`}
                        ></i>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="d-flex justify-content-center align-items-center">
                    <h1 className="my-5">NO USERS FOUND</h1>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
