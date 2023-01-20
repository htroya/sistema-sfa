declare   
   salida_web_service varchar2(1000);
   salida_ejecucion varchar2(1000);   
   /*x01: 'http://sistema-sfa.com:1335/empleado_31',
             x02:'GET',
             x03: 'cantidad_empleados_por_nomina',
             x04: '"CANTIDAD"'
             x05:v_codigo_nomina*/
begin   
    pr_ejecuta_web_service(apex_application.g_x01 ,apex_application.g_x02,apex_application.g_x03,
                           apex_application.g_x04,apex_application.g_x05,salida_ejecucion,salida_web_service);   
    htp.p(salida_ejecucion||';'||salida_web_service);                      
   
end;
