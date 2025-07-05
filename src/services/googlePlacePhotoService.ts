/**
 * Retorna a URL da primeira foto de um lugar obtido via Google Places API.
 *
 * @param map     Instância do google.maps.Map para inicializar o PlacesService
 * @param placeId Identificador único de um lugar no Google Places
 * @param maxWidth  Largura máxima da imagem (padrão: 400)
 * @returns       Promise<string | null> com a URL da foto, ou null se não houver fotos
 */
export function getPlacePhotoUrl(
  map: google.maps.Map,
  placeId: string,
  maxWidth = 400
): Promise<string | null> {
  return new Promise((resolve) => {
    if (!map || !placeId) {
      console.warn("[getPlacePhotoUrl] map ou placeId ausente.");
      resolve(null);
      return;
    }

    const service = new google.maps.places.PlacesService(map);
    service.getDetails(
      { placeId, fields: ["photos"] },
      (placeResult, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          placeResult?.photos?.length
        ) {
          const url = placeResult.photos![0].getUrl({ maxWidth });
          resolve(url);
        } else {
          console.warn(
            "[getPlacePhotoUrl] sem fotos ou status inválido:",
            status
          );
          resolve(null);
        }
      }
    );
  });
}
export function getBeachPhotoByName(
  map: google.maps.Map | null,
  nomePraia: string,
  lat: number,
  lng: number,
  maxWidth = 400
): Promise<string | null> {
  if (!map) {
    console.warn("[getBeachPhotoByName] map is null, resolving null");
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    const service = new google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(
      {
        query: nomePraia,
        locationBias: { lat, lng },
        fields: ["photos"],
      },
      (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results?.length &&
          results[0].photos?.length
        ) {
          const url = results[0].photos![0].getUrl({ maxWidth });
          resolve(url);
        } else {
          console.warn(
            "[getBeachPhotoByName] sem foto para",
            nomePraia,
            "status:",
            status
          );
          resolve(null);
        }
      }
    );
  });
}
