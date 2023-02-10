declare
  salida varchar2(4000);  
begin
  begin    
    delete rrhh_nomina_empleado@emcoepnew_link where ID_GENO = apex_application.g_x01; 
    delete rrhh_nomina_empleado_format@emcoepnew_link;
    delete rrhh_empleados_por_nomina@emcoepnew_link where id_geno = apex_application.g_x01; 
    delete RRHH_GENERACION_NOMINA@emcoepnew_link where id_geno = apex_application.g_x01; 
    commit;    
    salida := 'OK';
  exception
     when others then
       salida := sqlerrm;      
  end;  
  htp.p(salida);
end;  
