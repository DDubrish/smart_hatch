const vectorSource = buildSource();
const map = buildMap(vectorSource);

//создание слоя для работы с popup
var container = document.getElementById("popup");
var content = document.getElementById("popup-content");
var closer = document.getElementById("popup-closer");

var overlay = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

//закрытие popup
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

map.addOverlay(overlay);

function addMarker(hatches) {
  hatches.forEach((hatch) => {
    // console.log("Проверка = ", a, b);

    var coordinate = [hatch.coord_y, hatch.coord_x];
    var icon = hatch.state == "1" ? GREEN_IMG : RED_IMG;

    console.log(coordinate);
    //создание маркера по координатам клика
    const iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(coordinate),
    });
    //стиль маркера
    const iconStyle = new ol.style.Style({
      image: new ol.style.Icon({
        src: icon,
      }),
    });

    iconFeature.setStyle(iconStyle);

    vectorSource.addFeature(iconFeature);
  });
}

//Обработка клика по маркеру
map.on("singleclick", function (event) {
  console.log("click");
  if (map.hasFeatureAtPixel(event.pixel) === true) {
    var coordinate = event.coordinate;
    content.innerHTML = "<b>Hello World!</b><br />I am a popup.";
    overlay.setPosition(coordinate);
  } else {
    overlay.setPosition(undefined);
    closer.blur();
  }
});
