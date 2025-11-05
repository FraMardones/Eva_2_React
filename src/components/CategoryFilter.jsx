// src/components/CategoryFilter.jsx

import React from 'react';

// Lista de todas las categorías disponibles en tu tienda
const categories = [
    { key: 'all', name: 'Todos', icon: 'fas fa-th-large' },
    { key: 'juegos de mesa', name: 'Juegos de Mesa', icon: 'fas fa-dice' },
    { key: 'accesorios', name: 'Accesorios', icon: 'fas fa-gamepad' },
    { key: 'consolas', name: 'Consolas', icon: 'fas fa-tv' },
    { key: 'computadores gamers', name: 'PCs Gamer', icon: 'fas fa-desktop' },
    { key: 'sillas gamers', name: 'Sillas Gamer', icon: 'fas fa-chair' },
    { key: 'mouse', name: 'Mouse', icon: 'fas fa-mouse' },
    { key: 'mousepad', name: 'Mousepad', icon: 'fas fa-square' },
    { key: 'poleras personalizadas', name: 'Poleras', icon: 'fas fa-tshirt' },
];

// El componente recibe props para manejar el estado desde la página principal
const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
    return (
        <section className="categories container">
            <h2 className="section-title">Categorías</h2>
            <div className="category-grid">
                {categories.map(category => (
                    <div
                        key={category.key}
                        // Agrega la clase 'active' si la categoría está seleccionada
                        className={`category-card ${selectedCategory === category.key ? 'active' : ''}`}
                        // Llama a la función del padre cuando se hace clic
                        onClick={() => onSelectCategory(category.key)}
                    >
                        <div className="category-icon"><i className={category.icon}></i></div>
                        <h3>{category.name}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryFilter;