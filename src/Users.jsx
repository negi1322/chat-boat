import { Query, getDocs, collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "./Firebase/Firebase";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Users = () => {
  const [user, setUserData] = useState([]);
  const [search, setSearch] = useState("");
  const userData = JSON.parse(localStorage.getItem("user"));
  const id = localStorage.getItem("uid");
  const navigate = useNavigate();
  const { state } = useLocation();

  console.log("state is ", state)


  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
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
    }
  };

  const filteredUsers = user.filter((item) =>
    item?.values?.name?.toLowerCase().includes(search.toLowerCase())
  );


  const sendRequest = async (sender) => {
    const otherUserId = sender?.id;
    const myRef = doc(firestore, "users", otherUserId, "notification", id);
    try {
      await setDoc(
        myRef, {
        values: {
          ...state, id,
        }
      });
      toast.success("Request message sent!")
    } catch (err) {
      toast.error("request not send try later")
    }
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-between">
          <div
            className="col-md-1 cont-1 d-flex align-items-center flex-column  border d-none d-md-block"
            style={{ height: "100vh" }}
          >
            <div className="d-flex flex-column align-items-center  bor">
              <div
                onClick={() => navigate(`/edit/${id}`, { state: user })}
                className="iiii mt-5"
              >
                <img
                  src={userData?.image}
                  alt="user-image"
                  className="img-fluid rounded-circle"
                />
              </div>
              <h6
                className="mb-0 mt-1 text-center"
                style={{ fontSize: "13px" }}
              >
                {userData?.name}
              </h6>
            </div>

            <div className="d-flex flex-column align-items-center mt-5 ">
              <i
                style={{ cursor: "pointer" }}
                className="bi bi-person-circle fs-1 img-fluid rounded-circle "
                onClick={() => navigate("/users")}
              ></i>
              <h6 className="mb-0 text-center" style={{ fontSize: "13px" }}>
                Users
              </h6>
            </div>
          </div>

          <div className="col-md-11 col-12">
            <div className="mt-3  ">
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

            <div className="mt-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((index, id) => (
                  <div
                    key={id}
                    className="d-flex mt-2 brown rounded-pill px-2 py-2 justify-content-between border"
                  >
                    <div className="w-100 d-flex gap-4 align-items-center">
                      <div className="user-images d-flex">
                        <img
                          onClick={() =>
                            navigate(`/user/${index?.id}`, { state: index })
                          }
                          src={index?.values?.image}
                          alt="user-image"
                          className="img-fluid rounded-circle"
                        />
                      </div>

                      <div>
                        <h6 className="mt-2 text-secondary user-mg fw-bold">
                          {index?.values?.name}
                        </h6>
                        <h6 className="mt-2 text-secondary fw-bold user-msg">
                          {index?.values?.email}
                        </h6>
                      </div>
                      <i onClick={() => sendRequest(index)} className="text-primary bi bi-person-check fs-2 pointer sent-icon position-absolute"></i>
                    </div>

                  </div>
                ))
              ) : (
                <div className="d-flex justify-content-center align-items-center">
                  <h1 className="my-5">NO USER FOUND</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
