"use client"

import type React from "react"

import { useState } from "react"
import {toast,ToastContainer} from 'react-toastify'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type FormState = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  consent: boolean
  // honeypot
  company: string
}

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    consent: false,
    company: "",
  })

  const onChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast(
      "Please fill in your name, email, and message.",
      
      )
      return
    }
    if (!form.consent) {
      toast(
        
         "Please agree to be contacted regarding your inquiry.",
         
      )
      return
    }
    // basic email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast(
        
         "Please provide a valid email address.",
       
      )
      return
    }
    // honeypot check
    if (form.company) {
      // silently ignore bots
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error || "Failed to send message")
      }
      toast(
     "Thanks for reaching out. We’ll get back to you shortly.",
      )
      // reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        consent: false,
        company: "",
      })
    } catch (err) {
      toast( "Please try again later.")
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col" aria-describedby="contact-instructions">
      <p id="contact-instructions" className="sr-only">
        All fields marked required must be completed before submitting the form.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">
            Full name<span className="ml-1 text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={onChange("name")}
            required
            aria-invalid={!form.name ? true : undefined}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">
            Email<span className="ml-1 text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={onChange("email")}
            required
            aria-invalid={!form.email ? true : undefined}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="+91 9876543210"
            value={form.phone}
            onChange={onChange("phone")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            name="subject"
            placeholder="Question about bookings"
            value={form.subject}
            onChange={onChange("subject")}
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-2">
          <Label htmlFor="message">
            Message<span className="ml-1 text-destructive">*</span>
          </Label>
          <Textarea
            id="message"
            name="message"
            placeholder="How can we help?"
            value={form.message}
            onChange={onChange("message")}
            required
            rows={6}
            aria-invalid={!form.message ? true : undefined}
          />
        </div>
        <div className="md:col-span-2">
          {/* consent + honeypot */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <input
                id="consent"
                name="consent"
                type="checkbox"
                checked={form.consent}
                onChange={onChange("consent")}
                className="mt-1 h-4 w-4"
                aria-invalid={!form.consent ? true : undefined}
              />
              <Label htmlFor="consent" className="font-normal text-muted-foreground">
                I agree to be contacted about my inquiry. We’ll never share your information.
              </Label>
            </div>
            {/* Honeypot field for bots (hidden) */}
            <div aria-hidden="true" className="hidden">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={form.company}
                onChange={onChange("company")}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button type="submit" disabled={loading} className="min-w-32">
          {loading ? "Sending..." : "Send message"}
        </Button>
      </div>
      <ToastContainer autoClose = {200}/>
    </form>
  )
}
