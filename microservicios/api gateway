// index.js

const { ServiceBroker } = require("moleculer");
const HTTPServer = require("moleculer-web");
const winston = require("winston");

// se crea el broker para el node-1 se define el nombre y transporte
const brokerNode1 = new ServiceBroker({ 
  nodeID: "node-1",
  transporter: "nats://192.168.20.249:4222",
  logger: console,    
  logLevel: "info",//warn  debug
  /*logger: {
    type: "Winston",
    options: {        
        level: "info",
        winston: {            
            transports: [                
                new winston.transports.File({ filename: "./moleculer_249.log" })
            ]
        }
    }
  },*/
  retryPolicy: {
    enabled: true,
    retries: 5,
    delay: 2000,
    maxDelay: 10000,
    factor: 2,
    check: err => err && !!err.retryable
  },  
},
);

brokerNode1.createService({  
  name: "gateway-1",
  mixins: [HTTPServer],
  settings: {
    port: 1336,
    routes: [
      {
        aliases: {          
          "GET /nomina_249": "nomina_249.acciones_nomina",  //192.168.20.249 (node-2) llamada http://sistema-sfa.com:1336/nomina
          "PUT /nomina_249": "nomina_249.actualiza_tipo_salario",
          "GET /nomina_249_rrhh_comp": "nomina_249_rrhh_comp.get_rrhh_componentes", 
          "PUT /nomina_249_rrhh_comp": "nomina_249_rrhh_comp.actualiza_rrhh_componentes",
          "GET /nomina_249_nfre": "nomina_249_nfre.get_nfre",
          "PUT /nomina_249_nfre": "nomina_249_nfre.actualiza_nfre",          
          "DELETE /nomina_249_nfre": "nomina_249_nfre.elimina_nfre", 
          "GET /nomina_249_noem": "nomina_249_noem.get_noem",
        }
      }
    ]
  }
});


// se crea el broker para el node-4 se define el nombre y transporte
const brokerNode2 = new ServiceBroker({
  nodeID: "node-4",
  transporter: "nats://192.168.20.31:4222",
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
  retryPolicy: {
    enabled: true,
    retries: 5,
    delay: 2000,
    maxDelay: 10000,
    factor: 2,
    check: err => err && !!err.retryable
  },  
},
);

brokerNode2.createService({
  name: "gateway-2",
  mixins: [HTTPServer],
  settings: {
    port: 1335,
    routes: [
      {
        aliases: {        
          "GET /empleado_31": "empleado_31.acciones_empleado",//192.168.20.31 (node-3)llamada http://sistema-sfa.com:1335/empleado
          "GET /empleado_por_nomina_31": "empleado_por_nomina_31.acciones_empleado_por_nomina",
          "GET /empleado_31_noem": "empleado_31_noem.get_noem", 
        }
      }
    ]
  }
});
console.log('Broker ejecutandose....')
//Iniciar ambos brokers
//Promise.all([brokerNode1.start().then(() => {brokerNode1.repl();}), brokerNode2.start()]);
Promise.all([brokerNode1.start(), brokerNode2.start().then(() => {brokerNode2.repl();})]);
//Promise.all([brokerNode1.start(), brokerNode2.start()]);


