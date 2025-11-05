import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container footer-content">
        <div className="footer-section">
            <h3>Level-Up Gamer</h3>
            <p>Tu tienda gamer de confianza en Chile. Productos de calidad para los verdaderos gamers.</p>
            <div className="social-share">
                <a href="#" className="social-btn"><i className="fab fa-facebook"></i></a>
                <a href="#" className="social-btn"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-btn"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-btn"><i className="fab fa-discord"></i></a>
            </div>
        </div>
        <div className="footer-section">
            <h3>Información</h3>
            <p><i className="fas fa-truck"></i> Despacho a todo Chile</p>
            <p><i className="fas fa-shield-alt"></i> Productos auténticos</p>
            <p><i className="fas fa-users"></i> Comunidad gamer</p>
        </div>
        <div className="footer-section">
            <h3>Contacto</h3>
            <p><i className="fas fa-envelope"></i> info@levelupgamer.cl</p>
            <p><i className="fas fa-phone"></i> +56 9 1234 5678</p>
            <p><i className="fas fa-map-marker-alt"></i> Santiago, Chile</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;