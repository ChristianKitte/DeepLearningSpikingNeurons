// Startwerte der Seite initialisieren und für die Lösung 1 (Am Anfang zu aktives Tab) die Simulation ausführen
setIntialValue();
runSimulation();

/**
 * Durchläuft die Simulation für die Lösung 1 komplett und zeigt den Verlauf über die Zeit an
 */
function runSimulation() {
    // Audiocontext, need a manual interaction within the Browser
    myAudioContext = new AudioContext();

    let primärTrain = dynamicImpulseTrain(
        rangeTgesamtValue,
        rangeTimpulseValue,
        rangeDtValue,
        rangeImaxValue,
        currentTypeValue
    );

    DrawGraph2("Diagramm1", primärTrain.U, primärTrain.U_out, primärTrain.I, primärTrain.T);


    let secundärTrain = dynamicVoltageTrain(
        rangeTgesamtValue,
        rangeDtValue,
        primärTrain.U_out
    );

    DrawGraph2("Diagramm2", secundärTrain.U, secundärTrain.U_out, secundärTrain.I, secundärTrain.T);
}

/**
 * Das aktuelle Netzwerk zur Simulation
 */
let network;

/**
 * True, wenn die Simulation in der AUsführung ist, ansonsten False
 * @type {boolean}
 */
let runNetworkSimulation = false;

/**
 * Für Debugzwecke
 * @type {number}
 */
let counter = 0;

/**
 * Erzeugt einen Netzwergraphen auf Basis der Einstellungen zur Lösung 2 und bringt
 * ihn zur Anzeige
 */
function createNetworkGraph() {
    network = new Network(rangeCountNeuronenValue, rangeWiderstandMinValue, rangeWiderstandMaxValue);
    console.log(network.toJSON());

    let newGraph = new NetworkGraph(network);
}

/**
 * Startet die Simulation
 */
function runNetSimulation() {
    if (runNetworkSimulation) {
        alert('starte Simulation...');
        nextNetSimulationStep();
    }
}

/**
 * Führt denn nächsten Simulationsschritt aus und ruft sich am Ende mit einer Verzögerung von 1 ms
 * selbst wieder auf
 */
function nextNetSimulationStep() {
    network.computeNexStep(1, NetCurrentTypeValue, rangeINetzMinValue, rangeINetzMaxValue, rangeTNetzImpulseValue);

    if (runNetworkSimulation) {
        setTimeout(nextNetSimulationStep, 1);
    } else {
        alert('beende Simulation...');
    }
}

/**
 * Startet die Simulation
 */
function startNetSimulation() {
    runNetworkSimulation = true;
    runNetSimulation();
}

/**
 * Beendet die Simulation
 */
function stopNetSimulation() {
    runNetworkSimulation = false;
}




