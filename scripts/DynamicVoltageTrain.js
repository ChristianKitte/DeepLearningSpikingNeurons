function dynamicVoltageTrain(
    duration = 0,
    durationStep = 0,
    inputVoltageSerial = []) {

    let neuron = new LIFNeuron();

    let I = [];
    let U = [];
    let U_out = [];
    let T = [];

    let steps = duration / durationStep;

    let pulseState = true;
    let timePulse = 0;

    for (let x = 1; x <= steps; x++) {
        // Gesamt abgelaufene Zeit
        let timeOverAll = x * durationStep;

        let i_app = getCurrent(inputVoltageSerial[x], rangeRmaxValue);
        let newState = feedNeuron(neuron, i_app, durationStep);

        T.push(timeOverAll);
        I.push(newState.I);
        U.push(newState.U);
        U_out.push(newState.U_pulse);
    }

    // Rückgabe JSON
    return {
        T: T,
        I: I,
        U: U,
        U_out: U_out,
        U_treshold: neuron.u_thresh
    }
}