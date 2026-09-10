import { useState } from "react";
import { calcularPrecios } from "../utils/configCotizador";

type Props = {
  volverMenu: () => void;
};

type ModoCosto = "automatico" | "manual";

function VinilImprimible({ volverMenu }: Props) {
  const [ancho, setAncho] = useState(1);
  const [alto, setAlto] = useState(1);
  const [cantidad, setCantidad] = useState(1);

  const [laminado, setLaminado] = useState(false);
  const [troquelado, setTroquelado] = useState(false);

  const [modoCosto, setModoCosto] = useState<ModoCosto>("automatico");
  const [costoManual, setCostoManual] = useState(0);

  const [diseno, setDiseno] = useState(3);
  const [instalacion, setInstalacion] = useState(false);
  const [costoInstalacion, setCostoInstalacion] = useState(10);
  const [transporte, setTransporte] = useState(0);
  const [extra, setExtra] = useState(0);

  // =====================================================
  // TARIFAS XTREMO DIGITAL
  // =====================================================

  const PRECIO_IMPRESION_M2 = 10;
  const PRECIO_LAMINADO_M2 = 3.5;
  const PRECIO_TROQUELADO_M2 = 3;

  // =====================================================
  // MEDIDAS
  // =====================================================

  const area = ancho * alto;
  const areaTotal = area * cantidad;

  // =====================================================
  // COSTOS AUTOMÁTICOS
  // =====================================================

  const costoImpresionUnidad = area * PRECIO_IMPRESION_M2;

  const costoLaminadoUnidad = laminado
    ? area * PRECIO_LAMINADO_M2
    : 0;

  const costoTroqueladoUnidad = troquelado
    ? area * PRECIO_TROQUELADO_M2
    : 0;

  const costoAutomaticoUnidad =
    costoImpresionUnidad +
    costoLaminadoUnidad +
    costoTroqueladoUnidad;

  const costoProveedorUnidad =
    modoCosto === "automatico"
      ? costoAutomaticoUnidad
      : costoManual;

  const costoProveedorTotal =
    costoProveedorUnidad * cantidad;

  // =====================================================
  // COSTOS ADICIONALES
  // =====================================================

  const costoInstalacionFinal = instalacion
    ? costoInstalacion
    : 0;

  const costoTotal =
    costoProveedorTotal +
    diseno +
    costoInstalacionFinal +
    transporte +
    extra;

  const precios = calcularPrecios(costoTotal);

  // =====================================================
  // DESCRIPCIÓN
  // =====================================================

  const acabados: string[] = [];

  if (laminado) {
    acabados.push("laminado");
  }

  if (troquelado) {
    acabados.push("troquelado");
  }

  const descripcionAcabados =
    acabados.length > 0
      ? ` con ${acabados.join(" + ")}`
      : "";

  const descripcion =
    `Vinil imprimible ${ancho}m × ${alto}m${descripcionAcabados}`;

  return (
    <div className="calculadora">
      <button className="back-btn" onClick={volverMenu}>
        ← Volver al menú
      </button>

      <h2>🎨 Vinil Imprimible</h2>

      <p className="subtitulo">
        Calcula automáticamente el costo de producción utilizando
        las tarifas de referencia de Xtremo Digital.
      </p>

      {/* =====================================================
          MEDIDAS
      ====================================================== */}

      <label>Ancho del trabajo (metros)</label>

      <input
        type="number"
        min="0.01"
        step="0.01"
        value={ancho}
        onChange={(e) =>
          setAncho(Math.max(0, Number(e.target.value)))
        }
      />

      <label>Alto del trabajo (metros)</label>

      <input
        type="number"
        min="0.01"
        step="0.01"
        value={alto}
        onChange={(e) =>
          setAlto(Math.max(0, Number(e.target.value)))
        }
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
          <span>Área por unidad</span>
          <strong>{area.toFixed(2)} m²</strong>
        </div>
      </div>

      {/* =====================================================
          ACABADOS
      ====================================================== */}

      <label>Laminado</label>

      <div className="selector-opciones">
        <button
          type="button"
          className={!laminado ? "opcion activa" : "opcion"}
          onClick={() => setLaminado(false)}
        >
          Sin laminado
        </button>

        <button
          type="button"
          className={laminado ? "opcion activa" : "opcion"}
          onClick={() => setLaminado(true)}
        >
          Con laminado
        </button>
      </div>

      <label>Troquelado / corte</label>

      <div className="selector-opciones">
        <button
          type="button"
          className={!troquelado ? "opcion activa" : "opcion"}
          onClick={() => setTroquelado(false)}
        >
          Sin troquelado
        </button>

        <button
          type="button"
          className={troquelado ? "opcion activa" : "opcion"}
          onClick={() => setTroquelado(true)}
        >
          Con troquelado
        </button>
      </div>

      {/* =====================================================
          TIPO DE CÁLCULO
      ====================================================== */}

      <label>Tipo de cálculo del proveedor</label>

      <div className="selector-opciones">
        <button
          type="button"
          className={
            modoCosto === "automatico"
              ? "opcion activa"
              : "opcion"
          }
          onClick={() => setModoCosto("automatico")}
        >
          Automático
        </button>

        <button
          type="button"
          className={
            modoCosto === "manual"
              ? "opcion activa"
              : "opcion"
          }
          onClick={() => setModoCosto("manual")}
        >
          Costo manual
        </button>
      </div>

      {modoCosto === "automatico" ? (
        <div className="resultado">
          <h3>🏭 Xtremo Digital</h3>

          <div className="precio-card">
            <span>Impresión por m²</span>
            <strong>${PRECIO_IMPRESION_M2.toFixed(2)}</strong>
          </div>

          <div className="precio-card">
            <span>Costo impresión</span>
            <strong>${costoImpresionUnidad.toFixed(2)}</strong>
          </div>

          {laminado && (
            <>
              <div className="precio-card">
                <span>Laminado por m²</span>
                <strong>${PRECIO_LAMINADO_M2.toFixed(2)}</strong>
              </div>

              <div className="precio-card">
                <span>Costo laminado</span>
                <strong>${costoLaminadoUnidad.toFixed(2)}</strong>
              </div>
            </>
          )}

          {troquelado && (
            <>
              <div className="precio-card">
                <span>Troquelado por m²</span>
                <strong>${PRECIO_TROQUELADO_M2.toFixed(2)}</strong>
              </div>

              <div className="precio-card">
                <span>Costo troquelado</span>
                <strong>${costoTroqueladoUnidad.toFixed(2)}</strong>
              </div>
            </>
          )}

          <div className="precio-card recomendado">
            <span>Costo proveedor por unidad</span>
            <strong>${costoAutomaticoUnidad.toFixed(2)}</strong>
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
              setCostoManual(
                Math.max(0, Number(e.target.value))
              )
            }
          />
        </>
      )}

      {/* =====================================================
          CANTIDAD
      ====================================================== */}

      <label>Cantidad</label>

      <input
        type="number"
        min="1"
        step="1"
        value={cantidad}
        onChange={(e) =>
          setCantidad(
            Math.max(
              1,
              Math.floor(Number(e.target.value) || 1)
            )
          )
        }
      />

      {/* =====================================================
          DISEÑO
      ====================================================== */}

      <label>Diseño / preparación</label>

      <input
        type="number"
        min="0"
        step="0.01"
        value={diseno}
        onChange={(e) =>
          setDiseno(Math.max(0, Number(e.target.value)))
        }
      />

      {/* =====================================================
          INSTALACIÓN
      ====================================================== */}

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
              setCostoInstalacion(
                Math.max(0, Number(e.target.value))
              )
            }
          />
        </>
      )}

      {/* =====================================================
          TRANSPORTE
      ====================================================== */}

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

      {/* =====================================================
          EXTRAS
      ====================================================== */}

      <label>Costos adicionales</label>

      <input
        type="number"
        min="0"
        step="0.01"
        value={extra}
        onChange={(e) =>
          setExtra(Math.max(0, Number(e.target.value)))
        }
      />

      {/* =====================================================
          RESUMEN
      ====================================================== */}

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
          <strong>{areaTotal.toFixed(2)} m²</strong>
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

      {/* =====================================================
          PRECIOS SUGERIDOS
      ====================================================== */}

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

      {/* =====================================================
          CONSEJO
      ====================================================== */}

      <div className="consejo">
        <strong>💡 Consejo de Julikrom:</strong>

        <p>
          Julikrom calcula automáticamente el costo estimado de
          producción utilizando las tarifas de referencia de Xtremo
          Digital. Puedes agregar laminado y troquelado según el
          trabajo. Si el proveedor entrega una cotización especial,
          selecciona “Costo manual” e ingresa el valor real.
        </p>
      </div>
    </div>
  );
}

export default VinilImprimible;