document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".navbar-menu");
  const loginBtn = document.getElementById("nav-login");
  const crearUsuarioLink = document.querySelector('a[href="register.html"]'); // detecta el enlace "Crear usuario"

  if (!menu || !loginBtn) return;

  // Leer usuario desde localStorage
  const storedData = localStorage.getItem("usuario");
  let usuario = null;

  try {
    usuario = storedData ? JSON.parse(storedData) : null;
  } catch (err) {
    console.error("Error al parsear usuario:", err);
  }

  if (usuario) {
    // Extraer nombre y rol, adaptando al formato guardado
    const nombre = usuario.nombre || (usuario.usuario && usuario.usuario.nombre) || "Usuario";
    const rol = usuario.rol || (usuario.usuario && usuario.usuario.rol) || "cliente";

    // Mostrar el nombre en el header
    loginBtn.innerHTML = `<i class="fas fa-user" style="color:#b085f5;margin-right:6px;"></i>${nombre}`;
    loginBtn.href = "#";
    loginBtn.style.fontWeight = "600";

    // Ocultar “Crear usuario”
    if (crearUsuarioLink) {
      crearUsuarioLink.style.display = "none";
    }

    // Agregar botón de cerrar sesión
    const logoutItem = document.createElement("li");
    const logoutLink = document.createElement("a");
    logoutLink.textContent = "Cerrar sesión";
    logoutLink.href = "#";
    logoutLink.style.color = "#fff";
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("¿Querés cerrar sesión?")) {
        localStorage.removeItem("usuario");
        window.location.href = "index.html";
      }
    });
    logoutItem.appendChild(logoutLink);
    menu.appendChild(logoutItem);

    // Si el rol es admin → mostrar botón de administración
    if (rol === "admin") {
      const adminItem = document.createElement("li");
      const adminLink = document.createElement("a");
      adminLink.href = "stock.html";
      adminLink.innerHTML = '<i class="fas fa-user-tie" style="margin-right:6px;color:#b085f5"></i>Administrador';
      adminLink.style.color = "#fff";
      adminItem.appendChild(adminLink);
      menu.insertBefore(adminItem, loginBtn.parentElement);
    }

  } else {
    // Usuario no logueado
    loginBtn.textContent = "Iniciar Sesión";
    loginBtn.href = "login.html";

    // Mostrar "Crear usuario" por si estaba oculto
    if (crearUsuarioLink) {
      crearUsuarioLink.style.display = "inline";
    }
  }
});
