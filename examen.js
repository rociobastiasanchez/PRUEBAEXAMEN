'use strict'

var madrid;

require ([
    "esri/map",
    "esri/geometry/Extent",
    "esri/layers/FeatureLayer",
    "esri/tasks/ServiceAreaTask",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/tasks/ServiceAreaParameters",
    "esri/tasks/ServiceAreaSolveResult",
    "esri/tasks/FeatureSet",
    "esri/tasks/query",

    "esri/dijit/Legend",
    "esri/dijit/Search",
    "esri/dijit/Scalebar",

    "dojo/on",
    "dojo/parser",
    

    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane",
    "dijit/layout/BorderContainer",
    "dojo/_base/array",
    "dojo/domReady!",

], function (
    Map,
    Extent,
    FeatureLayer,
    ServiceAreaTask,
    SimpleFillSymbol,
    SimpleLineSymbol,
    ServiceAreaParameters,
    ServiceAreaSolveResult,
    FeatureSet,
    Query,
    Legend,
    Search,
    Scalebar,
    on,
    parser,
    array,
){
    parser.parse();

    //Creamos el mapa

    madrid = new Map ("mapa", {
        basemap : "streets",
        extent: new Extent({
            spatialReference: {wkid: 102100},
            xmax: -399503.1659847863,
            xmin: -420542.4580202527,
            ymax: 4931083.171244445,
            ymin: 4915413.580446006,
        })
    });

    //Añadimos la capa desde ArcGIS online

    var capacentros = new FeatureLayer("https://services8.arcgis.com/BtkRLT3YBKaVGV3g/arcgis/rest/services/CENTROS_SALUD_MADRID/FeatureServer/0");

    madrid.addLayer(capacentros);

    //Primero hacemos una consulta

    var consulta = new Query();
    consulta.where = "1=1";
    capacentros.selectFeatures(consulta,FeatureLayer.SELECTION_NEW);
    capacentros.on("selection-complete", ejecutar);

    function ejecutar(evt){
       var facilities = new FeatureSet();
       console.log(evt);
    
        var parametros = new ServiceAreaParameters();
        parametros.defaultBreaks= [1];
        parametros.outSpatialReference = madrid.spatialReference;
        parametros.returnFacilities = true;
        parametros.facilities = evt.features[0];

        //Creamos el Service Area

        var area = new ServiceAreaTask("https://formacion.esri.es/server/rest/services/RedMadrid/NAServer/Service%20Area");


        area.solve(parametros, function(resultado){

            //Creamos la simbologia
            var simbolopoligono = new SimpleFillSymbol( 
            "solid",  
            new SimpleLineSymbol("solid", new Color([232,104,80]), 2),
            new Color([232,104,80,0.25]));

           //Ahora llamamos a la propiedad de ServiceAreaSolve con ServiceAreaPolygons

            arrayUtils.forEach(resultado.serviceAreaPolygons, function(servicioArea){
            servicioArea.setSymbol(simbolopoligono); //Añadimos el símbolo que hemos creado
            madrid.graphics.add(servicioArea);
        });


        });

    };

    

    

    var leyenda = new Legend({
        map:madrid,
    }, "legendDiv");
    leyenda.startup();

    var buscador = new Search ({
      map: madrid
    }, "search");

    var escala = new Scalebar({
        map: madrid,
        scalebarUnit: "metric",
      });

    


   
}
)
