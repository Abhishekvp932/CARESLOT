import "../../css/Signup.css";
import Footer from "../../layout/Footer";
import Header from "../../layout/Header";
import { signupSchema } from "@/validation/signup.schema";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { useSignupMutation } from "@/features/auth/authApi";

import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

import { SubmitButton } from "@/components/common/SubmitButton";
import { InputField } from "@/components/common/InputField";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { useGoogleAuth } from "@/customHooks/googleAuth";
import { handleApiError } from "@/utils/handleApiError";

const Signup = () => {
  const navigate = useNavigate();
  // const user = useSelector((state: RootState) => state.auth.token);
  const googleAuth = useGoogleAuth();
  const [signup, { isLoading }] = useSignupMutation();

  const admin = useSelector((state: RootState) => state.admin);
  const user = useSelector((state: RootState) => state.auth);
  const doctor = useSelector((state: RootState) => state.doctor);

  // const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (admin?.role === "admin") {
      navigate("/admin");
    } else if (user.role === "patients") {
      navigate("/");
    } else if (doctor.role === "doctors") {
      navigate("/doctor");
    } else {
      navigate("/signup");
    }
  }, [admin, user, doctor, navigate]);

  // if (!isAuthorized) return null;

  type formType = {
    name: string;
    email: string;
    dob: string;
    gender: string;
    role: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };

  type formErrorType = {
    [k in keyof formType]?: string;
  };

  const [form, setForm] = useState<formType>({
    name: "",
    email: "",
    dob: "",
    gender: "",
    role: " ",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<formErrorType>({});

  const validation = () => {
    try {
      signupSchema.parse(form);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.path[0]]: curr.message,
          }),
          {}
        );
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validation()) return;

    try {
      const res = await signup(form).unwrap();

      toast.success(res.msg);
      setTimeout(() => {
        navigate("/otp-verification", {
          state: { email: form.email, role: form.role },
        });
      }, 3000);
    } catch (error) {
       toast.error(handleApiError(error));
    }
  };
  return (
    <div className="signup-page">
      <Header />
      <div className="signup-container">
        <div className="signup-content">
          <div className="signup-form-section">
            <div className="signup-form-container">
              <h1>Create Account</h1>
              <p className="signup-subtitle">
                Join thousands of patients who trust careslot for their medical
                needs
              </p>

              <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <InputField
                      type="text"
                      label="Name"
                      name="name"
                      placeholder="Enter your first name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                    {errors && <p className="errors">{errors.name}</p>}
                  </div>

                  <div>
                    <InputField
                      type="date"
                      label="Date Of Birth"
                      name="dob"
                      value={form.dob}
                      onChange={(e) =>
                        setForm({ ...form, dob: e.target.value })
                      }
                    />
                    {errors && <p className="errors">{errors.dob}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">GENDER</label>
                    <select
                      name="gender"
                      id=""
                      value={form.gender}
                      onChange={(e) =>
                        setForm({ ...form, gender: e.target.value })
                      }
                    >
                      <option value="">Select your gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Others</option>
                    </select>
                    {errors && <p className="errors">{errors.gender}</p>}
                  </div>
                </div>

                <div>
                  <InputField
                    type="email"
                    label="Email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                  {errors && <p className="errors">{errors.email}</p>}
                </div>

                <div>
                  <InputField
                    type="tel"
                    label="Phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                  {errors && <p className="errors">{errors.phone}</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={(e) => {
                      setForm({ ...form, role: e.target.value });
                    }}
                  >
                    <option value="">Select your role</option>
                    <option value="patients">Patient</option>
                    <option value="doctors">Doctor</option>
                  </select>
                  {errors?.role && <p className="errors">{errors.role}</p>}
                </div>

                <div>
                  <div>
                    <InputField
                      type="password"
                      label="Password"
                      name="password"
                      placeholder="Create a password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                    {errors && <p className="errors">{errors.password}</p>}
                  </div>
                  <div>
                    <InputField
                      type="password"
                      label="Confrim Password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                    />
                    {errors && (
                      <p className="errors">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
                <SubmitButton label="Signup" isLoading={isLoading} />
                <div className="divider">
                  <span>or continue with</span>
                </div>
                <div className="social-signup">
                  <button
                    type="button"
                    className="btn-google"
                    onClick={googleAuth}
                  >
                    <span>G</span> Google
                  </button>
                </div>

                <p className="login-link">
                  Already have an account?{" "}
                  <Link to={"/login"}>Sign in here</Link>
                </p>
              </form>
            </div>
          </div>

          <div className="signup-image">
            <img
              src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=800&fit=crop"
              alt="Healthcare Signup"
            />
            <div className="image-overlay">
              <h2>Start Your Health Journey</h2>
              <p>
                Join our community and get access to the best healthcare
                professionals in your area
              </p>
              <div className="features-list">
                <div className="feature-item">
                  ✓ Book appointments instantly
                </div>
                <div className="feature-item">✓ Access medical records</div>
                <div className="feature-item">✓ 24/7 support available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default Signup;
