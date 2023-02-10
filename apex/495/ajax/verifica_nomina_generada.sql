declare
   is_nomina number;
   is_generado number;
   periodo_nomina_anterior varchar2(10);
begin   
   begin
	  select nvl(count(1),0)
	  into is_nomina
	  from rrhh_nomina_empleado@emcoepnew_link
	  where ID_GENO = apex_application.g_x01;	  
   exception
      when others then
  	     is_nomina := 0;
   end;
   begin
     select nvl(count(1),0)
     into is_generado
     from dcpg@emcoepnew_link
     where seq_nood_cdg = apex_application.g_x01;	  
   exception
      when others then
         is_generado := 0;
   end;
   begin
      select to_char(geno_periodo_aplica,'mm/yyyy') 
      into periodo_nomina_anterior
      from rrhh_generacion_nomina@emcoepnew_link 
      where id_geno = apex_application.g_x01 -1;
   exception
      when others then
         periodo_nomina_anterior := to_char(sysdate,'mm/yyyy');
   end;
  
   if is_nomina = 0 and is_generado = 0 then
      --se borrar sin preguntar pues nomina no existe
      htp.p('BORRA_0_PREGUNTA-'||periodo_nomina_anterior);
   elsif is_nomina > 0 and is_generado = 0 then
      --se borra nomina preguntando pues ya existe
      htp.p('BORRA_1_PREGUNTA-'||periodo_nomina_anterior);
   elsif is_nomina > 0 and is_generado > 0 then
      --se borra nomina con doble pregunta pues ya fue contabilizada
     htp.p('BORRA_2_PREGUNTA-'||periodo_nomina_anterior);
   end if;
end;    
