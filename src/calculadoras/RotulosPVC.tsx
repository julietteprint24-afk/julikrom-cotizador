import { useState } from "react";
import { calcularPrecios } from "../utils/configCotizador";

type Props = {
  volverMenu: () => void;
};

function RotulosPVC({ volverMenu }: Props) {
  const [descripcion, setDescripcion] = useState("Rótulo PVC 45cm x 35cm");
  const [costoProveedor, setCostoProveedor] = useState(6);
  const [cantidad, setCantidad] = useState(1);
  const [diseno, setDiseno] = useState(3);
  const [instalacion, setInstalacion] = useState(false);
  const [costoInstalacion, setCostoInstalacion] = useState(10);
  const [transporte, setTransporte] = useState(0);
  const [extra, setExtra] = useState(0);

  const costoProveedorTotal = costoProveedor * cantidad;
  const costoInstalacionFinal = instalacion ? costoInstalacion : 0;

  const costoTotal =
    costoProveedorTotal + diseno + costoInstalacionFinal + transporte + extra;

  const precios = calcularPrecios(costoTotal);

  return (
    <div className="calculadora">
      <button className="back-btn" onClick={volverMenu}>
        ← Volver al menú
      </button>

      <h2>🧱 Rótulos PVC</h2>

      <p className="subtitulo">
        Calcula precios usando el costo real que te da el proveedor.
      </p>

      <label>Descripción del trabajo</label>
      <input
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <label>Costo proveedor por unidad</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={costoProveedor}
        onChange={(e) => setCostoProveedor(Number(e.target.value))}
      />

      <label>Cantidad</label>
      <input
        type="number"
        min="1"
        value={cantidad}
        onChange={(e) => setCantidad(Number(e.target.value))}
      />

      <label>Diseño / preparación</label>
      <input
        type="number"
        min="0"
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
          <label>Costo de instalación</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={costoInstalacion}
            onChange={(e) => setCostoInstalacion(Number(e.target.value))}
          />
        </>
      )}

      <label>Transporte</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={transporte}
        onChange={(e) => setTransporte(Number(e.target.value))}
      />

      <label>Costos adicionales</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={extra}
        onChange={(e) => setExtra(Number(e.target.value))}
      />

      <div className="resultado">
        <h3>📊 Resumen</h3>

        <div className="precio-card">
          <span>Trabajo</span>
          <strong>{descripcion}</strong>
        </div>

        <div className="precio-card">
          <span>Costo proveedor total</span>
          <strong>${costoProveedorTotal.toFixed(2)}</strong>
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
          Usa el costo exacto del proveedor. Julikrom aplicará los márgenes
          guardados en Configuración.
        </p>
      </div>
    </div>
  );
}

export default RotulosPVC;