"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

/**
 * Guarda un voto en la base de datos en la colección "votes"
 * @param {string} productID - ID del producto votado
 * @returns {Promise<{success: boolean, message: string}>}
 */
export function saveVote(productID) {
    const votesRef = ref(db, 'votes');
    const newVoteRef = push(votesRef);
    const voteData = {
        productID: productID,
        date: new Date().toISOString()
    };

    return set(newVoteRef, voteData)
        .then(() => ({
            success: true,
            message: "Voto guardado correctamente"
        }))
        .catch((error) => ({
            success: false,
            message: "Error al guardar el voto: " + error.message
        }));
}

/**
 * Obtiene todos los votos de la colección "votes"
 * @returns {Promise<any>} - Promesa con los datos de los votos o null si no existen
 */
export function getVotes() {
    const dbRef = ref(db);
    return get(child(dbRef, 'votes'))
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                return null;
            }
        })
        .catch((error) => {
            throw new Error("Error al obtener los votos: " + error.message);
        });
}

// Inicializa la app
const app = initializeApp(firebaseConfig);

// Obtén la base de datos
const db = getDatabase(app);

// Ejemplo: referencia y creación de datos
const usersRef = ref(db, 'users');
const newUserRef = push(usersRef);
set(newUserRef, {
    nombre: "Ejemplo",
    email: "ejemplo@email.com"
});