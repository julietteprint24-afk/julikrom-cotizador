import { useState } from "react";

type Props = {
  volverMenu: () => void;
};

function CotizacionRapida({ volverMenu }: Props) {
  const [descripcion, setDescripcion] = useState("Producto personalizado");
  const [cantidad, setCantidad] = useState(1);
  const [costoUnitario, setCostoUnitario] = useState(5);
  const [ganancia, setGanancia] = useState(35);

  const costoTotal = cantidad * costoUnitario;
  const utilidad = costoTotal * (ganancia / 100);
  const precioFinal = costoTotal + utilidad;

  return (
    <div className="calculadora">
      <button className="back-btn" onClick={volverMenu}>
        ← Volver al menú
      </button>

      <h2>🧾 Cotización Rápida</h2>

      <p className="subtitulo">
        Calcula un precio rápido usando costo, cantidad y porcentaje de ganancia.
      </p>

      <label>Descripción</label>
      <input
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <label>Cantidad</label>
      <input
        type="number"
        min="1"
        value={cantidad}
        onChange={(e) => setCantidad(Number(e.target.value))}
      />

      <label>Costo unitario</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={costoUnitario}
        onChange={(e) => setCostoUnitario(Number(e.target.value))}
      />

      <label>Ganancia deseada (%)</label>
      <input
        type="number"
        min="0"
        step="1"
        value={ganancia}
        onChange={(e) => setGanancia(Number(e.target.value))}
      />

      <div className="resultado">
        <h3>📊 Resultado</h3>

        <div className="precio-card">
          <span>Producto</span>
          <strong>{descripcion}</strong>
        </div>

        <div className="precio-card">
          <span>Costo total</span>
          <strong>${costoTotal.toFixed(2)}</strong>
        </div>

        <div className="precio-card">
          <span>Ganancia estimada</span>
          <strong>${utilidad.toFixed(2)}</strong>
        </div>

        <div className="precio-card recomendado">
          <span>Precio final sugerido</span>
          <strong>${precioFinal.toFixed(2)}</strong>
        </div>
      </div>

      <div className="consejo">
        <strong>💡 Consejo de Julikrom:</strong>
        <p>
          Esta opción es solo para cálculos rápidos o productos especiales que
          no estén en las demás calculadoras.
        </p>
      </div>
    </div>
  );
}

export default CotizacionRapida;