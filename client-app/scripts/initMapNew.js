const vectorSource = buildSource();
const map = buildMap(vectorSource);

document.getElementById("OSMap").hidden = true;

// var icon = hatch.state == "1" ? GREEN_IMG : RED_IMG;
console.log(document.getElementById("state"));

//Обработка клика по маркеру
map.on("singleclick", function (event) {
  console.log("click");
  var coordinate = event.coordinate;
  console.log("проверка = ", event.coordinate);

  //создание маркера по координатам клика
  const iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(event.coordinate),
  });
  //стиль маркера
  const iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
      src: GREEN_IMG,
    }),
  });

  iconFeature.setStyle(iconStyle);
  vectorSource.clear();
  vectorSource.addFeature(iconFeature);

  const out = ol.coordinate.toStringXY(coordinate, 5);
  console.log(out);
  document.getElementById("coordX").value = out.split(",")[1];
  document.getElementById("coordY").value = out.split(",")[0];
});
