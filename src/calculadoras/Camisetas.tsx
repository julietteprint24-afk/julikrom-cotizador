import { useState } from "react";
import { calcularPrecios } from "../utils/configCotizador";

type Props = {
  volverMenu: () => void;
};

type TipoCamiseta = "sublimada" | "estampada" | "dtf";

const preciosBase = {
  sublimada: {
    nombre: "Sublimada",
    costoBase: 6,
  },
  estampada: {
    nombre: "Estampada",
    costoBase: 5,
  },
  dtf: {
    nombre: "DTF / Transfer",
    costoBase: 7,
  },
};

function Camisetas({ volverMenu }: Props) {
  const [tipo, setTipo] = useState<TipoCamiseta>("sublimada");
  const [cantidad, setCantidad] = useState(1);
  const [costoProveedor, setCostoProveedor] = useState(
    preciosBase.sublimada.costoBase
  );

  const [frente, setFrente] = useState(true);
  const [espalda, setEspalda] = useState(false);
  const [manga, setManga] = useState(false);

  const [diseno, setDiseno] = useState(3);
  const [extra, setExtra] = useState(0);

  const cambiarTipo = (nuevoTipo: TipoCamiseta) => {
    setTipo(nuevoTipo);
    setCostoProveedor(preciosBase[nuevoTipo].costoBase);
  };

  const costoUbicaciones =
    (frente ? 1.5 : 0) +
    (espalda ? 1.5 : 0) +
    (manga ? 1 : 0);

  const costoUnitario =
    costoProveedor + costoUbicaciones;

  const costoTotal =
    costoUnitario * cantidad +
    diseno +
    extra;

  const precios = calcularPrecios(costoTotal);

  return (
    <div className="calculadora">
      <button
        className="back-btn"
        onClick={volverMenu}
      >
        ← Volver al menú
      </button>

      <h2>👕 Camisetas</h2>

      <p className="subtitulo">
        Calcula precios para camisetas
        sublimadas, estampadas o DTF.
      </p>

      <label>Tipo de camiseta</label>

      <div className="selector-opciones">
        <button
          className={
            tipo === "sublimada"
              ? "opcion activa"
              : "opcion"
          }
          onClick={() =>
            cambiarTipo("sublimada")
          }
        >
          Sublimada
        </button>

        <button
          className={
            tipo === "estampada"
              ? "opcion activa"
              : "opcion"
          }
          onClick={() =>
            cambiarTipo("estampada")
          }
        >
          Estampada
        </button>

        <button
          className={
            tipo === "dtf"
              ? "opcion activa"
              : "opcion"
          }
          onClick={() => cambiarTipo("dtf")}
        >
          DTF
        </button>
      </div>

      <label>
        Costo proveedor por camiseta
      </label>

      <input
        type="number"
        min="0"
        step="0.01"
        value={costoProveedor}
        onChange={(e) =>
          setCostoProveedor(
            Number(e.target.value)
          )
        }
      />

      <label>Cantidad</label>

      <input
        type="number"
        min="1"
        value={cantidad}
        onChange={(e) =>
          setCantidad(Number(e.target.value))
        }
      />

      <label>Áreas de impresión</label>

      <div className="check-grid">
        <button
          className={
            frente
              ? "check-btn activo"
              : "check-btn"
          }
          onClick={() =>
            setFrente(!frente)
          }
        >
          Frente
        </button>

        <button
          className={
            espalda
              ? "check-btn activo"
              : "check-btn"
          }
          onClick={() =>
            setEspalda(!espalda)
          }
        >
          Espalda
        </button>

        <button
          className={
            manga
              ? "check-btn activo"
              : "check-btn"
          }
          onClick={() =>
            setManga(!manga)
          }
        >
          Manga
        </button>
      </div>

      <label>Diseño / preparación</label>

      <input
        type="number"
        min="0"
        step="0.01"
        value={diseno}
        onChange={(e) =>
          setDiseno(Number(e.target.value))
        }
      />

      <label>Costos adicionales</label>

      <input
        type="number"
        min="0"
        step="0.01"
        value={extra}
        onChange={(e) =>
          setExtra(Number(e.target.value))
        }
      />

      <div className="resultado">
        <h3>📊 Resumen</h3>

        <div className="precio-card">
          <span>
            Costo unitario estimado
          </span>
          <strong>
            ${costoUnitario.toFixed(2)}
          </strong>
        </div>

        <div className="precio-card">
          <span>Costo total real</span>
          <strong>
            ${costoTotal.toFixed(2)}
          </strong>
        </div>
      </div>

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

      <div className="consejo">
        <strong>
          💡 Consejo de Julikrom:
        </strong>

        <p>
          Usa el costo real de tu
          proveedor. Julikrom aplicará
          automáticamente los márgenes
          configurados en Ajustes.
        </p>
      </div>
    </div>
  );
}

export default Camisetas;