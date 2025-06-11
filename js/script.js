"use strict";

import { saveVote, getVotes } from "./firebase.js";

function hoverNav() {
    // Selecciona los elementos con id "nav-link" y clase "nav-item"
    const navLinks = document.querySelectorAll('#nav-link');
    const navItems = document.querySelectorAll('#nav-item');

    // Función para agregar o quitar eventos según el ancho de pantalla
    function updateHoverEvents() {
        if (window.innerWidth >= 768) {
            // Aplica a #nav-link
            navLinks.forEach(link => {
                if (!link.hasHoverListeners) {
                    link.style.transition = '0.3s ease';
                    link.addEventListener('mouseenter', link._hoverEnter = () => {
                        link.style.color = "black";
                        link.style.background = 'linear-gradient(90deg, rgba(49, 130, 206, 1) 0%, rgba(56, 178, 172, 1) 100%)';
                    });
                    link.addEventListener('mouseleave', link._hoverLeave = () => {
                        link.style.color = "white";
                        link.style.background = '';
                    });
                    link.hasHoverListeners = true;
                }
            });
            // Quita eventos de .nav-item
            navItems.forEach(item => {
                if (item.hasHoverListeners) {
                    item.removeEventListener('mouseenter', item._hoverEnter);
                    item.removeEventListener('mouseleave', item._hoverLeave);
                    item.style.color = "";
                    item.style.background = "";
                    item.hasHoverListeners = false;
                }
            });
        } else {
            // Aplica a .nav-item
            navItems.forEach(item => {
                if (!item.hasHoverListeners) {
                    item.style.transition = '0.05s ease';
                    item.addEventListener('mouseenter', item._hoverEnter = () => {
                        item.style.color = "white";
                        item.style.background = 'linear-gradient(90deg, rgba(49, 130, 206, 1) 0%, rgba(56, 178, 172, 1) 100%)';
                    });
                    item.addEventListener('mouseleave', item._hoverLeave = () => {
                        item.style.color = "black";
                        item.style.background = '';
                    });
                    item.hasHoverListeners = true;
                }
            });
            // Quita eventos de #nav-link
            navLinks.forEach(link => {
                if (link.hasHoverListeners) {
                    link.removeEventListener('mouseenter', link._hoverEnter);
                    link.removeEventListener('mouseleave', link._hoverLeave);
                    link.style.color = "";
                    link.style.background = "";
                    link.hasHoverListeners = false;
                }
            });
        }
    }

    // Ejecuta al cargar y al cambiar el tamaño de la ventana
    updateHoverEvents();
    window.addEventListener('resize', updateHoverEvents);

    const allNav = [...navLinks, ...navItems];
    allNav.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

function hoverCita() {
    const resCita = document.querySelectorAll('#cita');
    resCita.forEach(cita => {
        cita.style.transition = '0.3s ease';

        cita.addEventListener('mouseenter', () => {
            cita.style.color = "black";
            cita.style.background = 'linear-gradient(90deg, rgba(49, 130, 206, 1) 0%, rgba(56, 178, 172, 1) 100%)';
            cita.style.borderColor = 'black';
        });

        cita.addEventListener('mouseleave', () => {
            cita.style.color = "white";
            cita.style.background = '';
            cita.style.borderColor = 'white';
        });
    });
}

function hoverCita2() {
    const resCita2 = document.querySelectorAll('#res-cita2');
    resCita2.forEach(cita => {
        cita.style.transition = '0.3s ease';

        cita.addEventListener('mouseenter', () => {
            cita.style.color = "black";
            cita.style.background = 'linear-gradient(90deg, rgba(49, 130, 206, 1) 0%, rgba(56, 178, 172, 1) 100%)';
            cita.style.borderColor = 'black';
            cita.style.borderWidth = '1px';
        });

        cita.addEventListener('mouseleave', () => {
            cita.style.color = "white";
            cita.style.background = '';
            cita.style.borderColor = 'transparent';
            cita.style.borderWidth = '1px';
        });
    });
}

function hoverCita3() {
    const resCita2 = document.querySelectorAll('#res-cita3');
    resCita2.forEach(cita => {
        cita.style.transition = '0.3s ease';

        cita.addEventListener('mouseenter', () => {
            cita.style.color = "black";
            cita.style.background = 'linear-gradient(90deg, rgba(49, 130, 206, 1) 0%, rgba(56, 178, 172, 1) 100%)';
            cita.style.borderColor = 'black';
            cita.style.borderWidth = '1px';
        });

        cita.addEventListener('mouseleave', () => {
            cita.style.color = "";
            cita.style.background = '';
            cita.style.borderColor = 'transparent';
            cita.style.borderWidth = '1px';
        });
    });
}

async function displayVotes() {
    const results = document.getElementById('results');
    if (!results) return;

    const votes = await getVotes();
    if (!votes) {
        results.innerHTML = "<p>No hay votos registrados.</p>";
        return;
    }

    // Contar votos por producto
    const voteCounts = {};
    Object.values(votes).forEach(vote => {
        if (vote.productID) {
            voteCounts[vote.productID] = (voteCounts[vote.productID] || 0) + 1;
        }
    });

    // Crear tabla
    let table = `<table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Total de votos</th>
            </tr>
        </thead>
        <tbody>`;
    for (const [product, count] of Object.entries(voteCounts)) {
        table += `<tr><td>${product}</td><td>${count}</td></tr>`;
    }
    table += `</tbody></table>`;

    results.innerHTML = table;
}

function enableForm() {
    const form = document.getElementById('form_voting');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const selectProduct = document.getElementById('select_product');
        if (!selectProduct) return;
        const productID = selectProduct.value;

        await saveVote(productID);

        form.reset();
        await displayVotes();
    });
}



(() => {
    document.addEventListener('DOMContentLoaded', () => {
        hoverNav();
        hoverCita();
        hoverCita2();
        hoverCita3();
        enableForm();
        displayVotes();
    });
})();