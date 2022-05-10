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