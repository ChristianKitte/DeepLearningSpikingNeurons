/**
 * Initialisieren des anfänglichen Status für Lösung 1 und 2
 */
setIntialValue();
/**
 * Starte die Simulation für Lösung 1 (2 zu starten ist nicht sinnvoll)
 */
runSimulation();

/////////////////////////////////////////////////////////////////////////////////////
//// Lösung 1 (beim start aktuelles Tab)
/////////////////////////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////////////////////////
//// Lösung 2
/////////////////////////////////////////////////////////////////////////////////////

/**
 * Das aktuelle Netzwerk zur Simulation
 */
let network;

/**
 * Die aktuelle D3 Session
 */
let newSession;

/**
 * True, wenn die Simulation in der Ausführung ist, ansonsten False
 * @type {boolean}
 */
let runNetworkSimulation = false;

/**
 * Hilfsvariable, um die Zeitspanne der Impulse zu bestimmen
 * @type {number}
 */
let pulseTimer = 0;

/**
 * True, wenn ein Pulse vorhanden ist, ansonsten False
 * @type {boolean}
 */
let pulse = true;


/**
 * Erzeugt einen Netzwergraphen auf Basis der Einstellungen zur Lösung 2 und bringt
 */
function createNetworkGraph() {
    network = new Network(rangeCountNeuronenValue, rangeWiderstandMinValue, rangeWiderstandMaxValue);
    newSession = createGraph(network);

    CreateNodeArray(network, 'box-container');
}

createNetworkGraph();

/**
 * Startet die Simulation
 */
function runNetSimulation() {
    if (runNetworkSimulation) {
        pulseTimer = rangeTNetzImpulseValue

        alert('starte Simulation...');
        nextNetSimulationStep();
    }
}

/**
 * Führt denn nächsten Simulationsschritt aus und ruft sich am Ende mit einer Verzögerung von 1 ms wieder auf
 */
function nextNetSimulationStep() {
    network.computeNexStep(1, NetCurrentTypeValue, rangeINetzMinValue, rangeINetzMaxValue, pulse);
    UpdateNodeArray(network, 'box-container')

    //newNetwork = new Network(rangeCountNeuronenValue, rangeWiderstandMinValue, rangeWiderstandMaxValue);
    //newSession = createGraph(network);

    pulseTimer--;
    if (pulseTimer <= 0) {
        pulse = !pulse;
        pulseTimer = rangeTNetzImpulseValue;
    }

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
    //d3.select('#range-countNeuronen-value').attr("disabled");
    //d3.select('#range-widerstandMin-value').attr("disabled");
    //d3.select('#range-widerstandMax-value').attr("disabled");

    runNetworkSimulation = true;
    runNetSimulation();
}

/**
 * Beendet die Simulation
 */
function stopNetSimulation() {
    //d3.select('#range-countNeuronen-value').removeAttribute("disabled");
    //d3.select('#range-widerstandMin-value').removeAttribute("disabled");
    //d3.select('#range-widerstandMax-value').removeAttribute("disabled");

    runNetworkSimulation = false;
}


