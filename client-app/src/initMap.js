// var fromProjection = new OpenLayers.Projection("EPSG:4326");
// var toProjection = new OpenLayers.Projection("EPSG:900913");
var layerMarkers;
function getMap() {
  map = new OpenLayers.Map("OSMap"); //инициализация карты
  var mapnik = new OpenLayers.Layer.OSM(); //создание слоя карты
  map.addLayer(mapnik); //добавление слоя (без него не отображается карта вообще)
  map.zoomToMaxExtent(); //выставляем zoom и центр карты, т.ч.поместился весь мир

  //широта/долгота, задаем от руки координаты маркера
  var lonlat = new OpenLayers.LonLat(39.1649, 51.6943);
  map.setCenter(
    lonlat.transform(
      //переобразование в WGS 1984 -геодезическая система координат на эллипсоиде WGS 84(широта/долгота) рассматривает Землю как эллипсоид
      new OpenLayers.Projection("EPSG:4326"),
      new OpenLayers.Projection("EPSG:900913") //переобразование проекции - WGS84 web mercator, рассматривает Землю как сферу. Также EPSG:3857
    ),
    16 //масштаб
  );

  //создание слоя меток
  layerMarkers = new OpenLayers.Layer.Markers("Equipments");
  //добавление этого слоя к карте
  map.addLayer(layerMarkers);

  // //данные маркера
  // var size = new OpenLayers.Size(25, 25); //размер иконки маркера
  // var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h); //смещение картинки для маркера
  // var icon = new OpenLayers.Icon("img/hatch.png", size, offset); //картинка для маркера
  // layerMarkers.addMarker(new OpenLayers.Marker(lonlat, icon)); //добавляем маркер к слою маркеров(координаты, иконка)
  //переключатель видимости слоев, если false, то сначала идет мой слой, потом базовый
  map.addControl(new OpenLayers.Control.LayerSwitcher({ ascending: true }));

  //координаты текущего положения мыши
  //преобразование из метров в градусы с помощью proj4js(библиотека JS, преобразует координаты из одной системы координат в другую)
  map.addControl(
    new OpenLayers.Control.MousePosition({
      // displayProjection: new OpenLayers.Projection("EPSG:4326"),
      displayProjection: new OpenLayers.Projection("EPSG:900913"),
    })
  );

  var click = new OpenLayers.Control.Click();
  map.addControl(click);
  click.activate();

  document.getElementById("OSMap").hidden = true;
}

OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
  defaultHandlerOptions: {
    single: true,
    double: false,
    pixelTolerance: 0,
    stopSingle: false,
    stopDouble: false,
  },

  initialize: function (options) {
    this.handlerOptions = OpenLayers.Util.extend(
      {},
      this.defaultHandlerOptions
    );
    OpenLayers.Control.prototype.initialize.apply(this, arguments);
    this.handler = new OpenLayers.Handler.Click(
      this,
      { click: this.trigger },
      this.handlerOptions
    );
  },
  trigger: function (e) {
    var lonlat = map.getLonLatFromPixel(e.xy);
    lonlat1 = new OpenLayers.LonLat(lonlat.lon, lonlat.lat).transform(
      new OpenLayers.Projection("EPSG:900913"), //координаты
      new OpenLayers.Projection("EPSG:4326") //градусы
    );

    // alert("Hello..." + lonlat.lon + " " + lonlat.lat);

    document.getElementById("coordX").value = lonlat.lat;
    document.getElementById("coordY").value = lonlat.lon;

    //данные маркера
    var size = new OpenLayers.Size(25, 25); //размер иконки маркера
    var offset = new OpenLayers.Pixel(-(size.w / 2), -(size.h / 2)); //смещение картинки для маркера
    var icon = new OpenLayers.Icon("img/hatch.png", size, offset); //картинка для маркера
    layerMarkers.clearMarkers();
    layerMarkers.addMarker(new OpenLayers.Marker(lonlat, icon));
  },
});

document.addEventListener("DOMContentLoaded", getMap, false);

document.forms["hatchForm"].addEventListener("submit", () => {
  layerMarkers.clearMarkers();
  alert("Люк добавлен!");
});
