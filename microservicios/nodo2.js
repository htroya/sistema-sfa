//// index.js
const { ServiceBroker } = require("moleculer");
const HTTPServer = require("moleculer-web");

const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
const { NUMBER, STRING, DB_TYPE_NUMBER, DATE, DB_TYPE_VARCHAR  } = require("oracledb");
const oracledb = require('oracledb');

// se crea el broker node-2 y se define el nodo y la comunicacion
const brokerNode2 = new ServiceBroker({
  nodeID: "node-2",  //nomina 192.168.20.249 puerto 1336 (node-2)  llamada http://sistema-sfa.com:1336/nomina
   transporter: "NATS", 
   logger: console, 
   logLevel: "info",//warn  debug info
  /*logger: {
    type: "Winston",
    options: {       
        level: "info",
        winston: {            
            transports: [                
                new winston.transports.File({ filename: "./moleculer_31.log" })
            ]
        }
    }
  },*/
});

brokerNode2.createService({  
  name: "nomina_249",
  mixins: [DbService],
    adapter: new SqlAdapter("oracle://sigac:Productos41@SRVEMCOSFA.emcoep.local:1521/emcoepnew"),   
    model: {
        name: "RRHH_TIPO_SALARIO",
        define: {
          ID_SALA: {type : NUMBER, primaryKey: true},
          SALA_DESCRIPCION:{type: STRING} 
        },
        options: {
          freezeTableName: true,
          timestamps: false,
        }
  }, 
  actions: {
    acciones_nomina(ctx) {                 
      if (ctx.params.get_tipo_salarios){     
         return  brokerNode2.call("nomina_249.find"); 
      }         
      else if (ctx.params.get_maxima_nomina){    
        return this.adapter.db.query("select max(ID_GENO)+1 max_id from RRHH_GENERACION_NOMINA")
               .then(([res, metadata]) => res); 
      }  
      else if (ctx.params.get_empresas){    
        return this.adapter.db.query("select empr_cdg,empr_razon_social_pruebas from empresas")
               .then(([res, metadata]) => res); 
      }               
      else if (ctx.params.get_rrhh_generacion_nomina && ctx.params.id_geno){    
        return this.adapter.db.query("select ID_GENO,GENE_PERIODO,GENO_OBSERVACIONES,EMPR_CDG,GENO_IS_CONTABILIZADO,"+  
                                     "GENO_TIPO_NOMINA,GENO_PERIODO_APLICA,GENO_IS_DECIMO_TERCER,GENO_IS_DECIMO_CUARTO,"+  
                                     "FECHA_CONTROL_PREVIO,USUARIO_CONTROL_PREVIO,BANDERA_CONTROL_PREVIO,GENO_IS_LIQUIDACION "+
                                     " from RRHH_GENERACION_NOMINA where ID_GENO = "+ctx.params.id_geno)
               .then(([res, metadata]) => res); 
      }   
      else if (ctx.params.get_nominas_distintas){    
        return this.adapter.db.query("select 'nómina:'||id_geno||' - periodo:'|| to_char(geno_periodo_aplica,'mm/yyyy') nomina ,"+
                                     "id_geno from rrhh_generacion_nomina order by id_geno desc")
              .then(([res, metadata]) => res);                      
      }   
      else{
        return  brokerNode2.call("nomina_249.find"); 
      } 
    },
    actualiza_tipo_salario(ctx) {      
      return  brokerNode2.call("nomina_249.update",{ id: ctx.params.id_sala, 
                                                     SALA_DESCRIPCION: ctx.params.sala_descripcion });      
    }
  }
});
// fin servicio "nomina"

//crea el servicio nomina_249_rrhh_componentes
brokerNode2.createService({  
  name: "nomina_249_rrhh_comp",
  mixins: [DbService],
    adapter: new SqlAdapter("oracle://sigac:Productos41@SRVEMCOSFA.emcoep.local:1521/emcoepnew"),   
    model: {
        name: "RRHH_COMPONENTES",
        define: {        
          ID_PK_COMP: {type : NUMBER, primaryKey: true},  
          ID_SALA: {type: DB_TYPE_NUMBER},
          COMP_NOMBRE: {type: DB_TYPE_VARCHAR},
          COMP_FORMULA_MICRO: {type: STRING},
          ID_COMP: {type: DB_TYPE_NUMBER},
          COMP_POSICION: {type: DB_TYPE_NUMBER},
          COMP_TIPO: {type: DB_TYPE_VARCHAR},
          PRSH_CDG_PERS: {type: DB_TYPE_NUMBER},
          COMP_GASTO: {type: DB_TYPE_VARCHAR},
          COMP_PRINCIPAL: {type: DB_TYPE_VARCHAR},
          COMP_PAGAR_PROVEEDORES: {type: DB_TYPE_VARCHAR},
          COMP_PASIVO: {type: DB_TYPE_VARCHAR},
          GENO_TIPO_NOMINA: {type: DB_TYPE_NUMBER},
          GENO_ORDEN_GENERACION: {type: DB_TYPE_NUMBER},          
        },
        options: {
          freezeTableName: true,
          timestamps: false,
        }
  }, 
  actions: {
    actualiza_rrhh_componentes(ctx) {            
      return  brokerNode2.call("nomina_249_rrhh_comp.update",{id:  ctx.params.id_pk_comp,                                                                     
                                                                     COMP_NOMBRE: ctx.params.comp_nombre,
                                                                     GENO_TIPO_NOMINA: ctx.params.geno_tipo_nomina,                                                                     
                                                                     });
    },
    get_rrhh_componentes(ctx){
      if (ctx.params.query_tipo_nomina){   
           return this.adapter.db.query("select COMP_NOMBRE,COMP_FORMULA_MICRO,ID_COMP,COMP_POSICION "+
                                        "from rrhh_componentes where GENO_TIPO_NOMINA = "+ctx.params.query_tipo_nomina +
                                        " and id_sala = 1 order by geno_orden_generacion")
           .then(([res, metadata]) => res);      
      }
      if (ctx.params.query_formula_por_comp){   
        return this.adapter.db.query("select COMP_NOMBRE,COMP_FORMULA_MICRO,ID_COMP,COMP_POSICION "+
                                     "from rrhh_componentes where "+
                                     " comp_posicion = "+ctx.params.query_formula_por_comp +
                                     " and id_sala = 1")
        .then(([res, metadata]) => res);      
      }
      else if (ctx.params.get_id_comp_1){
          return this.adapter.db.query("select COMP_POSICION "+
                                        "from rrhh_componentes where GENO_TIPO_NOMINA = "+ctx.params.get_id_comp_1 +
                                        " and id_sala = 1 order by geno_orden_generacion")
          .then(([res, metadata]) => res);      
      }   
      else if (ctx.params.pr_ws_cambia_componentes){
             return this.adapter.db.query("select fu_ws_cambia_componentes("+ctx.params.pr_ws_cambia_componentes+") from dual;")
             .then(([res, metadata]) => res);  
      }       
      else{
        return  brokerNode2.call("nomina_249_rrhh_comp.find"); 
      }

    }
  }
});
// fin servicio "nomina"

//crea el servicio nomina_249_rrhh_componentes
brokerNode2.createService({  
  name: "nomina_249_nfre",
  mixins: [DbService],
    adapter: new SqlAdapter("oracle://sigac:Productos41@SRVEMCOSFA.emcoep.local:1521/emcoepnew"),   
    model: {
        name: "RRHH_NOMINAS_FONDOS_RESERVA",
        define: {        
          ID_NFRE: {type : DB_TYPE_NUMBER, primaryKey: true},  
          ID_GENO_APLICA: {type: DB_TYPE_NUMBER},
          ID_GENO_APLICADA: {type: DB_TYPE_NUMBER},               
        },
        options: {
          freezeTableName: true,
          timestamps: false,
        }
  }, 
  actions: {   
    get_nfre(ctx){      
      if (ctx.params.insert){   
        return this.adapter.db.query("insert into rrhh_nominas_fondos_reserva(ID_GENO_APLICA,ID_GENO_APLICADA) values("+
                                     ctx.params.id_geno_aplica+","+ctx.params.id_geno_aplicada+")")
                                   .then(([res, metadata]) => res); 
      }
      else if (ctx.params.secuencia_id_nfre){   
        return this.adapter.db.query("select seq_id_nfre.nextval from dual")
                                   .then(([res, metadata]) => res); 
      }
      else{                   
        //return this.adapter.db.query("select ID_NFRE,ID_GENO_APLICA,ID_GENO_APLICADA from RRHH_NOMINAS_FONDOS_RESERVA "+
        //                             "where ID_GENO_APLICA = "+ctx.params.id_geno_aplica)
        //           .then(([res, metadata]) => res);           
         return  brokerNode2.call("nomina_249_nfre.find",{ query: {ID_GENO_APLICA: ctx.params.id_geno_aplica } }); 
      }   
    },
    actualiza_nfre(ctx) {             
      return  brokerNode2.call("nomina_249_nfre.update",{id:  ctx.params.id_nfre,                                                                   
                                                         ID_GENO_APLICA: ctx.params.id_geno_aplica,
                                                         ID_GENO_APLICADA: ctx.params.id_geno_aplicada,                                                                     
                                                        });
    },   
    elimina_nfre(ctx) {       
      return  brokerNode2.call("nomina_249_nfre.remove",{id:  ctx.params.id_nfre});
    },   
  }
});


////

Promise.all([brokerNode2.start()]);
