import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

import bubbleTea from '../assets/Bubble tea.png';
import coffee from '../assets/Coffee.png';
import foodItems from '../assets/Food Items.png';
import hookah from '../assets/Hookah.png';
import karuna from '../assets/Karuna.png';
import kopila from '../assets/Kopila.png';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Drift and Sip</div>
        <a href="tel:+9779769402712" className="call-link">
          <button className="call-btn">
            <i className="fas fa-phone-alt"></i> Call Now
          </button>
        </a>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Drift and Sip</h1>
        <p>Where every sip takes you on a journey of flavor and comfort</p>
        <div className="hero-buttons">
          <button onClick={() => navigate('/menu')} className="primary-btn">View Menu</button>
          <button onClick={() => navigate('/order')} className="secondary-btn">Order Online</button>
        </div>
      </section>

      {/* Specialties */}
      <section className="specialties">
        <h2>Our Specialties</h2>
        <p className="subtitle">Explore our most loved categories</p>
        <div className="card-container">
          <div className="card" onClick={() => navigate('/menu?section=bubble-tea')}>
            <img src={bubbleTea} alt="Bubble Tea" />
            <h3>Bubble Tea</h3>
            <p>20+ refreshing flavors</p>
          </div>
          <div className="card" onClick={() => navigate('/menu?section=coffee')}>
            <img src={coffee} alt="Coffee" />
            <h3>Coffee</h3>
            <p>Bold blends & rich aromas</p>
          </div>
          <div className="card" onClick={() => navigate('/menu?section=food')}>
            <img src={foodItems} alt="Food Items" />
            <h3>Food Items</h3>
            <p>Momo, noodles, burgers & more</p>
          </div>
          <div className="card" onClick={() => navigate('/menu?section=hookah')}>
            <img src={hookah} alt="Hookah" />
            <h3>Hookah</h3>
            <p>Smooth premium flavors</p>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="founders">
        <h2>Meet Our Founders</h2>
        <div className="founder-cards">
          <div className="founder-card">
            <img src={karuna} alt="Karuna Jaishi" className="founder-img" />
            <div>
              <h3>Karuna Jaishi</h3>
              <p className="position">Co-Founder & CEO</p>
              <p>Karuna brings warmth, creativity, and vision to Drift and Sip with her passion for hospitality.</p>
            </div>
          </div>
          <div className="founder-card">
            <img src={kopila} alt="Kopila Nyaupane" className="founder-img" />
            <div>
              <h3>Kopila Nyaupane</h3>
              <p className="position">Co-Founder</p>
              <p>Kopila’s culinary precision ensures every dish is crafted with excellence and love.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          <h3>Drift and Sip</h3>
          <p>Where every sip takes you on a journey of flavors and relaxation.</p>
          <div className="socials">
            <a href="https://facebook.com/profile.php?id=61572271866220" target="_blank" rel="noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com/drift_and_sip" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://tiktok.com/@driftandsipcafe" target="_blank" rel="noreferrer">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
        <div className="footer-right">
          <p><strong>📍 Koteshwor, Kathmandu</strong></p>
          <p><strong>📞 +977 976-9402712</strong></p>
          <p><strong>📧 driftandsip22@gmail.com</strong></p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
