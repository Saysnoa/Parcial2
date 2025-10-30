document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const mensaje = document.getElementById("mensaje");
  const navLogin = document.getElementById("nav-login");

  // Verificar si ya hay usuario logueado
  const usuarioGuardado = localStorage.getItem("usuario");
  const rolGuardado = localStorage.getItem("rol");

  if (usuarioGuardado) {
    mensaje.textContent = `✅ Ya estás logueado como ${usuarioGuardado}.`;
    mensaje.style.color = "green";

    // Actualizar botón de navegación
    if (navLogin) {
      navLogin.textContent = "Cerrar sesión";
      navLogin.href = "#";
      navLogin.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.clear();
        alert("Sesión cerrada correctamente");
        window.location.href = "index.html";
      });
    }

    // Desactivar el formulario si ya está logueado
    if (form) form.querySelector("button").disabled = true;
    return; // Evita ejecutar el resto
  }

  // Evento de login
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    // Usuario admin
    if (usuario === "admin" && password === "1234") {
      localStorage.setItem("usuario", "Administrador");
      localStorage.setItem("rol", "admin");
      mensaje.textContent = "✅ Inicio de sesión exitoso como administrador.";
      mensaje.style.color = "green";
      setTimeout(() => window.location.href = "index.html", 1000);

    // Usuario cliente
    } else if (usuario === "cliente" && password === "abcd") {
      localStorage.setItem("usuario", "Cliente");
      localStorage.setItem("rol", "cliente");
      mensaje.textContent = "✅ Bienvenido al sistema.";
      mensaje.style.color = "green";
      setTimeout(() => window.location.href = "index.html", 1000);

    // Credenciales inválidas
    } else {
      mensaje.textContent = "❌ Usuario o contraseña incorrectos.";
      mensaje.style.color = "red";
    }
  });
});
