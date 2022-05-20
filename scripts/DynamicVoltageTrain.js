/**
 * Eine Funktion, die über die übergebene Zeitspanne eine Pulsfolge auf Basis der Parameter
 * generiert und einem LIF Neuron zuführt. Die Ergebnisse werden als JSON zurückgegeben. Im
 * Gegensatz zu einem DynamicImpulsTrain ist die Eingangsgröße ein Array von Eingangsspannungen.
 * Als Widerstand wird der aktuell eingestellte Widerstand verwendet.
 * @param duration Die Zeitspanne
 * @param durationStep Der Zeitintervall der Berechnungen
 * @param inputVoltageSerial Ein Array der Eingabespannungen
 * @returns {{U_treshold: number, T: *[], U: *[], I: *[], U_out: *[]}} Vier Array: Zeit, Spannung, Strom, Spikespannung
 */
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