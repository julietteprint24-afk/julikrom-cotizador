import { useState } from "react";
import { calcularPrecios, obtenerConfiguracion } from "../utils/configCotizador";

type Props = {
  volver: () => void;
};

type Complejidad = "basico" | "medio" | "avanzado";

type ServicioDiseno = {
  nombre: string;
  horasBase: number;
};

const servicios: ServicioDiseno[] = [
  { nombre: "Logo básico", horasBase: 2 },
  { nombre: "Logo profesional", horasBase: 5 },
  { nombre: "Diseño para banner", horasBase: 1 },
  { nombre: "Spot para redes sociales", horasBase: 1 },
  { nombre: "Flyer sencillo", horasBase: 1 },
  { nombre: "Diseño para camiseta", horasBase: 1 },
  { nombre: "Diseño para taza", horasBase: 0.75 },
  { nombre: "Restauración fotográfica", horasBase: 2 },
  { nombre: "Menú / carta sencilla", horasBase: 1 },
  { nombre: "Menú / carta profesional", horasBase: 2 },
  { nombre: "Carnet PVC / credencial", horasBase: 0.75 },
  { nombre: "Tarjeta de presentación", horasBase: 1 },
  { nombre: "Otro diseño personalizado", horasBase: 2 },
];

const multiplicadores: Record<Complejidad, number> = {
  basico: 1,
  medio: 1.35,
  avanzado: 1.75,
};

function DisenoGrafico({ volver }: Props) {
  const config = obtenerConfiguracion();

  const [servicio, setServicio] = useState<ServicioDiseno>(servicios[0]);
  const [cantidad, setCantidad] = useState(1);
  const [complejidad, setComplejidad] = useState<Complejidad>("basico");
  const [costoHora, setCostoHora] = useState(config.costoHoraDiseno);
  const [extra, setExtra] = useState(0);

  const horasTotales =
    servicio.horasBase * multiplicadores[complejidad] * cantidad;

  const costoDiseno = horasTotales * costoHora;
  const costoTotal = costoDiseno + extra;

  const precios = calcularPrecios(costoTotal);

  const textoComplejidad = {
    basico: "Diseño sencillo, pocos cambios y estructura simple.",
    medio: "Diseño con más detalles, ajustes y mejor presentación visual.",
    avanzado: "Diseño elaborado, urgente, corporativo o con varias revisiones.",
  };

  return (
    <div className="calculadora">
      <button className="back-btn" onClick={volver}>
        ← Volver al menú
      </button>

      <h2>🎨 Diseño Gráfico</h2>

      <p className="subtitulo">
        Calcula servicios creativos usando costo por hora y márgenes globales.
      </p>

      <label>Tipo de diseño</label>
      <select
        value={servicio.nombre}
        onChange={(e) => {
          const seleccionado = servicios.find(
            (s) => s.nombre === e.target.value
          );

          if (seleccionado) {
            setServicio(seleccionado);
          }
        }}
      >
        {servicios.map((item) => (
          <option key={item.nombre} value={item.nombre}>
            {item.nombre}
          </option>
        ))}
      </select>

      <label>Complejidad del diseño</label>
      <div className="selector-opciones">
        <button
          className={complejidad === "basico" ? "opcion activa" : "opcion"}
          onClick={() => setComplejidad("basico")}
        >
          Básico
        </button>

        <button
          className={complejidad === "medio" ? "opcion activa" : "opcion"}
          onClick={() => setComplejidad("medio")}
        >
          Medio
        </button>

        <button
          className={complejidad === "avanzado" ? "opcion activa" : "opcion"}
          onClick={() => setComplejidad("avanzado")}
        >
          Avanzado
        </button>
      </div>

      <p className="nota">{textoComplejidad[complejidad]}</p>

      <label>Cantidad de diseños</label>
      <input
        type="number"
        min="1"
        value={cantidad}
        onChange={(e) => setCantidad(Number(e.target.value))}
      />

      <label>Costo por hora de diseño</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={costoHora}
        onChange={(e) => setCostoHora(Number(e.target.value))}
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
          <span>Horas estimadas</span>
          <strong>{horasTotales.toFixed(2)} h</strong>
        </div>

        <div className="precio-card">
          <span>Costo base de diseño</span>
          <strong>${costoDiseno.toFixed(2)}</strong>
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
          Puedes cambiar el costo por hora desde Configuración. Para trabajos
          sencillos usa el recomendado; para urgentes o corporativos usa el
          premium.
        </p>
      </div>
    </div>
  );
}

export default DisenoGrafico;