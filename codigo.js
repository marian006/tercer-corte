const readline = require('readline');

class Producto {
    constructor(ancho, alto, profundidad) {
        this.ancho = ancho;
        this.alto = alto;
        this.profundidad = profundidad;
    }

    calcularVolumen() {
        return this.ancho * this.alto * this.profundidad;
    }
}

class LinkedList {
    constructor() {
        this.cabeza = null;
    }

    agregarProducto(producto) {
        if (!this.cabeza) {
            this.cabeza = producto;
        } else {
            let actual = this.cabeza;
            while (actual.siguiente) {
                actual = actual.siguiente;
            }
            actual.siguiente = producto;
        }
    }

    obtenerProductos() {
        const productos = [];
        let actual = this.cabeza;
        while (actual) {
            productos.push(actual);
            actual = actual.siguiente;
        }
        return productos;
    }
}

async function ingresarProductos() {
    const lista = new LinkedList();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const cantidadProductos = await new Promise(resolve => {
        rl.question("Ingrese la cantidad de productos a transportar: ", answer => {
            resolve(parseInt(answer));
        });
    });

    for (let i = 1; i <= cantidadProductos; i++) {
        const ancho = await new Promise(resolve => {
            rl.question(`Ingrese el ancho del Producto ${i} (cm): `, answer => {
                resolve(parseFloat(answer));
            });
        });
        const alto = await new Promise(resolve => {
            rl.question(`Ingrese el alto del Producto ${i} (cm): `, answer => {
                resolve(parseFloat(answer));
            });
        });
        const profundidad = await new Promise(resolve => {
            rl.question(`Ingrese la profundidad del Producto ${i} (cm): `, answer => {
                resolve(parseFloat(answer));
            });
        });
        const producto = new Producto(ancho, alto, profundidad);
        lista.agregarProducto(producto);
    }

    rl.close();
    return lista.obtenerProductos();
}

function calcularCosto(productos) {
    let costoTotal = 0;
    let productoMayorDimension = null;
    let totalImpuestos = 0;

    productos.forEach(producto => {
        const volumen = producto.calcularVolumen();
        const costo = volumen * 100;

        let impuesto = 0;
        if (volumen > 1000) {
            impuesto += costo * 0.1;
            totalImpuestos += impuesto;
        }
        if (volumen > 10000) {
            impuesto += costo * 0.1; 
            totalImpuestos += costo * 0.1;
        }

        const costoTotalProducto = costo + impuesto;
        costoTotal += costoTotalProducto;

        if (!productoMayorDimension || volumen > productoMayorDimension.calcularVolumen()) {
            productoMayorDimension = producto;
        }
    });

    const promedioCosto = costoTotal / productos.length;

    return [costoTotal, productoMayorDimension, promedioCosto, totalImpuestos];
}

async function main() {
    const productos = await ingresarProductos();
    const [costoTotal, productoMayorDimension, promedioCosto, impuestos] = calcularCosto(productos);

    console.log("\n1. Costo total del flete:", costoTotal);
    console.log("2. Cual es el producto de mayores dimensiones:", productos.indexOf(productoMayorDimension) + 1);
    console.log("3. Promedio del costo de productos en el flete:", promedioCosto);
    console.log("4. La empresa necesita saber cuanto debe pagar de impuestos por el flete:", impuestos);
}

main();
