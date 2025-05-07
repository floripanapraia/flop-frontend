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
    console.log("[placePhotoService] requesting photo for placeId:", placeId);
    return new Promise((resolve) => {
      const service = new google.maps.places.PlacesService(map);
      service.getDetails(
        { placeId, fields: ["photos"] },
        (placeResult, status) => {
            console.log("[placePhotoService] getDetails status:", status, placeResult);
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            placeResult?.photos?.length
          ) {
            const url = placeResult.photos![0].getUrl({ maxWidth });
            console.log("[placePhotoService] got photoUrl:", url);
            resolve(url);
          } else {
            console.warn("[placePhotoService] no photos, resolving null");
            resolve(null);
          }
        }
      );
    });
  }

  export function getBeachPhotoByName(
    map: google.maps.Map,
    nomePraia: string,
    lat: number,
    lng: number,
    maxWidth = 400
  ): Promise<string | null> {
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
  