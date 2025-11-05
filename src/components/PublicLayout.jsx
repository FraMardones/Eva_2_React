import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

// Esta "plantilla" se asegura de que el Header y Footer 
// solo se muestren en las páginas de la tienda.
const PublicLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* Aquí se renderizarán HomePage, ProductosPage, etc. */}
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;