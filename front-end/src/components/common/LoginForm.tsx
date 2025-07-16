// components/auth/LoginForm.tsx
import React from "react";
import Login_img from "@/assets/illustration.png";
import { InputField } from "@/components/common/InputField";
import { SubmitButton } from "@/components/common/SubmitButton";
import { Link } from "react-router-dom";

import "../../css/Login.css";

type Props = {
  form: {
    email: string;
    password: string;
  };
  setForm: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  errors: {
    email?: string;
    password?: string;
    general?: string;
  };
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleLogin?: () => void;
};

const LoginForm: React.FC<Props> = ({
  form,
  setForm,
  errors,
  isLoading,
  onSubmit,
  onGoogleLogin,
}) => {
  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-image">
          <img src={Login_img} alt="Healthcare Login" />
          <div className="image-overlay">
            <h2>Welcome Back</h2>
            <p>Access your healthcare dashboard and manage your appointments with ease</p>
          </div>
        </div>

        <div className="login-form-section">
          <div className="login-form-container">
            <h1>Login</h1>
            <p className="login-subtitle">Enter your credentials to access your account</p>

            <form className="login-form" onSubmit={onSubmit}>
              <div className="form-group">
                <InputField
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <p className="errors">{errors.email}</p>}
              </div>

              <div className="form-group">
                <InputField
                  type="password"
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                {errors.password && <p className="errors">{errors.password}</p>}
              </div>

              <div className="form-options">
                <Link to={"/email-verification"} className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <SubmitButton label="Login" isLoading={isLoading} />
            </form>

            <div className="divider">
              <span>or continue with</span>
            </div>

            {onGoogleLogin && (
              <div className="social-login">
                <button type="button" className="btn-google" onClick={onGoogleLogin}>
                  <span>G</span> Google
                </button>
              </div>
            )}

            <p className="signup-link">
              Don't have an account? <Link to={"/signup"}>Sign up here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
