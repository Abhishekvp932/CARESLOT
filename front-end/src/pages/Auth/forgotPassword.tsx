import "../../css/Login.css";
import Login_img from "../../assets/illustration.png";
import { InputField } from "@/components/common/InputField";
import { SubmitButton } from "@/components/common/SubmitButton";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "@/features/auth/authApi";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/handleApiError";
const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const loaction = useLocation();
  const navigate = useNavigate();
  const email = loaction?.state?.email;
  //
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const validate = () => {
    const newError = { newPassword: "", confirmPassword: "" };
    let isValid = true;

    if (!form.newPassword) {
      newError.newPassword = "Password is required";
      isValid = false;
    } else if (form.newPassword.length < 6) {
      newError.newPassword = "Password must be 6 characters";
      isValid = false;
    }

    if (form.confirmPassword !== form.newPassword) {
      newError.confirmPassword = "Passwords must match";
      isValid = false;
    }

    setErrors(newError);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await forgotPassword({
        email,
        newPassword: form.newPassword,
      }).unwrap();
      toast.success(res.msg);
      navigate("/login");
    } catch (error) {
       toast.error(handleApiError(error));
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <div className="login-image">
            <img src={Login_img} alt="Healthcare Login" />
            <div className="image-overlay">
              <h2>Welcome Back</h2>
              <p>
                Access your healthcare dashboard and manage your appointments
                with ease
              </p>
            </div>
          </div>

          <div className="login-form-section">
            <div className="login-form-container">
              <h1>Reset Password</h1>
              <p className="login-subtitle">
                Enter your new password and confirm it.
              </p>

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <InputField
                    label="New Password"
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm({ ...form, newPassword: e.target.value })
                    }
                  />
                  {errors.newPassword && (
                    <p className="errors">{errors.newPassword}</p>
                  )}
                </div>

                <div className="form-group">
                  <InputField
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                  />
                  {errors.confirmPassword && (
                    <p className="errors">{errors.confirmPassword}</p>
                  )}
                </div>

                <SubmitButton label="Reset Password" isLoading={isLoading} />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
