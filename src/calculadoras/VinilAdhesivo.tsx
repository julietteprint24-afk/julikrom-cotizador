import { useState } from "react";
import { calcularPrecios } from "../utils/configCotizador";

type Props = {
  volverMenu: () => void;
};

function VinilAdhesivo({ volverMenu }: Props) {
  const [anchoCm, setAnchoCm] = useState(100);
  const [altoCm, setAltoCm] = useState(50);

  const [precioRollo, setPrecioRollo] = useState(8);

  const [largoRolloCm, setLargoRolloCm] = useState(457);
  const [anchoRolloCm, setAnchoRolloCm] = useState(30);

  const [cantidad, setCantidad] = useState(1);

  const [diseno, setDiseno] = useState(3);

  const [instalacion, setInstalacion] = useState(false);
  const [costoInstalacion, setCostoInstalacion] = useState(10);

  const [transporte, setTransporte] = useState(0);

  const [extra, setExtra] = useState(0);

  const areaTrabajo = anchoCm * altoCm * cantidad;
  const areaRollo = largoRolloCm * anchoRolloCm;

  const costoPorCm2 =
    areaRollo > 0 ? precioRollo / areaRollo : 0;

  const costoVinil = areaTrabajo * costoPorCm2;

  const costoInstalacionFinal = instalacion
    ? costoInstalacion
    : 0;

  const costoTotal =
    costoVinil +
    diseno +
    costoInstalacionFinal +
    transporte +
    extra;

  const precios = calcularPrecios(costoTotal);

  return (
    <div className="calculadora">
      <button className="back-btn" onClick={volverMenu}>
        ← Volver al menú
      </button>

      <h2>✨ Vinil Adhesivo</h2>

      <p className="subtitulo">
        Calcula automáticamente el consumo del rollo de vinil.
      </p>

      <label>Ancho del trabajo (cm)</label>
      <input
        type="number"
        value={anchoCm}
        onChange={(e) => setAnchoCm(Number(e.target.value))}
      />

      <label>Alto del trabajo (cm)</label>
      <input
        type="number"
        value={altoCm}
        onChange={(e) => setAltoCm(Number(e.target.value))}
      />

      <label>Cantidad</label>
      <input
        type="number"
        min="1"
        value={cantidad}
        onChange={(e) => setCantidad(Number(e.target.value))}
      />

      <hr />

      <label>Precio del rollo</label>
      <input
        type="number"
        step="0.01"
        value={precioRollo}
        onChange={(e) => setPrecioRollo(Number(e.target.value))}
      />

      <label>Largo del rollo (cm)</label>
      <input
        type="number"
        value={largoRolloCm}
        onChange={(e) => setLargoRolloCm(Number(e.target.value))}
      />

      <label>Ancho del rollo (cm)</label>
      <input
        type="number"
        value={anchoRolloCm}
        onChange={(e) => setAnchoRolloCm(Number(e.target.value))}
      />

      <hr />

      <label>Diseño / preparación</label>
      <input
        type="number"
        step="0.01"
        value={diseno}
        onChange={(e) => setDiseno(Number(e.target.value))}
      />

      <label>Instalación</label>

      <div className="selector-opciones">
        <button
          className={!instalacion ? "opcion activa" : "opcion"}
          onClick={() => setInstalacion(false)}
        >
          Sin instalación
        </button>

        <button
          className={instalacion ? "opcion activa" : "opcion"}
          onClick={() => setInstalacion(true)}
        >
          Con instalación
        </button>
      </div>

      {instalacion && (
        <>
          <label>Costo instalación</label>
          <input
            type="number"
            step="0.01"
            value={costoInstalacion}
            onChange={(e) =>
              setCostoInstalacion(Number(e.target.value))
            }
          />
        </>
      )}

      <label>Transporte</label>
      <input
        type="number"
        step="0.01"
        value={transporte}
        onChange={(e) => setTransporte(Number(e.target.value))}
      />

      <label>Costos adicionales</label>
      <input
        type="number"
        step="0.01"
        value={extra}
        onChange={(e) => setExtra(Number(e.target.value))}
      />

      <div className="resultado">
        <h3>📊 Resumen</h3>

        <div className="precio-card">
          <span>Área del trabajo</span>
          <strong>{areaTrabajo.toFixed(0)} cm²</strong>
        </div>

        <div className="precio-card">
          <span>Costo del vinil usado</span>
          <strong>${costoVinil.toFixed(2)}</strong>
        </div>

        <div className="precio-card">
          <span>Costo total real</span>
          <strong>${costoTotal.toFixed(2)}</strong>
        </div>
      </div>

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

      <div className="consejo">
        <strong>💡 Consejo de Julikrom:</strong>

        <p>
          Puedes cambiar el precio del rollo para vinil normal,
          reflectivo, tornasol o cualquier otro material sin modificar
          la calculadora.
        </p>
      </div>
    </div>
  );
}

export default VinilAdhesivo;