import "../../css/Login.css";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "@/features/auth/authApi";
import { setCredentials } from "@/features/auth/authSlice";
import { setCredentialsDoctor } from "@/features/docotr/doctorSlice";
import { setCredentialsAdmin } from "@/features/admin/adminSlice";
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

  const admin = useSelector((state:RootState)=> state.admin.admin);
  const doctor = useSelector((state:RootState)=> state.doctor.doctor);
  const user = useSelector((state:RootState)=> state.auth.user);
 

  useEffect(()=>{
    if(user){
      navigate('/');
    }
  })
  useEffect(()=>{
    if(doctor){
      navigate('/doctor')
    }
  })
  useEffect(()=>{
    if(admin){
      navigate('/admin');
    }
  })
  const [login, { isLoading }] = useLoginMutation();



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
       
     console.log('login response',res);
      toast.success(res.msg);
      const roles = res?.user?.role;
       
      if (roles === "patients") {
       dispatch(
        setCredentials({
          user:res?.user?.id,
          role:res?.user?.role
        })
       )
        navigate("/");
      } else if (roles === "doctors") {
        dispatch(
          setCredentialsDoctor({
            doctor:res?.user?.id,
            role:res?.user?.role
          })
        )
        navigate("/doctor");
      } else if(roles === 'admin') {  
        dispatch(
          setCredentialsAdmin({
             admin:res?.user?.id,
            role:res?.user?.role
          })
        )
        navigate("/admin");
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
