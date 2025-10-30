document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('productos-grid');
    const buscador = document.getElementById('buscador');
    const ordenSelect = document.getElementById('orden');
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    const paginaBtns = document.querySelectorAll('.pagina-btn');

    let productos = [];
    let currentCategoria = 'todos';
    let currentTerm = '';
    let currentOrden = 'default';
    let currentPage = 1;
    const productosPorPagina = 4;

    // --- CARGAR PRODUCTOS DESDE BACKEND ---
    async function cargarProductos() {
        try {
            const response = await fetch('/api/productos');
            productos = await response.json();
            renderizarProductos();
        } catch (err) {
            console.error("Error cargando productos:", err);
            grid.innerHTML = "<p>Error al cargar productos.</p>";
        }
    }

    // --- FILTROS ---
    filtroBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filtroBtns.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            currentCategoria = btn.textContent.toLowerCase();
            currentPage = 1;
            renderizarProductos();
        });
    });

    // --- BÚSQUEDA ---
    if (buscador) {
        buscador.addEventListener('input', e => {
            currentTerm = e.target.value.trim().toLowerCase();
            currentPage = 1;
            renderizarProductos();
        });
    }

    // --- ORDEN ---
    if (ordenSelect) {
        ordenSelect.addEventListener('change', e => {
            currentOrden = e.target.value;
            renderizarProductos();
        });
    }

    // --- FUNCIÓN DE RENDERIZADO ---
    function renderizarProductos() {
        let filtrados = productos.filter(p => {
            let visible = true;

            // Filtro categoría
            if (currentCategoria !== 'todos') {
                visible = (p.categoria || '').toLowerCase() === currentCategoria;
            }

            // Filtro búsqueda
            if (visible && currentTerm) {
                visible = p.nombre.toLowerCase().includes(currentTerm);
            }

            return visible;
        });

        // Ordenamiento
        if (currentOrden === 'precio-asc')
            filtrados.sort((a, b) => a.precio_unitario_ars - b.precio_unitario_ars);
        else if (currentOrden === 'precio-desc')
            filtrados.sort((a, b) => b.precio_unitario_ars - a.precio_unitario_ars);

        // Paginación
        const totalPaginas = Math.ceil(filtrados.length / productosPorPagina);
        const inicio = (currentPage - 1) * productosPorPagina;
        const fin = inicio + productosPorPagina;
        const visibles = filtrados.slice(inicio, fin);

        // Render HTML
        grid.innerHTML = visibles.map(p => `
            <div class="producto">
                <img src="imagenes/productos/${p.id_producto}.jpg" alt="${p.nombre}" loading="lazy">
                <h3>${p.nombre}</h3>
                <span class="precio">$${p.precio_unitario_ars.toFixed(2)}</span>
                <button class="btn-agregar"><i class="fas fa-shopping-cart"></i> Agregar al carrito</button>
            </div>
        `).join('');

        // Actualizar paginación visual
        paginaBtns.forEach((btn, index) => {
            btn.classList.toggle('activo', index + 1 === currentPage);
            btn.style.display = index + 1 <= totalPaginas ? 'inline-block' : 'none';
        });
    }

    // --- EVENTOS PAGINACIÓN ---
    paginaBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('siguiente')) {
                currentPage++;
            } else {
                currentPage = index + 1;
            }
            renderizarProductos();
        });
    });

    // --- INICIO ---
    await cargarProductos();
});
