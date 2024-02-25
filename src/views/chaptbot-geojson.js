function reduceGeoJsonWeight(geoJson) {
    // Vérifie si l'objet GeoJSON est valide
    if (!geoJson || !geoJson.type || geoJson.type !== 'FeatureCollection') {
      return null;
    }
  
    // Parcours les différentes entités de l'objet GeoJSON
    for (let i = 0; i < geoJson.features.length; i++) {
      const feature = geoJson.features[i];
  
      // Vérifie si l'entité est un polygone
      if (feature.geometry.type === 'Polygon') {
        // Parcours les différents contours du polygone
        for (let j = 0; j < feature.geometry.coordinates.length; j++) {
          const polygon = feature.geometry.coordinates[j];
  
          // Vérifie si le contour est dans un ordre horaire
          if (isClockwise(polygon)) {
            // Inverse l'ordre des points du contour pour le mettre dans un ordre antihoraire
            feature.geometry.coordinates[j] = reverseCoordinates(polygon);
          }
        }
      }
    }
  
    return geoJson;
  }
  
  // Fonction pour vérifier si un contour est dans un ordre horaire
  function isClockwise(polygon) {
    let sum = 0;
  
    // Parcours les différents points du contour
    for (let i = 0; i < polygon.length - 1; i++) {
      const p1 = polygon[i];
      const p2 = polygon[i + 1];
  
      // Calcule la somme des différences de longitude et latitude
      sum += (p2[0] - p1[0]) * (p2[1] + p1[1]);
    }
  
    // Vérifie si la somme est positive (ordre horaire) ou négative (ordre antihoraire)
    return sum > 0;
  }
  
  // Fonction pour inverser l'ordre des points d'un contour
  function reverseCoordinates(polygon) {
    return polygon.reverse();
  }
  