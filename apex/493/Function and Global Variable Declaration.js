var lSpinner$;
var htmldb_delete_message='"DELETE_CONFIRM_MSG"';

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

function fu_valida_nomina(v_codigo_nomina,v_periodo_aplica,v_tipo_nomina){    
   if ($v('P493_GENO_TIPO_NOMINA') == 2 ){                            
      fu_cuenta_fondo_reserva(v_codigo_nomina,v_periodo_aplica,v_tipo_nomina);
   }
   else{
      fu_genera_nomina(v_codigo_nomina,v_periodo_aplica,v_tipo_nomina,$v('P493_FUNCIONARIOS_NOMINA'),
                       $v('P493_COMPONENTES_A_USARSE'),$v('P493_NOMINAS_FONDOS_RESERVA'),1);       
   }   
}
                       
function fu_cuenta_fondo_reserva(v_codigo_nomina,v_periodo_aplica,v_tipo_nomina){    
   apex.server.process( 
           'pr_ejecuta_web_service_ajax',
           { x01: 'http://sistema-sfa.com:1336/nomina_249_nfre',
             x02:'GET',
             x03: 'id_geno_aplica',
             x04: v_codigo_nomina,
             x05: '"ID_GENO_APLICADA"'
           },  // Parametros
           {
             success: function (pData) {                              
                 var salida_array = pData.split(';');                    
                 if ( salida_array[0] == 'OK'){ 
                     if (!salida_array[0].match(/.*OK.*/) || salida_array[1].match(/.*Error.*/)){ 
                         fu_mensajes_pantalla('','No están configuradas las nóminas que se usarán para el cálculo del fondo de reserva' ,
                                             'P',3000);                                                
                         lSpinner$.remove();
                     }
                     else{
                         $s('P493_NOMINAS_FONDOS_RESERVA',salida_array[1].trim());
                         fu_genera_nomina(v_codigo_nomina,v_periodo_aplica,v_tipo_nomina,$v('P493_FUNCIONARIOS_NOMINA'),
                                          $v('P493_COMPONENTES_A_USARSE'),$v('P493_NOMINAS_FONDOS_RESERVA'),1);    
                     }              
                 }
                 else{
                     fu_mensajes_pantalla('','Error al generar nómina en verificación de fondos de reserva'+salida_array[0] ,'P',3000);
                     lSpinner$.remove();
                 }
             },
             error: function(e){
                  fu_mensajes_pantalla('','Error al generar web service que verifica nóminas fondos de reserva'+e,'P',3000);
                  lSpinner$.remove();
             },
             dataType: "text"                       
           }
        );    
}

function fu_genera_nomina(v_codigo_nomina,v_periodo_aplica,v_tipo_nomina,v_lista_empleados,
                          v_lista_componentes,v_lista_nominas_fr,v_orden_ejecucion){        
    apex.server.process( 
           'pr_ws_crea_proceso_batch',
           { x01: v_codigo_nomina,
             x02: v_periodo_aplica,
             x03: v_tipo_nomina,
             x04: v_lista_empleados,
             x05: v_lista_componentes,
             x06: v_lista_nominas_fr,
             x07: v_orden_ejecucion           
           },  // Parametros
           {
             success: function (pData) {                                             
                 if (pData.match(/.*OK.*/)){      
                    var cantidad_funcionarios = $v('P493_FUNCIONARIOS_NOMINA').trim().split(',').join("").length/4;
                    apex.message.confirm( 'Generar la nómina No.'+$v('P493_ID_GENO')+' en el periodo: '+$v('P493_GENO_PERIODO_APLICA')+
                                          ' para '+cantidad_funcionarios+' funcionarios ?',
                      function( okPressed ) { 
                         if( okPressed ) {                                    
                             lSpinner$.remove();
                             fu_mensajes_pantalla('','Nómina ejecutandose ...','S',1500);  
                             
                             for (var i= 1;i<=7;i++){
                               (async () => {                                                                   
                                  await  consume_bat(i,'https://sistema-sfa.com:1338/ejecuta?nombre_bat=todobat'+i);         
                               })();
                             }    
                         }
                         else{
                             lSpinner$.remove();
                         }
                      }
                    ); 
                    
                    //fu_mensajes_pantalla('','Nómina generada','S',2000);  
                 }              
                 else{
                    lSpinner$.remove();
                    fu_mensajes_pantalla('','Error al generar proceso bacth de nómina '+ pData,'P',3000);                     
                    return;
                 }
             },
             error: function(e){
                  lSpinner$.remove();
                  fu_mensajes_pantalla('','Error al generar web service que obtiene funcionarios para la nómina'+e,'P',3000);                  
                  return;
             },
             dataType: "text"                       
           }
        );      
}

function customOnCloseEvent(event, data){
   apex.server.process( 
           'fu_ws_empleados_nomina',
           { x01: $v('P493_ID_GENO')
           },  // Parametros
           {
             success: function (pData) {                              
                 var salida_array = pData.split('--');                    
                 if ( salida_array[0].match(/.*OK.*/)){                      
                      $s('P493_FUNCIONARIOS_NOMINA',salida_array[1].trim());
                 }
                 else{
                     fu_mensajes_pantalla('','Error al obtener funcionarios para la nómina'+salida_array[0] ,'P',3000);                     
                 }
             },
             error: function(e){
                  fu_mensajes_pantalla('','Error al generar web service que obtiene funcionarios para la nómina'+e,'P',3000);                  
             },
             dataType: "text"                       
           }
        );    
}

function fu_extrae_componentes_a_usarse(v_periodo_in){
    apex.server.process( 
           'fu_ws_componentes_usar_nomina',
           { x01: ''
           },  // Parametros
           {
             success: function (pData) {                                  
                 var salida_array = pData.split('--');                    
                 if (!salida_array[0].match(/.*OK.*/) || salida_array[1].match(/.*Error.*/)){                      
                     fu_mensajes_pantalla('','Error al obtener componentes salariales para la nómina'+salida_array[1] ,'P',3000); 
                     return;
                 }
                 else{
                     $s('P493_COMPONENTES_A_USARSE',salida_array[1].trim());
                     if ($v('P493_COMPONENTES_A_USARSE').length > 0){
                            lSpinner$ = apex.util.showSpinner();    
                            fu_valida_nomina($v('P493_ID_GENO'),v_periodo_in,$v('P493_GENO_TIPO_NOMINA'));                             
                     }    
                 }
             },
             error: function(e){
                  fu_mensajes_pantalla('','Error al generar web service que obtiene componentes salariales para la nómina'+e,'P',3000);
                  return;
             },
             dataType: "text"                       
           }
        );    
}

async function consume_bat(id_ejecucion,theUrl) {  
  try{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl ); // false en el tercer parametro para synchronous request
    xmlHttp.send( null );       
    if (xmlHttp.responseText  == 'OK' && id_ejecucion == 7){
         lSpinner$.remove();
         fu_mensajes_pantalla('','Nómina generada','S',2000);                
    }      
    return xmlHttp.responseText;      
  } catch (error) {   
      Spinner.remove();
      console.log('Error invocando bat '+error);      
  }    
}

