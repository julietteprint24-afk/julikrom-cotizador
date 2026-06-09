import { useState } from "react";
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

  const volverMenu = () => setPantalla("menu");

  return (
    <div className="app">
      <div className="phone">
        <header className="header">
          <img src="/logo.ico" alt="Juliette Print" className="logo" />
          <h1>Julikrom Cotizador</h1>
          <p>Calculadora profesional para Juliette Print</p>
        </header>

        {pantalla === "menu" && (
          <>
            <section className="welcome-card">
              <h2>¿Qué deseas cotizar?</h2>
              <p>Selecciona una calculadora para iniciar.</p>
            </section>

            <div className="menu-grid">
              <button className="menu-btn active" onClick={() => setPantalla("banner")}>
                🖨️ <span>Banner</span>
              </button>

              <button className="menu-btn active" onClick={() => setPantalla("vinilImprimible")}>
                🎨 <span>Vinil Imprimible</span>
              </button>

              <button className="menu-btn active" onClick={() => setPantalla("vinilAdhesivo")}>
                ✨ <span>Vinil Adhesivo</span>
              </button>

              <button className="menu-btn active" onClick={() => setPantalla("rotulosPVC")}>
                🧱 <span>Rótulos PVC</span>
              </button>

              <button className="menu-btn active" onClick={() => setPantalla("figurasPVC")}>
                🧩 <span>Figuras PVC</span>
              </button>

              <button className="menu-btn active" onClick={() => setPantalla("transporte")}>
                🚗 <span>Transporte</span>
              </button>

              <button className="menu-btn active" onClick={() => setPantalla("camisetas")}>
                👕 <span>Camisetas</span>
              </button>

              <button className="menu-btn active" onClick={() => setPantalla("disenoGrafico")}>
                🖌️ <span>Diseño Gráfico</span>
              </button>

              <button className="menu-btn active" onClick={() => setPantalla("configuracion")}>
                ⚙️ <span>Configuración</span>
              </button>

              <button className="menu-btn active" onClick={() => setPantalla("cotizacionRapida")}>
                🧾 <span>Cotización Rápida</span>
              </button>
            </div>
          </>
        )}

        {pantalla === "banner" && <Banner volverMenu={volverMenu} />}
        {pantalla === "vinilImprimible" && <VinilImprimible volverMenu={volverMenu} />}
        {pantalla === "vinilAdhesivo" && <VinilAdhesivo volverMenu={volverMenu} />}
        {pantalla === "rotulosPVC" && <RotulosPVC volverMenu={volverMenu} />}
        {pantalla === "figurasPVC" && <FigurasPVC volverMenu={volverMenu} />}
        {pantalla === "transporte" && <Transporte volverMenu={volverMenu} />}
        {pantalla === "camisetas" && <Camisetas volverMenu={volverMenu} />}
        {pantalla === "disenoGrafico" && <DisenoGrafico volver={volverMenu} />}
        {pantalla === "configuracion" && <Configuracion volverMenu={volverMenu} />}
        {pantalla === "cotizacionRapida" && <CotizacionRapida volverMenu={volverMenu} />}

        <footer>Juliette Print · Pequeños detalles, grandes impresiones</footer>
      </div>
    </div>
  );
}

export default App;