declare
  is_no_existe_prpg number;
  is_liquidacion varchar2(1);
begin
   begin        
      select nvl(geno_is_liquidacion,'N')
      into is_liquidacion
      from rrhh_generacion_nomina@emcoepnew_link 
      where id_geno = apex_application.g_x01;
    exception
      when others then
         is_liquidacion := 'N';
   end;     
   if is_liquidacion = 'S' then  
      begin
        select count(distinct a.id_emp)
        into is_no_existe_prpg
        from rrhh_nomina_empleado@emcoepnew_link a,rrhh_empleado@emcoepnew_link b,prpg@emcoepnew_link c
        where id_geno = apex_application.g_x01
        and a.id_emp = b.id_emp
        and b.empl_identificacion = c.prpg_ruc (+)
        and prpg_ruc is null;
      exception
        when others then
           is_no_existe_prpg := 0;
     end;       
  
     if is_no_existe_prpg  > 0 then       
          htp.p('Existen funcionarios que no están creados en registro de proveedores del SIGAC, para continuar debe ingresarlos');
          return;
     else
       begin
          pr_actualiza_control_previo@emcoepnew_link(apex_application.g_x01);
          htp.p('Nómina revisada y validada');
       exception
         when others then
             htp.p('Error al registrar control previo '||sqlerrm);
       end;
     end if;  
  else     
     begin
       pr_actualiza_control_previo@emcoepnew_link(apex_application.g_x01);
       htp.p('Nómina revisada y validada');
     exception
       when others then
           htp.p('Error al registrar control previo '||sqlerrm);
     end;
   end if;  
end;
