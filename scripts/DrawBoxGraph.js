let activeNodesCount = [];
const simulationTimeCount = [];

let simulationOverAllTime = 0;
let simulationMaxTime = 20000;

function DrawBoxGraph(divID, dt, network, reset = false) {
    if (reset || simulationMaxTime < simulationOverAllTime) {
        simulationMaxTime = 0;
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