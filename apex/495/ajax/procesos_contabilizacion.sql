declare
   salida varchar2(1000);
   /*x01: $v('P495_FECHA_CONTABILIZACION'),
     x02: $v('P495_ID_GENO_PIVOTE'),
     x03: $v('P495_GENE_PERIODO_APLICA_CABECERA')*/
   is_cuarto varchar2(1);  
   is_tercer varchar2(1);  
begin   
   begin
     select nvl(geno_is_decimo_cuarto,'N')
     into is_cuarto
     from  rrhh_generacion_nomina@emcoepnew_link 
     where id_geno = apex_application.g_x02;
   exception
     when others then
        is_cuarto := 'N';
   end;
   begin
     select nvl(geno_is_decimo_tercer,'N')
     into is_tercer
     from  rrhh_generacion_nomina@emcoepnew_link 
     where id_geno = apex_application.g_x02;
   exception
     when others then
        is_tercer := 'N';
   end;
   if is_tercer = 'N' then
   salida := fu_crea_certificaciones_web@emcoepnew_link(apex_application.g_x01,apex_application.g_x02,apex_application.g_x03);   
   if salida = 'OK' then
      salida :=  fu_crea_compromisos_web@emcoepnew_link(apex_application.g_x01,apex_application.g_x02,apex_application.g_x03);      
      if salida = 'OK' then
         salida := fu_doc_principal_nomina_web@emcoepnew_link(apex_application.g_x01,apex_application.g_x02,apex_application.g_x03);
         if salida = 'OK' then 
            salida := fu_crea_cert_prov_web@emcoepnew_link(apex_application.g_x01,apex_application.g_x02,apex_application.g_x03);
            if salida = 'OK' then
               salida := fu_crea_comp_prov_web@emcoepnew_link(apex_application.g_x01,apex_application.g_x02,apex_application.g_x03);
               if salida = 'OK' then
                 salida := pr_carga_docu_auxiliares_web@emcoepnew_link(apex_application.g_x01,apex_application.g_x02,apex_application.g_x03);
                 if salida = 'OK' then
                   commit;
                   salida := fu_genera_transaccion_web@emcoepnew_link(apex_application.g_x01,apex_application.g_x02,apex_application.g_x03);
                   if salida = 'OK' then      
                      pr_actualiza_salientes_web@emcoepnew_link(apex_application.g_x01,apex_application.g_x02);
                      commit;
                      htp.p('OK');
                   else
                     rollback;
                     htp.p(salida);   
                   end if;
                 else
                   rollback;
                   htp.p(salida);   
                 end if;
               else
                 rollback;
                 htp.p(salida);   
               end if;  
            else
              rollback;
              htp.p(salida);  
            end if;
         else
           rollback;
           htp.p(salida); 
         end if;
      else
        rollback;
        htp.p(salida);
      end if;
   else
      rollback;
      htp.p(salida);
   end if;
   else
     update rrhh_generacion_nomina@emcoepnew_link  set GENO_IS_CONTABILIZADO = 'S'  where id_geno = apex_application.g_x02;
     commit;
     htp.p('OK');
   end if;
end;   
