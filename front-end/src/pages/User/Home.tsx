import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Shield,
  Clock,
  Users,
  Heart,
  Stethoscope,
  Activity,
  Award,
} from "lucide-react";

import Header from "@/layout/Header";
import Footer from "@/layout/Footer";
import Chatbot from "@/components/common/user/Chatboat";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import type { AppDispatch } from "@/app/store";

import axios from "axios";
import { ToastContainer } from "react-toastify";

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();

  interface userInfo {
    token: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  }

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.get<userInfo>(
          "https://careslot-j0bz.onrender.com/api/auth/me",
          {
            withCredentials: true,
          }
        );

        const { user } = res.data;
        dispatch(
          setCredentials({
            user: user,
            role: user?.role,
          })
        );
      } catch (error) {
        console.error("error fetching ", error);
      }
    };
    getUserData();
  }, [dispatch]);

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiA0NGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center md:text-left z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                <Heart className="w-4 h-4" />
                Trusted by 50,000+ Patients
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Your Health
                <span className="block text-blue-200">Our-Priority</span>
              </h1>

              <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-xl">
                Connect with top-rated doctors and specialists. Book
                appointments instantly and experience quality healthcare from
                the comfort of your home.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 shadow-lg"
                >
                  <Link to="/doctors">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Appointment
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <Link to="/doctors">
                    <Users className="w-5 h-5 mr-2" />
                    Find Doctors
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-8 pt-6 text-sm">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-200" />
                  <span>Certified Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-200" />
                  <span>100% Secure</span>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur">
                <img
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop"
                  alt="Healthcare professional with patient"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%234F46E5' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='24' font-family='Arial'%3EHealthcare%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-indigo-400 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="currentColor"
              className="text-background"
            />
          </svg>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Why Choose CareSlot?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience modern healthcare with our comprehensive platform
              designed for your convenience and wellbeing.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Expert Doctors</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Access certified and experienced medical professionals across
                50+ specialties for comprehensive care.
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Easy Booking</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Simple, fast appointment scheduling with real-time availability
                and instant confirmation.
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Your medical information is protected with industry-leading
                encryption and security measures.
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-200 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">24/7 Support</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Get assistance anytime for bookings, questions, and care
                guidance from our dedicated team.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <div>
        <Chatbot />
      </div>
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-6">
          <Activity className="w-16 h-16 mx-auto text-blue-200" />
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl text-blue-100 leading-relaxed">
            Join thousands of patients who trust HealthCare+ for their medical
            needs. Book your appointment today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50"
            >
              <Link to="/book">Get Started Today</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <ToastContainer autoClose={2000} />
    </main>
  );
};

export default Index;
