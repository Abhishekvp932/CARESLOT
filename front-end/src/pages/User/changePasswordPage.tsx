"use client";

import type React from "react";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useChangePasswordMutation } from "@/features/users/userApi";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function ChangePasswordPage() {
  type ChangePassoword = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };

  type Errors = {
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
  const [formData, setFormData] = useState<ChangePassoword>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setErrors] = useState<Errors>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [changePassword] = useChangePasswordMutation();

  const validate = () => {
    let isValidate = true;

    const newError = { oldPassword: "", newPassword: "", confirmPassword: "" };

    if (!formData.oldPassword) {
      newError.oldPassword = "Old password is required";
      isValidate = false;
    }
    if (formData.newPassword.length < 6) {
      newError.newPassword = "Password must be 6 characters";
      isValidate = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newError.confirmPassword = "Password must be same";
      isValidate = false;
    }
    setErrors(newError);

    return isValidate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }
    try {
      const res = await changePassword({ formData, userId }).unwrap();
      toast.success(res?.msg);
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      toast.error((error as any)?.data?.msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            to="/profile"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Change Password
            </CardTitle>
            <CardDescription className="text-gray-600">
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            `
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label
                  htmlFor="oldPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    value={formData.oldPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, oldPassword: e.target.value })
                    }
                    className="pr-10"
                    placeholder="Enter your current password"
                  />
                  {error && <p style={{ color: "red" }}>{error.oldPassword}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    className="pr-10"
                    placeholder="Enter your new password"
                  />
                  {error && <p style={{ color: "red" }}>{error.newPassword}</p>}
                </div>
                <p className="text-xs text-gray-500">
                  Must be at least 8 characters with uppercase, lowercase, and
                  number
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="pr-10"
                    placeholder="Confirm your new password"
                  />
                  {error && (
                    <p style={{ color: "red" }}>{error.confirmPassword}</p>
                  )}
                </div>
              </div>
              <Button>submit</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <ToastContainer autoClose={600} />
    </div>
  );
}
