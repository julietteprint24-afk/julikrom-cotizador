export type ConfiguracionCotizador = {
  combustible: number;
  margenMinimo: number;
  margenRecomendado: number;
  margenPremium: number;
  costoHoraDiseno: number;
  costoInstalacion: number;
};

export const configuracionBase: ConfiguracionCotizador = {
  combustible: 4.25,
  margenMinimo: 20,
  margenRecomendado: 35,
  margenPremium: 50,
  costoHoraDiseno: 5,
  costoInstalacion: 10,
};

export const obtenerConfiguracion = (): ConfiguracionCotizador => {
  const guardada = localStorage.getItem("julikrom_configuracion");

  if (!guardada) {
    return configuracionBase;
  }

  try {
    return {
      ...configuracionBase,
      ...JSON.parse(guardada),
    };
  } catch {
    return configuracionBase;
  }
};

export const calcularPrecios = (costoTotal: number) => {
  const config = obtenerConfiguracion();

  return {
    minimo: costoTotal * (1 + config.margenMinimo / 100),
    recomendado: costoTotal * (1 + config.margenRecomendado / 100),
    premium: costoTotal * (1 + config.margenPremium / 100),
  };
};