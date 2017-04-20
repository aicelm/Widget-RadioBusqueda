define(['dojo/_base/declare',
        "jimu/BaseWidget",
        "esri/geometry/Circle",
        "esri/geometry/Extent",
        "esri/layers/FeatureLayer",
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "esri/geometry/Polygon",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/graphic",
        "esri/layers/GraphicsLayer",
        "esri/Color",
        "dojo/ready",
        "dojo/dom",
        "dojo/parser",
        "esri/domUtils",
        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"
    ],

    function(declare, BaseWidget,
        Circle, Extent,
        FeatureLayer, Query,
        QueryTask, Polygon, SimpleLineSymbol,
        SimpleFillSymbol, Graphic, GraphicsLayer, Color, ready, dom, parser,
        domUtils, BorderContainer, ContentPane ) {

        return declare([BaseWidget], {
            baseClass: 'RadioBusqueda',
            _isClosed: false,

            //Iniciamos el widget
            onOpen: function() {

              //Generamos las variables que vamos a utilizar
              window.$app = {
                  qEdificios: this.qEdificios,
                  qtEdificios: this.qtEdificios,
                  distancia: this.distancia,
                  danio: this.danio,
                  map: this.map,
                  graphicLayer: this.graphicLayer,
                  click : this.click
                };

              },

              ejecutar: function() {

                        //Creamos la Query y QuerTask
                        window.$app.qtEdificios = new QueryTask("https://localhost:6443/arcgis/rest/services/App_field/Edificios_field/FeatureServer/0");
                        window.$app.qEdificios = new Query();

                        //Configuramos los valores de búsqueda
                        window.$app.qEdificios.outFields = ["*"];
                        window.$app.qEdificios.returnGeometry = true;

                        window.$app.danio = dom.byId("query").value;
                        // console.log(window.$app.danio)
                        window.$app.qEdificios.where = "NB_GradoDaño = '" + window.$app.danio + "'";
                        window.$app.distancia = dom.byId("distancia").value;
                        window.$app.graphicLayer = new GraphicsLayer();
                        window.$app.map.addLayer(window.$app.graphicLayer);

                      //Evento click en el mapa
                      window.$app.click = window.$app.map.on("click", function(evt) {

                        var texto1 = document.getElementById('siguiente');
                          texto1.classList.remove("siguiente");
                          while (texto1.firstChild) {
                              texto1.removeChild(texto1.firstChild);
                              }


                          //Creamos el circulo de búsqueda
                          var circle = new Circle({
                              center: evt.mapPoint,
                              radius: window.$app.distancia
                          });

                          // Configuramos la geometría de búsqueda
                          window.$app.qEdificios.geometry = circle;
                          window.$app.qEdificios.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
                          var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, new Color([0.3, 0.3, 0.3, 0.2]));
                          var gr = new Graphic(circle,symbol);

                          window.$app.graphicLayer.clear();
                          window.$app.graphicLayer.add(gr);

                          //Ejecutamos la QueryTask
                          window.$app.qtEdificios.execute(window.$app.qEdificios, show);

                      });

                      //Función show para mostrar resultados de la QueryTask
                      function show(fsResult) {

                          var features = fsResult.features;
                          window.$app.map.graphics.clear();


                          if (features.length != 0) {
                              if (window.$app.danio === "Completo") {
                                var fillsymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                    new Color([1.0, 1.0, 1.0]), 1.5),new Color("#0c0c0c"));
                              }
                              else if (window.$app.danio === "Extenso") {
                                var fillsymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                    new Color([1.0, 1.0, 1.0]), 1.5),new Color("#de0e0e"));
                              }
                              else if (window.$app.danio === "Moderado") {
                                var fillsymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                    new Color([1.0, 1.0, 1.0]), 1.5),new Color("#eef222"));
                              }
                              else if (window.$app.danio === "Leve") {
                                var fillsymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                    new Color([1.0, 1.0, 1.0]), 1.5),new Color("#42e634"));
                              }
                              else if (window.$app.danio === "0"){
                                var error = dom.byId("error");
                                error.className = 'error';
                                error.innerHTML = '<p> No se han encontrado edificios con este grado de daño en el rango de búsqueda </p>';
                              }
                          } else {
                            var error = dom.byId("error");
                            error.className = 'error';
                            error.innerHTML = '<p> No se han encontrado edificios con este grado de daño en el rango de búsqueda </p>';
                          }

                          for (var i = 0; i < features.length; i++) {
                            features[i].symbol = fillsymbol;
                            window.$app.map.graphics.add(features[i]);
                          };
                      };

                      var texto2 = document.getElementById('error');
                          texto2.classList.remove("error");
                            while (texto2.firstChild) {
                                  texto2.removeChild(texto2.firstChild);
                                  }

                      var texto = dom.byId("siguiente");
                      texto.className = 'siguiente';
                      texto.innerHTML = '<p> Selecciona la zona de búsqueda </p>';

                  },

                  onClose: function() {
                    window.$app.graphicLayer.clear();
                    window.$app.map.graphics.clear();
                    window.$app.click.remove();
                  }

        });
    });
