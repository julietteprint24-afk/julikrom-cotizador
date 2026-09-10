import { useState } from "react";
import { calcularPrecios } from "../utils/configCotizador";

type Props = {
  volverMenu: () => void;
};

type ModoCosto = "automatico" | "manual";

function Banner({ volverMenu }: Props) {
  const [ancho, setAncho] = useState(1);
  const [alto, setAlto] = useState(0.5);
  const [cantidad, setCantidad] = useState(1);

  const [modoCosto, setModoCosto] = useState<ModoCosto>("automatico");
  const [costoManual, setCostoManual] = useState(0);

  const [diseno, setDiseno] = useState(5);
  const [instalacion, setInstalacion] = useState(false);
  const [costoInstalacion, setCostoInstalacion] = useState(10);
  const [transporte, setTransporte] = useState(0);
  const [extra, setExtra] = useState(0);

  const area = ancho * alto;

  const calcularCostoXtremo = () => {
    const anchoCm = Math.round(ancho * 100);
    const altoCm = Math.round(alto * 100);

    const ladoMayor = Math.max(anchoCm, altoCm);
    const ladoMenor = Math.min(anchoCm, altoCm);

    // Tarifas de referencia para formatos pequeños
    if (ladoMayor === 50 && ladoMenor === 50) {
      return 3;
    }

    if (ladoMayor === 75 && ladoMenor === 50) {
      return 4;
    }

    if (ladoMayor === 100 && ladoMenor === 50) {
      return 5;
    }

    if (ladoMayor === 100 && ladoMenor === 75) {
      return 7.5;
    }

    // Tarifa estándar desde 1 m²
    if (area >= 1) {
      return area * 8.5;
    }

    /*
      Para medidas menores de 1 m² que no coincidan exactamente
      con los formatos de referencia, usamos $8.50/m² como
      estimación base, pero nunca menos de $3.00.
    */
    return Math.max(area * 8.5, 3);
  };

  const costoAutomatico = calcularCostoXtremo();

  const costoProveedorUnidad =
    modoCosto === "automatico" ? costoAutomatico : costoManual;

  const costoProveedorTotal = costoProveedorUnidad * cantidad;

  const costoInstalacionFinal = instalacion ? costoInstalacion : 0;

  const costoTotal =
    costoProveedorTotal +
    diseno +
    costoInstalacionFinal +
    transporte +
    extra;

  const precios = calcularPrecios(costoTotal);

  const descripcion = `Banner ${ancho}m × ${alto}m`;

  return (
    <div className="calculadora">
      <button className="back-btn" onClick={volverMenu}>
        ← Volver al menú
      </button>

      <h2>🖨️ Banner</h2>

      <p className="subtitulo">
        Calcula automáticamente el costo de producción utilizando las tarifas
        de referencia de Xtremo Digital.
      </p>

      {/* MEDIDAS */}

      <label>Ancho del banner (metros)</label>
      <input
        type="number"
        min="0.01"
        step="0.01"
        value={ancho}
        onChange={(e) => setAncho(Math.max(0, Number(e.target.value)))}
      />

      <label>Alto del banner (metros)</label>
      <input
        type="number"
        min="0.01"
        step="0.01"
        value={alto}
        onChange={(e) => setAlto(Math.max(0, Number(e.target.value)))}
      />

      <div className="resultado">
        <h3>📐 Medidas</h3>

        <div className="precio-card">
          <span>Tamaño</span>
          <strong>
            {ancho.toFixed(2)} m × {alto.toFixed(2)} m
          </strong>
        </div>

        <div className="precio-card">
          <span>Área por banner</span>
          <strong>{area.toFixed(2)} m²</strong>
        </div>
      </div>

      {/* COSTO PROVEEDOR */}

      <label>Tipo de cálculo del proveedor</label>

      <div className="selector-opciones">
        <button
          type="button"
          className={
            modoCosto === "automatico" ? "opcion activa" : "opcion"
          }
          onClick={() => setModoCosto("automatico")}
        >
          Automático
        </button>

        <button
          type="button"
          className={modoCosto === "manual" ? "opcion activa" : "opcion"}
          onClick={() => setModoCosto("manual")}
        >
          Costo manual
        </button>
      </div>

      {modoCosto === "automatico" ? (
        <div className="resultado">
          <h3>🏭 Xtremo Digital</h3>

          <div className="precio-card recomendado">
            <span>Costo estimado por banner</span>
            <strong>${costoAutomatico.toFixed(2)}</strong>
          </div>
        </div>
      ) : (
        <>
          <label>Costo proveedor por unidad</label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={costoManual}
            onChange={(e) =>
              setCostoManual(Math.max(0, Number(e.target.value)))
            }
          />
        </>
      )}

      {/* CANTIDAD */}

      <label>Cantidad</label>
      <input
        type="number"
        min="1"
        step="1"
        value={cantidad}
        onChange={(e) =>
          setCantidad(Math.max(1, Math.floor(Number(e.target.value) || 1)))
        }
      />

      {/* DISEÑO */}

      <label>Diseño / preparación</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={diseno}
        onChange={(e) => setDiseno(Math.max(0, Number(e.target.value)))}
      />

      {/* INSTALACIÓN */}

      <label>Instalación</label>

      <div className="selector-opciones">
        <button
          type="button"
          className={!instalacion ? "opcion activa" : "opcion"}
          onClick={() => setInstalacion(false)}
        >
          Sin instalación
        </button>

        <button
          type="button"
          className={instalacion ? "opcion activa" : "opcion"}
          onClick={() => setInstalacion(true)}
        >
          Con instalación
        </button>
      </div>

      {instalacion && (
        <>
          <label>Costo de instalación</label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={costoInstalacion}
            onChange={(e) =>
              setCostoInstalacion(Math.max(0, Number(e.target.value)))
            }
          />
        </>
      )}

      {/* TRANSPORTE */}

      <label>Transporte</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={transporte}
        onChange={(e) =>
          setTransporte(Math.max(0, Number(e.target.value)))
        }
      />

      {/* EXTRAS */}

      <label>Costos adicionales</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={extra}
        onChange={(e) => setExtra(Math.max(0, Number(e.target.value)))}
      />

      {/* RESUMEN */}

      <div className="resultado">
        <h3>📊 Resumen</h3>

        <div className="precio-card">
          <span>Trabajo</span>
          <strong>{descripcion}</strong>
        </div>

        <div className="precio-card">
          <span>Cantidad</span>
          <strong>{cantidad}</strong>
        </div>

        <div className="precio-card">
          <span>Área total</span>
          <strong>{(area * cantidad).toFixed(2)} m²</strong>
        </div>

        <div className="precio-card">
          <span>Costo proveedor por unidad</span>
          <strong>${costoProveedorUnidad.toFixed(2)}</strong>
        </div>

        <div className="precio-card">
          <span>Costo proveedor total</span>
          <strong>${costoProveedorTotal.toFixed(2)}</strong>
        </div>

        {diseno > 0 && (
          <div className="precio-card">
            <span>Diseño / preparación</span>
            <strong>${diseno.toFixed(2)}</strong>
          </div>
        )}

        {instalacion && (
          <div className="precio-card">
            <span>Instalación</span>
            <strong>${costoInstalacionFinal.toFixed(2)}</strong>
          </div>
        )}

        {transporte > 0 && (
          <div className="precio-card">
            <span>Transporte</span>
            <strong>${transporte.toFixed(2)}</strong>
          </div>
        )}

        {extra > 0 && (
          <div className="precio-card">
            <span>Costos adicionales</span>
            <strong>${extra.toFixed(2)}</strong>
          </div>
        )}

        <div className="precio-card recomendado">
          <span>Costo total real</span>
          <strong>${costoTotal.toFixed(2)}</strong>
        </div>
      </div>

      {/* PRECIOS SUGERIDOS */}

      <div className="resultado">
        <h3>💰 Precios sugeridos</h3>

        <div className="precio-card">
          <span>Precio mínimo</span>
          <strong>${precios.minimo.toFixed(2)}</strong>
        </div>

        <div className="precio-card recomendado">
          <span>Precio recomendado</span>
          <strong>${precios.recomendado.toFixed(2)}</strong>
        </div>

        <div className="precio-card">
          <span>Precio premium</span>
          <strong>${precios.premium.toFixed(2)}</strong>
        </div>
      </div>

      {/* CONSEJO */}

      <div className="consejo">
        <strong>💡 Consejo de Julikrom:</strong>

        <p>
          Julikrom calcula automáticamente el costo estimado de producción
          utilizando las tarifas de referencia de Xtremo Digital. Si el
          proveedor entrega una cotización diferente para un trabajo especial,
          selecciona “Costo manual” e ingresa el valor real.
        </p>
      </div>
    </div>
  );
}

export default Banner;