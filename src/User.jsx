
import { useLocation, useNavigate } from "react-router-dom";

const User = () => {
    const { state } = useLocation();
    const navigate = useNavigate()
    const id = localStorage.getItem("uid")
    const user = JSON.parse(localStorage.getItem("user"))
    return (
        <>
            <div className="container-xxl">
                <div className="row justify-content-between">
                    <div className="col-md-1 cont-1 d-flex align-items-center flex-column ">
                        <div className="d-flex flex-column align-items-center " >
                            <div className="iiii mt-5" onClick={() => navigate(`/edit/${id}`, { state: user })}>
                                <img
                                    src={user?.image}
                                    alt="user-image"
                                    className="img-fluid rounded-circle"
                                />
                            </div>
                            <h6 className="mb-0 mt-1 text-center" style={{ fontSize: "13px" }}>{state?.vlaue?.name}</h6>
                        </div>

                        <div className="d-flex flex-column align-items-center mt-5 " >
                            <i onClick={() => navigate("/users")} style={{ cursor: "pointer" }} className="bi bi-person-circle fs-1 img-fluid rounded-circle " ></i>
                            <h6 className="mb-0 text-center" style={{ fontSize: "13px" }}>Users</h6>
                        </div>
                    </div>
                    
                    <div className="col-md-11 border border-1 ">

                    </div>
                </div>
            </div>
        </>
    )
}
export default User;