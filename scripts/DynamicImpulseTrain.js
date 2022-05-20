/**
 * Eine Funktion, die über die übergebene Zeitspanne eine Pulsfolge auf Basis der Parameter
 * generiert und einem LIF Neuron zuführt. Die Ergebnisse werden als JSON zurückgegeben.
 * @param duration Die Zeitspanne
 * @param durationPulse Die Pulslänge
 * @param durationStep Der Zeitintervall der Berechnungen
 * @param inputCurrent Der maximale Eingabestrom (Minimum ist 0 mA)
 * @param inputType Die Art des Stroms (Puls oder Zufall)
 * @returns {{U_treshold: number, T: *[], U: *[], I: *[], U_out: *[]}} Vier Array: Zeit, Spannung, Strom, Spikespannung
 */
function dynamicImpulseTrain(
    duration = 400,
    durationPulse = 30,
    durationStep = 1,
    inputCurrent = 1.2,
    inputType = 1) {

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

        let i_app = 0;
        timePulse = timePulse + durationStep;

        // Steuerung der Pulsmodulation.
        //if (inputType === 1 && timePulse >= durationPulse) {
        if (inputType === 1 && timeOverAll % durationPulse === 0) {
            // Puls modulieren
            pulseState = !pulseState;
            timePulse = 0;
        } else if (inputType === 2) {
            // Pulse überbrücken
            pulseState = true;
        }

        // Set input current in mA
        if (inputType === 1 && pulseState) {
            // Pulshöhe in der übergebenen Höhe
            // inputCurrent in mA

            i_app = inputCurrent;
        } else if (inputType === 2) {
            // Strom von 0  bis zur übergebenen Höhe
            // inputCurrent in mA

            i_app = getRndInteger(0, inputCurrent * 1000) / 1000;
        }

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