/**
 * ============================================================
 *  HAKUNA MATATA — Sistema POS · app.js
 *  Módulos: Navegación · Sesión · Inventario · Pedidos · Mesas
 * ============================================================
 */
 
/* ============================================================
   1. ESTADO GLOBAL (fuente de verdad compartida entre páginas)
   ============================================================ */
const HakunaApp = (() => {
 
  // ── Inventario con umbrales ──────────────────────────────
  const inventarioInicial = [
    { id: 1,  nombre: "Lomo de Kudu Fresco",   cantidad: 3.2,  unidad: "kg",    maximo: 30,  critico: 5,   bajo: 10  },
    { id: 2,  nombre: "Salsa Peri-Peri",        cantidad: 14,   unidad: "L",     maximo: 40,  critico: 8,   bajo: 15  },
    { id: 3,  nombre: "Papas Dulces",            cantidad: 124,  unidad: "kg",    maximo: 150, critico: 10,  bajo: 30  },
    { id: 4,  nombre: "Ron Oscuro",              cantidad: 2,    unidad: "botellas", maximo: 24, critico: 2, bajo: 5  },
    { id: 5,  nombre: "Campari",                 cantidad: 0,    unidad: "botellas", maximo: 12, critico: 1, bajo: 3  },
    { id: 6,  nombre: "Jugo de Piña",            cantidad: 6,    unidad: "L",     maximo: 20,  critico: 2,   bajo: 5  },
    { id: 7,  nombre: "Tequila Blanco",          cantidad: 8,    unidad: "botellas", maximo: 24, critico: 2, bajo: 5  },
    { id: 8,  nombre: "Bourbon",                 cantidad: 3,    unidad: "botellas", maximo: 12, critico: 1, bajo: 3  },
    { id: 9,  nombre: "Ensalada Chakalaka Mix",  cantidad: 0,    unidad: "kg",    maximo: 10,  critico: 1,   bajo: 3  },
    { id: 10, nombre: "Limones",                 cantidad: 45,   unidad: "unidades", maximo: 200, critico: 20, bajo: 50 },
  ];
 
  // ── Menú del restaurante ─────────────────────────────────
  const menuInicial = [
    // Bebidas
    { id: "B1", nombre: "Margarita",         categoria: "Bebidas",  precio: 14500, inventarioId: 7,  imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfmIIjQv0_n0hlBQpfeJb5pdl7c3osIterrjxd0ggFha8Bz13DMdgZJdtxRGusdBCrPdZDSWwOi9FeXBUsgftnpdYSs-mv6ZO30T3NqpOuYQR2F25_cjaYFo5jG3iMBckxmDwqYVc5fh2Y94DVDvaUwcys-oP9Rbx9EgzoeEMP-_lYIVHRaCnoanh09y64rbVRxekBgHSYCC2nnWHvhoBlDq-QK0JtF3_kIntQ_0SYpQgsyXQpbhQQtoUE7of-qt-2kKcsRPnNib8" },
    { id: "B2", nombre: "Bourbon Ahumado",   categoria: "Bebidas",  precio: 16000, inventarioId: 8,  imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLIQGOPK8S935abb6NXuCXwKkJlaLF6UhG7X6QXPa_ROHrYeNIxVc11GUfe3R69ICJN2z--I6exvn37Y6f8YihaEm7ESrALDhyDcKQ7i-4qAKi7q78aU6Yicc6oEOJUKPWFK36oI09I4ZdE28uve4KU_cQFh3w3ZrVWw59UyE3CJrnxPJzmVUpbNpPKCyqR_KxejWzx_dViK1D8ZL6IgAL6nuqo4sQHF8XREgCF_bIw03Dwbfzd6SHFYIP3ShRcB4" },
    { id: "B3", nombre: "Jungle Bird",       categoria: "Bebidas",  precio: 15000, inventarioId: 4,  imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuBV9K5X7nJtXZtNqy-23hqHHfnyKKz4exs8Nulbh0E0MJ6ib82kxIqrupK1d3UMBKmwCYPhqj9O4uCTMMS0DMZFr6NeHigsn317ogk0DJfgu9GMr4MqXLn1E7h7IpOqrwqFBOMcpZxpkVQcG8ERKuJeUKZU7PQebml1AQt2YpN1hJC2YiIM9bWDWBYxPbFJlukMEdOJ-jl0QKHmqK-72QqtztUd3LwSQ8L4zMdJvRiZC0cg2SStakNtj9PtgD0gws8fAQPv957rojU" },
    // Comidas
    { id: "C1", nombre: "Asado de Kudu",     categoria: "Comidas",  precio: 48000, inventarioId: 1,  imagen: "img/asado de kudo.jpg" },
    { id: "C2", nombre: "Ensalada Chakalaka",categoria: "Comidas",  precio: 22000, inventarioId: 9,  imagen: "img/ensalada chamalaka.jpg" },
    // Postres
    { id: "P1", nombre: "Pastel de Baobab",  categoria: "Postres", precio: 14000, inventarioId: 10, imagen: "img/pasteldebaobab.jpg" },
    { id: "P2", nombre: "Helado de Cacao",    categoria: "Postres", precio: 12000, inventarioId: 10, imagen: "img/heladodecacao.jpg" },
  ];
 
  // ── Mesas ────────────────────────────────────────────────
  const mesasInicial = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    numero: i + 1,
    estado: ["libre", "ocupada", "reservada", "libre"][i % 4],
    capacidad: [2, 4, 4, 6][i % 4],
    pedidoActivo: null,
  }));
 
  // ── Pedidos ──────────────────────────────────────────────
  const pedidosActivos = [];
 
  // ── Sesión ───────────────────────────────────────────────
  const usuarios = [
    { id: 1, usuario: "admin",    clave: "admin123",  rol: "Administrador", nombre: "Ricardo Hernandez" },
    { id: 2, usuario: "mesero1",  clave: "mesero123", rol: "Mesero",        nombre: "Laura Mendez" },
    { id: 3, usuario: "cocina1",  clave: "cocina123", rol: "Cocina",        nombre: "José Torres" },
    { id: 4, usuario: "yan cifuentes", clave: "12345", rol: "Mesero", nombre: "Yan Cifuentes" },
  ];

  // ── Persistencia en localStorage ────────────────────────
  function cargar(clave, porDefecto) {
    try {
      const raw = localStorage.getItem("hm_" + clave);
      return raw ? JSON.parse(raw) : porDefecto;
    } catch { return porDefecto; }
  }
  function guardar(clave, valor) {
    try { localStorage.setItem("hm_" + clave, JSON.stringify(valor)); } catch {}
  }
 
  // Estado reactivo cargado desde localStorage (o inicial)
  const state = {
    inventario: cargar("inventario", inventarioInicial),
    menu:       menuInicial,
    mesas:      cargar("mesas",      mesasInicial),
    pedidos:    cargar("pedidos",    pedidosActivos),
    sesion:     cargar("sesion",     null),
    pedidoTemp: { mesaId: null, items: [] },
  };
 
  function persistir() {
    guardar("inventario", state.inventario);
    guardar("mesas",      state.mesas);
    guardar("pedidos",    state.pedidos);
    guardar("sesion",     state.sesion);
  }
 
  return { state, persistir, usuarios };
})();
 
 
/* ============================================================
   2. UTILIDADES
   ============================================================ */
const Utils = {
  formatPrecio: (n) => `$${Number(n).toLocaleString("es-CO")}`,
 
  // Estado de stock según umbrales
  estadoStock(item) {
    const pct = item.cantidad / item.maximo;
    if (item.cantidad <= 0)      return { label: "AGOTADO",  clase: "agotado",  color: "#ffb4ab", pct: 0 };
    if (item.cantidad <= item.critico) return { label: "CRÍTICO",  clase: "critico",  color: "#ffb4ab", pct };
    if (item.cantidad <= item.bajo)    return { label: "BAJO",     clase: "bajo",     color: "#fabd00", pct };
    return                              { label: "SALUDABLE", clase: "saludable", color: "#78dc77", pct };
  },
 
  porcentajeStock(item) {
    return Math.min(100, Math.round((item.cantidad / item.maximo) * 100));
  },
 
  // Obtener el producto de inventario vinculado a un item del menú
  getInventarioDeMenu(menuItem) {
    if (!menuItem.inventarioId) return null;
    return HakunaApp.state.inventario.find(i => i.id === menuItem.inventarioId) || null;
  },
 
  mostrarToast(mensaje, tipo = "info") {
    const colores = { info: "#ffb77a", exito: "#78dc77", error: "#ffb4ab", advertencia: "#fabd00" };
    const t = document.createElement("div");
    t.className = "hm-toast";
    t.style.cssText = `
      position:fixed; bottom:120px; left:50%; transform:translateX(-50%) translateY(20px);
      background:#201f1f; color:#e5e2e1; border-left:4px solid ${colores[tipo]};
      padding:14px 24px; border-radius:12px; font-family:'Inter',sans-serif; font-size:14px;
      font-weight:600; z-index:9999; box-shadow:0 8px 32px rgba(0,0,0,0.5);
      transition:all 0.3s ease; opacity:0; max-width:90vw; text-align:center;
    `;
    t.textContent = mensaje;
    document.body.appendChild(t);
    requestAnimationFrame(() => {
      t.style.opacity = "1";
      t.style.transform = "translateX(-50%) translateY(0)";
    });
    setTimeout(() => {
      t.style.opacity = "0";
      t.style.transform = "translateX(-50%) translateY(20px)";
      setTimeout(() => t.remove(), 300);
    }, 3500);
  },
};
 
 
/* ============================================================
   3. MÓDULO DE SESIÓN
   ============================================================ */
const Sesion = {
  // Iniciar sesión desde el formulario de login
  init() {
    const form = document.querySelector("form");
    if (!form) return;
 
    // Mostrar/ocultar contraseña
    const btnVer = document.querySelector('[data-icon="visibility"]')?.closest("div.absolute");
    const inputPass = document.getElementById("password");
    if (btnVer && inputPass) {
      btnVer.addEventListener("click", () => {
        const oculta = inputPass.type === "password";
        inputPass.type = oculta ? "text" : "password";
        const icon = btnVer.querySelector(".material-symbols-outlined");
        if (icon) icon.textContent = oculta ? "visibility_off" : "visibility";
      });
    }
 
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const usuario = document.getElementById("username")?.value.trim();
      const clave   = document.getElementById("password")?.value.trim();
 
      const encontrado = HakunaApp.usuarios.find(
        u => (u.usuario === usuario || u.nombre.toLowerCase() === usuario.toLowerCase()) && u.clave === clave
      );
 
      if (encontrado) {
        HakunaApp.state.sesion = { ...encontrado, ingreso: new Date().toISOString() };
        HakunaApp.persistir();
        Utils.mostrarToast(`¡Bienvenido, ${encontrado.nombre}!`, "exito");
        setTimeout(() => { window.location.href = "index.html"; }, 1000);
      } else {
        Utils.mostrarToast("Usuario o contraseña incorrectos.", "error");
        const btn = form.querySelector("button[type=submit]");
        if (btn) { btn.classList.add("shake"); setTimeout(() => btn.classList.remove("shake"), 500); }
      }
    });
  },
 
  // Proteger páginas que requieren sesión
  verificar() {
    const publica = window.location.pathname.includes("login");
    if (publica) return;
    if (!HakunaApp.state.sesion) {
      window.location.href = "login.html";
    }
  },
 
  cerrar() {
    HakunaApp.state.sesion = null;
    HakunaApp.persistir();
    window.location.href = "login.html";
  },
};
 
 
/* ============================================================
   4. MÓDULO DE INVENTARIO Y ALERTAS DE EXISTENCIAS
   ============================================================ */
const Inventario = {
 
  // Verificar si un producto del menú está disponible para pedirse
  estaDisponible(menuItem) {
    const inv = Utils.getInventarioDeMenu(menuItem);
    if (!inv) return true; // Sin control de inventario → disponible
    return inv.cantidad > 0;
  },
 
  // Verificar por nombre (útil desde otras páginas)
  verificarPorNombre(nombre) {
    const item = HakunaApp.state.inventario.find(
      i => i.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    if (!item) return { encontrado: false };
    const estado = Utils.estadoStock(item);
    return { encontrado: true, item, estado };
  },
 
  // Descontar inventario cuando se confirma un pedido
  descontarPedido(items) {
    items.forEach(({ menuId, cantidad }) => {
      const menuItem = HakunaApp.state.menu.find(m => m.id === menuId);
      if (!menuItem?.inventarioId) return;
      const inv = HakunaApp.state.inventario.find(i => i.id === menuItem.inventarioId);
      if (inv) {
        inv.cantidad = Math.max(0, inv.cantidad - cantidad);
      }
    });
    HakunaApp.persistir();
    this.verificarAlertas();
  },
 
  // Detectar productos agotados o críticos y mostrar alertas
  verificarAlertas() {
    const alertas = HakunaApp.state.inventario.filter(i => {
      const e = Utils.estadoStock(i);
      return e.clase === "agotado" || e.clase === "critico";
    });
 
    alertas.forEach(item => {
      const e = Utils.estadoStock(item);
      if (e.clase === "agotado") {
        Utils.mostrarToast(`🚫 AGOTADO: ${item.nombre}`, "error");
      } else if (e.clase === "critico") {
        Utils.mostrarToast(`⚠️ STOCK CRÍTICO: ${item.nombre} (${item.cantidad} ${item.unidad})`, "advertencia");
      }
    });
 
    return alertas;
  },
 
  // Renderizar el widget de alertas de inventario en index.html
  renderizarWidgetInventario() {
    const contenedor = document.querySelector(".space-y-6"); // sidebar de alertas
    if (!contenedor) return;
 
    // Buscar el primer elemento del sidebar de alertas
    const primerItem = contenedor.querySelector(".relative");
    if (!primerItem) return;
 
    // Limpiar y re-renderizar los 5 ítems más críticos
    const items = [...HakunaApp.state.inventario].sort((a, b) => {
      const pA = Utils.porcentajeStock(a);
      const pB = Utils.porcentajeStock(b);
      return pA - pB;
    }).slice(0, 5);
 
    contenedor.innerHTML = items.map(item => {
      const estado = Utils.estadoStock(item);
      const pct = Utils.porcentajeStock(item);
      const badgeBg = {
        agotado:   "bg-error-container/30 text-error",
        critico:   "bg-error-container/20 text-error",
        bajo:      "bg-tertiary-container/10 text-tertiary",
        saludable: "bg-secondary-container/10 text-secondary",
      }[estado.clase];
 
      return `
        <div class="relative" data-inv-id="${item.id}">
          <div class="flex justify-between items-center mb-2">
            <span class="font-headline text-sm font-bold text-on-surface">${item.nombre}</span>
            <span class="text-[10px] font-label font-bold uppercase tracking-widest px-2 py-0.5 rounded ${badgeBg}">
              ${estado.label}
            </span>
          </div>
          <div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700"
                 style="width:${pct}%; background:${estado.color}"></div>
          </div>
          <div class="flex justify-between items-center mt-1">
            <span class="text-[10px] font-label text-on-surface-variant uppercase">
              ${item.cantidad} ${item.unidad} restante${item.cantidad !== 1 ? 's' : ''}
            </span>
            <span class="text-[10px] font-label font-bold" style="color:${estado.color}">
              ${estado.clase === 'agotado' ? '🚫 Sin stock' :
                estado.clase === 'critico' ? 'Reabastecer Ahora' :
                estado.clase === 'bajo'    ? 'Verificar Proveedor' : ''}
            </span>
          </div>
        </div>
      `;
    }).join('<div class="border-t border-outline-variant/10 my-2"></div>');
  },
 
  // Panel modal completo de inventario
  abrirPanelInventario() {
    if (document.getElementById("hm-modal-inventario")) return;
 
    const modal = document.createElement("div");
    modal.id = "hm-modal-inventario";
    modal.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:10000;
      display:flex; align-items:center; justify-content:center; padding:16px;
      backdrop-filter:blur(4px); animation:hmFadeIn 0.2s ease;
    `;
 
    const items = HakunaApp.state.inventario;
 
    modal.innerHTML = `
      <div style="background:#201f1f; border-radius:20px; width:100%; max-width:700px;
                  max-height:85vh; overflow-y:auto; padding:32px; box-shadow:0 24px 64px rgba(0,0,0,0.6);
                  border:1px solid rgba(86,67,52,0.3); font-family:'Inter',sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
          <div>
            <h2 style="font-family:'Plus Jakarta Sans',sans-serif; font-weight:800; font-size:22px;
                       color:#e5e2e1; margin:0 0 4px;">Inventario Completo</h2>
            <p style="font-size:12px; color:#a48c7a; margin:0; text-transform:uppercase;
                      letter-spacing:0.15em;">Control de Existencias · Hakuna Matata</p>
          </div>
          <button id="hm-cerrar-inv" style="background:#2a2a2a; border:none; color:#ddc1ae;
                  width:36px; height:36px; border-radius:50%; cursor:pointer; font-size:18px;
                  display:flex; align-items:center; justify-content:center;">✕</button>
        </div>
 
        <!-- Buscador de existencias -->
        <div style="position:relative; margin-bottom:20px;">
          <input id="hm-buscar-inv" placeholder="Buscar producto para verificar existencias..."
            style="width:100%; padding:12px 16px 12px 44px; background:#131313; border:1px solid #564334;
                   border-radius:12px; color:#e5e2e1; font-size:14px; font-family:'Inter',sans-serif;
                   box-sizing:border-box; outline:none;">
          <span style="position:absolute; left:14px; top:50%; transform:translateY(-50%);
                       font-family:'Material Symbols Outlined'; font-size:20px; color:#a48c7a;">search</span>
          <div id="hm-resultado-busqueda" style="margin-top:8px; min-height:28px;"></div>
        </div>
 
        <!-- Tabla de inventario -->
        <div style="display:grid; gap:10px;">
          ${items.map(item => {
            const estado = Utils.estadoStock(item);
            const pct = Utils.porcentajeStock(item);
            return `
              <div style="background:#131313; border-radius:12px; padding:16px;
                          border-left:3px solid ${estado.color}; display:flex;
                          align-items:center; gap:16px; flex-wrap:wrap;">
                <div style="flex:1; min-width:180px;">
                  <div style="font-weight:700; color:#e5e2e1; font-size:14px;
                              font-family:'Plus Jakarta Sans',sans-serif;">${item.nombre}</div>
                  <div style="font-size:12px; color:#a48c7a; margin-top:2px;">
                    ${item.cantidad} ${item.unidad} / ${item.maximo} ${item.unidad} máx
                  </div>
                </div>
                <div style="flex:1; min-width:120px;">
                  <div style="height:6px; background:#353534; border-radius:6px; overflow:hidden;">
                    <div style="height:100%; width:${pct}%; background:${estado.color};
                                border-radius:6px; transition:width 0.5s ease;"></div>
                  </div>
                  <div style="font-size:11px; color:#a48c7a; margin-top:4px;">${pct}%</div>
                </div>
                <div>
                  <span style="padding:4px 10px; border-radius:20px; font-size:10px;
                               font-weight:700; text-transform:uppercase; letter-spacing:0.1em;
                               background:${estado.color}22; color:${estado.color};">
                    ${estado.label}
                  </span>
                </div>
                <button class="hm-btn-ajustar"
                        data-id="${item.id}"
                        style="background:#2a2a2a; border:1px solid #564334; color:#ffb77a;
                               padding:6px 14px; border-radius:8px; font-size:12px; font-weight:600;
                               cursor:pointer; font-family:'Inter',sans-serif; white-space:nowrap;">
                  Ajustar
                </button>
              </div>
            `;
          }).join("")}
        </div>
 
        <!-- Leyenda -->
        <div style="display:flex; gap:16px; margin-top:20px; flex-wrap:wrap;">
          ${[["#ffb4ab","AGOTADO"],["#ffb4ab","CRÍTICO"],["#fabd00","BAJO"],["#78dc77","SALUDABLE"]].map(
            ([c,l]) => `<div style="display:flex;align-items:center;gap:6px;">
              <div style="width:10px;height:10px;border-radius:50%;background:${c}"></div>
              <span style="font-size:10px;color:#a48c7a;font-weight:700;letter-spacing:0.1em;">${l}</span>
            </div>`
          ).join("")}
        </div>
      </div>
    `;
 
    document.body.appendChild(modal);
 
    // Cerrar modal
    document.getElementById("hm-cerrar-inv").onclick = () => modal.remove();
    modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
 
    // Buscador en tiempo real
    document.getElementById("hm-buscar-inv").addEventListener("input", function() {
      const q = this.value.trim();
      const res = document.getElementById("hm-resultado-busqueda");
      if (!q) { res.innerHTML = ""; return; }
      const r = Inventario.verificarPorNombre(q);
      if (!r.encontrado) {
        res.innerHTML = `<span style="color:#a48c7a;font-size:12px;">No se encontró "${q}" en el inventario.</span>`;
      } else {
        const e = r.estado;
        res.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;
                      background:${e.color}18;border-radius:8px;border:1px solid ${e.color}33;">
            <span style="font-size:20px;">${e.clase==="agotado"?"🚫":e.clase==="critico"?"⚠️":e.clase==="bajo"?"📦":"✅"}</span>
            <div>
              <div style="font-weight:700;color:#e5e2e1;font-size:14px;">${r.item.nombre}</div>
              <div style="font-size:12px;color:${e.color};font-weight:600;">
                ${e.label} — ${r.item.cantidad} ${r.item.unidad} disponibles
              </div>
            </div>
          </div>`;
      }
    });
 
    // Botones de ajuste
    modal.querySelectorAll(".hm-btn-ajustar").forEach(btn => {
      btn.onclick = () => {
        const id = parseInt(btn.dataset.id);
        Inventario.abrirAjusteStock(id, modal);
      };
    });
  },
 
  abrirAjusteStock(itemId, modalPadre) {
    const item = HakunaApp.state.inventario.find(i => i.id === itemId);
    if (!item) return;
 
    const dlg = document.createElement("div");
    dlg.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:10001;
      display:flex; align-items:center; justify-content:center; padding:16px;
    `;
    dlg.innerHTML = `
      <div style="background:#201f1f; border-radius:16px; padding:28px; width:100%;
                  max-width:360px; box-shadow:0 16px 48px rgba(0,0,0,0.6);
                  border:1px solid #564334; font-family:'Inter',sans-serif;">
        <h3 style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:18px;
                   color:#e5e2e1;margin:0 0 6px;">${item.nombre}</h3>
        <p style="font-size:12px;color:#a48c7a;margin:0 0 20px;">
          Stock actual: <strong style="color:#ffb77a">${item.cantidad} ${item.unidad}</strong>
        </p>
        <label style="font-size:11px;font-weight:700;color:#a48c7a;text-transform:uppercase;
                      letter-spacing:0.1em;display:block;margin-bottom:8px;">
          Nueva Cantidad (${item.unidad})
        </label>
        <input id="hm-nueva-cant" type="number" min="0" value="${item.cantidad}"
          style="width:100%;padding:12px;background:#131313;border:1px solid #564334;
                 border-radius:10px;color:#e5e2e1;font-size:16px;font-family:'Inter',sans-serif;
                 box-sizing:border-box;outline:none;margin-bottom:16px;">
        <div style="display:flex;gap:10px;">
          <button id="hm-cancelar-ajuste"
            style="flex:1;padding:12px;background:#2a2a2a;border:1px solid #564334;color:#ddc1ae;
                   border-radius:10px;cursor:pointer;font-weight:600;font-family:'Inter',sans-serif;">
            Cancelar
          </button>
          <button id="hm-confirmar-ajuste"
            style="flex:1;padding:12px;background:linear-gradient(135deg,#ffb77a,#fd8e00);
                   border:none;color:#131313;border-radius:10px;cursor:pointer;
                   font-weight:800;font-family:'Plus Jakarta Sans',sans-serif;">
            Guardar
          </button>
        </div>
      </div>`;
    document.body.appendChild(dlg);
 
    document.getElementById("hm-cancelar-ajuste").onclick = () => dlg.remove();
    document.getElementById("hm-confirmar-ajuste").onclick = () => {
      const nueva = parseFloat(document.getElementById("hm-nueva-cant").value);
      if (isNaN(nueva) || nueva < 0) {
        Utils.mostrarToast("Ingresa una cantidad válida.", "error"); return;
      }
      item.cantidad = nueva;
      HakunaApp.persistir();
      dlg.remove();
      if (modalPadre) { modalPadre.remove(); }
      Utils.mostrarToast(`✅ ${item.nombre}: stock actualizado a ${nueva} ${item.unidad}`, "exito");
      const e = Utils.estadoStock(item);
      if (e.clase === "agotado" || e.clase === "critico") {
        setTimeout(() => Utils.mostrarToast(`⚠️ Atención: ${item.nombre} está ${e.label}.`, "advertencia"), 800);
      }
      // Re-renderizar widget si estamos en index
      Inventario.renderizarWidgetInventario();
    };
    document.getElementById("hm-nueva-cant").focus();
  },
};
 
 
/* ============================================================
   5. MÓDULO DE PEDIDOS
   ============================================================ */
const Pedidos = {
  agregarItem(menuId, nombre, precio) {
    const menuItem = HakunaApp.state.menu.find(m => m.id === menuId);
    const disponible = menuItem ? Inventario.estaDisponible(menuItem) : true;
 
    if (!disponible) {
      const inv = Utils.getInventarioDeMenu(menuItem);
      Utils.mostrarToast(`🚫 ${nombre} está AGOTADO. No puede agregarse al pedido.`, "error");
      return false;
    }
 
    // Verificar stock bajo antes de agregar
    if (menuItem?.inventarioId) {
      const inv = Utils.getInventarioDeMenu(menuItem);
      if (inv) {
        const e = Utils.estadoStock(inv);
        if (e.clase === "critico") {
          Utils.mostrarToast(`⚠️ Stock crítico de ${inv.nombre} (${inv.cantidad} ${inv.unidad})`, "advertencia");
        }
      }
    }
 
    const temp = HakunaApp.state.pedidoTemp;
    const existe = temp.items.find(i => i.menuId === menuId);
    if (existe) {
      existe.cantidad++;
      existe.subtotal = existe.precio * existe.cantidad;
    } else {
      temp.items.push({ menuId, nombre, precio, cantidad: 1, subtotal: precio, nota: "" });
    }
 
    this.renderizarPedidoActual();
    Utils.mostrarToast(`${nombre} agregado al pedido`, "exito");
    return true;
  },
 
  eliminarItem(menuId) {
    const temp = HakunaApp.state.pedidoTemp;
    const idx = temp.items.findIndex(i => i.menuId === menuId);
    if (idx !== -1) temp.items.splice(idx, 1);
    this.renderizarPedidoActual();
  },
 
  cambiarCantidad(menuId, delta) {
    const temp = HakunaApp.state.pedidoTemp;
    const item = temp.items.find(i => i.menuId === menuId);
    if (!item) return;
    item.cantidad = Math.max(0, item.cantidad + delta);
    if (item.cantidad === 0) {
      this.eliminarItem(menuId);
    } else {
      item.subtotal = item.precio * item.cantidad;
      this.renderizarPedidoActual();
    }
  },
 
  calcularTotales() {
    const items = HakunaApp.state.pedidoTemp.items;
    const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
    const impuesto = subtotal * 0.08;
    const total    = subtotal + impuesto;
    return { subtotal, impuesto, total };
  },

  renderizarCatalogo(categoria = "Bebidas") {
    const contenedor = document.getElementById("hm-menu-grid");
    if (!contenedor) return;

    const elementos = HakunaApp.state.menu.filter(item => item.categoria === categoria);
    if (elementos.length === 0) {
      contenedor.innerHTML = `<div class="col-span-full text-center text-on-surface-variant">No hay elementos disponibles en ${categoria}.</div>`;
      return;
    }

    contenedor.innerHTML = elementos.map(item => {
      const disponible = Inventario.estaDisponible(item);
      const precio = Utils.formatPrecio(item.precio);
      const imagen = item.imagen || "https://via.placeholder.com/480x320?text=Sin+imagen";
      return `
        <div class="group bg-surface-container-high rounded-xl overflow-hidden shadow-xl hover:shadow-primary/10 transition-all">
          <div class="h-48 w-full overflow-hidden bg-surface-container-lowest">
            <img src="${imagen}" alt="${item.nombre}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
          </div>
          <div class="p-5 flex flex-col gap-3">
            <div class="flex justify-between items-start">
              <h3 class="font-headline text-lg font-bold text-on-surface leading-tight">${item.nombre}</h3>
              <span class="font-headline font-extrabold text-primary">${precio}</span>
            </div>
            <p class="text-on-surface-variant text-sm line-clamp-2">${item.categoria} delicioso para su mesa.</p>
            <button class="hm-btn-agregar w-full mt-2 py-3 ${disponible ? 'bg-surface-container rounded-lg border border-outline-variant/20 group-hover:bg-primary group-hover:text-on-primary text-on-surface' : 'bg-error-container text-on-error cursor-not-allowed'} font-bold flex items-center justify-center gap-2 transition-all" data-menu-id="${item.id}" ${!disponible ? 'disabled' : ''}>
              <span class="material-symbols-outlined text-sm" data-icon="add">add</span>
              ${disponible ? 'AGREGAR AL PEDIDO' : 'AGOTADO'}
            </button>
          </div>
        </div>
      `;
    }).join("");

    contenedor.querySelectorAll(".hm-btn-agregar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const menuId = btn.dataset.menuId;
        const menuItem = HakunaApp.state.menu.find(m => m.id === menuId);
        if (!menuItem) return;
        Pedidos.agregarItem(menuItem.id, menuItem.nombre, menuItem.precio);
        btn.classList.add("scale-95");
        setTimeout(() => btn.classList.remove("scale-95"), 150);
      });
    });
  },

  renderizarPedidoActual() {
    // Actualiza contadores de badge en navbar si existen
    const badge = document.getElementById("hm-pedido-badge");
    const total = HakunaApp.state.pedidoTemp.items.reduce((s, i) => s + i.cantidad, 0);
    if (badge) badge.textContent = total;
 
    // Actualizar lista de items en toma_pedidos
    const contenedorItems = document.getElementById("hm-pedido-items");
    if (contenedorItems) {
      const items = HakunaApp.state.pedidoTemp.items;
      if (!items.length) {
        contenedorItems.innerHTML = `
          <div class="text-center text-on-surface-variant text-sm">No hay items en el pedido.</div>
        `;
      } else {
        contenedorItems.innerHTML = items.map(item => {
          const menuItem = HakunaApp.state.menu.find(m => m.id === item.menuId) || {};
          const imagen = menuItem.imagen || "https://via.placeholder.com/80";
          return `
            <div class="flex items-center gap-4 group bg-surface-container-low rounded-xl p-3">
              <div class="w-12 h-12 rounded-lg bg-surface-container-lowest overflow-hidden flex-shrink-0">
                <img class="w-full h-full object-cover" src="${imagen}" alt="${item.nombre}" />
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <p class="font-bold text-sm text-on-surface">${item.nombre}</p>
                  <p class="font-headline font-bold text-sm text-primary">${Utils.formatPrecio(item.subtotal)}</p>
                </div>
                <div class="flex items-center gap-3 mt-1">
                  <button class="btn-cantidad w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-transform" data-menu-id="${item.menuId}" data-delta="-1">
                    <span class="material-symbols-outlined text-xs">remove</span>
                  </button>
                  <span class="text-sm font-bold w-5 text-center">${item.cantidad}</span>
                  <button class="btn-cantidad w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary active:scale-95 transition-transform" data-menu-id="${item.menuId}" data-delta="1">
                    <span class="material-symbols-outlined text-xs">add</span>
                  </button>
                  <button class="btn-eliminar ml-auto text-xs text-error hover:text-error-container">Eliminar</button>
                </div>
              </div>
            </div>
          `;
        }).join("");

        // Asociar eventos +/- y eliminar
        contenedorItems.querySelectorAll(".btn-cantidad").forEach(btn => {
          btn.addEventListener("click", () => {
            const menuId = parseInt(btn.dataset.menuId, 10);
            const delta = parseInt(btn.dataset.delta, 10);
            Pedidos.cambiarCantidad(menuId, delta);
          });
        });
        contenedorItems.querySelectorAll(".btn-eliminar").forEach((btn, idx) => {
          btn.addEventListener("click", () => {
            const item = items[idx];
            if (item) Pedidos.eliminarItem(item.menuId);
          });
        });
      }
    }
 
    // Totales en facturación / toma_pedidos
    const totales = this.calcularTotales();
    const elSubtotal = document.querySelector("[data-total='subtotal']");
    const elImp      = document.querySelector("[data-total='impuesto']");
    const elTotal    = document.querySelector("[data-total='total']");
    if (elSubtotal) elSubtotal.textContent = Utils.formatPrecio(totales.subtotal);
    if (elImp)      elImp.textContent      = Utils.formatPrecio(totales.impuesto);
    if (elTotal)    elTotal.textContent    = Utils.formatPrecio(totales.total);
  },
 
  confirmarPedido(mesaId) {
    const temp = HakunaApp.state.pedidoTemp;
    if (!temp.items.length) {
      Utils.mostrarToast("No hay items en el pedido.", "advertencia"); return;
    }
 
    // Descontar inventario
    Inventario.descontarPedido(temp.items);
 
    const pedido = {
      id: Date.now(),
      mesaId: mesaId || temp.mesaId || "S/N",
      items: [...temp.items],
      ...this.calcularTotales(),
      hora: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      estado: "en_cocina",
    };
 
    HakunaApp.state.pedidos.push(pedido);
 
    // Marcar mesa como ocupada
    const mesa = HakunaApp.state.mesas.find(m => m.id === mesaId);
    if (mesa) { mesa.estado = "ocupada"; mesa.pedidoActivo = pedido.id; }
 
    // Limpiar pedido temporal
    temp.items = [];
    temp.mesaId = null;
    HakunaApp.persistir();
 
    Utils.mostrarToast(`✅ Pedido enviado a cocina — Mesa ${pedido.mesaId}`, "exito");
    this.renderizarPedidoActual();
    return pedido;
  },
};
 
 
/* ============================================================
   6. MÓDULO DE MESAS
   ============================================================ */
const Mesas = {
  cambiarEstado(mesaId, nuevoEstado) {
    const mesa = HakunaApp.state.mesas.find(m => m.id === mesaId);
    if (!mesa) return;
    mesa.estado = nuevoEstado;
    if (nuevoEstado !== "reservada") mesa.reserva = null;
    HakunaApp.persistir();
    Utils.mostrarToast(`Mesa ${mesa.numero}: ${nuevoEstado.toUpperCase()}`, "info");
  },

  reservarMesa(mesaId, reserva) {
    const mesa = HakunaApp.state.mesas.find(m => m.id === mesaId);
    if (!mesa) return false;
    mesa.estado = "reservada";
    mesa.reserva = reserva;
    HakunaApp.persistir();
    Utils.mostrarToast(`Mesa ${mesa.numero} reservada para ${reserva.nombre}`, "exito");
    return true;
  },
 
  getResumen() {
    const mesas = HakunaApp.state.mesas;
    return {
      total:     mesas.length,
      libres:    mesas.filter(m => m.estado === "libre").length,
      ocupadas:  mesas.filter(m => m.estado === "ocupada").length,
      reservadas:mesas.filter(m => m.estado === "reservada").length,
    };
  },
};
 
 
/* ============================================================
   7. NAVEGACIÓN — enlazar los bottom navbars de todas las páginas
   ============================================================ */
const Navegacion = {
  // Mapa de iconos → páginas
  RUTAS: {
    "table_bar":   "gestion_mesas.html",
    "receipt_long":"toma_pedidos.html",
    "point_of_sale":"index.html",
    "settings":    "adm_usuarios.html",
    "payments":    "facturacion.html",
  },
 
  init() {
    // ── Bottom NavBar ────────────────────────────────────
    document.querySelectorAll("nav [data-icon], nav a, nav button[data-href]").forEach(el => {
      const icon = el.matches("[data-icon]") ? el : el.querySelector("[data-icon]");
      if (!icon) return;
      const ruta = this.RUTAS[icon.dataset.icon];
      if (ruta) {
        el.style.cursor = "pointer";
        el.addEventListener("click", e => {
          e.preventDefault();
          window.location.href = ruta;
        });
      }
    });

    // ── Top navbar en facturación (texto) ──────────────────
    document.querySelectorAll("header nav span").forEach(span => {
      const texto = span.textContent.trim().toLowerCase();
      if (texto.includes("mesas"))      span.style.cursor = "pointer", span.onclick = () => window.location.href = "gestion_mesas.html";
      if (texto.includes("pedidos"))    span.style.cursor = "pointer", span.onclick = () => window.location.href = "toma_pedidos.html";
      if (texto.includes("menú") || texto.includes("menu") || texto.includes("pos")) { span.style.cursor = "pointer"; span.onclick = () => window.location.href = "index.html"; }
      if (texto.includes("administraci")) { span.style.cursor = "pointer"; span.onclick = () => window.location.href = "facturacion.html"; }
    });
 
    // ── Sidebar adm_usuarios ────────────────────────────
    document.querySelectorAll("aside a[href='#']").forEach(link => {
      const texto = link.textContent.trim().toLowerCase();
      if (texto.includes("mesas"))      link.href = "gestion_mesas.html";
      if (texto.includes("pedidos"))    link.href = "toma_pedidos.html";
      if (texto.includes("personal"))   link.href = "adm_usuarios.html";
      if (texto.includes("config"))     link.href = "#";
    });
 
    // ── Header links ────────────────────────────────────
    document.querySelectorAll("header span[class*='cursor-pointer']").forEach(span => {
      const t = span.textContent.trim().toLowerCase();
      if (t.includes("mesas"))    span.style.cursor = "pointer", span.onclick = () => window.location.href = "gestion_mesas.html";
      if (t.includes("pedidos"))  span.style.cursor = "pointer", span.onclick = () => window.location.href = "toma_pedidos.html";
      if (t.includes("personal")) span.style.cursor = "pointer", span.onclick = () => window.location.href = "adm_usuarios.html";
    });
 
    // ── Botón "Ver Inventario Completo" ─────────────────
    document.querySelectorAll("button").forEach(btn => {
      const texto = btn.textContent.toLowerCase();
      if (texto.includes("inventario completo")) {
        btn.addEventListener("click", () => Inventario.abrirPanelInventario());
      }

      if (texto.includes("marcar como listo")) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const parent = btn.closest(".group, .relative, .bg-surface-container-low");
          if (parent) parent.classList.add("opacity-60", "border-green-500", "shadow-[0_0_16px_rgba(120,220,119,0.48)]");
          btn.textContent = "LISTO";
          btn.disabled = true;
          btn.classList.remove("from-primary", "to-primary-container");
          btn.classList.add("bg-secondary", "text-on-secondary");
          Utils.mostrarToast("✅ Pedido marcado como listo", "exito");
        });
      }

      if (texto.includes("procesar pedido")) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const ticket = btn.closest(".group, .relative, .bg-surface-container-low");
          if (ticket) ticket.classList.add("opacity-75");
          btn.textContent = "PROCESADO";
          btn.disabled = true;
          btn.classList.add("bg-tertiary", "text-on-tertiary", "font-bold");
          Utils.mostrarToast("✅ Pedido en proceso", "info");
        });
      }
    });
 
    // ── Botón cerrar sesión ─────────────────────────────
    document.querySelectorAll("button, a").forEach(el => {
      if (el.textContent.toLowerCase().includes("cerrar sesión") ||
          el.textContent.toLowerCase().includes("salir")) {
        el.addEventListener("click", e => { e.preventDefault(); Sesion.cerrar(); });
      }
    });
 
    // ── Mostrar usuario logueado ─────────────────────────
    const sesion = HakunaApp.state.sesion;
    if (sesion) {
      document.querySelectorAll("[data-usuario], .hm-usuario").forEach(el => {
        el.textContent = sesion.nombre;
      });
    }
 
    this.marcarActivo();
  },
 
  // Resaltar el ítem del nav activo según la página actual
  marcarActivo() {
    const pagina = window.location.pathname.split("/").pop() || "index.html";
    const iconoActivo = Object.entries(this.RUTAS).find(([, v]) => v === pagina)?.[0];
    if (!iconoActivo) return;
    document.querySelectorAll("nav a, nav button").forEach(el => {
      const icon = el.querySelector("[data-icon]");
      if (icon?.dataset.icon === iconoActivo) {
        el.classList.add("hm-nav-activo");
      }
    });
  },
};
 
 
/* ============================================================
   8. INICIALIZACIÓN POR PÁGINA
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const pagina = window.location.pathname.split("/").pop() || "index.html";
 
  // Inyectar estilos globales de animaciones
  injectarEstilos();
 
  // Verificar sesión (excepto en login)
  if (!pagina.includes("login")) {
    Sesion.verificar();
    Navegacion.init();
  }
 
  switch (true) {
    case pagina.includes("login"):
      Sesion.init();
      break;
 
    case pagina.includes("index"):
      Inventario.renderizarWidgetInventario();
      // Verificar alertas al cargar
      setTimeout(() => Inventario.verificarAlertas(), 800);
      // Refresco automático del inventario cada 30s
      setInterval(() => Inventario.renderizarWidgetInventario(), 30000);
      break;
 
    case pagina.includes("toma_pedidos"):
      initTomaPedidos();
      break;
 
    case pagina.includes("gestion_mesas"):
      initGestionMesas();
      break;
 
    case pagina.includes("facturacion"):
      initFacturacion();
      break;
 
    case pagina.includes("adm_usuarios"):
      // Sin lógica extra por ahora
      break;
  }
});
 
 
/* ── Init Toma de Pedidos ─────────────────────────────────── */
function initTomaPedidos() {
  const categoriaDefault = "Bebidas";
  const botonesCategoria = document.querySelectorAll("#hm-categoria-buttons button");

  const seleccionarCategoria = (categoria) => {
    botonesCategoria.forEach(btn => {
      if (btn.dataset.categoria === categoria) {
        btn.classList.add("bg-gradient-to-tr", "from-primary", "to-primary-container", "text-on-primary-container", "font-extrabold", "shadow-lg");
        btn.classList.remove("bg-surface-container-high", "text-on-surface-variant", "font-bold");
      } else {
        btn.classList.remove("bg-gradient-to-tr", "from-primary", "to-primary-container", "text-on-primary-container", "font-extrabold", "shadow-lg");
        btn.classList.add("bg-surface-container-high", "text-on-surface-variant", "font-bold");
      }
    });
    Pedidos.renderizarCatalogo(categoria);
  };

  botonesCategoria.forEach(btn => {
    btn.addEventListener("click", () => seleccionarCategoria(btn.dataset.categoria));
  });

  seleccionarCategoria(categoriaDefault);

  // Botón Enviar Pedido
  document.querySelectorAll("button").forEach(btn => {
    if (!btn.textContent.trim().toUpperCase().includes("ENVIAR PEDIDO")) return;
    btn.addEventListener("click", () => {
      const mesaEl = document.querySelector(".font-bold.text-on-surface");
      const mesaTexto = mesaEl?.textContent?.replace(/\D/g, "") || "12";
      const mesaId = parseInt(mesaTexto, 10) || 12;
      Pedidos.confirmarPedido(mesaId);
    });
  });

  Pedidos.renderizarPedidoActual();
}


/* ── Init Gestión de Mesas ────────────────────────────────── */
function initGestionMesas() {
  let filtroMesa = "todas";

  const actualizarContadores = () => {
    const resumen = Mesas.getResumen();
    const estadoEls = document.querySelectorAll("[data-mesas-estado]");
    estadoEls.forEach(el => {
      const key = el.dataset.mesasEstado;
      if (resumen[key] !== undefined) el.textContent = resumen[key];
    });
  };

  const actualizarMesasUI = () => {
    document.querySelectorAll("[data-mesa-id]").forEach(el => {
      const id = parseInt(el.dataset.mesaId);
      const mesa = HakunaApp.state.mesas.find(m => m.id === id);
      if (!mesa) return;

      el.classList.remove("bg-secondary-container/20", "border-secondary/20", "bg-error-container/30", "border-error/20", "bg-tertiary-container/20", "border-tertiary/20");
      if (mesa.estado === "libre") {
        el.classList.add("bg-secondary-container/20", "border-secondary/20");
      } else if (mesa.estado === "ocupada") {
        el.classList.add("bg-error-container/30", "border-error/20");
      } else if (mesa.estado === "reservada") {
        el.classList.add("bg-tertiary-container/20", "border-tertiary/20");
      }

      let badge = el.querySelector(".mesa-estado-badge");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "mesa-estado-badge absolute top-3 right-3 px-2 py-1 text-[10px] uppercase tracking-widest rounded-lg font-bold";
        el.appendChild(badge);
      }
      badge.textContent = mesa.estado.toUpperCase();
      if (mesa.estado === "libre") {
        badge.classList.remove("bg-error","bg-tertiary","text-on-error","text-on-tertiary");
        badge.classList.add("bg-secondary","text-on-secondary");
      } else if (mesa.estado === "ocupada") {
        badge.classList.remove("bg-secondary","bg-tertiary","text-on-secondary","text-on-tertiary");
        badge.classList.add("bg-error","text-on-error");
      } else if (mesa.estado === "reservada") {
        badge.classList.remove("bg-secondary","bg-error","text-on-secondary","text-on-error");
        badge.classList.add("bg-tertiary","text-on-tertiary");
      }

      const reservaInfo = el.querySelector(".mesa-reserva-info");
      if (mesa.reserva) {
        if (!reservaInfo) {
          const info = document.createElement("p");
          info.className = "mesa-reserva-info text-[10px] mt-2 text-on-surface-variant";
          el.appendChild(info);
        }
        el.querySelector(".mesa-reserva-info").textContent = `${mesa.reserva.nombre} • ${mesa.reserva.fecha} ${mesa.reserva.hora}`;
      } else if (reservaInfo) {
        reservaInfo.remove();
      }

      // Mostrar/ocultar según filtros
      if (filtroMesa === "todas") {
        el.classList.remove("hidden");
      } else {
        el.classList.toggle("hidden", mesa.estado !== filtroMesa);
      }
    });
    actualizarContadores();
  };

  const abrirModalReserva = () => {
    if (document.getElementById("hm-modal-reserva")) return;
    const modal = document.createElement("div");
    modal.id = "hm-modal-reserva";
    modal.style.cssText = "position:fixed; inset:0; background:rgba(0,0,0,0.62); z-index:11000; display:flex; align-items:center; justify-content:center; padding:16px; backdrop-filter:blur(2px);";
    const mesasDisp = HakunaApp.state.mesas.filter(m => m.estado !== "ocupada");

    modal.innerHTML = `
      <div style="background:#131313; border:1px solid rgba(255,255,255,0.14); border-radius:16px; width:100%; max-width:420px; padding:24px; box-shadow:0 14px 40px rgba(0,0,0,0.5);">
        <h3 style="color:#e5e2e1; font-family:'Plus Jakarta Sans',sans-serif; font-size:22px; margin:0 0 8px;">Confirmar Reserva</h3>
        <p style="color:#a48c7a; font-size:12px; margin:0 0 16px;">Completa fecha, hora, mesa y cantidad.</p>

        <label style="display:block; color:#a48c7a; font-size:11px; font-weight:700; margin-bottom:4px;">Cliente</label>
        <input id="hm-reserva-nombre" type="text" placeholder="Nombre completo" style="width:100%; padding:10px 12px; background:#1c1b1b; border:1px solid #564334; border-radius:10px; color:#e5e2e1; margin-bottom:12px;" />

        <label style="display:block; color:#a48c7a; font-size:11px; font-weight:700; margin-bottom:4px;">Seleccionar mesa</label>
        <select id="hm-reserva-mesa" style="width:100%; padding:10px 12px; background:#1c1b1b; border:1px solid #564334; border-radius:10px; color:#e5e2e1; margin-bottom:12px;">
          ${mesasDisp.map(m => `<option value="${m.id}">#${m.numero} (${m.estado})</option>`).join("")}
        </select>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
          <div>
            <label style="display:block; color:#a48c7a; font-size:11px; font-weight:700; margin-bottom:4px;">Fecha</label>
            <input id="hm-reserva-fecha" type="date" style="width:100%; padding:10px 12px; background:#1c1b1b; border:1px solid #564334; border-radius:10px; color:#e5e2e1;" />
          </div>
          <div>
            <label style="display:block; color:#a48c7a; font-size:11px; font-weight:700; margin-bottom:4px;">Hora</label>
            <input id="hm-reserva-hora" type="time" style="width:100%; padding:10px 12px; background:#1c1b1b; border:1px solid #564334; border-radius:10px; color:#e5e2e1;" />
          </div>
        </div>

        <label style="display:block; color:#a48c7a; font-size:11px; font-weight:700; margin-bottom:4px;">Personas</label>
        <input id="hm-reserva-personas" type="number" min="1" value="2" style="width:100%; padding:10px 12px; background:#1c1b1b; border:1px solid #564334; border-radius:10px; color:#e5e2e1; margin-bottom:16px;" />

        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button id="hm-reserva-cancelar" style="flex:1; padding:10px; background:#2a2a2a; color:#ddc1ae; border:1px solid #564334; border-radius:10px;">Cancelar</button>
          <button id="hm-reserva-confirmar" style="flex:1; padding:10px; background:#ffb77a; color:#131313; border:none; border-radius:10px; font-weight:700;">Reservar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
    document.getElementById("hm-reserva-cancelar").addEventListener("click", () => modal.remove());

    document.getElementById("hm-reserva-confirmar").addEventListener("click", () => {
      const nombre = document.getElementById("hm-reserva-nombre").value.trim();
      const mesaId = parseInt(document.getElementById("hm-reserva-mesa").value, 10);
      const fecha = document.getElementById("hm-reserva-fecha").value;
      const hora = document.getElementById("hm-reserva-hora").value;
      const personas = parseInt(document.getElementById("hm-reserva-personas").value, 10);

      if (!nombre || !fecha || !hora || !personas || isNaN(personas) || personas < 1) {
        Utils.mostrarToast("Completa todos los campos de la reserva", "error");
        return;
      }

      const ok = Mesas.reservarMesa(mesaId, { nombre, fecha, hora, personas });
      if (ok) {
        modal.remove();
        actualizarMesasUI();
      }
    });
  };

  actualizarContadores();
  actualizarMesasUI();

  const selectFiltro = document.getElementById("hm-filtro-estado");
  if (selectFiltro) {
    selectFiltro.addEventListener("change", () => {
      filtroMesa = selectFiltro.value;
      actualizarMesasUI();
      Utils.mostrarToast(`Filtro aplicado: ${filtroMesa}`, "info");
    });
  }

  const btnFiltro = document.getElementById("hm-filtro-mesas");
  if (btnFiltro && selectFiltro) {
    btnFiltro.addEventListener("click", (e) => {
      e.preventDefault();
      const opciones = { todas: "ocupada", ocupada: "reservada", reservada: "libre", libre: "todas" };
      filtroMesa = opciones[filtroMesa] || "todas";
      selectFiltro.value = filtroMesa;
      actualizarMesasUI();
      Utils.mostrarToast(`Filtro rápido: ${filtroMesa}`, "info");
    });
  }

  document.querySelectorAll("[data-mesa-id]").forEach(el => {
    el.addEventListener("click", () => {
      const id = parseInt(el.dataset.mesaId);
      const mesa = HakunaApp.state.mesas.find(m => m.id === id);
      if (!mesa) return;
      if (mesa.estado === "libre") {
        abrirModalReserva();
        return;
      }
      if (mesa.estado === "reservada") {
        if (confirm(`Cancelar reserva de ${mesa.reserva?.nombre || 'cliente'} en mesa ${mesa.numero}?`)) {
          Mesas.cambiarEstado(id, "libre");
          actualizarMesasUI();
        }
        return;
      }
      // ocupada -> reservada o libre
      const siguiente = { libre: "ocupada", ocupada: "reservada", reservada: "libre" };
      Mesas.cambiarEstado(id, siguiente[mesa.estado] || "libre");
      actualizarMesasUI();
    });
  });

  const btnNuevaReserva = Array.from(document.querySelectorAll("button")).find(b => b.textContent.toLowerCase().includes("nueva reserva"));
  if (btnNuevaReserva) {
    btnNuevaReserva.addEventListener("click", (e) => {
      e.preventDefault();
      abrirModalReserva();
    });
  }
}



/* ── Init Facturación ─────────────────────────────────────── */
function initFacturacion() {
  Pedidos.renderizarPedidoActual();

  // Botón imprimir / cerrar factura, nueva venta
  document.querySelectorAll("button").forEach(btn => {
    const txt = btn.textContent.trim().toLowerCase();

    if (txt.includes("imprimir") || txt.includes("factura")) {
      btn.addEventListener("click", () => {
        window.print();
        Utils.mostrarToast("Imprimiendo recibo...");
      });
    }

    if (txt.includes("nueva venta") || txt.includes("limpiar")) {
      btn.addEventListener("click", () => {
        HakunaApp.state.pedidoTemp = { mesaId: null, items: [] };
        HakunaApp.persistir();
        Pedidos.renderizarPedidoActual();
        Utils.mostrarToast("Nueva venta iniciada.", "info");
      });
    }

    if (txt.includes("exportar csv")) {
      btn.addEventListener("click", () => {
        const filas = Array.from(document.querySelectorAll("tbody tr"));
        const data = ["ID de Pedido,Mesero,Estado,Monto"].concat(filas.map(f => {
          const cols = Array.from(f.querySelectorAll("td")).slice(0,4).map(c => `"${c.textContent.trim().replace(/"/g, '""')}"`);
          return cols.join(",");
        })).join("\n");
        const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transacciones.csv";
        link.click();
        URL.revokeObjectURL(url);
        Utils.mostrarToast("CSV exportado.", "exito");
      });
    }

    if (txt.includes("ver todo")) {
      btn.addEventListener("click", () => Utils.mostrarToast("Mostrando todas las transacciones."));
    }
  });

  // Quick actions en la pantalla de facturación
  const btnArqueo = document.querySelector("button span[data-icon='account_balance_wallet']")?.closest("button");
  const btnCierre = document.querySelector("button span[data-icon='event_busy']")?.closest("button");

  if (btnArqueo) {
    btnArqueo.addEventListener("click", () => Utils.mostrarToast("Arqueo de caja realizado.", "exito"));
  }

  if (btnCierre) {
    btnCierre.addEventListener("click", () => Utils.mostrarToast("Turno cerrado correctamente.", "info"));
  }

  // Botones de tabla (imprimir/editar)
  document.querySelectorAll("tbody tr button").forEach(btn => {
    const icon = btn.querySelector("span[data-icon]")?.dataset.icon;
    if (icon === "print") {
      btn.addEventListener("click", () => {
        window.print();
        Utils.mostrarToast("Recibo impreso.", "exito");
      });
    }
    if (icon === "edit") {
      btn.addEventListener("click", () => Utils.mostrarToast("Función editar no implementada aún.", "info"));
    }
  });
}


/* ============================================================
9. ESTILOS GLOBALES INYECTADOS
   ============================================================ */
function injectarEstilos() {
if (document.getElementById("hm-global-styles")) return;
const style = document.createElement("style");
style.id = "hm-global-styles";
style.textContent = `
    @keyframes hmFadeIn  { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
    @keyframes hmSlideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes shake {
    0%,100% { transform:translateX(0); }
    20%,60% { transform:translateX(-6px); }
    40%,80% { transform:translateX(6px); }
    }
    .shake { animation: shake 0.45s ease; }

    /* Nav activo */
    .hm-nav-activo {
    background: linear-gradient(135deg, #ffb77a, #fd8e00) !important;
    color: #131313 !important;
    border-radius: 1.5rem !important;
    padding: 8px 24px !important;
    opacity: 1 !important;
    }

    /* Toast */
    .hm-toast { pointer-events:none; }

    /* Scrollbar del modal */
    #hm-modal-inventario ::-webkit-scrollbar { width:6px; }
    #hm-modal-inventario ::-webkit-scrollbar-track { background:#131313; border-radius:6px; }
    #hm-modal-inventario ::-webkit-scrollbar-thumb { background:#564334; border-radius:6px; }

    /* Input focus en modal */
    #hm-buscar-inv:focus { border-color:#ffb77a; box-shadow:0 0 0 2px rgba(255,183,122,0.2); }
    #hm-nueva-cant:focus  { border-color:#ffb77a; box-shadow:0 0 0 2px rgba(255,183,122,0.2); }

    /* Kinetic gradient del botón login */
    .kinetic-gradient {
    background: linear-gradient(135deg, #ffb77a 0%, #fd8e00 100%);
    transition: filter 0.2s ease, transform 0.15s ease;
    }
    .kinetic-gradient:hover { filter: brightness(1.1); }
    .kinetic-gradient:active { transform: scale(0.97); }
`;
document.head.appendChild(style);
}


/* ============================================================
10. EXPOSICIÓN GLOBAL (para uso desde consola o desde HTML)
   ============================================================ */
window.HakunaApp   = HakunaApp;
window.Inventario  = Inventario;
window.Pedidos     = Pedidos;
window.Mesas       = Mesas;
window.Sesion      = Sesion;
window.Utils       = Utils;