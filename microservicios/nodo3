// index.js

const { ServiceBroker } = require("moleculer");
const HTTPServer = require("moleculer-web");

const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");
const { NUMBER, STRING, DB_TYPE_NUMBER, DATE, DB_TYPE_VARCHAR  } = require("oracledb");
const oracledb = require('oracledb');


// Crea el broker para el nodo 3 se define el nodeID y se configura el transpoter
const brokerNode3 = new ServiceBroker({
  nodeID: "node-3", //empleado 192.168.20.31 puerto 1335 (node-3) llamada http://sistema-sfa.com:1335/empleado
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

// Crea el servicio "EMPLEADO"
brokerNode3.createService({  
  name: "empleado_31",
  mixins: [DbService],
    adapter: new SqlAdapter("oracle://sigac:Productos41@SRVPSERVICE.emcoep.local:1521/xepdb1"),   
    model: {
        name: "RRHH_EMPLEADO",
        define: {
          ID_EMP: {type : NUMBER, primaryKey: true},
          USUARIO:{type: STRING} 
        },
        options: {
          freezeTableName: true,
          timestamps: false,
        }
  },
  actions: {
    acciones_empleado(ctx) {            
      if (ctx.params.listar_empleado == 'S'){         
         return  brokerNode3.call("empleado_31.find"); 
      }       
      else if (ctx.params.llena_empleados_por_nomina){        
        return ejecuta_procedimiento('pr_llena_empleados_por_nomina',ctx.params.llena_empleados_por_nomina);        
      }       
      else if (ctx.params.id_nomina){     
        var dato =  '\''+ctx.params.id_nomina+'-'+ctx.params.id_emp+'-'+ ctx.params.estado+'\'';         
        return ejecuta_procedimiento('pr_actualiza_empleados_por_nomina',dato);        
      }    
      else if (ctx.params.sentencia_texto){             
        return ejecuta_procedimiento_immediate(ctx.params.sentencia_texto);        
      } 
      else if (ctx.params.cantidad_empleados){     
            return this.adapter.db.query("select count(1) cantidad_funcionarios from rrhh_empleado where EMPL_ACTIVO = 'S'"+
                                         "and id_tico != 13 and id_emp > 1 and empl_status_ingreso = 1")
           .then(([res, metadata]) => res); 
      }        
      else if (ctx.params.nombre_proc){ 
        return this.adapter.db.query("select "+ctx.params.nombre_proc+" from dual;")
             .then(([res, metadata]) => res);           
      }
      else if (ctx.params.cantidad_empleados_por_nomina){     
            return this.adapter.db.query("select nvl(count(1),0) cantidad from  rrhh_empleados_por_nomina "+
                                         "where ID_GENO = "+ctx.params.cantidad_empleados_por_nomina+" and EMPN_UTILIZADO = 'S'")
            .then(([res, metadata]) => res); 
      }     
      else{
        return  brokerNode3.call("empleado_31.find"); 
      }             
    }
  }
});
//fin servicio "EMPLEADO"

brokerNode3.createService({  
  name: "empleado_por_nomina_31",
  mixins: [DbService],
    adapter: new SqlAdapter("oracle://sigac:Productos41@SRVPSERVICE.emcoep.local:1521/xepdb1"),   
    model: {
        name: "RRHH_EMPLEADOS_POR_NOMINA",
        define: {
          ID_EMP: {type : oracledb.DB_TYPE_NUMBER},
          ID_GENO:{type : NUMBER, primaryKey: true},
          EMPN_UTILIZADO: {type : oracledb.DB_TYPE_VARCHAR},
          EMPL_IDENTIFICACION: {type : oracledb.DB_TYPE_VARCHAR},
          EMPL_NOMBRE_COMPLETO: {type : oracledb.DB_TYPE_VARCHAR},
          EMPL_FECHA_INGRESO: {type : oracledb.DB_TYPE_DATE},          
          EMPL_FECHA_SALIDA: {type : oracledb.DB_TYPE_DATE},
        },
        options: {
          freezeTableName: true,
          timestamps: false,
        }
  },
  actions: {
    acciones_empleado_por_nomina(ctx) {   
        if (ctx.params.numero_nomina){                       
           return  brokerNode3.call("empleado_por_nomina_31.find",{ query: {ID_GENO: ctx.params.numero_nomina } }); 
        }
        else if (ctx.params.cursor_a_nomina){ 
          return this.adapter.db.query("select a.ID_EMP from rrhh_empleado a,rrhh_empleados_por_nomina b "+
                                       " where a.EMPL_ACTIVO = 'S' and a.id_tico != 13 "+  
                                       " and a.id_emp > 1000 and a.EMPL_ESTATUS_SUSPENSION  = 'N' "+
                                       " and a.empl_status_ingreso = 1 and a.id_emp = b.id_emp "+
                                       " and b.id_geno = "+ctx.params.cursor_a_nomina+" and b.EMPN_UTILIZADO = 'S' "+            
                                       " union all "+
                                       " select a.ID_EMP "+
                                       " from rrhh_empleado a,rrhh_empleados_por_nomina b "+
                                       " where a.EMPL_ACTIVO = 'N' and a.empl_fecha_salida is not null "+
                                       " and a.id_emp > 1000 and a.EMPL_ESTATUS_SUSPENSION  = 'N' "+
                                       " and a.id_emp = b.id_emp and b.id_geno = "+ctx.params.cursor_a_nomina+
                                       " and b.EMPN_UTILIZADO = 'S' ")
          .then(([res, metadata]) => res);  
        }   
    }
  }
});

//crea el servicio empleado_31_nomina_empleado
brokerNode3.createService({  
  name: "empleado_31_noem",
  mixins: [DbService],
    adapter: new SqlAdapter("oracle://sigac:Productos41@SRVPSERVICE.emcoep.local:1521/xepdb1"),   
    model: {
        name: "RRHH_NOMINA_EMPLEADO",
        define: {        
          ID_GENO: {type : DB_TYPE_NUMBER},  
          ID_EMP: {type: DB_TYPE_NUMBER},
          NOEM_TOTAL: {type: DB_TYPE_NUMBER},      
          NOEM_NOMBRE: {type: DB_TYPE_VARCHAR},
          NOEM_POSICION: {type : DB_TYPE_NUMBER},  
          ID_COMP: {type : DB_TYPE_NUMBER},  
          GENO_TIPO_NOMINA: {type : DB_TYPE_NUMBER},  
          ID_SALA: {type : DB_TYPE_NUMBER},  
          NOEM_TOTAL_ALTERNO: {type : DB_TYPE_NUMBER},  
          ID_NOEM:  {type : DB_TYPE_NUMBER, primaryKey: true},       
        },
        options: {
          freezeTableName: true,
          timestamps: false,
        }
  }, 
  actions: {   
    get_noem(ctx){      
      if (ctx.params.insert){   
          return this.adapter.db.query("insert into RRHH_NOMINA_EMPLEADO("+
                                       "ID_GENO,ID_EMP,NOEM_TOTAL,NOEM_NOMBRE,NOEM_POSICION,ID_COMP,GENO_TIPO_NOMINA) values("+
                                       ctx.params.ID_GENO+","+ctx.params.ID_EMP+","+ctx.params.NOEM_TOTAL+","+
                                       ctx.params.NOEM_NOMBRE+","+ctx.params.NOEM_POSICION+","+ctx.params.ID_COMP+","+
                                       ctx.params.GENO_TIPO_NOMINA+")")
          .then(([res, metadata]) => res); 
      }      
      else if (ctx.params.ID_GENO){ 
         return  brokerNode3.call("empleado_31_noem.find",{ query: {ID_GENO: ctx.params.ID_GENO } }); 
      }   
    },
    actualiza_noem(ctx) {             
       null;
    },   
    elimina_noem(ctx) {       
      null;
    },   
  }
});
////

async function ejecuta_procedimiento(v_procedimiento,id_nomina) {
  try {
    connection = await oracledb.getConnection({user: "sigac",password: "Productos41",connectString: "SRVPSERVICE.emcoep.local:1521/xepdb1"});
    result = await connection.execute('begin '+v_procedimiento+'('+id_nomina+',:salida); end;',
                                     { salida: {dir: oracledb.BIND_OUT,type: oracledb.STRING} },
                                     { autoCommit: true });  
    return result.outBinds.salida;                                      
  } 
  catch (err) {
     return ('error al conectar o ejecutar '+err.message);  
  } 
  finally {  
     if (connection) {         
        try {                       
          await connection.close();            
           
        } 
        catch (err) {  
           console.error('error general '+err.message);
        }
     }
  }
}

async function ejecuta_procedimiento_immediate(v_sentencia) {
  try {
    connection = await oracledb.getConnection({user: "sigac",password: "Productos41",connectString: "SRVPSERVICE.emcoep.local:1521/xepdb1"});     
    result = await connection.execute('begin pr_ejecuta_calculo_nomina('+v_sentencia+',:salida); end;',
                                     { salida: {dir: oracledb.BIND_OUT,type: oracledb.DB_TYPE_NUMBER} },
                                     { autoCommit: true });  
    return result.outBinds.salida;                                      
  } 
  catch (err) {
     return ('error al conectar o ejecutar '+err.message);  
  } 
  finally {  
     if (connection) {         
        try {                       
          await connection.close();            
           
        } 
        catch (err) {  
           console.error('error general '+err.message);
        }
     }
  }
}


Promise.all([brokerNode3.start()]);

