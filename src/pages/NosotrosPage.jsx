import React from 'react';
import '../assets/css/nosotros.css';

const NosotrosPage = () => {
    return (
        <main className="container py-5">
            <h1 className="text-center mb-5 nosotros-title">Sobre Level-UP Gamer</h1>
            <div className="card-neon">
                <h2>Nuestra Misión, Visión e Historia</h2>
                <p>
                    Nacimos hace dos años para cubrir la creciente demanda de productos gamers, ofreciendo consolas, accesorios, computadores y sillas especializadas. Nuestra misión es brindar productos de alta calidad para gamers en todo Chile, con una experiencia de compra única y un enfoque en la satisfacción de nuestra comunidad.
                </p>
                <p>
                    Nuestra visión es ser la tienda online líder en Chile, reconocida por la innovación, un servicio al cliente excepcional y un programa de fidelización que realmente premie a nuestros clientes más fieles.
                </p>
            </div>
        </main>
    );
};
export default NosotrosPage;