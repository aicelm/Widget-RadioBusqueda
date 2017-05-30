define(['dojo/_base/declare', 'jimu/BaseWidget', "dojo/dom-style", "dojo/dom", "esri/map", "esri/geometry/Point", "esri/graphic", "esri/symbols/SimpleMarkerSymbol", "esri/Color", "dojo/_base/lang"],
    function(declare, BaseWidget, domStyle, dom, Map, Point, Graphic, SimpleMarkerSymbol, Color, lang) {
        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {
            //   // DemoWidget code goes here
            baseClass: 'jimu-widget-AddFoto',
            name: 'AddFoto',
            //propiedad para almacenar el símbolo
            symbol: null,


            //please note that this property is be set by the framework when widget is loaded.
            //templateString: template,



            //método del postcreate, donde creamos el simbolo
            postCreate: function() {
                this.inherited(arguments);
                // this.symol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, null, new Color("black"))
            },
            // startup: function() {
            //   console.log('startup');
            // },
            //



            onOpen: function() {
                // this.map.on("click", lang.hitch(this, function(evt) {
                //         if (dom.byId("activado").checked) {
                //             console.log('click');
                //             var point = evt.mapPoint;
                //             var graphic = new Graphic(point, this.symbol);
                //             this.map.graphics.clear();
                //             this.map.graphics.add(this.graphic);
                //         }
                // }));

                        var TakeFoto = document.querySelector("#foto");
                        TakeFoto.onclick = function(event) {
                            // Obtener una referencia a la fotografía tomada o fichero seleccionado
                            var files = event.target.files,
                                file;
                            if (files && files.length > 0) {
                                file = files[0];
                            }
                        };
                        //hace visible los graficos
                        this.map.graphics.show()
                    },



            onClose: function() {
                this.map.on("click", function() {
                    console.log('click_close');
                });
                this.map.graphics.hide();
            }
            //
            // onMinimize: function(){
            //   console.log('onMinimize');
            // },
            //
            // onMaximize: function(){
            //   console.log('onMaximize');
            // },
            //
            // onSignIn: function(credential){
            //   /* jshint unused:false*/
            //   console.log('onSignIn');
            // },
            //
            // onSignOut: function(){
            //   console.log('onSignOut');
            // }
        });
    });
