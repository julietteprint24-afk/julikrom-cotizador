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
  observacion?: string;
};

const tablaRotulosPVC: PrecioPVC[] = [
  { ancho: 30, alto: 20, precio: 4 },
  { ancho: 35, alto: 20, precio: 3.5 },
  { ancho: 35, alto: 25, precio: 4 },
  { ancho: 40, alto: 40, precio: 6 },
  { ancho: 45, alto: 35, precio: 6 },
  { ancho: 50, alto: 20, precio: 6 },
  { ancho: 50, alto: 30, precio: 6 },
  { ancho: 60, alto: 20, precio: 6 },
  { ancho: 50, alto: 70, precio: 10 },
  { ancho: 75, alto: 50, precio: 10 },

  // Este valor se deduce de una cotización conjunta:
  // 100x75 + 50x20 = $20
  // Como 50x20 está confirmado en $6,
  // se obtiene una referencia aproximada de $14.
  {
    ancho: 100,
    alto: 75,
    precio: 14,
    observacion: "Precio inferido de cotización conjunta",
  },
];

function RotulosPVC({ volverMenu }: Props) {
  const [anchoCm, setAnchoCm] = useState(45);
  const [altoCm, setAltoCm] = useState(35);

  const [cantidad, setCantidad] = useState(1);

  const [modoCosto, setModoCosto] =
    useState<ModoCosto>("automatico");

  const [costoManual, setCostoManual] = useState(0);

  const [diseno, setDiseno] = useState(3);

  const [instalacion, setInstalacion] = useState(false);
  const [costoInstalacion, setCostoInstalacion] = useState(10);

  const [transporte, setTransporte] = useState(0);
  const [extra, setExtra] = useState(0);

  // =====================================================
  // MEDIDAS Y ÁREA
  // =====================================================

  const anchoMetros = anchoCm / 100;
  const altoMetros = altoCm / 100;

  const areaUnidad = anchoMetros * altoMetros;
  const areaTotal = areaUnidad * cantidad;

  // =====================================================
  // PRECIO EXACTO
  // =====================================================

  const precioExacto = tablaRotulosPVC.find((item) => {
    const normal =
      item.ancho === anchoCm &&
      item.alto === altoCm;

    const invertida =
      item.ancho === altoCm &&
      item.alto === anchoCm;

    return normal || invertida;
  });

  // =====================================================
  // ESTIMACIÓN PARA MEDIDAS NO REGISTRADAS
  // =====================================================

  const calcularCostoEstimado = () => {
    if (precioExacto) {
      return precioExacto.precio;
    }

    if (areaUnidad <= 0) {
      return 0;
    }

    /*
      Para una medida especial buscamos las referencias
      conocidas más cercanas por área.

      En lugar de utilizar una tarifa fija por m²,
      interpolamos entre datos reales del proveedor.
      Esto representa mejor los precios observados,
      especialmente en rótulos pequeños.
    */

    const referencias = tablaRotulosPVC
      .map((item) => ({
        ...item,
        area: (item.ancho / 100) * (item.alto / 100),
      }))
      .sort((a, b) => a.area - b.area);

    // Menor que nuestra referencia más pequeña
    if (areaUnidad <= referencias[0].area) {
      const referencia = referencias[0];

      const precioPorM2 =
        referencia.precio / referencia.area;

      const calculado = areaUnidad * precioPorM2;

      // Protegemos un mínimo observado
      return Math.max(3.5, calculado);
    }

    // Mayor que nuestra referencia más grande
    const ultima = referencias[referencias.length - 1];

    if (areaUnidad >= ultima.area) {
      const precioPorM2 =
        ultima.precio / ultima.area;

      return areaUnidad * precioPorM2;
    }

    // Buscar referencias inferior y superior
    for (let i = 0; i < referencias.length - 1; i++) {
      const inferior = referencias[i];
      const superior = referencias[i + 1];

      if (
        areaUnidad >= inferior.area &&
        areaUnidad <= superior.area
      ) {
        // Si ambas referencias tienen prácticamente
        // la misma área, usamos el promedio.
        if (
          Math.abs(superior.area - inferior.area) <
          0.000001
        ) {
          return (
            (inferior.precio + superior.precio) / 2
          );
        }

        const proporcion =
          (areaUnidad - inferior.area) /
          (superior.area - inferior.area);

        return (
          inferior.precio +
          proporcion *
            (superior.precio - inferior.precio)
        );
      }
    }

    return 0;
  };

  const costoAutomaticoUnidad =
    calcularCostoEstimado();

  const costoProveedorUnidad =
    modoCosto === "automatico"
      ? costoAutomaticoUnidad
      : costoManual;

  const costoProveedorTotal =
    costoProveedorUnidad * cantidad;

  // =====================================================
  // COSTOS DEL TRABAJO
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

  const descripcion =
    `Rótulo PVC ${anchoCm}cm × ${altoCm}cm`;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="calculadora">
      <button
        className="back-btn"
        onClick={volverMenu}
      >
        ← Volver al menú
      </button>

      <h2>🧱 Rótulos PVC</h2>

      <p className="subtitulo">
        Calcula rótulos PVC utilizando referencias de
        costos reales de producción.
      </p>

      {/* MEDIDAS */}

      <label>Ancho del rótulo (cm)</label>

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

      <label>Alto del rótulo (cm)</label>

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
          <span>Área por unidad</span>

          <strong>
            {areaUnidad.toFixed(3)} m²
          </strong>
        </div>
      </div>

      {/* COSTO */}

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
          <h3>🏭 Costo de producción</h3>

          <div className="precio-card">
            <span>Tipo de referencia</span>

            <strong>
              {precioExacto
                ? precioExacto.observacion
                  ? "Referencia inferida"
                  : "Precio exacto registrado"
                : "Precio estimado"}
            </strong>
          </div>

          <div className="precio-card recomendado">
            <span>Costo por rótulo</span>

            <strong>
              ${costoAutomaticoUnidad.toFixed(2)}
            </strong>
          </div>

          {!precioExacto && (
            <p className="nota">
              Esta medida no está registrada entre las
              cotizaciones disponibles. Julikrom está
              calculando una estimación utilizando las
              referencias de producción conocidas.
            </p>
          )}

          {precioExacto?.observacion && (
            <p className="nota">
              El costo de esta medida fue obtenido a partir
              de una cotización conjunta y debe considerarse
              una referencia hasta confirmarlo individualmente.
            </p>
          )}
        </div>
      ) : (
        <>
          <label>Costo proveedor por rótulo</label>

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

      {/* CANTIDAD */}

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
              Math.floor(
                Number(e.target.value) || 1
              )
            )
          )
        }
      />

      {/* DISEÑO */}

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

      {/* INSTALACIÓN */}

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
          <label>Costo de instalación</label>

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

      {/* TRANSPORTE */}

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

      {/* EXTRAS */}

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

          <strong>
            {areaTotal.toFixed(3)} m²
          </strong>
        </div>

        <div className="precio-card">
          <span>Costo proveedor por unidad</span>

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

      {/* PRECIOS SUGERIDOS */}

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

      {/* CONSEJO */}

      <div className="consejo">
        <strong>💡 Consejo de Julikrom:</strong>

        <p>
          Cuando la medida coincide con una cotización
          registrada, Julikrom utiliza el costo real conocido.
          Para medidas diferentes genera una estimación basada
          en las referencias disponibles. Si recibes una
          cotización especial del proveedor, utiliza
          “Costo manual”.
        </p>
      </div>
    </div>
  );
}

export default RotulosPVC;