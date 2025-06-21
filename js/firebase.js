import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, push, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCMovWU_E9pkyvZtwpKenoOsEljGr6sxeM",
    authDomain: "prueba-94d59.firebaseapp.com",
    databaseURL: "https://prueba-94d59-default-rtdb.firebaseio.com",
    projectId: "prueba-94d59",
    storageBucket: "prueba-94d59.firebasestorage.app",
    messagingSenderId: "784675813944",
    appId: "1:784675813944:web:e8b15d32078dea37f784cd",
    measurementId: "G-S70S4C3G1K"
};
// Inicializa la app
const app = initializeApp(firebaseConfig);

// Obtén la base de datos
const db = getDatabase(app);

//post y get
let userId = localStorage.getItem('userId');
if (!userId) {
  userId = crypto.randomUUID(); // genera ID único
  localStorage.setItem('userId', userId);
}


const form = document.getElementById('myForm');
const resultadosDiv = document.getElementById('resultados');

form.addEventListener('submit', e => {
  e.preventDefault();

  const nombre = form.nombre.value.trim();
  const correo = form.correo.value.trim();
  const telefono = form.telefono.value.trim();
  const comentario = form.comentario.value.trim();

  if (!nombre || !correo || !telefono || !comentario) {
    alert("Por favor completa todos los campos.");
    return;
  }

  const comentariosRef = ref(db, 'comentarios');
  const nuevoComentarioRef = push(comentariosRef);

  set(nuevoComentarioRef, {
    userId,
    nombre,
    correo,
    telefono,
    comentario,
    fecha: new Date().toISOString()
  })
    .then(() => {
      alert("Comentario enviado correctamente!");
      form.reset();
      mostrarComentarios();
    })
    .catch(error => {
      console.error("Error al enviar comentario:", error);
    });
});

function mostrarComentarios() {
  const comentariosRef = ref(db, 'comentarios');

  get(comentariosRef)
    .then(snapshot => {
      if (snapshot.exists()) {
        const comentarios = snapshot.val();
        resultadosDiv.innerHTML = '';

        // Mostrar solo los comentarios de este usuario
        Object.entries(comentarios).forEach(([key, c]) => {
          if (c.userId !== userId) return; // Filtra por usuario

          const div = document.createElement('div');
          div.style.border = "1px solid #ccc";
          div.style.padding = "10px";
          div.style.marginBottom = "10px";
          div.style.backgroundColor = "#f7faff";
          div.style.borderRadius = "6px";

          div.innerHTML = `
            <strong>Nombre:</strong> ${c.nombre} <br/>
            <strong>Correo:</strong> ${c.correo} <br/>
            <strong>Teléfono:</strong> ${c.telefono} <br/>
            <strong>Comentario:</strong> ${c.comentario} <br/>
            <small><em>Enviado el: ${new Date(c.fecha).toLocaleString()}</em></small>
          `;
          resultadosDiv.appendChild(div);
        });

        // Si no hay comentarios del usuario
        if (resultadosDiv.innerHTML === '') {
          resultadosDiv.textContent = "Aún no has enviado ningún comentario.";
        }

      } else {
        resultadosDiv.textContent = "Aún no has enviado ningún comentario.";
      }
    })
    .catch(error => {
      console.error("Error al cargar comentarios:", error);
      resultadosDiv.textContent = "Error al cargar tus comentarios.";
    });
}

window.addEventListener('DOMContentLoaded', mostrarComentarios);