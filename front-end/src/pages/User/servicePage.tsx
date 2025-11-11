"use client"

import { Card } from "@/components/ui/card"
import { Heart, Brain, Stethoscope, Eye, Smile, Activity, Clock, Shield, Users, Zap } from "lucide-react"
import Header from "@/layout/Header"
import Footer from "@/layout/Footer"
import { ToastContainer } from "react-toastify"

const services = [
  {
    icon: Heart,
    title: "Cardiology",
    description: "Expert heart and cardiovascular care from board-certified cardiologists.",
    specialists: "45+ Specialists",
  },
  {
    icon: Brain,
    title: "Neurology",
    description: "Comprehensive neurological care for brain and nervous system disorders.",
    specialists: "32+ Specialists",
  },
  {
    icon: Stethoscope,
    title: "General Medicine",
    description: "Primary care and general health consultations for all ages.",
    specialists: "120+ Specialists",
  },
  {
    icon: Eye,
    title: "Ophthalmology",
    description: "Complete eye care and vision correction services.",
    specialists: "28+ Specialists",
  },
  {
    icon: Smile,
    title: "Dentistry",
    description: "Professional dental care and cosmetic dentistry services.",
    specialists: "35+ Specialists",
  },
  {
    icon: Activity,
    title: "Orthopedics",
    description: "Specialized care for bones, joints, and musculoskeletal health.",
    specialists: "38+ Specialists",
  },
]

const features = [
  {
    icon: Clock,
    title: "Quick Appointments",
    description: "Book appointments in minutes with flexible scheduling options.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your health data is encrypted and protected with industry standards.",
  },
  {
    icon: Users,
    title: "Verified Doctors",
    description: "All healthcare professionals are verified and board-certified.",
  },
  {
    icon: Zap,
    title: "Instant Consultations",
    description: "Get video consultations with doctors from the comfort of your home.",
  },
]

export default function ServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">
              Comprehensive Healthcare Services at Your Fingertips
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Connect with qualified healthcare professionals across multiple specialties. Book appointments, get
              consultations, and manage your health all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition">
                Explore Services
              </button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Medical Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Access a wide range of medical specialties with experienced professionals ready to help.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="mb-4 inline-block p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="flex items-center justify-between">
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why Choose CareSlot?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience healthcare reimagined with modern technology and professional care.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card key={index} className="p-6 text-center">
                    <div className="mb-4 inline-block p-3 bg-accent/10 rounded-lg">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-center text-primary-foreground">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of patients who trust HealthHub for their healthcare needs.
            </p>
            <button className="px-8 py-3 bg-primary-foreground text-primary rounded-lg font-semibold hover:opacity-90 transition">
              Get Started Today
            </button>
          </div>
        </section>
      </main>
      <Footer />
         <ToastContainer autoClose={2000} />
    </div>
  )
}