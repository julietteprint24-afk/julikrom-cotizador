import { useEffect, useState } from "react";
import "./styles.css";

import Banner from "./calculadoras/Banner";
import VinilImprimible from "./calculadoras/VinilImprimible";
import VinilAdhesivo from "./calculadoras/VinilAdhesivo";
import RotulosPVC from "./calculadoras/RotulosPVC";
import FigurasPVC from "./calculadoras/FigurasPVC";
import Transporte from "./calculadoras/Transporte";
import Camisetas from "./calculadoras/Camisetas";
import DisenoGrafico from "./calculadoras/DisenoGrafico";
import Configuracion from "./calculadoras/Configuracion";
import CotizacionRapida from "./calculadoras/CotizacionRapida";

type Pantalla =
  | "menu"
  | "banner"
  | "vinilImprimible"
  | "vinilAdhesivo"
  | "rotulosPVC"
  | "figurasPVC"
  | "transporte"
  | "camisetas"
  | "disenoGrafico"
  | "configuracion"
  | "cotizacionRapida";

function App() {
  const [pantalla, setPantalla] = useState<Pantalla>("menu");

  /* =========================================================
     HISTORIAL DEL NAVEGADOR
  ========================================================= */

  useEffect(() => {
    // Al iniciar Julikrom dejamos registrada la pantalla actual.
    window.history.replaceState(
      { pantalla: "menu" },
      "",
      window.location.href
    );

    const manejarAtras = (event: PopStateEvent) => {
      const pantallaHistorial = event.state?.pantalla as
        | Pantalla
        | undefined;

      // Si existe una pantalla registrada, regresamos a ella.
      // Si no existe, mostramos el menú.
      setPantalla(pantallaHistorial ?? "menu");
    };

    window.addEventListener("popstate", manejarAtras);

    return () => {
      window.removeEventListener("popstate", manejarAtras);
    };
  }, []);

  /* =========================================================
     NAVEGACIÓN INTERNA
  ========================================================= */

  const abrirPantalla = (nuevaPantalla: Pantalla) => {
    if (nuevaPantalla === pantalla) {
      return;
    }

    window.history.pushState(
      { pantalla: nuevaPantalla },
      "",
      window.location.href
    );

    setPantalla(nuevaPantalla);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const volverMenu = () => {
    if (pantalla === "menu") {
      return;
    }

    // Utilizamos el historial real.
    // Esto hace que el botón interno y el botón Atrás
    // del teléfono trabajen de la misma manera.
    window.history.back();
  };

  /* =========================================================
     INTERFAZ
  ========================================================= */

  return (
    <div className="app">
      <div className="phone">
        <header className="header">
          <img
            src="/logo.ico"
            alt="Juliette Print"
            className="logo"
          />

          <h1>Julikrom Cotizador</h1>

          <p>
            Calculadora profesional para Juliette Print
          </p>
        </header>

        {/* =====================================================
            MENÚ PRINCIPAL
        ====================================================== */}

        {pantalla === "menu" && (
          <>
            <section className="welcome-card">
              <h2>¿Qué deseas cotizar?</h2>

              <p>
                Selecciona una calculadora para iniciar.
              </p>
            </section>

            <div className="menu-grid">
              <button
                className="menu-btn active"
                onClick={() => abrirPantalla("banner")}
              >
                🖨️ <span>Banner</span>
              </button>

              <button
                className="menu-btn active"
                onClick={() =>
                  abrirPantalla("vinilImprimible")
                }
              >
                🎨 <span>Vinil Imprimible</span>
              </button>

              <button
                className="menu-btn active"
                onClick={() =>
                  abrirPantalla("vinilAdhesivo")
                }
              >
                ✨ <span>Vinil Adhesivo</span>
              </button>

              <button
                className="menu-btn active"
                onClick={() =>
                  abrirPantalla("rotulosPVC")
                }
              >
                🧱 <span>Rótulos PVC</span>
              </button>

              <button
                className="menu-btn active"
                onClick={() =>
                  abrirPantalla("figurasPVC")
                }
              >
                🧩 <span>Figuras PVC</span>
              </button>

              <button
                className="menu-btn active"
                onClick={() =>
                  abrirPantalla("transporte")
                }
              >
                🚗 <span>Transporte</span>
              </button>

              <button
                className="menu-btn active"
                onClick={() =>
                  abrirPantalla("camisetas")
                }
              >
                👕 <span>Camisetas</span>
              </button>

              <button
                className="menu-btn active"
                onClick={() =>
                  abrirPantalla("disenoGrafico")
                }
              >
                🖌️ <span>Diseño Gráfico</span>
              </button>

              <button
                className="menu-btn active"
                onClick={() =>
                  abrirPantalla("configuracion")
                }
              >
                ⚙️ <span>Configuración</span>
              </button>

              <button
                className="menu-btn active"
                onClick={() =>
                  abrirPantalla("cotizacionRapida")
                }
              >
                🧾 <span>Cotización Rápida</span>
              </button>
            </div>
          </>
        )}

        {/* =====================================================
            CALCULADORAS
        ====================================================== */}

        {pantalla === "banner" && (
          <Banner volverMenu={volverMenu} />
        )}

        {pantalla === "vinilImprimible" && (
          <VinilImprimible volverMenu={volverMenu} />
        )}

        {pantalla === "vinilAdhesivo" && (
          <VinilAdhesivo volverMenu={volverMenu} />
        )}

        {pantalla === "rotulosPVC" && (
          <RotulosPVC volverMenu={volverMenu} />
        )}

        {pantalla === "figurasPVC" && (
          <FigurasPVC volverMenu={volverMenu} />
        )}

        {pantalla === "transporte" && (
          <Transporte volverMenu={volverMenu} />
        )}

        {pantalla === "camisetas" && (
          <Camisetas volverMenu={volverMenu} />
        )}

        {pantalla === "disenoGrafico" && (
          <DisenoGrafico volver={volverMenu} />
        )}

        {pantalla === "configuracion" && (
          <Configuracion volverMenu={volverMenu} />
        )}

        {pantalla === "cotizacionRapida" && (
          <CotizacionRapida volverMenu={volverMenu} />
        )}

        <footer>
          Juliette Print · Pequeños detalles, grandes impresiones
        </footer>
      </div>
    </div>
  );
}

export default App;