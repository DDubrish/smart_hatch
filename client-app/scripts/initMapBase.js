function buildSource() {
  return new ol.source.Vector({});
}

function buildMap(vectorSource) {
  //создание контрола позиции мыши
  const mousePosition = new ol.control.MousePosition({
    projection: "EPSG:3857",
    coordinateFormat: ol.coordinate.createStringXY(5),
  });

  //добавление слоя для создания маркеров
  const layerMarkers = new ol.layer.Vector({
    source: vectorSource,
  });

  //инициализация карты, центрирование на координатах Воронежа
  const map = new ol.Map({
    // controls: ol.control.defaults({ attribution: false }).extend([attribution]),
    controls: [mousePosition],
    layers: [
      //общий слой карты
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
      //слой маркеров
      layerMarkers,
    ],
    // overlays: [overlay],
    target: "OSMap",
    view: new ol.View({
      center: ol.proj.fromLonLat([39.1649, 51.6943]), //преобразует из градусов
      maxZoom: 19,
      zoom: 18,
    }),
  });

  return map;
}
