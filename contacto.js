// contacto.js
document.addEventListener("DOMContentLoaded", () => {
  const nombreInput = document.getElementById("nombre");
  const emailInput = document.getElementById("email");
  const mensajeInput = document.getElementById("mensaje");

  // Leer el usuario desde localStorage
  const storedData = localStorage.getItem("usuario");
  if (storedData) {
    try {
      const userData = JSON.parse(storedData);

      // Detecta formato según backend
      const user = userData.usuario || userData; 

      // Autocompletar nombre y correo (si existe)
      if (nombreInput && user.nombre) nombreInput.value = user.nombre;
      if (emailInput && user.email) emailInput.value = user.email;

      // ⚠️ Asegurarnos de no meter nada en el textarea por error
      if (mensajeInput) mensajeInput.value = "";
    } catch (err) {
      console.error("Error al parsear usuario:", err);
    }
  }
});
