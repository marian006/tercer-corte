const readline = require('readline');

class Vuelo {
    constructor(origen, destino, costo, impuesto, promocion = false) {
        this.origen = origen;
        this.destino = destino;
        this.costo = costo;
        this.impuesto = impuesto;
        this.promocion = promocion;
    }
}

class Pasajero {
    constructor(nombre, edad, mascota = false, infante = false) {
        this.nombre = nombre;
        this.edad = edad;
        this.mascota = mascota;
        this.infante = infante;
    }
}

class Nodo {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class ListaEnlazada {
    constructor() {
        this.head = null;
    }

    insertar(data) {
        const nuevoNodo = new Nodo(data);
        if (!this.head) {
            this.head = nuevoNodo;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = nuevoNodo;
        }
    }

    *[Symbol.iterator]() {
        let current = this.head;
        while (current) {
            yield current.data;
            current = current.next;
        }
    }
}

class SistemaReservas {
    constructor() {
        this.vuelos = new ListaEnlazada();
        this.pasajeros = new ListaEnlazada();
        this.impuestosPorDestino = {};
    }

    async agregarVuelo() {
        const origen = await pregunta("Ingrese el origen del vuelo: ");
        const destino = await pregunta("Ingrese el destino del vuelo: ");
        const costo = parseFloat(await pregunta("Ingrese el costo del vuelo: "));
        const impuesto = parseFloat(await pregunta("Ingrese el impuesto del vuelo: "));
        const promocion = (await pregunta("¿El vuelo está en promoción? (Sí/No): ")).toLowerCase() === "si";

        const vuelo = new Vuelo(origen, destino, costo, impuesto, promocion);
        this.vuelos.insertar(vuelo);
    }

    async agregarPasajero() {
        const nombre = await pregunta("Ingrese el nombre del pasajero: ");
        const edad = parseInt(await pregunta("Ingrese la edad del pasajero: "));
        const mascota = (await pregunta("¿El pasajero lleva mascota? (Sí/No): ")).toLowerCase() === "si";
        const infante = (await pregunta("¿El pasajero es un infante? (Sí/No): ")).toLowerCase() === "si";
        const destino = infante ? "" : await pregunta("Ingrese el destino del pasajero: ");

        const pasajero = new Pasajero(nombre, edad, mascota, infante, destino);
        this.pasajeros.insertar(pasajero);
    }

    async calcularTotalRecaudado() {
        let totalRecaudado = 0;
        for (const vuelo of this.vuelos) {
            totalRecaudado += vuelo.costo;
            if (vuelo.promocion) {
                totalRecaudado -= vuelo.costo * 0.1;
            }
        }
        return totalRecaudado;
    }

    destinoPreferido() {
        const destinos = {};
        for (const pasajero of this.pasajeros) {
            if (pasajero.edad <= 12) {
                continue; // Infantes no influyen en el destino preferido
            }
            destinos[pasajero.destino] = (destinos[pasajero.destino] || 0) + 1;
        }
        return Object.keys(destinos).reduce((a, b) => destinos[a] > destinos[b] ? a : b);
    }

    calcularTotalImpuestosDestino(destino) {
        let totalImpuestos = 0;
        for (const vuelo of this.vuelos) {
            if (vuelo.destino === destino) {
                totalImpuestos += vuelo.impuesto;
            }
        }
        return totalImpuestos;
    }

    recaudacionPorMascotas() {
        let totalMascotas = 0;
        for (const pasajero of this.pasajeros) {
            if (pasajero.mascota) {
                totalMascotas += pasajero.impuesto; // Suponiendo que las mascotas también pagan impuestos
            }
        }
        return totalMascotas;
    }

    contarInfantes() {
        let totalInfantes = 0;
        for (const pasajero of this.pasajeros) {
            if (pasajero.infante) {
                totalInfantes++;
            }
        }
        return totalInfantes;
    }

    costoTotalDulcesInfantes() {
        const costoDulceInfante = 1; // Suponiendo que el costo del dulce es constante
        return this.contarInfantes() * costoDulceInfante;
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function pregunta(pregunta) {
    return new Promise((resolve) => {
        rl.question(pregunta, (respuesta) => {
            resolve(respuesta);
        });
    });
}

// Ejemplo de uso:

const sistema = new SistemaReservas();

async function iniciarSistema() {
    const opcion = parseInt(await pregunta("Seleccione una opción:\n1. Agregar vuelo\n2. Agregar pasajero\n3. Calcular total recaudado\n4. Destino preferido\n5. Calcular total impuestos por destino\n6. Recaudación por mascotas\n7. Contar infantes\n8. Costo total de dulces para infantes\nOpción: "));

    switch (opcion) {
        case 1:
            await sistema.agregarVuelo();
            break;
        case 2:
            await sistema.agregarPasajero();
            break;
        case 3:
            console.log("Total recaudado:", await sistema.calcularTotalRecaudado());
            break;
        case 4:
            console.log("Destino preferido:", sistema.destinoPreferido());
            break;
        case 5:
            const destinoImpuestos = await pregunta("Ingrese el destino para calcular los impuestos: ");
            console.log("Total impuestos para", destinoImpuestos + ":", sistema.calcularTotalImpuestosDestino(destinoImpuestos));
            break;
        case 6:
            console.log("Recaudación por transporte de mascotas:", sistema.recaudacionPorMascotas());
            break;
        case 7:
            console.log("Cantidad de infantes:", sistema.contarInfantes());
            break;
        case 8:
            console.log("Costo total de dulces para infantes:", sistema.costoTotalDul
