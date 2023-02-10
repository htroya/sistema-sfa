declare
  is_crea_cert varchar2(2);
	
  cursor a is select nvl(round(sum(a.noem_total),2),0) valor,c.cnpc_cdg,d.CNPC_NMB
  from rrhh_nomina_empleado@emcoepnew_link a, rrhh_componentes@emcoepnew_link b,cnts@emcoepnew_link c,cnpc@emcoepnew_link d
  where id_geno = apex_application.g_x01
  and a.id_comp = b.id_comp
  and (b.comp_principal = 'S' or b.comp_posicion = 29)
  and a.id_sala = b.id_sala
  and c.cnpc_cdg = d.cnpc_cdg
  and c.CNTS_CDG_CTBLE = b.comp_gasto
  group by b.comp_gasto,c.cnpc_cdg,d.CNPC_NMB;
  
  cursor b is select nvl(round(sum(a.noem_total),2),0) valor, c.cnpc_cdg,d.CNPC_NMB,prsh_cdg_pers
  from rrhh_nomina_empleado@emcoepnew_link a, rrhh_componentes@emcoepnew_link b,cnts@emcoepnew_link c,cnpc@emcoepnew_link d
  where id_geno = apex_application.g_x01
  and a.id_comp = b.id_comp
  and b.comp_principal = 'N'
  and prsh_cdg_pers is not null
  and comp_pasivo is not null
  and c.cnpc_cdg = d.cnpc_cdg
  and a.id_sala = b.id_sala
  and c.CNTS_CDG_CTBLE = b.comp_gasto
  group by b.comp_gasto,c.cnpc_cdg,d.CNPC_NMB,prsh_cdg_pers,comp_pasivo,comp_gasto;
  
  
  
  clase_pago_parametro number;
  acreedor_parametro  number;
  tipo_documento_parametro  number;
  centro  varchar2(3);
  sub_centro varchar2(3);
  cuenta_pasivo varchar2(15);
  cuenta_pasivo_viaticos  varchar2(15);
  
  is_contabilizado varchar2(2);
  rol_usuario number;
  is_existe_registros number;
  is_aporte number;
  is_liquidacion varchar2(1);
  is_no_existe_prpg number;
begin 
  begin
	  select BANDERA_CREA_CERTIFICACION     
	  into is_crea_cert
	  from rrhh_parametros;
  exception
  	when others then
  	   is_crea_cert := 'N';
  end;	     
  if  is_crea_cert = 'S' then  --bandera en S implica que el sistema si crea las certificaciones
	 htp.p('No puede parametrizar certficaciones, porque son generadas automáticamente');
     return;
  elsif  is_crea_cert = 'N' then	 
	begin
	  select CLPP_CDG,PRSH_CDG_PERS,tpdc_cdg,CENTRO_COSTO,SUBCENTRO_COSTO,
	         CUENTA_CONTABLE_PASIVO,CUENTA_PASIVO_VIATICOS     
	  into clase_pago_parametro,acreedor_parametro,tipo_documento_parametro,
	       centro,sub_centro,cuenta_pasivo,cuenta_pasivo_viaticos
	  from rrhh_parametros;
    exception
  	   when others then
  	      htp.p('No existe el parametro clase de pago de parametros generales');
          return;
    end; 
    --se verifica si la nomina es de liquidacion
    begin        
      select nvl(geno_is_liquidacion,'N')
      into is_liquidacion
      from rrhh_generacion_nomina@emcoepnew_link 
      where id_geno = apex_application.g_x01;
    exception
      when others then
         is_liquidacion := 'N';
    end;         
	
	begin
	  select nvl(count(1),0)
	  into is_existe_registros
	  from numeros_certificacion_nomina@emcoepnew_link
	  where ID_GENO = apex_application.g_x01;		  
	exception
	  when others then
	     is_existe_registros := 0;
	end;	   
    
     
    
    if is_existe_registros = 0 and  is_liquidacion  = 'N' then
      for w_a in a loop
    	 insert into numeros_certificacion_nomina@emcoepnew_link(CENO_VALOR,               --1
                                                                 CENO_PARTIDA,             --2
                                                                 CENO_NOMBRE_PARTIDA,      --3
                                                                 ID_GENO,                  --4                                                          
                                                                 COMP_PRINCIPAL,           --5
                                                                 PRSH_CDG_PERS,            --6
                                                                 IS_CONTABILIZADO)         --7
                                                          values(w_a.valor,                         --1
                                                                 w_a.cnpc_cdg,                      --2
                                                                 w_a.CNPC_NMB,                      --3
                                                                 apex_application.g_x01,   --4
                                                                 'S',                               --5
                                                                  acreedor_parametro,                --6
                                                                 'N');                              --7                                                                                                                             
      end loop;
    
      for w_b in b loop
         if w_b.CNPC_NMB = 'APORTE PATRONAL' then
           begin
             select count(1)
             into is_aporte
             from numeros_certificacion_nomina@emcoepnew_link
             where CENO_NOMBRE_PARTIDA = w_b.CNPC_NMB
             and ID_GENO = apex_application.g_x01;
           exception
             when others then
                is_aporte := 0;
           end;
           if  is_aporte = 0 then 
    	     insert into numeros_certificacion_nomina@emcoepnew_link(CENO_VALOR,               --1
                                                                     CENO_PARTIDA,             --2
                                                                     CENO_NOMBRE_PARTIDA,      --3
                                                                     ID_GENO,                  --4                                                          
                                                                     COMP_PRINCIPAL,           --5
                                                                     PRSH_CDG_PERS,            --6
                                                                     IS_CONTABILIZADO)         --7
                                                              values(w_b.valor,                         --1
                                                                     w_b.cnpc_cdg,                      --2
                                                                     w_b.CNPC_NMB,                      --3
                                                                     apex_application.g_x01,   --4
                                                                     'N',                               --5
                                                                     w_b.prsh_cdg_pers,                 --6
                                                                    'N');                              --7                                                                                                                             
           end if;
         else
            insert into numeros_certificacion_nomina@emcoepnew_link(CENO_VALOR,               --1
                                                                     CENO_PARTIDA,             --2
                                                                     CENO_NOMBRE_PARTIDA,      --3
                                                                     ID_GENO,                  --4                                                          
                                                                     COMP_PRINCIPAL,           --5
                                                                     PRSH_CDG_PERS,            --6
                                                                     IS_CONTABILIZADO)         --7
                                                              values(w_b.valor,                         --1
                                                                     w_b.cnpc_cdg,                      --2
                                                                     w_b.CNPC_NMB,                      --3
                                                                     apex_application.g_x01,   --4
                                                                     'N',                               --5
                                                                     w_b.prsh_cdg_pers,                 --6
                                                                    'N');                              --7     
         end if;
      end loop;  
    elsif is_existe_registros = 0 and is_liquidacion  = 'S' then       
   
     ---se verifica si algun empleado aun no ha sido creado en prpg
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
       elsif is_no_existe_prpg  = 0 then
         pr_inserta_numeros_certif@emcoepnew_link(apex_application.g_x01);
       end if;  
    end if;
    commit;
    htp.p('OK');
  end if;	
end;
