import { Heart, Shield, Users, Award, Clock, MapPin, Linkedin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/layout/Header"
import Footer from "@/layout/Footer"
import CEO from '../../assets/1745997285118.jpeg'
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header/>
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-balance">
                  <span className="medical-gradient">CARESLOT</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium">Healthcare Platform</p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We connect patients with trusted healthcare professionals, making quality medical care accessible,
                  convenient, and reliable for everyone.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-1 h-16 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">MISSION</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      To revolutionize healthcare accessibility by bridging the gap between patients and healthcare
                      providers through innovative technology and compassionate care.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-1 h-16 bg-chart-2 rounded-full"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-chart-2 mb-2">VISION</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      A world where quality healthcare is just a click away, empowering individuals to take control of
                      their health journey with confidence and ease.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-balance">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Every decision we make is guided by our commitment to excellence, trust, and patient-centered care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Compassion</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We approach every patient interaction with empathy, understanding, and genuine care for their
                  wellbeing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-chart-2" />
                </div>
                <h3 className="text-xl font-semibold">Trust</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We maintain the highest standards of security, privacy, and professional integrity in all our
                  services.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-chart-3" />
                </div>
                <h3 className="text-xl font-semibold">Accessibility</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We believe quality healthcare should be available to everyone, regardless of location or circumstance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-chart-4/10 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8 text-chart-4" />
                </div>
                <h3 className="text-xl font-semibold">Excellence</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We continuously strive for the highest quality in our platform, services, and patient outcomes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-balance">Meet Our Leadership</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Dedicated professionals committed to transforming healthcare delivery
            </p>
          </div>

          <div className="flex justify-center">
            {/* Founder & CEO */}
            <Card className="border-0 bg-card/50 backdrop-blur-sm overflow-hidden group max-w-md w-full">
              <CardContent className="p-0">
                <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 to-chart-2/20 h-80">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-6xl font-bold text-primary-foreground">
                      <img src={CEO} alt="" />
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">Abhishek Vp</h3>
                    <p className="text-primary font-medium">Founder & CEO</p>
                  </div>
                  <div className="flex justify-center gap-4 pt-2">
                    <a href="https://www.linkedin.com/in/abhishek-vp-46aa65327/" target="_blank" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition flex items-center justify-center">
                      <Linkedin className="w-5 h-5 text-primary" />
                    </a>
                    <a href="https://www.instagram.com/abhishekhh.__/" target="_blank" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-primary" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-balance">Our Story</h2>
              <p className="text-xl text-muted-foreground text-pretty">
                Born from a vision to transform healthcare delivery
              </p>
            </div>

            <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
              <p>
                CARESLOT was founded with a simple yet powerful belief: that everyone deserves access to quality
                healthcare, regardless of their location, schedule, or circumstances. Our journey began when our
                founders experienced firsthand the challenges of finding and booking appointments with trusted
                healthcare professionals.
              </p>

              <p>
                We recognized that the traditional healthcare system often creates barriers between patients and the
                care they need. Long wait times, complex booking processes, and limited access to specialist information
                were preventing people from getting timely medical attention.
              </p>

              <p>
                Today, CARESLOT serves as a bridge between patients and healthcare providers, offering a comprehensive
                platform that simplifies the entire healthcare journey. From finding the right specialist to booking
                appointments and managing medical records, we're committed to making healthcare more accessible,
                transparent, and patient-centered.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 pt-8">
              <div className="text-center space-y-3">
                <Clock className="w-12 h-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">24/7 Availability</h3>
                <p className="text-muted-foreground text-sm">Book appointments and access care whenever you need it</p>
              </div>

              <div className="text-center space-y-3">
                <MapPin className="w-12 h-12 text-chart-2 mx-auto" />
                <h3 className="text-xl font-semibold">Nationwide Network</h3>
                <p className="text-muted-foreground text-sm">Connect with verified doctors across the country</p>
              </div>

              <div className="text-center space-y-3">
                <Shield className="w-12 h-12 text-chart-3 mx-auto" />
                <h3 className="text-xl font-semibold">Secure & Private</h3>
                <p className="text-muted-foreground text-sm">
                  Your health information is protected with enterprise-grade security
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-balance">Ready to Experience Better Healthcare?</h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Join thousands of patients who trust CARESLOT for their healthcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Book Your First Appointment
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              Learn More About Our Services
            </Button>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  )
}