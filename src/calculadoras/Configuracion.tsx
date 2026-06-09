import { useEffect, useState } from "react";

type Props = {
  volverMenu: () => void;
};

type ConfiguracionCotizador = {
  combustible: number;
  margenMinimo: number;
  margenRecomendado: number;
  margenPremium: number;
  costoHoraDiseno: number;
  costoInstalacion: number;
};

const configuracionInicial: ConfiguracionCotizador = {
  combustible: 4.25,
  margenMinimo: 20,
  margenRecomendado: 35,
  margenPremium: 50,
  costoHoraDiseno: 5,
  costoInstalacion: 10,
};

function Configuracion({ volverMenu }: Props) {
  const [config, setConfig] = useState<ConfiguracionCotizador>(configuracionInicial);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const datosGuardados = localStorage.getItem("julikrom_configuracion");

    if (datosGuardados) {
      setConfig(JSON.parse(datosGuardados));
    }
  }, []);

  const actualizarCampo = (campo: keyof ConfiguracionCotizador, valor: number) => {
    setConfig({
      ...config,
      [campo]: valor,
    });

    setGuardado(false);
  };

  const guardarConfiguracion = () => {
    localStorage.setItem("julikrom_configuracion", JSON.stringify(config));
    setGuardado(true);
  };

  const restaurarValores = () => {
    setConfig(configuracionInicial);
    localStorage.setItem(
      "julikrom_configuracion",
      JSON.stringify(configuracionInicial)
    );
    setGuardado(true);
  };

  return (
    <div className="calculadora">
      <button className="back-btn" onClick={volverMenu}>
        ← Volver al menú
      </button>

      <h2>⚙️ Configuración</h2>

      <p className="subtitulo">
        Ajusta los valores base que usará Julikrom para calcular precios.
      </p>

      <label>Precio gasolina / combustible</label>
      <input
        type="number"
        step="0.01"
        value={config.combustible}
        onChange={(e) => actualizarCampo("combustible", Number(e.target.value))}
      />

      <label>Margen mínimo (%)</label>
      <input
        type="number"
        value={config.margenMinimo}
        onChange={(e) => actualizarCampo("margenMinimo", Number(e.target.value))}
      />

      <label>Margen recomendado (%)</label>
      <input
        type="number"
        value={config.margenRecomendado}
        onChange={(e) =>
          actualizarCampo("margenRecomendado", Number(e.target.value))
        }
      />

      <label>Margen premium (%)</label>
      <input
        type="number"
        value={config.margenPremium}
        onChange={(e) => actualizarCampo("margenPremium", Number(e.target.value))}
      />

      <label>Costo por hora de diseño</label>
      <input
        type="number"
        step="0.01"
        value={config.costoHoraDiseno}
        onChange={(e) =>
          actualizarCampo("costoHoraDiseno", Number(e.target.value))
        }
      />

      <label>Costo base de instalación</label>
      <input
        type="number"
        step="0.01"
        value={config.costoInstalacion}
        onChange={(e) =>
          actualizarCampo("costoInstalacion", Number(e.target.value))
        }
      />

      <button className="main-btn" onClick={guardarConfiguracion}>
        Guardar configuración
      </button>

      <button className="secondary-btn" onClick={restaurarValores}>
        Restaurar valores base
      </button>

      {guardado && (
        <div className="resultado">
          <h3>✅ Configuración guardada</h3>
          <p>Julikrom usará estos valores en futuras calculadoras.</p>
        </div>
      )}
    </div>
  );
}

export default Configuracion;