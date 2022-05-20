/**
 * Enthält die Anzahl spikender Neuronen je Zeitschritt seit Start der Aufzeichnung
 * @type {*[]} Ein Array der Anzahlen
 */
let activeNodesCount = [];
/**
 * Enthält die absolute Zeitangabe je Zeitschritt seit Start der Aufzeichnung
 * @type {*[]} Ein Array der Zeiten
 */
const simulationTimeCount = [];

/**
 * Die gesammte vergangene Zeit seit Start der Aufzeichnug
 * @type {number}
 */
let simulationOverAllTime = 0;
/**
 * Die maximale Zeit, nach der sich der Graph automatisch zurück setzt
 * @type {number}
 */
let simulationMaxTime = 20000;

/**
 * Gibt ein Plotly Scatter Plot innerhalb des übergebenen Containers aus. Hierbei werden nur die
 * Daten für eine einzelne Ausgabe übergeben.
 * @param divID Die ID eines DIV Elementes als Container
 * @param dt Der zur Ausgabe zu verwendende Zeitschrit ab der letzten Ausgabe
 * @param network Das auszuwertende Netzwerk mit seinen aktuellen Werten
 * @param reset True, um das Diagramm zurück zu setzen, ansonsten False
 * @constructor
 */
function DrawBoxGraph(divID, dt, network, reset = false) {
    if (reset || simulationMaxTime < simulationOverAllTime) {
        simulationMaxTime = 20000;
        simulationOverAllTime = 0;
        activeNodesCount.splice(0, activeNodesCount.length)
        simulationTimeCount.splice(0, simulationTimeCount.length)
    }

    simulationOverAllTime++;
    simulationTimeCount.push(simulationOverAllTime);

    let countSpiking = 0;
    for (let x = 0; x < network.neurons.length; x++) {
        let newNode = network.neurons[x];

        if (newNode.spiking) {
            countSpiking++;
        }
    }
    activeNodesCount.push(countSpiking);

    let activeNodes = {
        x: simulationTimeCount,
        y: activeNodesCount,
        mode: 'lines',
        type: 'scatter',
        name: 'Anzahl feuernder Neuronen'
    };

    let data = [activeNodes];

    let layout = {
        title: 'Laufzeit der Simulation in ms',
        xaxis: {
            title: 'Zeit in ms',
            showgrid: false,
            zeroline: false,
            range: [0, simulationMaxTime],
        },
        yaxis: {
            title: 'Anzahl der spikenden LIF Neuronen',
            range: [0, network.neurons.length + 3],
            showline: false,
            mode: 'lines',
            type: 'scatter'
        }
    };

    Plotly.newPlot(divID, data, layout);
}