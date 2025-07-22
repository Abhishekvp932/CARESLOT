

import '../../css/Home.css'
import Footer from '../../layout/Footer'
import Header from '../../layout/Header'
import Dcotor_one from '../../assets/d1.jpg'
import Doctor_two from '../../assets/d2.jpg'
import Doctor_three from '../../assets/d3.jpg'
import Doctor_four from '../../assets/WhatsApp Image 2025-07-15 at 18.34.52_bd39d868.jpg'
import { useEffect } from 'react'
import { useDispatch,useSelector} from 'react-redux'
import { setCredentials } from '@/features/auth/authSlice'
import type { AppDispatch } from '@/app/store'
import type { RootState } from '@/app/store'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const Index = () => {


  const dispatch = useDispatch<AppDispatch>();
  
  const admin = useSelector((state:RootState)=> state.admin.admin);
  const navigate = useNavigate()
    
  const doctors = [
    {
      id: 1,
      name: "Dr Amruth",
      specialty: "Cardiologist",
      experience: "15 years",
      rating: 4.9,
      image: Dcotor_one
    },
    {
      id: 2,
      name: "Dr Anees",
      specialty: "Neurologist",
      experience: "12 years",
      rating: 4.8,
      image: Doctor_two
    },
    {
      id: 3,
      name: "Dr. Faique Faizal",
      specialty: "Pediatrician",
      experience: "10 years",
      rating: 4.9,
      image: Doctor_three
    },
    {
      id: 4,
      name: "Dr. Lena",
      specialty: "psychologist",
      experience: "18 years",
      rating: 4.7,
      image: Doctor_four
    }
  ];

interface userInfo{
  token : string,
  user:{
    id:string;
    email:string;
    role:string;
  }
}

  useEffect(()=>{
    const getUserData = async()=>{

      try {
        const res = await axios.get<userInfo>('http://localhost:3000/api/auth/me',{
          withCredentials:true
        });
       
        const  {token,user} = res.data;
        dispatch(setCredentials({
          user:user.id,
          role:user?.role,
          token:token
        }))
      } catch (error) {
        console.error('error fetching ',error)
        
      }
    }
    getUserData()
     },[]);
    
  return (
    <div className="home-page">
         <Header/>
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Your Health, Our Priority</h1>
            <p>Book appointments with top-rated doctors and specialists. Quality healthcare is just a click away.</p>
            <div className="hero-buttons">
              <button className="btn-primary">Book Appointment</button>
              <button className="btn-secondary">Find Doctors</button>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop" alt="Healthcare" />
          </div>
        </div>
      </section>

    
      <section className="features">
        <div className="features-container">
          <h2>Why Choose HealthCare+?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h3>Expert Doctors</h3>
              <p>Access to certified and experienced medical professionals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Easy Booking</h3>
              <p>Simple and quick appointment scheduling system</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your medical information is protected and confidential</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💊</div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock medical assistance and emergency care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="doctors" id="doctors">
        <div className="doctors-container">
          <h2>Meet Our Top Doctors</h2>
          <p className="doctors-subtitle">Experienced professionals dedicated to your health and wellbeing</p>
          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-image flex justify-center">
                  <img src={doctor.image} alt={doctor.name}  />
                </div>
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <p className="specialty">{doctor.specialty}</p>
                  <p className="experience">{doctor.experience} experience</p>
                  <div className="rating">
                    <span className="stars">⭐⭐⭐⭐⭐</span>
                    <span className="rating-number">{doctor.rating}</span>
                  </div>
                  <button className="btn-book">Book Appointment</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="cta">
        <div className="cta-container">
          <h2>Ready to Start Your Health Journey?</h2>
          <p>Join thousands of patients who trust HealthCare+ for their medical needs</p>
          <button className="btn-cta">Get Started Today</button>
        </div>
      </section>
   <Footer/>
    </div>
  );
};

export default Index;