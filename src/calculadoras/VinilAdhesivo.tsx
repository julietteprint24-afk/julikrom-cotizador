import { useMemo, useState } from "react";
import { calcularPrecios } from "../utils/configCotizador";

type Props = {
  volverMenu: () => void;
};

type TipoVinil =
  | "normal"
  | "tornasol"
  | "reflectivo"
  | "personalizado";

type ConfigMaterial = {
  nombre: string;
  precio: number;
  largoCm: number;
  anchoCm: number;
  nota: string;
};

/*
  ============================================================
  REFERENCIAS DE MATERIALES
  ============================================================

  VINIL NORMAL
  Precio confirmado:
  $8.00 por rollo
  5 yardas x 30 cm

  5 yardas = 457.2 cm aproximadamente.

  TORNAsOL Y REFLECTIVO
  Se mantienen como referencias editables mientras se
  actualizan los costos con nuevas compras.
*/

const PRECIO_MINIMO_VENTA = 1;

const materialesBase: Record<
  Exclude<TipoVinil, "personalizado">,
  ConfigMaterial
> = {
  normal: {
    nombre: "Vinil adhesivo normal",
    precio: 8,
    largoCm: 457.2,
    anchoCm: 30,
    nota: "Rollo de 5 yardas × 30 cm.",
  },

  tornasol: {
    nombre: "Vinil tornasol",
    precio: 28,
    largoCm: 457.2,
    anchoCm: 30,
    nota: "Referencia histórica. Actualizar cuando exista una compra nueva.",
  },

  reflectivo: {
    nombre: "Vinil reflectivo",
    precio: 27.52,
    largoCm: 100,
    anchoCm: 40,
    nota: "Referencia aproximada de 1 m × 40 cm. Confirmar precio y medida en una compra nueva.",
  },
};

function VinilAdhesivo({ volverMenu }: Props) {
  /*
    ============================================================
    DATOS DEL TRABAJO
    ============================================================
  */

  const [anchoCm, setAnchoCm] = useState(30);
  const [altoCm, setAltoCm] = useState(20);

  const [cantidad, setCantidad] = useState(1);

  /*
    ============================================================
    MATERIAL
    ============================================================
  */

  const [tipoVinil, setTipoVinil] =
    useState<TipoVinil>("normal");

  /*
    Datos personalizados.

    También sirven para modificar temporalmente una referencia
    cuando el proveedor entrega un precio especial.
  */

  const [precioPersonalizado, setPrecioPersonalizado] =
    useState(8);

  const [largoPersonalizadoCm, setLargoPersonalizadoCm] =
    useState(457.2);

  const [anchoPersonalizadoCm, setAnchoPersonalizadoCm] =
    useState(30);

  /*
    ============================================================
    SERVICIOS Y EXTRAS
    ============================================================
  */

  const [diseno, setDiseno] = useState(3);

  const [instalacion, setInstalacion] =
    useState(false);

  const [costoInstalacion, setCostoInstalacion] =
    useState(10);

  const [transporte, setTransporte] = useState(0);

  const [extra, setExtra] = useState(0);

  /*
    ============================================================
    OBTENER DATOS DEL MATERIAL
    ============================================================
  */

  const material = useMemo<ConfigMaterial>(() => {
    if (tipoVinil === "personalizado") {
      return {
        nombre: "Vinil personalizado",
        precio: precioPersonalizado,
        largoCm: largoPersonalizadoCm,
        anchoCm: anchoPersonalizadoCm,
        nota: "Material ingresado manualmente.",
      };
    }

    return materialesBase[tipoVinil];
  }, [
    tipoVinil,
    precioPersonalizado,
    largoPersonalizadoCm,
    anchoPersonalizadoCm,
  ]);

  /*
    ============================================================
    CÁLCULO DEL MATERIAL
    ============================================================

    IMPORTANTE:

    No calculamos únicamente por área.

    El vinil tiene un ancho físico limitado.

    Julikrom intenta colocar la pieza en dos orientaciones:

    OPCIÓN A
    ancho del trabajo sobre ancho del rollo.

    OPCIÓN B
    alto del trabajo sobre ancho del rollo.

    Se selecciona automáticamente la orientación que consuma
    menos longitud de material.
  */

  const calculoMaterial = useMemo(() => {
    const anchoTrabajo = Math.max(0, anchoCm);
    const altoTrabajo = Math.max(0, altoCm);

    const cantidadSegura = Math.max(1, cantidad);

    const anchoRollo = Math.max(0, material.anchoCm);
    const largoRollo = Math.max(0, material.largoCm);

    const precioMaterial = Math.max(0, material.precio);

    const areaTrabajoUnitario =
      anchoTrabajo * altoTrabajo;

    const areaTrabajoTotal =
      areaTrabajoUnitario * cantidadSegura;

    const areaMaterialTotal =
      anchoRollo * largoRollo;

    /*
      --------------------------------------------
      ORIENTACIÓN 1
      --------------------------------------------
    */

    let longitudOpcion1 = Infinity;
    let piezasPorFila1 = 0;

    if (
      anchoTrabajo > 0 &&
      altoTrabajo > 0 &&
      anchoRollo > 0 &&
      anchoTrabajo <= anchoRollo
    ) {
      piezasPorFila1 = Math.floor(
        anchoRollo / anchoTrabajo
      );

      if (piezasPorFila1 > 0) {
        const filasNecesarias = Math.ceil(
          cantidadSegura / piezasPorFila1
        );

        longitudOpcion1 =
          filasNecesarias * altoTrabajo;
      }
    }

    /*
      --------------------------------------------
      ORIENTACIÓN 2
      --------------------------------------------

      Giramos la pieza 90 grados.
    */

    let longitudOpcion2 = Infinity;
    let piezasPorFila2 = 0;

    if (
      anchoTrabajo > 0 &&
      altoTrabajo > 0 &&
      anchoRollo > 0 &&
      altoTrabajo <= anchoRollo
    ) {
      piezasPorFila2 = Math.floor(
        anchoRollo / altoTrabajo
      );

      if (piezasPorFila2 > 0) {
        const filasNecesarias = Math.ceil(
          cantidadSegura / piezasPorFila2
        );

        longitudOpcion2 =
          filasNecesarias * anchoTrabajo;
      }
    }

    /*
      --------------------------------------------
      SELECCIONAR MEJOR ORIENTACIÓN
      --------------------------------------------
    */

    const puedeOpcion1 =
      Number.isFinite(longitudOpcion1);

    const puedeOpcion2 =
      Number.isFinite(longitudOpcion2);

    let longitudConsumida = 0;

    let orientacion =
      "La pieza supera el ancho del material";

    let piezasPorFila = 0;

    let piezaCabe = false;

    if (puedeOpcion1 || puedeOpcion2) {
      piezaCabe = true;

      if (
        puedeOpcion1 &&
        (!puedeOpcion2 ||
          longitudOpcion1 <= longitudOpcion2)
      ) {
        longitudConsumida = longitudOpcion1;
        piezasPorFila = piezasPorFila1;

        orientacion = "Orientación normal";
      } else {
        longitudConsumida = longitudOpcion2;
        piezasPorFila = piezasPorFila2;

        orientacion = "Pieza girada 90°";
      }
    }

    /*
      --------------------------------------------
      COSTO POR LONGITUD
      --------------------------------------------

      Si el material cuesta X por un rollo de determinada
      longitud, calculamos cuánto cuesta cada centímetro
      lineal del ancho completo del rollo.
    */

    const costoPorCmLineal =
      largoRollo > 0
        ? precioMaterial / largoRollo
        : 0;

    const costoMaterialConsumido =
      piezaCabe
        ? longitudConsumida * costoPorCmLineal
        : 0;

    /*
      --------------------------------------------
      DESPERDICIO
      --------------------------------------------

      Área físicamente consumida del rollo menos área real
      ocupada por las piezas.
    */

    const areaConsumida =
      longitudConsumida * anchoRollo;

    const desperdicioCm2 =
      piezaCabe
        ? Math.max(
            0,
            areaConsumida - areaTrabajoTotal
          )
        : 0;

    const porcentajeDesperdicio =
      areaConsumida > 0
        ? (desperdicioCm2 / areaConsumida) * 100
        : 0;

    /*
      --------------------------------------------
      ROLLOS / UNIDADES DE MATERIAL
      --------------------------------------------
    */

    const rollosEquivalentes =
      largoRollo > 0
        ? longitudConsumida / largoRollo
        : 0;

    const rollosCompletosNecesarios =
      largoRollo > 0 && piezaCabe
        ? Math.ceil(longitudConsumida / largoRollo)
        : 0;

    return {
      areaTrabajoUnitario,
      areaTrabajoTotal,

      areaMaterialTotal,

      longitudConsumida,

      costoPorCmLineal,

      costoMaterialConsumido,

      desperdicioCm2,

      porcentajeDesperdicio,

      rollosEquivalentes,

      rollosCompletosNecesarios,

      piezasPorFila,

      orientacion,

      piezaCabe,
    };
  }, [
    anchoCm,
    altoCm,
    cantidad,
    material,
  ]);

  /*
    ============================================================
    COSTOS GENERALES
    ============================================================
  */

  const costoInstalacionFinal =
    instalacion ? costoInstalacion : 0;

  const costoTotal =
    calculoMaterial.costoMaterialConsumido +
    diseno +
    costoInstalacionFinal +
    transporte +
    extra;

  const preciosCalculados = calcularPrecios(costoTotal);

  /*
    ============================================================
    PRECIO MÍNIMO DE VENTA
    ============================================================

    Regla comercial acordada:

    Ningún precio sugerido para vinil adhesivo puede quedar
    por debajo de $1.00, independientemente del material.

    Esto aplica a:
    - Vinil normal
    - Vinil tornasol
    - Vinil reflectivo
    - Vinil personalizado

    El cálculo real del material y de los costos se conserva.
    Únicamente se protege el precio final mostrado al cliente.
  */

  const precios = {
    minimo: Math.max(PRECIO_MINIMO_VENTA, preciosCalculados.minimo),
    recomendado: Math.max(
      PRECIO_MINIMO_VENTA,
      preciosCalculados.recomendado
    ),
    premium: Math.max(PRECIO_MINIMO_VENTA, preciosCalculados.premium),
  };

  /*
    ============================================================
    CAMBIO DE MATERIAL
    ============================================================
  */

  const seleccionarMaterial = (
    nuevoTipo: TipoVinil
  ) => {
    setTipoVinil(nuevoTipo);

    /*
      Cuando seleccionamos personalizado copiamos como punto
      de partida el material que estaba seleccionado.
    */

    if (
      nuevoTipo === "personalizado" &&
      tipoVinil !== "personalizado"
    ) {
      const actual = materialesBase[tipoVinil];

      setPrecioPersonalizado(actual.precio);

      setLargoPersonalizadoCm(actual.largoCm);

      setAnchoPersonalizadoCm(actual.anchoCm);
    }
  };

  return (
    <div className="calculadora">
      <button
        className="back-btn"
        onClick={volverMenu}
      >
        ← Volver al menú
      </button>

      <h2>✨ Vinil Adhesivo</h2>

      <p className="subtitulo">
        Calcula el consumo real del vinil tomando en cuenta
        las dimensiones del rollo y la orientación de las
        piezas.
      </p>

      {/* =====================================================
          TIPO DE VINIL
      ====================================================== */}

      <label>Tipo de vinil</label>

      <div className="selector-opciones">
        <button
          className={
            tipoVinil === "normal"
              ? "opcion activa"
              : "opcion"
          }
          onClick={() =>
            seleccionarMaterial("normal")
          }
        >
          Normal
        </button>

        <button
          className={
            tipoVinil === "tornasol"
              ? "opcion activa"
              : "opcion"
          }
          onClick={() =>
            seleccionarMaterial("tornasol")
          }
        >
          Tornasol
        </button>

        <button
          className={
            tipoVinil === "reflectivo"
              ? "opcion activa"
              : "opcion"
          }
          onClick={() =>
            seleccionarMaterial("reflectivo")
          }
        >
          Reflectivo
        </button>

        <button
          className={
            tipoVinil === "personalizado"
              ? "opcion activa"
              : "opcion"
          }
          onClick={() =>
            seleccionarMaterial("personalizado")
          }
        >
          Personalizado
        </button>
      </div>

      {/* =====================================================
          INFORMACIÓN DEL MATERIAL
      ====================================================== */}

      <div className="resultado">
        <h3>📦 Material seleccionado</h3>

        <div className="precio-card">
          <span>Material</span>
          <strong>{material.nombre}</strong>
        </div>

        <div className="precio-card">
          <span>Precio de referencia</span>
          <strong>
            ${material.precio.toFixed(2)}
          </strong>
        </div>

        <div className="precio-card">
          <span>Formato</span>
          <strong>
            {material.largoCm.toFixed(1)} ×{" "}
            {material.anchoCm.toFixed(1)} cm
          </strong>
        </div>

        <p className="nota">
          {material.nota}
        </p>
      </div>

      {/* =====================================================
          MATERIAL PERSONALIZADO
      ====================================================== */}

      {tipoVinil === "personalizado" && (
        <>
          <label>
            Precio del material ($)
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={precioPersonalizado}
            onChange={(e) =>
              setPrecioPersonalizado(
                Number(e.target.value)
              )
            }
          />

          <label>
            Largo total del material (cm)
          </label>

          <input
            type="number"
            min="0"
            step="0.1"
            value={largoPersonalizadoCm}
            onChange={(e) =>
              setLargoPersonalizadoCm(
                Number(e.target.value)
              )
            }
          />

          <label>
            Ancho del material (cm)
          </label>

          <input
            type="number"
            min="0"
            step="0.1"
            value={anchoPersonalizadoCm}
            onChange={(e) =>
              setAnchoPersonalizadoCm(
                Number(e.target.value)
              )
            }
          />
        </>
      )}

      <hr />

      {/* =====================================================
          MEDIDAS DEL TRABAJO
      ====================================================== */}

      <h3>📐 Medidas del trabajo</h3>

      <label>Ancho del trabajo (cm)</label>

      <input
        type="number"
        min="0"
        step="0.1"
        value={anchoCm}
        onChange={(e) =>
          setAnchoCm(Number(e.target.value))
        }
      />

      <label>Alto del trabajo (cm)</label>

      <input
        type="number"
        min="0"
        step="0.1"
        value={altoCm}
        onChange={(e) =>
          setAltoCm(Number(e.target.value))
        }
      />

      <label>Cantidad</label>

      <input
        type="number"
        min="1"
        step="1"
        value={cantidad}
        onChange={(e) =>
          setCantidad(
            Math.max(1, Number(e.target.value))
          )
        }
      />

      {/* =====================================================
          ADVERTENCIA DE ANCHO
      ====================================================== */}

      {!calculoMaterial.piezaCabe && (
        <div className="resultado">
          <h3>⚠️ Medida no compatible</h3>

          <p>
            La pieza no cabe dentro del ancho de{" "}
            <strong>
              {material.anchoCm.toFixed(1)} cm
            </strong>{" "}
            del material seleccionado, ni siquiera
            girándola 90°.
          </p>

          <p>
            Selecciona otro formato de vinil o utiliza
            la opción Personalizado.
          </p>
        </div>
      )}

      <hr />

      {/* =====================================================
          DISEÑO
      ====================================================== */}

      <label>Diseño / preparación ($)</label>

      <input
        type="number"
        min="0"
        step="0.01"
        value={diseno}
        onChange={(e) =>
          setDiseno(Number(e.target.value))
        }
      />

      {/* =====================================================
          INSTALACIÓN
      ====================================================== */}

      <label>Instalación</label>

      <div className="selector-opciones">
        <button
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
            Costo de instalación ($)
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={costoInstalacion}
            onChange={(e) =>
              setCostoInstalacion(
                Number(e.target.value)
              )
            }
          />
        </>
      )}

      {/* =====================================================
          TRANSPORTE
      ====================================================== */}

      <label>Transporte ($)</label>

      <input
        type="number"
        min="0"
        step="0.01"
        value={transporte}
        onChange={(e) =>
          setTransporte(Number(e.target.value))
        }
      />

      {/* =====================================================
          EXTRAS
      ====================================================== */}

      <label>Costos adicionales ($)</label>

      <input
        type="number"
        min="0"
        step="0.01"
        value={extra}
        onChange={(e) =>
          setExtra(Number(e.target.value))
        }
      />

      {/* =====================================================
          RESUMEN DE CONSUMO
      ====================================================== */}

      <div className="resultado">
        <h3>📐 Consumo de material</h3>

        <div className="precio-card">
          <span>Área de las piezas</span>

          <strong>
            {(
              calculoMaterial.areaTrabajoTotal /
              10000
            ).toFixed(3)}{" "}
            m²
          </strong>
        </div>

        <div className="precio-card">
          <span>Orientación utilizada</span>

          <strong>
            {calculoMaterial.orientacion}
          </strong>
        </div>

        {calculoMaterial.piezaCabe && (
          <>
            <div className="precio-card">
              <span>
                Piezas por fila
              </span>

              <strong>
                {calculoMaterial.piezasPorFila}
              </strong>
            </div>

            <div className="precio-card">
              <span>
                Longitud consumida
              </span>

              <strong>
                {calculoMaterial.longitudConsumida.toFixed(
                  1
                )}{" "}
                cm
              </strong>
            </div>

            <div className="precio-card">
              <span>
                Desperdicio estimado
              </span>

              <strong>
                {calculoMaterial.porcentajeDesperdicio.toFixed(
                  1
                )}
                %
              </strong>
            </div>
          </>
        )}
      </div>

      {/* =====================================================
          RESUMEN ECONÓMICO
      ====================================================== */}

      <div className="resultado">
        <h3>📊 Resumen</h3>

        <div className="precio-card">
          <span>Material</span>

          <strong>
            {material.nombre}
          </strong>
        </div>

        <div className="precio-card">
          <span>
            Costo del vinil consumido
          </span>

          <strong>
            $
            {calculoMaterial.costoMaterialConsumido.toFixed(
              2
            )}
          </strong>
        </div>

        <div className="precio-card">
          <span>
            Diseño / preparación
          </span>

          <strong>
            ${diseno.toFixed(2)}
          </strong>
        </div>

        {instalacion && (
          <div className="precio-card">
            <span>Instalación</span>

            <strong>
              $
              {costoInstalacionFinal.toFixed(
                2
              )}
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
            <span>
              Costos adicionales
            </span>

            <strong>
              ${extra.toFixed(2)}
            </strong>
          </div>
        )}

        <div className="precio-card">
          <span>Costo total real</span>

          <strong>
            ${costoTotal.toFixed(2)}
          </strong>
        </div>
      </div>

      {/* =====================================================
          PRECIOS SUGERIDOS
      ====================================================== */}

      {calculoMaterial.piezaCabe && (
        <div className="resultado">
          <h3>💰 Precios sugeridos</h3>

          <div className="precio-card">
            <span>Precio mínimo</span>

            <strong>
              ${precios.minimo.toFixed(2)}
            </strong>
          </div>

          <div className="precio-card recomendado">
            <span>
              Precio recomendado
            </span>

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
      )}

      {/* =====================================================
          CONSEJO
      ====================================================== */}

      <div className="consejo">
        <strong>
          💡 Consejo de Julikrom:
        </strong>

        <p>
          Julikrom calcula el consumo según el ancho
          físico del material y busca automáticamente
          la orientación que aprovecha mejor el vinil.
          El precio del vinil normal está basado en el
          rollo actual de $8.00 por 5 yardas × 30 cm.
          Las referencias de tornasol y reflectivo deben
          actualizarse cuando exista una compra nueva. Ningún
          precio sugerido de venta baja de $1.00, aunque el
          consumo calculado del material sea menor.
        </p>
      </div>
    </div>
  );
}

export default VinilAdhesivo;