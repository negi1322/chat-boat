import { toast } from "react-toastify";
import { firebaseAuth, firestore } from "../Firebase/Firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
    Button,
    Form,
    Input,
    InputNumber,
    Select,
} from "antd";
import IMAGES from "../assets/images";
import { useNavigate } from "react-router-dom";

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

const SignUp = () => {
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
        prompt: "select_account"
    });

    const [form] = Form.useForm();
    const navigate = useNavigate()


    // Signup with google login
    const signupwithgoogle = async () => {
        try {
            const res = await signInWithPopup(firebaseAuth, googleProvider);
            toast.success("Signup Successfully");
            localStorage.setItem("token", res?.user?.accessToken);
            localStorage.setItem("user", JSON.stringify(res?.user));

        } catch (err) {
            toast.error("Signup Again");
        }
    };

    // Sign up manually
    const onFinish = async (values) => {
        let uid = null
        try {
            const res = await createUserWithEmailAndPassword(firebaseAuth, values.email, values.password)
            localStorage.setItem("token", res?.user?.accessToken);
            localStorage.setItem("user", JSON.stringify(res?.user));
            toast.success("Form Submitted Successfully!");
            uid = res?.user?.uid
        } catch (err) {
            toast.error(err?.message)
        }

        try {
            await setDoc(doc(firestore, "users", uid), {
                values
            })
        } catch (err) {
        } finally {
            navigate("/login")
        }
    };


    return (
        <>
            <div className="container">
                <div className="row align-items-center" style={{ height: "100vh" }}>
                    <div className="col-md-5 col-12">
                        <img src={IMAGES.SIGNUP} alt="signup" className="img-fluid" />
                    </div>

                    <div className="col-md-7 col-12">
                        <Form
                            {...formItemLayout}
                            form={form}
                            onFinish={onFinish}
                            style={{ maxWidth: 600 }}
                        >
                            <div className="mt-2">
                                <Form.Item
                                    label="Name"
                                    name="name"

                                    rules={[{ required: true, message: "Enter your name" }]}
                                >
                                    <Input placeholder="Enter name" />
                                </Form.Item>
                            </div>


                            <div className="mt-2">
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        { required: true, message: "Enter your email" },
                                        { type: "email", message: "Enter a valid email" },
                                    ]}
                                >
                                    <Input placeholder="Enter email" />
                                </Form.Item>
                            </div>


                            <Form.Item
                                label="Contact"
                                name="contact"
                                rules={[{ required: true, message: "Enter contact number" }]}
                            >
                                <InputNumber style={{ width: "100%" }} placeholder="Enter number" />
                            </Form.Item>

                            <Form.Item
                                label="Age"
                                name="age"
                                rules={[{ required: true, message: "Enter age" }]}
                            >
                                <InputNumber style={{ width: "100%" }} placeholder="Enter age" />
                            </Form.Item>

                            <Form.Item
                                label="Gender"
                                name="gender"
                                rules={[{ required: true, message: "Select gender" }]}
                            >
                                <Select placeholder="Select gender">
                                    <Select.Option value="male">Male</Select.Option>
                                    <Select.Option value="female">Female</Select.Option>
                                    <Select.Option value="other">Other</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    { required: true, message: "Set your password" },
                                    { min: 6, message: "Password must be at least 6 characters" }
                                ]}
                            >
                                <Input.Password placeholder="Set Your Password" />
                            </Form.Item>


                            <Form.Item label={null}>
                                <Button className="w-100 mt-2" type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>

                        </Form>
                        <div className="d-flex justify-content-center">
                            <button className="btn btn-primary text-cennter p-1" onClick={signupwithgoogle}>
                                Google Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
