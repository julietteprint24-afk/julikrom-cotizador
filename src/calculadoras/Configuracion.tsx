import { useEffect, useState } from "react";
import {
  configuracionBase,
  obtenerConfiguracion,
  type ConfiguracionCotizador,
} from "../utils/configCotizador";

type Props = {
  volverMenu: () => void;
};

function Configuracion({ volverMenu }: Props) {
  const [config, setConfig] =
    useState<ConfiguracionCotizador>(configuracionBase);

  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    setConfig(obtenerConfiguracion());
  }, []);

  const actualizarCampo = (
    campo: keyof ConfiguracionCotizador,
    valor: number
  ) => {
    setConfig((configActual) => ({
      ...configActual,
      [campo]: valor,
    }));

    setGuardado(false);
  };

  const guardarConfiguracion = () => {
    localStorage.setItem(
      "julikrom_configuracion",
      JSON.stringify(config)
    );

    setGuardado(true);
  };

  const restaurarValores = () => {
    setConfig(configuracionBase);

    localStorage.setItem(
      "julikrom_configuracion",
      JSON.stringify(configuracionBase)
    );

    setGuardado(true);
  };

  return (
    <div className="calculadora">
      <button
        className="back-btn"
        onClick={volverMenu}
      >
        ← Volver al menú
      </button>

      <h2>⚙️ Configuración</h2>

      <p className="subtitulo">
        Administra los parámetros generales utilizados por
        Julikrom Cotizador.
      </p>

      {/* =====================================================
          PARÁMETROS GENERALES
      ====================================================== */}

      <div className="config-section">
        <h3>📊 Parámetros generales</h3>

        <p className="subtitulo">
          Estos valores son compartidos por las calculadoras
          que utilizan costos generales de Julikrom.
        </p>

        {/* COMBUSTIBLE */}

        <label>
          Precio gasolina / combustible ($)
        </label>

        <input
          type="number"
          min="0"
          step="0.01"
          value={config.combustible}
          onChange={(e) =>
            actualizarCampo(
              "combustible",
              Math.max(0, Number(e.target.value))
            )
          }
        />

        <p className="nota">
          Utilizado como referencia para cálculos de
          transporte cuando corresponda.
        </p>
      </div>

      {/* =====================================================
          MÁRGENES DE RENTABILIDAD
      ====================================================== */}

      <div className="config-section">
        <h3>💰 Márgenes de rentabilidad</h3>

        <p className="subtitulo">
          Julikrom utiliza estos porcentajes para generar
          los tres niveles de precio sugerido.
        </p>

        {/* MARGEN MÍNIMO */}

        <label>Margen mínimo (%)</label>

        <input
          type="number"
          min="0"
          step="1"
          value={config.margenMinimo}
          onChange={(e) =>
            actualizarCampo(
              "margenMinimo",
              Math.max(0, Number(e.target.value))
            )
          }
        />

        <p className="nota">
          Precio mínimo recomendado para mantener una
          rentabilidad básica.
        </p>

        {/* MARGEN RECOMENDADO */}

        <label>Margen recomendado (%)</label>

        <input
          type="number"
          min="0"
          step="1"
          value={config.margenRecomendado}
          onChange={(e) =>
            actualizarCampo(
              "margenRecomendado",
              Math.max(0, Number(e.target.value))
            )
          }
        />

        <p className="nota">
          Margen principal utilizado como referencia
          comercial por Julikrom.
        </p>

        {/* MARGEN PREMIUM */}

        <label>Margen premium (%)</label>

        <input
          type="number"
          min="0"
          step="1"
          value={config.margenPremium}
          onChange={(e) =>
            actualizarCampo(
              "margenPremium",
              Math.max(0, Number(e.target.value))
            )
          }
        />

        <p className="nota">
          Utilizado para trabajos con mayor valor agregado,
          urgencia o complejidad.
        </p>
      </div>

      {/* =====================================================
          SERVICIOS GENERALES
      ====================================================== */}

      <div className="config-section">
        <h3>🛠️ Servicios generales</h3>

        <p className="subtitulo">
          Valores base que pueden utilizarse como referencia
          para diseño e instalación.
        </p>

        {/* DISEÑO */}

        <label>Costo por hora de diseño ($)</label>

        <input
          type="number"
          min="0"
          step="0.01"
          value={config.costoHoraDiseno}
          onChange={(e) =>
            actualizarCampo(
              "costoHoraDiseno",
              Math.max(0, Number(e.target.value))
            )
          }
        />

        <p className="nota">
          Referencia interna para valorar tiempo de diseño
          y preparación de artes.
        </p>

        {/* INSTALACIÓN */}

        <label>Costo base de instalación ($)</label>

        <input
          type="number"
          min="0"
          step="0.01"
          value={config.costoInstalacion}
          onChange={(e) =>
            actualizarCampo(
              "costoInstalacion",
              Math.max(0, Number(e.target.value))
            )
          }
        />

        <p className="nota">
          Valor base de referencia. Cada calculadora puede
          permitir modificarlo según el trabajo.
        </p>
      </div>

      {/* =====================================================
          REFERENCIAS DE PRODUCCIÓN
      ====================================================== */}

      <div className="config-section">
        <h3>🏭 Referencias de producción</h3>

        <p className="subtitulo">
          Las calculadoras especializadas utilizan actualmente
          sus propias tablas y referencias de producción.
        </p>

        <div className="resultado">
          <div className="precio-card">
            <span>🖨️ Banner</span>
            <strong>Xtremo Digital</strong>
          </div>

          <p className="nota">
            Calculado automáticamente por medidas y tarifas
            de referencia del proveedor.
          </p>

          <div className="precio-card">
            <span>🎨 Vinil imprimible</span>
            <strong>Xtremo Digital</strong>
          </div>

          <p className="nota">
            Precio base por m² con opciones de laminado
            y troquelado.
          </p>

          <div className="precio-card">
            <span>🧱 Rótulos PVC</span>
            <strong>Tabla de trabajos reales</strong>
          </div>

          <p className="nota">
            Julikrom utiliza precios registrados por medida
            y estima automáticamente tamaños especiales.
          </p>

          <div className="precio-card">
            <span>🧩 Figuras PVC</span>
            <strong>Xtremo Digital</strong>
          </div>

          <p className="nota">
            Utiliza la tabla oficial de medidas disponible
            y genera estimaciones para medidas especiales.
          </p>

          <div className="precio-card">
            <span>✨ Vinil adhesivo</span>
            <strong>Cálculo por consumo</strong>
          </div>

          <p className="nota">
            Calcula el aprovechamiento físico del rollo,
            orientación, desperdicio y costo consumido.
          </p>
        </div>

        <p className="nota">
          ℹ️ Los precios específicos de producción se
          administrarán posteriormente desde una sección
          especializada de proveedores y materiales.
        </p>
      </div>

      {/* =====================================================
          VALORES ACTUALES
      ====================================================== */}

      <div className="resultado">
        <h3>📋 Configuración actual</h3>

        <div className="precio-card">
          <span>Combustible</span>
          <strong>
            ${config.combustible.toFixed(2)}
          </strong>
        </div>

        <div className="precio-card">
          <span>Margen mínimo</span>
          <strong>
            {config.margenMinimo.toFixed(0)}%
          </strong>
        </div>

        <div className="precio-card recomendado">
          <span>Margen recomendado</span>
          <strong>
            {config.margenRecomendado.toFixed(0)}%
          </strong>
        </div>

        <div className="precio-card">
          <span>Margen premium</span>
          <strong>
            {config.margenPremium.toFixed(0)}%
          </strong>
        </div>

        <div className="precio-card">
          <span>Hora de diseño</span>
          <strong>
            ${config.costoHoraDiseno.toFixed(2)}
          </strong>
        </div>

        <div className="precio-card">
          <span>Instalación base</span>
          <strong>
            ${config.costoInstalacion.toFixed(2)}
          </strong>
        </div>
      </div>

      {/* =====================================================
          ACCIONES
      ====================================================== */}

      <button
        className="main-btn"
        onClick={guardarConfiguracion}
      >
        💾 Guardar configuración
      </button>

      <button
        className="secondary-btn"
        onClick={restaurarValores}
      >
        ↺ Restaurar valores base
      </button>

      {guardado && (
        <div className="resultado">
          <h3>✅ Configuración guardada</h3>

          <p>
            Julikrom utilizará estos parámetros en las
            próximas cotizaciones.
          </p>
        </div>
      )}

      {/* =====================================================
          INFORMACIÓN
      ====================================================== */}

      <div className="consejo">
        <strong>💡 Consejo de Julikrom:</strong>

        <p>
          Los márgenes configurados aquí se aplican sobre
          el costo real calculado por cada módulo. Las
          calculadoras de Banner, Vinil Imprimible, PVC y
          Vinil Adhesivo utilizan sus propias referencias
          especializadas de producción.
        </p>
      </div>
    </div>
  );
}

export default Configuracion;