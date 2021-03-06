define(['dojo/_base/declare', "jimu/BaseWidget", "esri/geometry/Circle", "esri/geometry/Extent", "esri/layers/FeatureLayer", "esri/tasks/query", "esri/tasks/QueryTask", "esri/geometry/Polygon", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/graphic", "esri/layers/GraphicsLayer", "esri/Color", "dojo/ready", "dojo/parser", "esri/domUtils", "dojo/dom", "esri/tasks/StatisticDefinition", "dijit/layout/BorderContainer", "dijit/layout/ContentPane"],
function (declare, BaseWidget, Circle, Extent, FeatureLayer, Query, QueryTask, Polygon, SimpleLineSymbol, SimpleFillSymbol, Graphic, GraphicsLayer, Color, ready, parser, domUtils, dom, StatisticDefinition, BorderContainer, ContentPane) {

    return declare([BaseWidget], {
        baseClass: 'jimu-widget-RadioBusqueda',
        _isClosed: false,

        //Init widget
        onOpen: function() {

            //variables
            window.$app = {
                qBuild: this.qBuild,
                qtBuild: this.qtBuild,
                distance: this.distance,
                damage: this.damage,
                map: this.map,
                graphicLayer: this.graphicLayer,
                click: this.click,
                stadtisctisDefinition: this.statisticDefinition
            };
        },



        //Btn play
        play: function() {
            //Clear map

            window.$app.map.graphics.clear();

            //Create Query and QuerTask
            window.$app.qtBuild = new QueryTask("https://localhost:6443/arcgis/rest/services/Edificios/edificios/FeatureServer/0");
            window.$app.qBuild = new Query();

            //Search configuration
            window.$app.qBuild.outFields = ["*"];
            window.$app.qBuild.returnGeometry = true;

            window.$app.damage = dom.byId("query").value;
            window.$app.qBuild.where = "NB_GradoDaño = '" + window.$app.damage + "'";
            window.$app.distance = dom.byId("distance").value;
            window.$app.graphicLayer = new GraphicsLayer();
            window.$app.map.addLayer(window.$app.graphicLayer);

            //Click event
            window.$app.click = window.$app.map.on("click", function (evt) {

                var text1 = document.getElementById('next');
                text1.classList.remove("next");
                while (text1.firstChild) {
                    text1.removeChild(text1.firstChild);
                }

                //Create circle
                var circle = new Circle({
                    center: evt.mapPoint,
                    radius: window.$app.distance
                });

                // Configurate geometry search
                window.$app.qBuild.geometry = circle;
                window.$app.qBuild.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
                var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, new Color([0.3, 0.3, 0.3, 0.2]));
                var gr = new Graphic(circle, symbol);

                window.$app.graphicLayer.clear();
                window.$app.graphicLayer.add(gr);


                //Execute QueryTask
                window.$app.qtBuild.execute(window.$app.qBuild, show);
            });

            //Create show function to show the results of QueryTask
            function show(fsResult) {

                var features = fsResult.features;
                window.$app.map.graphics.clear();

                if (features.length != 0) {
                    if (window.$app.damage === "Completo") {
                        var fillsymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([1.0, 1.0, 1.0]), 1.5), new Color("#0c0c0c"));
                    } else if (window.$app.damage === "Extenso") {
                        var fillsymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([1.0, 1.0, 1.0]), 1.5), new Color("#de0e0e"));
                    } else if (window.$app.damage === "Moderado") {
                        var fillsymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([1.0, 1.0, 1.0]), 1.5), new Color("#eef222"));
                    } else if (window.$app.damage === "Leve") {
                        var fillsymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([1.0, 1.0, 1.0]), 1.5), new Color("#42e634"));
                    } else if (window.$app.damage === "0") {
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

                var count = document.getElementById('countResult');
                count.innerHTML = features.length;

                };


            };



            var text2 = document.getElementById('error');
            text2.classList.remove("error");
            while (text2.firstChild) {
                text2.removeChild(text2.firstChild);
            };

            var text = dom.byId("next");
            text.className = 'next';
            text.innerHTML = '<p> Selecciona la zona de búsqueda </p>';

        },



        //Btn clear
        clear: function() {

          window.$app.graphicLayer.clear();
          window.$app.map.graphics.clear();
          window.$app.click.remove();

          document.getElementById('error').classList.remove('error');
          dom.byId("rangevalue").value = 50;
          dom.byId("distance").value = 50;
          dom.byId("query").value =0;
          dom.byId('countResult').innerHTML = 0;

        },

        //Close widget
        onClose: function() {

          window.$app.graphicLayer.clear();
          window.$app.map.graphics.clear();
          window.$app.click.remove();

          document.getElementById('error').classList.remove('error');
          dom.byId("rangevalue").value = 50;
          dom.byId("distance").value = 50;
          dom.byId("query").value =0;
          dom.byId('countResult').innerHTML = 0;

        }

    });
});
