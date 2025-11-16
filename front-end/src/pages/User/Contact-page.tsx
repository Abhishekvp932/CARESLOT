"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import { useCreateContactInformationMutation } from "@/features/users/userApi";
import { toast, ToastContainer } from "react-toastify";
import { handleApiError } from "@/utils/handleApiError";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const validate = () => {
    const newError = { name: "", email: "", phone: "", message: "" };
    let isValid = true;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email) || !formData.email) {
      newError.email = "Please enter a valid email address";
      isValid = false;
    }
    const phonePattern = /^[6-9]\d{9}$/;
    if (!formData.phone || !phonePattern.test(formData.phone)) {
      newError.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }
    if (!formData.name) {
      newError.name = "Enter your Name";
      isValid = false;
    }
    if (formData.message.length <= 10) {
      newError.message = "Message should be atleast 20 character";
      isValid = false;
    }

    setErrors(newError);
    return isValid;
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [createContactInformation] = useCreateContactInformationMutation();
  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
    try {
      const name = formData.name;
      const email = formData.email;
      const phone = formData.phone;
      const message = formData.message;
      const res = await createContactInformation({
        name,
        email,
        phone,
        message,
      }).unwrap();
      toast.success(res?.msg);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Header />
      </header>

      <main className="flex-1 pt-8">
        <section className="py-12 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
              <p className="text-muted-foreground">
                Get in touch with us for any queries or appointments
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-xl">Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                      />
                      {errors && <p style={{ color: "red" }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                      />
                      {errors && <p style={{ color: "red" }}>{errors.email}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Your phone number"
                      />
                      {errors && <p style={{ color: "red" }}>{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your message"
                        rows={6}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                        required
                      />
                      {errors && (
                        <p style={{ color: "red" }}>{errors.message}</p>
                      )}
                    </div>
                    <Button onClick={handleSubmit} className="w-full">
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl">Clinic Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-5">
                    <li>
                      <div className="text-sm text-muted-foreground mb-1">
                        Phone
                      </div>
                      <div className="font-medium">+91 9876543210</div>
                    </li>
                    <li>
                      <div className="text-sm text-muted-foreground mb-1">
                        Email
                      </div>
                      <div className="font-medium break-all">
                        careslot@gmail.com
                      </div>
                    </li>
                    <li>
                      <div className="text-sm text-muted-foreground mb-1">
                        Address
                      </div>
                      <div className="font-medium">
                        Kakkancheri
                        <br />
                        Calicut, Kerala
                        <br />
                        673634
                      </div>
                    </li>
                    <li>
                      <div className="text-sm text-muted-foreground mb-1">
                        Hours
                      </div>
                      <div className="font-medium">
                        Mon–Fri: 8:00 AM–6:00 PM
                        <br />
                        Sat: 9:00 AM–2:00 PM
                        <br />
                        Sun: Closed
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-6">
        <Footer />
      </footer>
      <ToastContainer autoClose={200} />
    </div>
  );
}
