declare
  salida varchar2(1000);
  /*x01: v_codigo_nomina,
    x02: v_periodo_aplica,
    x03: v_tipo_nomina,
    x04: v_lista_empleados,
    x05: v_lista_componentes,
    x06: v_lista_nominas_fr,
    x07: v_orden_ejecucion  
    pr_ws_crea_proceso_batch(v_lista_empleados clob,v_periodo varchar2,v_id_nomina number,
                             v_lista_componentes varchar2,v_lista_nominas_fr varchar2,
                             v_tipo_nomina varchar2,v_orden_ejecucion number,v_retorno out varchar2)*/
begin
  /*  host_command (p_command => 'del C:\temp\ejecuta*.bat');  
    host_command (p_command => 'del C:\temp\ejecuta*.sql');     
    host_command (p_command => 'del C:\temp\todobat*.bat');  */
    for i in 1 .. 7 loop
       pr_ws_crea_proceso_batch(apex_application.g_x04,apex_application.g_x02,apex_application.g_x01,
                                apex_application.g_x05,apex_application.g_x06,
                                apex_application.g_x03,i,salida);
   end loop;                             
   
   htp.p(salida);
end;

