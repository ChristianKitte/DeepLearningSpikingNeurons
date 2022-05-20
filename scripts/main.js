/**
 * Initialisieren des anfänglichen Status für Lösung 1 und 2
 */
setIntialValue();
/**
 * Starte die Simulation für Lösung 1
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
 * Startet die Simulation
 */
function startNetSimulation() {
    if (!runNetworkSimulation) {

        if (NetCurrentTypeValue === "0") {
            alert('Sie müssen die Art des Stroms auswählen...');
            return;
        }

        runNetworkSimulation = true;
        pulseTimer = rangeTNetzImpulseValue

        alert('starte Simulation...');
        nextNetSimulationStep();
    }
}

/**
 * Beendet die Simulation
 */
function stopNetSimulation() {
    runNetworkSimulation = false;
}

/**
 * Führt denn nächsten Simulationsschritt aus und ruft sich am Ende mit einer Verzögerung von 1 ms wieder auf
 */
function nextNetSimulationStep() {
    network.computeNexStep(1, NetCurrentTypeValue, rangeINetzMinValue, rangeINetzMaxValue, pulse);

    UpdateNodeArray(network, 'box-container')
    DrawBoxGraph('box-Plot', 1, network);

    pulseTimer--;
    if (pulseTimer <= 0) {
        pulse = !pulse;
        pulseTimer = rangeTNetzImpulseValue;
    }

    if (runNetworkSimulation) {
        setTimeout(nextNetSimulationStep, 1);
    } else {
        CreateNodeArray(network, 'box-container');
        alert('beende Simulation...');
    }
}

/**
 * Erzeugt einen Netzwergraphen auf Basis der Einstellungen zur Lösung 2 und bringt
 */
function createNetworkGraph() {
    network = new Network(rangeCountNeuronenValue, rangeWiderstandMinValue, rangeWiderstandMaxValue);
    newSession = createGraph(network);

    CreateNodeArray(network, 'box-container');
    DrawBoxGraph('box-Plot', 1, network);
}

/**
 * Starte die Vorbereitung für Lösung 2
 */
createNetworkGraph();