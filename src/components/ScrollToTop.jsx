// src/components/ScrollToTop.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Obtiene el "pathname" (ej: "/carrito", "/productos")
  const { pathname } = useLocation();

  // Este hook se ejecuta CADA VEZ que el 'pathname' cambia
  useEffect(() => {
    window.scrollTo(0, 0); // Manda el scroll al inicio de la página
  }, [pathname]);

  return null; // No renderiza nada
};

export default ScrollToTop;