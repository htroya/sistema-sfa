//esto pone un color a la nomina seleccionada de lado izquierdo
$('#NOMINAS_IZQUIERDA span').each(function(){  
    if($(this).text() == "Nómina No.: "+$v('P495_ID_GENO_PIVOTE')){   
      $(this).css({"background-color":"#daa6da"});
      return false;
    }
});


$s('P495_ID_GENO_PIVOTE',null);



/* esto hace que el menu del lado izquierdo se cierra utomatico */
/*(function($) {    
$(window).on('theme42ready', function() {    
    if ($('.t-PageBody').hasClass('js-navExpanded')) {
        $('#t_Button_navControl').click();
    }
    $('.apex-side-nav .t-Body-nav').hover(
        function(){
            //only expand if the side menu is collapsed
            $('.t-PageBody:not(.js-navExpanded) #t_Button_navControl').click();
        },
        function() {
            $('#t_Button_navControl').click();
        }
    );
});
})(apex.jQuery);*/


$('#EMPLEADOS_DERECHO_report').find('.t-MediaList-body').css({'position': 'relative',
                                                              'left': '-7px',
                                                              'padding-right': '20px'});

$('#EMPLEADOS_DERECHO_report').find('.t-MediaList-badgeWrap').css({'position': 'relative',
                                                                   'padding-left': '0px',
                                                                   'padding-right': '0px'});

$('#EMPLEADOS_DERECHO_report').find('.t-MediaList-itemWrap ').css({'position': 'relative',
                                                                   'left': '-8px'});


$('#INGRESOS_GRID_ig_grid_vc_pageRange').attr('title','Totales Por Tipo');
$('#GASTOS_GRID_ig_grid_vc_pageRange').attr('title','Totales Por Tipo');
$('#PROVISIONES_GRID_ig_grid_vc_pageRange').attr('title','Totales Por Tipo');

var model = apex.region('r_dialog_ig_detalle_nomina').widget().interactiveGrid("getCurrentView").model;

model.subscribe({
    onChange: function(changeType, change) {
       // console.log(changeType); 
       if (changeType == 'refresh'){
          id_reporte_actual =$('#r_dialog_ig_detalle_nomina_ig_toolbar').find('select').val(); 
          var v_array = apex.region("r_dialog_ig_detalle_nomina").widget().interactiveGrid("getReports");          
          v_array.forEach(function(e) {      
              if (e.name == "Todos los Rubros"){
                 id_reporte_1 = e.id;
              }  
              if (e.name == "Formato de Nómina Principal"){
                 id_reporte_2 = e.id;
              }  
              if (e.name == "Formato de Nómina Secundaria"){
                 id_reporte_3 = e.id;
              }  
          });          
       }
       else{
           if(changeType == 'addData'){
               setTimeout(function(){
                   $('#r_dialog_ig_detalle_nomina').find('.a-GV-w-hdr').find('colgroup').find('col[data-idx="10"]').attr('width','130');
                   $('#r_dialog_ig_detalle_nomina').find('.a-GV-w-scroll').find('colgroup').find('col[data-idx="10"]').attr('width','130');
                   $('#tabla_totales_secundaria').find('colgroup').find('col[data-idx="11"]').attr('width','95');
                   $('#tabla_totales_secundaria').find('colgroup').find('col[data-idx="14"]').attr('width','92');
                   $('#tabla_totales_secundaria').find('colgroup').find('col[data-idx="24"]').attr('width','121');
                   $('#tabla_totales_secundaria').find('colgroup').find('col[data-idx="27"]').attr('width','85');
                   $('#tabla_totales_secundaria').find('colgroup').find('col[data-idx="29"]').attr('width','60');},
               100);               
           }    
       }        
    }
});

var model = apex.region('r_numeros_certificacion_nomina').widget().interactiveGrid("getCurrentView").model;

model.subscribe({
    onChange: function(changeType, change) {       
       if (changeType == 'refresh'){           
           var myVar = setInterval(myTimer, 1000);
           function myTimer() {
              if ($('#r_numeros_certificacion_nomina_ig_grid_vc .a-GV-bdy .a-GV-w-scroll .a-GV-table tbody tr.is-grandTotal').length){                                   
                  clearInterval(myVar);                                    
                  $('#r_numeros_certificacion_nomina_ig_grid_vc .a-GV-bdy .a-GV-w-scroll .a-GV-table tbody tr.is-grandTotal')
                   .find('td:eq(2)').text($v('P495_TOTAL_NUMEROS_CERT'));                                      
              }  
            }
           
       }     
    }
});

fu_remueve_frezze("#ig_nomina_format");
fu_remueve_frezze("#INGRESOS_GRID");
fu_remueve_frezze("#GASTOS_GRID");
fu_remueve_frezze("#PROVISIONES_GRID");
fu_remueve_frezze("#r_numeros_certificacion_nomina");





$('#P495_GENO_IS_CONTABILIZADO_CABECERA').parent().find('.a-Switch-toggle').first().css('left','35%');

$('#P495_GENO_IS_VERIFICADO_CABECERA').parent().find('.a-Switch-toggle').first().css('left','3%');


requirejs.config({
    waitSeconds : 20
});


var_root = document.querySelector(':root');

