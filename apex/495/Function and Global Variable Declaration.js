var id_reporte_1;
var id_reporte_2;
var id_reporte_3;
var id_reporte_actual;
var lSpinner$
var ip_server = self.location.host;

function ancho_columna_agg(region) {        
    var g = apex.region(region).widget().interactiveGrid('getViews', 'grid');
    g.view$.grid('option', 'rowHeaderWidth', 1); //esto hace que cambie el ancho de la columna izquierda a 1px  
    g.view$.grid('refresh');
}


$('#ig_nomina_format').on('interactivegridviewchange', function(event , ui){      
   ancho_columna_agg('ig_nomina_format');
});

$('#r_numeros_certificacion_nomina').on('interactivegridviewchange', function(event , ui){      
   ancho_columna_agg('r_numeros_certificacion_nomina');
});

function funcion_extraccion(){
    lSpinner$.remove();
    $("#baja_archivo_spi").click();
}  

function funcion_extraccion_txt(){
    lSpinner$.remove();
    $("#baja_archivo_texto_beneficiario").click();
}  

function funcion_extraccion_spi_xls(){
    lSpinner$.remove();
    $("#baja_archivo_beneficiario").click();
}  




  $(document).ready(function () {
     $("#baja_archivo_spi").click(function (e) {
         e.preventDefault();                
         var referencia_1 = "https://"+ip_server+"/i/SPI/SPI-SP_NOMINA_"+$v('P495_ID_GENO_PIVOTE')+".xls";  
         $('#r_oculto').append( '<a href= '+referencia_1+' download id="link_down_1">' );
         $('#link_down_1')[0].click();
         $('#link_down_1').remove();
         /*var myVar = setInterval(myTimer, 2000);
         function myTimer() {
           $("#baja_archivo_beneficiario").click();
           clearInterval(myVar);  
         }*/
     });
  })   

$(document).ready(function () {
     $("#baja_archivo_beneficiario").click(function (e) {         
         e.preventDefault();                 
         var referencia_2 = "https://"+ip_server+"/i/SPI/BENEFICIARIOS_SPI_NOMINA_"+$v('P495_ID_GENO_PIVOTE')+".xls";  
         $('#r_oculto').append( '<a href= '+referencia_2+' download id="link_down_2">' );
         $('#link_down_2')[0].click();
         $('#link_down_2').remove();         
         /*var myVar = setInterval(myTimer, 2000);
         function myTimer() {
           $("#baja_archivo_texto_beneficiario").click();
           clearInterval(myVar);  
         }*/
     });
  })   

$(document).ready(function () {
     $("#baja_archivo_texto_beneficiario").click(function (e) {         
         e.preventDefault();             
         var referencia_3 = "https://"+ip_server+"/i/SPI/BENEFICIARIOS_SPI_NOMINA_"+$v('P495_ID_GENO_PIVOTE')+".txt";  
         $('#r_oculto').append( '<a href= '+referencia_3+' download id="link_down_3">' );
         $('#link_down_3')[0].click();
         $('#link_down_3').remove();
     });
  })   




                  
function fu_consulta_nomina(nomina_numero,periodo){   
    $s('P495_ID_GENO_PIVOTE',nomina_numero);
    $('#r_centro_detalle_heading').text('Nómina No.: '+nomina_numero);
    apex.server.process( 
      'muestra_datos',
      { x01: nomina_numero,
        x02:periodo},  // Parametros
      {
        success: function (pData) {                        
            apex.item('P495_ID_GENO_CABECERA').setValue(pData.p_codigo_nomina);
            apex.item('P495_GENE_PERIODO_CABECERA').setValue(pData.p_periodo);
            apex.item('P495_GENE_PERIODO_APLICA_CABECERA').setValue(pData.p_periodo_aplica);
            apex.item('P495_GENO_IS_CONTABILIZADO_CABECERA').setValue(pData.p_contabilizado);
            apex.item('P495_GENO_IS_LIQUIDACION').setValue(pData.p_liquidacion);
            apex.item('P495_GENO_TIPO_NOMINA_CABECERA').setValue(pData.p_tipo_nomina);
            apex.item('P495_GENO_OBSERVACIONES_CABECERA').setValue(pData.p_observaciones);
            apex.item('P495_TOTAL_INGRESOS').setValue(pData.p_total_ingresos);
            apex.item('P495_TOTAL_GASTOS').setValue(pData.p_total_gastos);
            apex.item('P495_TOTAL_PROVISIONES').setValue(pData.p_total_provisiones);
            apex.item('P495_GENO_IS_VERIFICADO_CABECERA').setValue(pData.p_revisado);  
            apex.item('P495_TOTAL_NUMEROS_CERT').setValue(pData.p_valor_numeros_cert);  
            if ($v('P495_GENO_IS_LIQUIDACION') == 'S'){
               $('#r_centro_detalle_heading').html('Nómina No.: '+$v('P495_ID_GENO_CABECERA')+' (Liquidación)');
            }
            else{
                $('#r_centro_detalle_heading').html('Nómina No.: '+$v('P495_ID_GENO_CABECERA'));
            }
        },
        error: function(e){
            console.log("Error: ", e);
        },
        dataType: "json"                       
      }
    ); 
    
    $('#NOMINAS_IZQUIERDA span').each(function(){         
    if($(this).css("background-color") == "rgb(218, 166, 218)"){   
      $(this).css({"background-color":"rgba(0, 0, 0, 0.05)"});    
      return false;  
    }    
    });
    
    
    $('#NOMINAS_IZQUIERDA span').each(function(){  
    if($(this).text() == "Nómina No.: "+$v('P495_ID_GENO_PIVOTE')){   
      $(this).css({"background-color":"#daa6da"});     
      return false;    
    }    
    });
    
    apex.region('INGRESOS_GRID').refresh();
    apex.region('GASTOS_GRID').refresh();
    apex.region('PROVISIONES_GRID').refresh();
    apex.region('EMPLEADOS_DERECHO').refresh();
    
    var myVar = setInterval(myTimer, 1000);

    function myTimer() {  
      if($('#INGRESOS_GRID_ig_grid_vc_pageRange').find('span.a-GV-pageRange').text()){
          $('#INGRESOS_GRID_ig_grid_vc_pageRange').find('span.a-GV-pageRange').text('Total '+ $v('P495_TOTAL_INGRESOS'));
          $('#GASTOS_GRID_ig_grid_vc_pageRange').find('span.a-GV-pageRange').text('Total '+ $v('P495_TOTAL_GASTOS'));
          $('#PROVISIONES_GRID_ig_grid_vc_pageRange').find('span.a-GV-pageRange').text('Total '+ $v('P495_TOTAL_PROVISIONES'));
          $('#INGRESOS_GRID_ig_grid_vc_pageRange').find('.a-GV-pageRange').css({'left': '4px','position': 'relative'});
          $('#GASTOS_GRID_ig_grid_vc_pageRange').find('.a-GV-pageRange').css({'left': '4px','position': 'relative'});
          $('#PROVISIONES_GRID_ig_grid_vc_pageRange').find('.a-GV-pageRange').css({'left': '4px','position': 'relative'});
          clearInterval(myVar);      }
     }
    $('#P495_ID_GENO_CABECERA').focus();    
}


function botones_barra_grid_gastos(config){
let $             = apex.jQuery,
      toolbarData   = $.apex.interactiveGrid.copyDefaultToolbar(), 
      grupoactions3 = toolbarData.toolbarFind( "search" ).controls;  
   
  grupoactions3.push({type: "STATIC",
                      label: "Gastos",
                       id: "static"
                     });
   
    config.toolbarData = toolbarData;
  
  return config;
} 



function fu_detalle_rubros(){
   if(!$v('P495_ID_GENO_PIVOTE').length){
      fu_mensajes_pantalla('','Primero debe seleccionar una nómina','P',3000);
   }
   else{    
     openModal('r_dialog_contenedor_detalle_nomina');   
     $('div[aria-describedby="r_dialog_contenedor_detalle_nomina"]').css({'width': $(window).width()+'px',
                                                                        'top': '37px'});  
     apex.region('r_dialog_ig_detalle_nomina').refresh();
    
     $s('P495_TRAMA_TOTALES_SECUNDARIA_INICIAL',
        '<table id="tabla_totales_secundaria" class="a-GV-table" style="position: relative; top: -5px;width: 951px;left: 347px;"><colgroup>'+
        $('#r_dialog_ig_detalle_nomina_ig_grid_vc').find('.a-GV-bdy').find('.a-GV-w-scroll')
        .find('.a-GV-table').find('colgroup').html());       
     if(id_reporte_actual == id_reporte_3){             
          apex.server.process( 
           'obtienes_totales_secundaria',
           { x01: $v('P495_ID_GENO_PIVOTE')},  // Parametros
           {
             success: function (pData) {        
                 $s('P495_TRAMA_SECUNDARIA',$v('P495_TRAMA_TOTALES_SECUNDARIA_INICIAL')+pData);
                 fu_totales(id_reporte_actual);
             },
             error: function(e){
                 console.log("Error: ", e);
             },
             dataType: "text"                       
           }
        );  
     }    
       //procesos de acciones por rol de usuarios
     if ($v('P495_ROL_USUARIO') == 6){  //rol contador se oculta spi y certificaciones
        apex.region("r_dialog_ig_detalle_nomina").widget().interactiveGrid("getActions").hide("Generar_SPI");
        apex.region("r_dialog_ig_detalle_nomina").widget().interactiveGrid("getActions").hide("certificaciones_nomina"); 
     }    
     if ($v('P495_ROL_USUARIO') == 4){  //rol tesoreria se oculta validar y contabilizar
        apex.region("r_dialog_ig_detalle_nomina").widget().interactiveGrid("getActions").hide("validar_nomina");
        apex.region("r_dialog_ig_detalle_nomina").widget().interactiveGrid("getActions").hide("contabilizar_nomina");  
     }    
     if ($v('P495_ROL_USUARIO') != 5){ 
       if (apex.item('P495_GENO_IS_VERIFICADO_CABECERA').getValue() == 'S'){
          apex.region("r_dialog_ig_detalle_nomina").widget().interactiveGrid("getActions").hide("validar_nomina");
       } 
       if (apex.item('P495_GENO_IS_CONTABILIZADO_CABECERA').getValue() == 'S'){
         apex.region("r_dialog_ig_detalle_nomina").widget().interactiveGrid("getActions").hide("contabilizar_nomina");
       }    
     }    
   }     
    
}    



function fu_totales(id_actual){ 
    //alert(tipo);
    $('#tabla_totales_secundaria').remove();
     if(id_actual == id_reporte_3){     
        if( !$('#tabla_totales_secundaria').length){
           $($v('P495_TRAMA_SECUNDARIA')).insertAfter("#r_dialog_ig_detalle_nomina_ig_grid_vc_status");
        };    
     }       
}


function botones_barra_grid_ingresos(config){
let $             = apex.jQuery,
      toolbarData   = $.apex.interactiveGrid.copyDefaultToolbar(), 
      grupoactions3 = toolbarData.toolbarFind( "search" ).controls;  
   
  grupoactions3.push({type: "STATIC",
                      label: "Ingresos",
                       id: "static"
                     });
   
    config.toolbarData = toolbarData;
  
  return config;
}   



function botones_barra_grid_provisiones(config){
let $             = apex.jQuery,
      toolbarData   = $.apex.interactiveGrid.copyDefaultToolbar(), 
      grupoactions3 = toolbarData.toolbarFind( "search" ).controls;  
   
  grupoactions3.push({type: "STATIC",
                      label: "Provisiones",
                       id: "static"
                     });
   
    config.toolbarData = toolbarData;
  
  return config;
}   


function botones_barra_grid_detalle_nomina(config){
    var TB_MENU = "MENU",
        TOGGLE = "toggle",
        ACTION = "action",
        TOGGLE = "toggle",
        RADIO_GROUP = "radioGroup",
        SEPARATOR_MI = { type: "separator" },
        TB_BUTTON = "BUTTON",
        TB_MENU = "MENU";
  config.toolbarData =[
        {
            id: "search",
            controls: [
                {
                    type: TB_MENU,
                    id: "actions_button",
                    labelKey: "APEX.IG.ACTIONS",
                    menu: {
                        items: [                                
                            SEPARATOR_MI,
                            {
                              type: ACTION,
                              id: "certificaciones_nomina",
                              label: "Ingrese Números de Certificaciones Para la Nómina",    
                              icon:"fa fa-table", 
                              action: "certificaciones_nomina", 
                              iconBeforeLabel: true   
                            },  
                            SEPARATOR_MI,
                            {
                              type: ACTION,
                              id: "validar_nomina",
                              label: "Control Previo de Nómina",    
                              icon:"fa fa-square-o",   
                              action: "validar_nomina", 
                              iconBeforeLabel: true   
                            },
                            {
                              type: ACTION,
                              id: "contabilizar_nomina",
                              label: "Contabilice Nómina",    
                              icon:"fa fa-database", 
                              action: "contabilizar_nomina", 
                              iconBeforeLabel: true   
                            },
                            SEPARATOR_MI,
                            {
                               type: ACTION,
                               id: "Generar_SPI",
                               label: "Genere Archivos SPI para Pagos de Nómina",    
                               icon:"fa fa-files-o",
                               action: "Generar_SPI", 
                               iconBeforeLabel: true   
                            },                                                      
                            SEPARATOR_MI,
                            {
                                type: ACTION,
                                id: "Exportar Excel",
                                label: "Exportar Excel",    
                                icon:"fa fa-file-excel-o",
                                action: "GPVGETXLSX", //esta accion esta declarada en el archivo IG2MSEXCEL.js del plugin
                                //al utilizarla aqui ejecuta directamente la pulsacion del boton 
                                iconBeforeLabel: true
                            },
                            {
                                type: "subMenu",
                                id: "save_report_submenu",
                                labelKey: "APEX.IG.REPORT",
                                icon: "icon-irr-saved-report", //todo get ig icon, was "icon-ig-report-settings",
                                menu: {
                                    items: [
                                        {
                                            type: ACTION,
                                            action: "save-report"
                                        },
                                        {
                                            type: ACTION,
                                            action: "show-save-report-as-dialog"
                                        },
                                        {
                                            type: ACTION,
                                            action: "show-edit-report-dialog"
                                        },
                                        SEPARATOR_MI,
                                        {
                                            type: ACTION,
                                            action: "delete-report"
                                        },
                                        SEPARATOR_MI,
                                        {
                                            type: ACTION,
                                            action: "reset-report"
                                        },
                                        {
                                            type: ACTION,
                                            action: "show-columns-dialog"
                                        }
                                    ]
                                }
                            }

                        ]
                    }
                }
            ]
        },
        {
            id: "reports",
            align: "end",
            controls: [
                {
                    type: "SELECT",
                    action: "change-report"
                }
            ]
        },
    ]
    config.defaultGridViewOptions = {
        rowHeader: "sequence"
    }  
    config.initActions = function( actions ) {             
        actions.add( {
            name: "Generar_SPI",           
            action: function(event, focusElement) {                   
                if( $v('P495_GENO_IS_CONTABILIZADO_CABECERA') =='N'){
                    fu_mensajes_pantalla('','La nómina aún no está contabilizada, no puede proceder','P',3000);
                }   
                else{
                  openModal('r_inline_archivos_spi');   
                  $('div[aria-describedby="r_inline_archivos_spi"]').css({'width': '1128px',
                                                                          'top': '37px',
                                                                          'height': '350px'});  
                  apex.region('ig_nomina_format').refresh();
                  $('#ui-id-2').text('Formato SPI  Valores a Pagar - '+ $v('P495_GENO_TIPO_NOMINA_CABECERA')+' No.: '+
                                     $v('P495_ID_GENO_PIVOTE') );
                }    
            }    
        } );
        actions.add( {
            name: "validar_nomina",           
            action: function(event, focusElement) {  
                if( $v('P495_GENO_IS_VERIFICADO_CABECERA')=='S'){
                    fu_mensajes_pantalla('','La nómina ya fue validada','P',3000);
                }
                else{
                  apex.message.confirm( "Revisó los datos y la nómina tiene todos los valores correctos ?", function( okPressed ) { 
                    if( okPressed ) {
                      apex.server.process( 
                          'control_previo',
                          { x01: $v('P495_ID_GENO_PIVOTE')},  // Parametros
                          {
                             success: function (pData) {                                     
                                 if (pData.match(/.*Nómina revisada y validada.*/)){
                                    fu_mensajes_pantalla('',pData,'S',3000);
                                    $s('P495_GENO_IS_VERIFICADO_CABECERA','S');
                                    closeModal('r_dialog_contenedor_detalle_nomina');
                                 }
                                 else{
                                    fu_mensajes_pantalla('',pData,'P',3000); 
                                 }
                             },
                             error: function(e){
                                fu_mensajes_pantalla('','Error al validar la nómina','P',3000);
                             },
                             dataType: "text"                       
                          }
                      );    
                    }
                  });
               }     
            }    
        } );
        actions.add( {
            name: "certificaciones_nomina",           
            action: function(event, focusElement) { 
              if( $v('P495_GENO_IS_CONTABILIZADO_CABECERA')=='S'){
                    fu_mensajes_pantalla('','La nómina ya fue contabilizada,no puede ingresar certificaciones','P',3000);
              }   
              else{  
                apex.server.process( 
                   'procesos_numeros_certificacion',
                   { x01: $v('P495_ID_GENO_PIVOTE')},  // Parametros
                   {
                      success: function (pData) {                             
                           if (pData.match(/OK.*/)){   
                               openModal('r_inline_numeros_certificacion');        
                               apex.region('r_numeros_certificacion_nomina').refresh();
                               $('div[aria-describedby="r_inline_numeros_certificacion"]').css({'width': '1023',
                                                                          'top': '37px'});                                  
                           }
                           else{
                              fu_mensajes_pantalla('',pData,'P',5000);
                           }
                      },
                      error: function(e){
                         console.log("Error: ", e);
                      },
                      dataType: "text"                       
                   }
                );  
              }    
            }    
        } );
        actions.add( {
            name: "contabilizar_nomina",           
            action: function(event, focusElement) {
               if( $v('P495_GENO_IS_CONTABILIZADO_CABECERA')=='S'){
                    fu_mensajes_pantalla('','La nómina ya fue contabilizada','P',3000);
               } 
               else{
                  if( $v('P495_GENO_IS_VERIFICADO_CABECERA') =='N'){
                    fu_mensajes_pantalla('','Nómina aún no ha sido validada en control previo, no puede proceder','P',3000);
                  }   
                  else{
                      apex.message.confirm( "Desea generar la transacción contable para esta nómina ?", function( okPressed ) { 
                        if( okPressed ) {
                            openModal('r_alerta_pregunta_contabiliza'); 
                        }    
                      });                  
                  } 
               }    
            }    
        } );
    }
  return config;
} 

function barra_spi(config){
    var TB_MENU = "MENU",
        TOGGLE = "toggle",
        ACTION = "action",
        TOGGLE = "toggle",
        RADIO_GROUP = "radioGroup",
        SEPARATOR_MI = { type: "separator" },
        TB_BUTTON = "BUTTON",
        TB_MENU = "MENU";
  config.toolbarData =[
        {
            id: "search",
            groupTogether: true,
            controls: [
                {
                    type: TB_MENU,
                    id: "column_filter_button",
                    labelKey: "APEX.IG.SELECT_COLUMNS_TO_SEARCH",
                    icon: "icon-search",
                    iconOnly: true,
                    menu: {
                        items: [
                            {
                                type: TOGGLE,
                                action: "search-case-sensitive"
                            },
                            SEPARATOR_MI,
                            {
                                type: RADIO_GROUP,
                                action: "filter-column"
                            }
                        ]
                    }
                },
                {
                    type: "TEXT",
                    id: "search_field",
                    enterAction: "search"
                },
                {
                    type: TB_BUTTON,
                    action: "search"
                }
            ]
        },
        {
            id: "actions2",
            controls: [                
                {
                    type: TB_BUTTON,
                    hot: false,
                    action: "save"
                }
            ]
        }, 
        {
            id: "actions4",
            align: "end",
            controls: [
                {
                    type: TB_BUTTON,
                    action: "descargar_archivo_txt",                                        
                    icon:"fa fa-cloud-download",  
                    iconOnly: false,
                    hot: false,
                    id:"descargar_archivo_txt",
                    title:"Descargar Beneficiarios txt",
                    label:"Descargar Beneficiarios txt",
                    iconBeforeLabel: true
                },
                {
                    type: TB_BUTTON,
                    action: "descargar_archivo_spi",                                        
                    icon:"fa fa-cloud-download",  
                    iconOnly: false,
                    hot: false,
                    id:"descargar_archivo_spi_xls",
                    title:"Descargar SPI XLS",
                    label:"Descargar SPI XLS",
                    iconBeforeLabel: true
                },
                {
                    type: TB_BUTTON,
                    action: "descargar_archivo_spi_xls",                                        
                    icon:"fa fa-cloud-download",  
                    iconOnly: false,
                    hot: false,
                    id:"descargar_archivo_spi",
                    title:"Descargar Beneficiarios XLS",
                    label:"Descargar Beneficiarios XLS",
                    iconBeforeLabel: true
                }
            ]
        }

    ]
    
    config.initActions = function( actions ) {             
        actions.add( {
            name: "descargar_archivo_spi",           
            action: function(event, focusElement) { 
               $('#ig_nomina_format_ig_toolbar_descargar_archivo_bene').attr('disabled');
               lSpinner$ = apex.util.showSpinner( $( "#r_inline_archivos_spi" ) ); 
               apex.server.process( 
                  'solicita_archivos',
                  { x01: $v('P495_ID_GENO_PIVOTE')},  // Parametros
                    {
                      success: function (pData) {                               
                        myVar = setTimeout(funcion_extraccion, 4000);                          
                      },
                      error: function(e){
                         console.log("Error: ", e);
                      },
                      dataType: "text"                       
                  }
               );        
            }    
        } );   
        actions.add( {
            name: "descargar_archivo_txt",           
            action: function(event, focusElement) { 
               $('#ig_nomina_format_ig_toolbar_descargar_archivo_bene').attr('disabled');
               lSpinner$ = apex.util.showSpinner( $( "#r_inline_archivos_spi" ) ); 
               apex.server.process( 
                  'solicita_archivos',
                  { x01: $v('P495_ID_GENO_PIVOTE')},  // Parametros
                    {
                      success: function (pData) {                               
                        myVar = setTimeout(funcion_extraccion_txt, 4000);                          
                      },
                      error: function(e){
                         console.log("Error: ", e);
                      },
                      dataType: "text"                       
                  }
               );        
            }    
        } );   
        actions.add( {
            name: "descargar_archivo_spi_xls",           
            action: function(event, focusElement) { 
               $('#ig_nomina_format_ig_toolbar_descargar_archivo_bene').attr('disabled');
               lSpinner$ = apex.util.showSpinner( $( "#r_inline_archivos_spi" ) ); 
               apex.server.process( 
                  'solicita_archivos',
                  { x01: $v('P495_ID_GENO_PIVOTE')},  // Parametros
                    {
                      success: function (pData) {                               
                        myVar = setTimeout(funcion_extraccion_spi_xls, 4000);                          
                      },
                      error: function(e){
                         console.log("Error: ", e);
                      },
                      dataType: "text"                       
                  }
               );        
            }    
        } ); 
        
    }
  return config;
} 

function fu_remueve_frezze(id_region){
  $(id_region).on("gridactivatecolumnheader", function(e){
     setTimeout(function() {
          $(id_region+"_ig_column_header_menu").find("[data-option='freeze']").remove();       
      },1);
  });
}    


function fu_elimina_nomina(v_nomina,v_periodo,v_periodo_anterior){
   apex.server.process( 
      'elimina_nomina',
      { x01: v_nomina,
        x02: v_periodo},  // Parametros
        {
          success: function (pData) {        
             if (pData.match(/OK.*/)){
                 fu_mensajes_pantalla('','Transacción efectuada, nómina eliminada','S',3000)
                 var indice = $('#NOMINAS_IZQUIERDA_report').find('a[href*="'+v_nomina+'"').parent().index();
                 $('#NOMINAS_IZQUIERDA_report').find('li:eq('+indice+')').remove();
                 fu_consulta_nomina(v_nomina-1,v_periodo_anterior);
             }
             else{
                fu_mensajes_pantalla('','Error al eliminar nómina '+pData,'P',3000); 
             } 
          },
          error: function(e){
              console.log("Error: ", e);
          },
          dataType: "text"                       
        }
   );   
}

function fu_mensajes_pantalla(item,texto,tipo,tiempo){
    if (tipo == 'I'){
      apex.message.showErrors([
       {
         type:       "error",
         location:   [ "page","inline"],       
         pageItem:   item,  
         message:    texto,
         unsafe:     false
       }]);  
       setTimeout(function() {
          $('#t_Alert_Notification').fadeOut(1000); 
           apex.message.clearErrors();
       }, tiempo);   
    }
    else if(tipo=='P'){
       apex.message.clearErrors();
       apex.message.showErrors([
       {
         type:       "error",
         location:   [ "page"],         
         message:    texto,
         unsafe:     false
       }]);           
       setTimeout(function() {
          $('#t_Alert_Notification').fadeOut(1000); 
       }, tiempo);      
    }
    else if(tipo == 'S'){
        apex.message.showPageSuccess(texto);
        setTimeout(function() {
          $('#t_Alert_Success').fadeOut(1000); 
           apex.message.clearErrors();
       }, tiempo);
    }
}
