///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2016 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
  'dojo/_base/declare',
  'jimu/BaseWidgetSetting',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/Color'
],
function(declare, BaseWidgetSetting, SimpleMarkerSymbol, Color ) {

  return declare([BaseWidgetSetting], {
    baseClass: 'jimu-widget-demo-setting',
  
    //postCreate: function(){
      //the config object is passed in
      this.inherited(arguments);
      var config = this.config;

      config.symbol = config.symbol {}
      this.setConfig(this.config);
    },

    setConfig: function(config){
      this.config = config;
      var options = config.symbol;

      if (options && options.style){
        this.style_symbol.value = options.style;
      }
      if (options && options.size){
        document.getElementById("size").value = options.size;
      }
      if (options && options.color){
        this.color_symb.value = options.color;
      }
    },

    getConfig: function(){
      //WAB will get config object through this method
      this.config.symbol.style = this.style_symb.value;
      this.config.symbol.size = this.size_symb.value;
      this.conifg.symbol.color = this.color_symb.value;

      return this.config;
    }

    createSymbol: function(){
      var style = this.config.symbol.style;

      var inStyle = null;

      switch (style){
        case "STYLE_CIRCULE":
          inStyle = SimpleMarkerSymbol.STYLE_CIRCULE;
        break;
        case "STYLE_CROSS":
          inStyle = SimpleMarkerSymbol.STYLE_CROSS;
        break;
        case "STYLE_DIAMOND":
          inStyle = SimpleMarkerSymbol.STYLE_DIAMOND;
        break;
        case "STYLE_PATH":
          inStyle = SimpleMarkerSymbol.STYLE_PATH;
        break;
        case "STYLE_SQUARE":
          inStyle = SimpleMarkerSymbol.STYLE_SQUARE;
        break;
        case "STYLE_X":
          inStyle = SimpleMarkerSymbol.STYLE_X;
        break;
      }
      var size = this.config.symbol.size;
      var color = this.config.symbol.color;

      this.symbol = new SimpleMarkerSymbol (inStyle, size, null, new Color(color));
    }
  });
});
