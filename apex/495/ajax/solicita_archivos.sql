declare
  cantidad_registros number;
begin  
  begin
     select count(1)
     into cantidad_registros 
     from rrhh_nomina_empleado_spi@emcoepnew_link a 
     where a.referencia = apex_application.g_x01
     and comp_24 > 0 and pagar = 'S';
   exception
     when others then
        cantidad_registros := 0;
  end;     

  
  begin
    pr_rrhh_listener_spi('C:\SPI-2005\listener_spi.bat',cantidad_registros,apex_application.g_x01);
  exception
    when others then
       null;
  end;  

end;  
