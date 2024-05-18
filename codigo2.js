const readlineSync = require('readline-sync');


class Pasajero {
    constructor(nombre, edad, mascota) {
        this.nombre = nombre;
        this.edad = edad;
        this.mascota = mascota;
    }
}

class Vuelo {
    constructor(origen, destino, costo, impuesto, promocion) {
        this.origen = origen;
        this.destino = destino;
        this.costo = costo;
        this.impuesto = impuesto;
        this.promocion = promocion;
    }
}

class NodoVuelo {
    constructor(vuelo) {
        this.valor = vuelo;
        this.siguiente = null;
    }
}

class ListaVuelos {
    constructor() {
        this.cabeza = null;
    }

    insertar(vuelo) {
        const nuevoNodo = new NodoVuelo(vuelo);

        if (this.cabeza == null) {
            this.cabeza = nuevoNodo;
        } else {
            let nodoTmp = this.cabeza;
            while (nodoTmp.siguiente != null) {
                nodoTmp = nodoTmp.siguiente;
            }
            nodoTmp.siguiente = nuevoNodo;
        }
    }

    mostrarTodosLosVuelos() {
        if (this.cabeza == null) {
            console.log('No hay vuelos para mostrar, no hay nodos en la lista');
        } else {
            let nodoTmp = this.cabeza;
            let i = 1;
            while (nodoTmp != null) {
                console.log(`Datos del vuelo numero ${i}`);
                console.log(`Origen: ${nodoTmp.valor.origen}`);
                console.log(`Destino: ${nodoTmp.valor.destino}`);
                console.log(`Costo: ${nodoTmp.valor.costo}`);
                console.log(`Impuesto: ${nodoTmp.valor.impuesto}`);
                console.log(`Promoción: ${nodoTmp.valor.promocion}`);
                nodoTmp = nodoTmp.siguiente;
                i++;
            }
        }
    }

    calcularEstadisticas(costoDulce, infantesRegistrados) {
        let valorTotalTiquetes = 0;
        let destinosPreferidos = {};
        let dineroMascotas = 0;
        let cantidadInfantes = infantesRegistrados.length;
        let costoTotalDulces = cantidadInfantes * costoDulce;

        let nodoTmp = this.cabeza;
        while (nodoTmp != null) {
            let vuelo = nodoTmp.valor;
            valorTotalTiquetes += vuelo.costo;

            dineroMascotas += vuelo.promocion ? 30 : 0;

            if (destinosPreferidos.hasOwnProperty(vuelo.destino)) {
                destinosPreferidos[vuelo.destino]++;
            } else {
                destinosPreferidos[vuelo.destino] = 1;
            }

            nodoTmp = nodoTmp.siguiente;
        }

        const destinoPreferido = Object.keys(destinosPreferidos).reduce((a, b) => destinosPreferidos[a] > destinosPreferidos[b] ? a : b);

        console.log(`1. Valor total recaudado por concepto de venta de tiquetes: ${valorTotalTiquetes.toFixed(2)} pesos`);
        console.log(`2. Destino preferido de las personas: ${destinoPreferido}`);
        console.log(`3. Dinero recaudado por concepto de transporte de mascotas: ${dineroMascotas.toFixed(2)} pesos`);

        const destinoConsulta = readlineSync.question('Ingrese el destino para calcular el impuesto total: ');
        const impuestoTotalDestino = this.calcularImpuestoTotal(destinoConsulta);
        console.log(`4. Impuesto total para ${destinoConsulta}: ${impuestoTotalDestino.toFixed(2)} pesos`);

        console.log(`5. Cantidad de infantes que han viajado: ${cantidadInfantes}`);
        console.log(`6. Costo total de los dulces brindados a los infantes: ${costoTotalDulces.toFixed(2)} pesos`);
    }

    calcularImpuestoTotal(destino) {
        let impuestoTotal = 0;
        let nodoTmp = this.cabeza;
        while (nodoTmp != null) {
            if (nodoTmp.valor.destino === destino) {
                impuestoTotal += nodoTmp.valor.costo * nodoTmp.valor.impuesto;
            }
            nodoTmp = nodoTmp.siguiente;
        }
        return impuestoTotal;
    }
}

class SistemaReservas {
    constructor() {
        this.listaVuelos = new ListaVuelos();
        this.pasajeros = [];
        this.infantesRegistrados = [];
    }

    iniciar() {
        const costoDulce = parseFloat(readlineSync.question('Ingrese el costo de los dulces para los infantes: '));

        const cantidadTotalPasajeros = parseInt(readlineSync.question('Ingrese la cantidad total de pasajeros (adultos e infantes): '));
        console.log(`Se van a registrar ${cantidadTotalPasajeros} pasajeros.`);

        for (let i = 0; i < cantidadTotalPasajeros; i++) {
            console.log(`\nRegistro de informacion del pasajero ${i + 1}:`);
            const pasajero = this.obtenerDatosPasajero();
            this.pasajeros.push(pasajero);
            if (pasajero.edad <= 12) {
                this.infantesRegistrados.push(pasajero);
            }
        }

        let continuarRegistroVuelos = true;
        while (continuarRegistroVuelos) {
            console.log('\nRegistro de información del vuelo:');
            this.listaVuelos.insertar(this.obtenerDatosVuelo());
            continuarRegistroVuelos = readlineSync.keyInYNStrict('Desea registrar otro vuelo?');
        }

        console.log('--- Informacion de pasajeros y vuelos registrada con exito. ---');
        console.log('\n--- Estadisticas ---');
        this.listaVuelos.calcularEstadisticas(costoDulce, this.infantesRegistrados);
    }

    obtenerDatosPasajero() {
        const nombre = readlineSync.question('Nombre del pasajero: ');
        const edad = parseInt(readlineSync.question('Edad del pasajero: '));
        const mascota = readlineSync.keyInYNStrict('El pasajero lleva mascota?');
        return new Pasajero(nombre, edad, mascota);
    }

    obtenerDatosVuelo() {
        const origen = readlineSync.question('Origen del vuelo: ');
        const destino = readlineSync.question('Destino del vuelo: ');
        const costo = parseFloat(readlineSync.question('Costo del vuelo: '));
        const impuesto = parseFloat(readlineSync.question('Impuesto del destino (en porcentaje): ')) / 100;
        const promocion = readlineSync.keyInYNStrict('El vuelo tiene promocion?');
        return new Vuelo(origen, destino, costo, impuesto, promocion);
    }
}

const sistemaReservas = new SistemaReservas();
sistemaReservas.iniciar();
