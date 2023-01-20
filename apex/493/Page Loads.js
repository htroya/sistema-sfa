//cambia el titulo del dialogo pone  el numero de nomina y el periodo

apex.util.getTopApex().jQuery(".ui-dialog-content").dialog("option", "title", 
   "Creación de Nómina -- Nueva nómina Nro: " + $v('P493_ID_GENO'));

$('#r_tipos_salarios').hide();

