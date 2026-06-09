import { useEffect, useState } from "react";
import { calcularPrecios, obtenerConfiguracion } from "../utils/configCotizador";

type Props = {
  volverMenu: () => void;
};

type Vehiculo = "mazda" | "moto" | "otro";

const vehiculosBase = {
  mazda: {
    nombre: "Mazda Tribute 2008",
    rendimientoKmGalon: 28,
  },
  moto: {
    nombre: "AKT TT 200",
    rendimientoKmGalon: 95,
  },
};

function Transporte({ volverMenu }: Props) {
  const config = obtenerConfiguracion();

  const [vehiculo, setVehiculo] = useState<Vehiculo>("mazda");
  const [nombreOtroVehiculo, setNombreOtroVehiculo] = useState("Otro vehículo");
  const [rendimientoOtro, setRendimientoOtro] = useState(40);

  const [precioGasolina, setPrecioGasolina] = useState(config.combustible);
  const [kilometros, setKilometros] = useState(10);
  const [empleados, setEmpleados] = useState(1);
  const [precioPlato, setPrecioPlato] = useState(3);
  const [parqueoPeajes, setParqueoPeajes] = useState(0);
  const [extras, setExtras] = useState(0);

  useEffect(() => {
    const configuracionActual = obtenerConfiguracion();
    setPrecioGasolina(configuracionActual.combustible);
  }, []);

  const rendimiento =
    vehiculo === "otro"
      ? rendimientoOtro
      : vehiculosBase[vehiculo].rendimientoKmGalon;

  const nombreVehiculo =
    vehiculo === "otro" ? nombreOtroVehiculo : vehiculosBase[vehiculo].nombre;

  const galonesEstimados = rendimiento > 0 ? kilometros / rendimiento : 0;
  const costoGasolina = galonesEstimados * precioGasolina;
  const costoAlimentacion = empleados * precioPlato;

  const costoTotal =
    costoGasolina + costoAlimentacion + parqueoPeajes + extras;

  const precios = calcularPrecios(costoTotal);

  return (
    <div className="calculadora">
      <button className="back-btn" onClick={volverMenu}>
        ← Volver al menú
      </button>

      <h2>🚗 Transporte</h2>

      <p className="subtitulo">
        Calcula transporte según vehículo, gasolina, alimentación y gastos
        adicionales.
      </p>

      <label>Vehículo</label>
      <div className="selector-opciones">
        <button
          className={vehiculo === "mazda" ? "opcion activa" : "opcion"}
          onClick={() => setVehiculo("mazda")}
        >
          Mazda
        </button>

        <button
          className={vehiculo === "moto" ? "opcion activa" : "opcion"}
          onClick={() => setVehiculo("moto")}
        >
          Moto
        </button>

        <button
          className={vehiculo === "otro" ? "opcion activa" : "opcion"}
          onClick={() => setVehiculo("otro")}
        >
          Otro
        </button>
      </div>

      {vehiculo === "otro" && (
        <>
          <label>Nombre del vehículo</label>
          <input
            type="text"
            value={nombreOtroVehiculo}
            onChange={(e) => setNombreOtroVehiculo(e.target.value)}
          />

          <label>Rendimiento estimado km/galón</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={rendimientoOtro}
            onChange={(e) => setRendimientoOtro(Number(e.target.value))}
          />
        </>
      )}

      <p className="nota">
        Vehículo seleccionado: {nombreVehiculo} · Rendimiento estimado:{" "}
        {rendimiento.toFixed(2)} km/galón.
      </p>

      <label>Precio actual de gasolina premium</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={precioGasolina}
        onChange={(e) => setPrecioGasolina(Number(e.target.value))}
      />

      <label>Kilómetros totales ida y vuelta</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={kilometros}
        onChange={(e) => setKilometros(Number(e.target.value))}
      />

      <label>Número de empleados</label>
      <input
        type="number"
        min="0"
        value={empleados}
        onChange={(e) => setEmpleados(Number(e.target.value))}
      />

      <label>Precio del plato por empleado</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={precioPlato}
        onChange={(e) => setPrecioPlato(Number(e.target.value))}
      />

      <label>Parqueo / peajes</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={parqueoPeajes}
        onChange={(e) => setParqueoPeajes(Number(e.target.value))}
      />

      <label>Costos adicionales</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={extras}
        onChange={(e) => setExtras(Number(e.target.value))}
      />

      <div className="resultado">
        <h3>📊 Resumen de costos</h3>

        <div className="precio-card">
          <span>Galones estimados</span>
          <strong>{galonesEstimados.toFixed(2)}</strong>
        </div>

        <div className="precio-card">
          <span>Costo gasolina</span>
          <strong>${costoGasolina.toFixed(2)}</strong>
        </div>

        <div className="precio-card">
          <span>Alimentación</span>
          <strong>${costoAlimentacion.toFixed(2)}</strong>
        </div>

        <div className="precio-card">
          <span>Costo total real</span>
          <strong>${costoTotal.toFixed(2)}</strong>
        </div>
      </div>

      <div className="resultado">
        <h3>💰 Precio sugerido de transporte</h3>

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
          Para otro vehículo, escribe su rendimiento aproximado en km/galón.
          Julikrom calculará automáticamente el consumo según la distancia.
        </p>
      </div>
    </div>
  );
}

export default Transporte;