// Simulation with square input currents
function pulseTest() {
    // Audiocontext, need a manual interaction within the Browser

    myAudioContext = new AudioContext();

    // Duration of the simulation in ms
    const T = 200;
    // Duration of each time step in ms
    const dt = 1;
    // Number of iterations = T/dt
    let steps = T / dt;
    // Output variables
    let timePoint = [];
    let I = [];
    let U = [];

    let neuron = new LIFNeuron();

    let neuron2 = new LIFNeuron();
    let I2 = [];
    let U2 = [];

    let neuron3 = new LIFNeuron();
    let I3 = [];
    let U3 = [];

    for (let x = 1; x <= steps; x++) {
        let i_app = 0;

        let t = x * dt;

        // Set input current in mA
        if (t > 10 && t < 30) {
            i_app = 0.5;
        } else if (t > 50 && t < 100) {
            i_app = 1.2;
        } else if (t > 120 && t < 180) {
            i_app = 1.5;
        } else {
            i_app = 0.0;
        }

        let newState = feedNeuron(neuron, i_app, dt);


        //neuron.i_app = i_app;
        //neuron.dt = 1;

        //neuron.get_potential_op();

        timePoint.push(t);
        //I.push(neuron.i_app);
        //U.push(neuron.u);

        I.push(newState.I);
        U.push(newState.U);

        let i_app2 = ((newState.U) / r1);
        let newState2 = feedNeuron(neuron2, i_app2, dt);

        I2.push(newState2.I);
        U2.push(newState2.U);

        let i_app3 = ((newState2.U) / 0.2);
        let newState3 = feedNeuron(neuron3, i_app3, dt);

        I3.push(newState3.I);
        U3.push(newState3.U);
    }

    DrawGraph("Diagramm1", U, I, timePoint);
    //DrawGraph("Diagramm2", U2, I2, timePoint);
    //DrawGraph("Diagramm3", U3, I3, timePoint);
}

let r1 = 0;

function dummy(value) {
    //r1 = document.getElementById("range1").value;
    //document.getElementById("curR1").innerText = "Aktueller Wert: " + r1.toString();

    //pulseTest()
}


// Simulation with Random Current
function RandomTest() {
    // Audiocontext, need a manual interaction within the Browser
    myAudioContext = new AudioContext();
    // Duration of the simulation in ms
    const T = 200;
    // Duration of each time step in ms
    const dt = 1;
    // Number of iterations = T/dt
    let steps = T / dt;
    // Output variables
    let timePoint = [];
    let I = [];
    let U = [];

    let neuron = new LIFNeuron();
    const random = d3.randomNormal(1.5, 1.0);

    for (let x = 1; x <= steps; x++) {
        let i_app = 0;

        let t = x * dt;

        // Set input current in mA
        if (t > 10 && t < 180) {
            i_app = random();
        } else {
            i_app = 0.0;
        }

        neuron.i_app = i_app;
        neuron.dt = 1;

        neuron.get_potential_op();

        timePoint.push(t);
        I.push(neuron.i_app);
        U.push(neuron.u);
    }

    DrawGraph("Diagramm1", U, I, timePoint);
}


function dynamicImpulse(duration = 400, deltaTimesteps = 1, durationPulse = 30, directCurrent = 1.2) {
    let steps = duration / deltaTimesteps;

    let timePoint = [];
    let I = [];
    let U = [];
    let U_out = [];

    let pulseState = false;
    let timePulse = 0;

    let neuron = new LIFNeuron();

    for (let x = 1; x <= steps; x++) {
        let i_app = 0;

        let timeOverAll = x * deltaTimesteps;
        timePulse = timePulse + deltaTimesteps;

        if (timePulse >= durationPulse) {
            pulseState = !pulseState;
            timePulse = 0;
        }

        // Set input current in mA
        if (pulseState) {
            i_app = directCurrent;
        }

        let newState = feedNeuron(neuron, i_app, deltaTimesteps);

        timePoint.push(timeOverAll);
        I.push(newState.I);
        U.push(newState.U);
        U_out.push(newState.U_pulse);
    }

    DrawGraph2("Diagramm1", U, U_out, I, timePoint);
}


