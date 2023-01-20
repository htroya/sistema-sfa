declare
  salida clob;
  --x01: id_nomina
begin
   htp.p(fu_ws_empleados_nomina(apex_application.g_x01));   
end;
