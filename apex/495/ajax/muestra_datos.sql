declare
  codigo_nomina number;
  periodo varchar2(10);
  periodo_aplica varchar2(10);
  contabilizado varchar2(1);
  liquidacion varchar2(1);
  tipo_nomina varchar2(30);
  observaciones varchar2(1000);
  total_ingresos varchar2(30);
  total_gastos varchar2(30);
  total_provisiones varchar2(30);
  valor_numeros_cert varchar2(30);
  revisado varchar2(1);
  cursor a is select to_char(nvl(sum(Ingresos),0) ,'FML999,999,999,990.09') Ingresos,
                     to_char(nvl(sum(Gastos),0) ,'FML999,999,999,990.09') Gastos,
                     to_char(nvl(sum(Provisiones),0) ,'FML999,999,999,990.09') Provisiones
              from
              (select round(noem_total,2) noem_total ,noem_posicion             
               from rrhh_nomina_empleado@emcoepnew_link a
               where id_geno = apex_application.g_x01 )
               pivot
               (sum(round(noem_total,2))
                for noem_posicion in(14 Ingresos,23 Gastos,30 Provisiones));     
begin  
   select id_geno,to_char(GENE_PERIODO,'mm/yyyy'),to_char(GENO_PERIODO_APLICA,'mm/yyyy'),
          GENO_IS_CONTABILIZADO,decode(GENO_TIPO_NOMINA,1,'Nómina Principal','Nómina Secundaria'),
          GENO_OBSERVACIONES,bandera_control_previo,geno_is_liquidacion
   into codigo_nomina,periodo,periodo_aplica,contabilizado,tipo_nomina,observaciones,revisado,liquidacion
   from rrhh_generacion_nomina@emcoepnew_link
   where id_geno = apex_application.g_x01;
   
   for w_a in a loop
      total_ingresos := w_a.Ingresos;
      total_gastos := w_a.Gastos;
      total_provisiones := w_a.Provisiones;
   end loop;   
   
   begin
     PR_GENERA_TABLA_SPI@emcoepnew_link(apex_application.g_x01,apex_application.g_x02,'40102');
   end;  
   
   begin
      select to_char(sum(ceno_valor),'999,999,990.09')
      into valor_numeros_cert
      from NUMEROS_CERTIFICACION_NOMINA@emcoepnew_link
      where id_geno = apex_application.g_x01;
   exception
     when others then
          valor_numeros_cert := '0.00';
   end;       
          
   apex_json.open_object;
   apex_json.write('p_codigo_nomina', codigo_nomina);
   apex_json.write('p_periodo', periodo);
   apex_json.write('p_periodo_aplica', periodo_aplica);
   apex_json.write('p_contabilizado', contabilizado);
   apex_json.write('p_liquidacion', liquidacion);
   apex_json.write('p_tipo_nomina', tipo_nomina);
   apex_json.write('p_observaciones', observaciones);
   apex_json.write('p_total_ingresos', total_ingresos);
   apex_json.write('p_total_gastos', total_gastos);
   apex_json.write('p_total_provisiones', total_provisiones);
   apex_json.write('p_revisado', revisado);
   apex_json.write('p_valor_numeros_cert', valor_numeros_cert);
   apex_json.close_all;
end;       
