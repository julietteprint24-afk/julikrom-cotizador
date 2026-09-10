import { useState } from "react";
import { calcularPrecios } from "../utils/configCotizador";

type Props = {
  volverMenu: () => void;
};

type ModoCosto = "automatico" | "manual";

type PrecioPVC = {
  ancho: number;
  alto: number;
  precio: number;
};

const tablaXtremoPVC: PrecioPVC[] = [
  { ancho: 50, alto: 50, precio: 6 },
  { ancho: 50, alto: 75, precio: 10 },
  { ancho: 75, alto: 75, precio: 13 },
  { ancho: 80, alto: 80, precio: 14.5 },
  { ancho: 100, alto: 50, precio: 12 },
  { ancho: 100, alto: 75, precio: 14 },
  { ancho: 100, alto: 100, precio: 17 },
  { ancho: 120, alto: 70, precio: 18 },
  { ancho: 120, alto: 90, precio: 20 },
  { ancho: 150, alto: 80, precio: 25.5 },
  { ancho: 150, alto: 100, precio: 27 },
  { ancho: 150, alto: 120, precio: 33 },
  { ancho: 180, alto: 100, precio: 35 },
  { ancho: 180, alto: 120, precio: 38 },
  { ancho: 240, alto: 120, precio: 49 },
];

function FigurasPVC({ volverMenu }: Props) {
  const [anchoCm, setAnchoCm] = useState(50);
  const [altoCm, setAltoCm] = useState(50);
  const [cantidad, setCantidad] = useState(1);

  const [modoCosto, setModoCosto] =
    useState<ModoCosto>("automatico");

  const [costoManual, setCostoManual] = useState(0);

  const [diseno, setDiseno] = useState(5);

  const [instalacion, setInstalacion] = useState(false);
  const [costoInstalacion, setCostoInstalacion] = useState(10);

  const [transporte, setTransporte] = useState(0);
  const [extra, setExtra] = useState(0);

  // =====================================================
  // MEDIDAS
  // =====================================================

  const anchoMetros = anchoCm / 100;
  const altoMetros = altoCm / 100;

  const areaUnidad = anchoMetros * altoMetros;
  const areaTotal = areaUnidad * cantidad;

  // =====================================================
  // BUSCAR PRECIO EXACTO EN TABLA XTREMO DIGITAL
  // =====================================================

  const buscarPrecioExacto = () => {
    return tablaXtremoPVC.find((item) => {
      const medidaNormal =
        item.ancho === anchoCm && item.alto === altoCm;

      const medidaInvertida =
        item.ancho === altoCm && item.alto === anchoCm;

      return medidaNormal || medidaInvertida;
    });
  };

  const precioExacto = buscarPrecioExacto();

  // =====================================================
  // ESTIMACIÓN PARA MEDIDAS ESPECIALES
  // =====================================================

  const calcularEstimado = () => {
    if (precioExacto) {
      return precioExacto.precio;
    }

    if (areaUnidad <= 0) {
      return 0;
    }

    /*
      Estimación para medidas no incluidas en la tabla.

      Para piezas pequeñas se protege un costo mínimo.
      Para piezas mayores se utiliza una referencia aproximada
      de $18 por m², coherente con los tamaños medianos/grandes
      publicados por Xtremo Digital.
    */

    const estimadoPorArea = areaUnidad * 18;

    return Math.max(6, estimadoPorArea);
  };

  const costoAutomaticoUnidad = calcularEstimado();

  const costoProveedorUnidad =
    modoCosto === "automatico"
      ? costoAutomaticoUnidad
      : costoManual;

  const costoProveedorTotal =
    costoProveedorUnidad * cantidad;

  // =====================================================
  // COSTOS ADICIONALES
  // =====================================================

  const costoInstalacionFinal =
    instalacion ? costoInstalacion : 0;

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

  const descripcion =
    `Figura PVC ${anchoCm}cm × ${altoCm}cm`;

  return (
    <div className="calculadora">
      <button
        className="back-btn"
        onClick={volverMenu}
      >
        ← Volver al menú
      </button>

      <h2>🧩 Figuras PVC</h2>

      <p className="subtitulo">
        Calcula figuras PVC utilizando las tarifas de referencia
        de Xtremo Digital.
      </p>

      {/* =====================================================
          MEDIDAS
      ====================================================== */}

      <label>Ancho de la figura (cm)</label>

      <input
        type="number"
        min="1"
        step="1"
        value={anchoCm}
        onChange={(e) =>
          setAnchoCm(
            Math.max(0, Number(e.target.value))
          )
        }
      />

      <label>Alto de la figura (cm)</label>

      <input
        type="number"
        min="1"
        step="1"
        value={altoCm}
        onChange={(e) =>
          setAltoCm(
            Math.max(0, Number(e.target.value))
          )
        }
      />

      <div className="resultado">
        <h3>📐 Medidas</h3>

        <div className="precio-card">
          <span>Tamaño</span>

          <strong>
            {anchoCm} × {altoCm} cm
          </strong>
        </div>

        <div className="precio-card">
          <span>Área aproximada</span>

          <strong>
            {areaUnidad.toFixed(3)} m²
          </strong>
        </div>
      </div>

      {/* =====================================================
          COSTO PROVEEDOR
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
          onClick={() =>
            setModoCosto("automatico")
          }
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
          onClick={() =>
            setModoCosto("manual")
          }
        >
          Costo manual
        </button>
      </div>

      {modoCosto === "automatico" ? (
        <div className="resultado">
          <h3>🏭 Xtremo Digital</h3>

          <div className="precio-card">
            <span>Tipo de referencia</span>

            <strong>
              {precioExacto
                ? "Precio exacto de tabla"
                : "Precio estimado"}
            </strong>
          </div>

          <div className="precio-card recomendado">
            <span>Costo por figura</span>

            <strong>
              ${costoAutomaticoUnidad.toFixed(2)}
            </strong>
          </div>

          {!precioExacto && (
            <p className="nota">
              Esta medida no aparece exactamente en la tabla de
              Xtremo Digital. Julikrom está mostrando una
              estimación. Confirma el precio con el proveedor
              antes de cerrar la cotización.
            </p>
          )}
        </div>
      ) : (
        <>
          <label>Costo proveedor por figura</label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={costoManual}
            onChange={(e) =>
              setCostoManual(
                Math.max(
                  0,
                  Number(e.target.value)
                )
              )
            }
          />
        </>
      )}

      {/* =====================================================
          CANTIDAD
      ====================================================== */}

      <label>Cantidad de figuras</label>

      <input
        type="number"
        min="1"
        step="1"
        value={cantidad}
        onChange={(e) =>
          setCantidad(
            Math.max(
              1,
              Math.floor(
                Number(e.target.value) || 1
              )
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
          setDiseno(
            Math.max(
              0,
              Number(e.target.value)
            )
          )
        }
      />

      {/* =====================================================
          INSTALACIÓN
      ====================================================== */}

      <label>Instalación</label>

      <div className="selector-opciones">
        <button
          type="button"
          className={
            !instalacion
              ? "opcion activa"
              : "opcion"
          }
          onClick={() =>
            setInstalacion(false)
          }
        >
          Sin instalación
        </button>

        <button
          type="button"
          className={
            instalacion
              ? "opcion activa"
              : "opcion"
          }
          onClick={() =>
            setInstalacion(true)
          }
        >
          Con instalación
        </button>
      </div>

      {instalacion && (
        <>
          <label>
            Costo de instalación
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={costoInstalacion}
            onChange={(e) =>
              setCostoInstalacion(
                Math.max(
                  0,
                  Number(e.target.value)
                )
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
          setTransporte(
            Math.max(
              0,
              Number(e.target.value)
            )
          )
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
          setExtra(
            Math.max(
              0,
              Number(e.target.value)
            )
          )
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
          <span>Área total aproximada</span>

          <strong>
            {areaTotal.toFixed(3)} m²
          </strong>
        </div>

        <div className="precio-card">
          <span>
            Costo proveedor por figura
          </span>

          <strong>
            ${costoProveedorUnidad.toFixed(2)}
          </strong>
        </div>

        <div className="precio-card">
          <span>Costo proveedor total</span>

          <strong>
            ${costoProveedorTotal.toFixed(2)}
          </strong>
        </div>

        {diseno > 0 && (
          <div className="precio-card">
            <span>Diseño / preparación</span>

            <strong>
              ${diseno.toFixed(2)}
            </strong>
          </div>
        )}

        {instalacion && (
          <div className="precio-card">
            <span>Instalación</span>

            <strong>
              ${costoInstalacionFinal.toFixed(2)}
            </strong>
          </div>
        )}

        {transporte > 0 && (
          <div className="precio-card">
            <span>Transporte</span>

            <strong>
              ${transporte.toFixed(2)}
            </strong>
          </div>
        )}

        {extra > 0 && (
          <div className="precio-card">
            <span>Costos adicionales</span>

            <strong>
              ${extra.toFixed(2)}
            </strong>
          </div>
        )}

        <div className="precio-card recomendado">
          <span>Costo total real</span>

          <strong>
            ${costoTotal.toFixed(2)}
          </strong>
        </div>
      </div>

      {/* =====================================================
          PRECIOS SUGERIDOS
      ====================================================== */}

      <div className="resultado">
        <h3>💰 Precios sugeridos</h3>

        <div className="precio-card">
          <span>Precio mínimo</span>

          <strong>
            ${precios.minimo.toFixed(2)}
          </strong>
        </div>

        <div className="precio-card recomendado">
          <span>Precio recomendado</span>

          <strong>
            ${precios.recomendado.toFixed(2)}
          </strong>
        </div>

        <div className="precio-card">
          <span>Precio premium</span>

          <strong>
            ${precios.premium.toFixed(2)}
          </strong>
        </div>
      </div>

      {/* =====================================================
          CONSEJO
      ====================================================== */}

      <div className="consejo">
        <strong>
          💡 Consejo de Julikrom:
        </strong>

        <p>
          Las medidas publicadas por Xtremo Digital utilizan
          directamente el precio exacto de su tabla. Para una
          medida especial, Julikrom genera una estimación de
          referencia; confirma el costo con el proveedor o utiliza
          “Costo manual” antes de cerrar la cotización.
        </p>
      </div>
    </div>
  );
}

export default FigurasPVC;