import "../../css/Login.css";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "@/features/auth/authApi";
import { setCredentials } from "@/features/auth/authSlice";
import type { AppDispatch } from "@/app/store";
import type { RootState } from "@/app/store";

import { loginSchema } from "@/validation/login.schema";
import type { LoginFormType } from "@/validation/login.schema";

import { toast, ToastContainer } from "react-toastify";
import { z } from "zod";
import LoginForm from "@/components/common/LoginForm";

import { useGoogleAuth } from "@/customHooks/googleAuth";

const Login = () => {
  const navigate = useNavigate();
  const googleAuth = useGoogleAuth();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [login, { isLoading }] = useLoginMutation();
  
  useEffect(() => {
    if (token) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, []);

  type formType = {
    email: string;
    password: string;
  };

  const [form, setForm] = useState<formType>({ email: "", password: "" });

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormType, string>>
  >({});

  const validation = () => {
    try {
      loginSchema.parse(form);
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
      const res = await login(form).unwrap();
       console.log('response from the back-end',res);

       toast.success(res.msg);
       const roles = res?.data?.role
       const verifyd = res.data.user.isVerified
       console.log('role is',roles)
       if(roles === 'patients'){
          if(verifyd === false){
            navigate('/otp-verification')
            return;
          }
          dispatch(
        setCredentials({
          user: res?.data?.user?._id,
          role: res?.data?.user.role,
          token: res?.data?.token,
        })
      );
        navigate('/')
       }else if(roles === 'doctors'){
        navigate('/signup')
       }else{
        navigate('/admin');
       }
     
     
    } catch (error: any) {
      console.error("Login error:", error);

      const errorMessage =
        error?.data?.msg ||
        error?.data?.error ||
        error.message ||
        "An error occurred during login";

      toast.error(errorMessage);
      setErrors((prev) => ({ ...prev, general: errorMessage }));
    }
  };

  return (
    <>
      <div className="login-page">
        <Header />
        <LoginForm
          form={form}
          setForm={setForm}
          errors={errors}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onGoogleLogin={googleAuth}
        />
        <Footer />
        <ToastContainer autoClose={2000} />
      </div>
    </>
  );
};

export default Login;
