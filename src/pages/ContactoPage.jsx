import React, { useState } from 'react';
import '../assets/css/contacto.css';

const ContactoPage = () => {
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const nombre = e.target.nombre.value;
        const correo = e.target.correo.value;
        const comentario = e.target.comentario.value;

        if (!nombre || !correo || !comentario) {
            setMensaje('<div class="alert alert-danger">Todos los campos son obligatorios.</div>');
            return;
        }
        setMensaje('<div class="alert alert-success">✅ Formulario enviado. ¡Gracias por contactarnos!</div>');
        e.target.reset();
    };

    return (
        <main className="container py-5">
            <h1 className="text-center mb-4">📬 Contáctanos</h1>
            {/* ✅ Restauramos la estructura de filas y columnas */}
            <div className="row g-4">
                {/* Columna del Formulario */}
                <div className="col-md-6">
                    <form onSubmit={handleSubmit} className="p-4 rounded shadow h-100">
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre *</label>
                            <input type="text" id="nombre" name="nombre" className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="correo" className="form-label">Correo electrónico *</label>
                            <input type="email" id="correo" name="correo" className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="comentario" className="form-label">Comentario *</label>
                            <textarea id="comentario" name="comentario" className="form-control" rows="5"></textarea>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: mensaje }}></div>
                        <button type="submit" className="btn btn-primary mt-3">Enviar</button>
                    </form>
                </div>

                {/* ✅ Columna del Mapa */}
                <div className="col-md-6">
                    <div className="mapa h-100">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.131231828994!2d-70.6482680847926!3d-33.44892798077587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a6d3b0b1f9%3A0x6d1f0b8b0b1f0b8b!2sSantiago%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1622082212224!5m2!1ses-419!2scl"
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '400px', borderRadius: '8px' }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Mapa de Ubicación"
                        ></iframe>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default ContactoPage;