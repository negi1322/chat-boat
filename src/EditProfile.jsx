import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { firestore } from "./Firebase/Firebase";
import { useLocation } from "react-router-dom";
import { Btn } from "./Reused/Reused";
const EditProfile = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log("state is ", state);
  const props = {
    listType: "picture",
    beforeUpload(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setImageUrl(reader.result);
          resolve(false);
        };
      });
    },
    showUploadList: false,
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      contact: "",
    },

    onSubmit: async (values) => {
      setLoading(true);
      if (!values.name || !values.email || !values.contact) {
        setLoading(false);
        toast.error("Fill all the fields");
        return;
      }

      try {
        await setDoc(
          doc(firestore, "users", id),
          {
            values: {
              ...values,
              image: imageUrl,
            },
          },
          { merge: true }
        );

        toast.success("Profile updated successfully!");
        navigate("/home");
      } catch (err) {
        console.log(err);
        toast.error("Error saving data");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <div className="edit-container d-flex justify-content-center align-items-center h-100 my-auto">
        <div className="container-fluid">
          <h2 className=" fs-5 text-center p-2 fw-bold ">
            Edit Your Profile
          </h2>
          <div className="row  flex-column gap-4">
            {/* LEFT IMAGE */}
            <div className="col-12 col-md-4 m-auto">
              <div className="edit-image m-auto border border-start">
                <img
                  src={state?.image}
                  alt="signup"
                  className="img-fluid rounded-circle"
                />
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="col-12 col-md-5 m-auto">
              <form
                onSubmit={formik.handleSubmit}
                className="form d-flex flex-column gap-3"
                action="submit"
              >
                <div className="inputForm position-relative rounded-pill border-3 ">
                  <span>
                    <i className="bi bi-person fs-5 ms-2 set-icons"></i>
                  </span>
                  <input
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    name="name"
                    type="text"
                    className="input border rounded-pill border-0 ms-auto"
                    style={{ width: "90%" }}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="inputForm position-relative rounded-pill border-3 ">
                  <span>
                    <i className="bi bi-envelope fs-5  set-icons ms-2"></i>
                  </span>
                  <input
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    name="email"
                    type="email"
                    className="input border rounded-pill border-0 ms-auto"
                    style={{ width: "90%" }}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="inputForm position-relative rounded-pill border-3">
                  <span>
                    <i className="bi bi-telephone fs-5 ms-2 set-icons"></i>
                  </span>
                  <input
                    value={formik.values.contact}
                    onChange={formik.handleChange}
                    name="contact"
                    type="number"
                    className="input border rounded-pill border-0 ms-auto"
                    style={{ width: "90%" }}
                    placeholder="Enter your number"
                  />
                </div>

                <div className="d-flex flex-column">
                  <label className="me-2 ms-2 fw-bold text-secondary mb-1">
                    Upload Profile Image
                  </label>
                  <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>

                  {imageUrl && (
                    <div className="w-25 h-25 mt-4 border rounded-2 border-2 border-black p-2">
                      <img
                        src={imageUrl}
                        alt="preview"
                        className="img-fluid "
                      />
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <Btn text={"Submit"} type="submit" isLoading={loading}>
                    Submit
                  </Btn>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
