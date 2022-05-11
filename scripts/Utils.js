function feedNeuron(neuron, current, dt) {
    let out = {I: 0, U: 0, U_pulse: 0};

    neuron.i_app = current;
    neuron.dt = dt;

    neuron.get_potential_op();

    out.I = neuron.i_app;
    out.U = neuron.u;
    out.U_pulse = neuron.u_out;

    return out;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCurrent(voltage, resistance) {
    if (resistance === 0) {
        // Begrenzung des Potentials für den Fall R = 0 Ohm
        return voltage;
    } else {
        let tmp = voltage / resistance;

        // Keine Division durch 0!
        if (tmp != 0) {
            return tmp;
            //return Math.round((voltage / resistance) * 1000) / 1000;
        } else {
            return 0;
        }
    }
}