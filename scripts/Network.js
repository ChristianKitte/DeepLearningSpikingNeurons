/**
 * Stellt ein Netzwerk von SynapticLIFNeuronen dar, welche zu einem Blub verbunden sind. Hierbei ist
 * jedes Neuron mit jeden anderen Neuron verbunden.
 */
class Network {
    /**
     * Der Konstruktor
     * @param numberOfNeurons Die Anzahl der Neuronen
     * @param minResistance Der kleinste Widerstand einer Verbindung
     * @param maxResistance Der größste Widerstand einer Verbindung
     */
    constructor(numberOfNeurons, minResistance, maxResistance) {
        this.neurons = [];
        this.connections = [];

        this.simulationTime = 0;
        //this.pulse = true;

        // Erzeugen der Neuronen
        for (let x = 0; x < numberOfNeurons; x++) {
            let newNeuron = new SynapticLIFNeuron();
            newNeuron.id = x;

            this.neurons.push(newNeuron);
        }

        // Erzeugen des Netzes
        for (let from = 0; from < numberOfNeurons; from++) {
            for (let to = 0; to < numberOfNeurons; to++) {
                if (from !== to) {
                    let newConnection = new Connection(this.neurons[from], this.neurons[to], minResistance, maxResistance);

                    if (minResistance === maxResistance) {
                        newConnection = minResistance;
                    }

                    this.connections.push(newConnection);
                    this.neurons[from].outputConnection.push(newConnection);
                    this.neurons[to].inputConnections.push(newConnection);
                }
            }
        }
    }

    /**
     * Berechnet für alle Neuronen den nächsten Zustand. Hierbei findet eine Vereinfachung statt, in dem seriell alle
     * Neuronen des Arrays in aufsteigender Reihenfolge durchiteriert werden.
     * @param dt Die bei der BErechnung zu berücksichtigende Zeitspanne in ms
     */
    computeNexStep(dt, currentType, currentMin, currentMax, pulse) {
        this.simulationTime++;

        if (currentType === 1) {
            // Pulse
            let triggerCurrent = 0;

            if (pulse) {
                triggerCurrent = currentMax;
            } else {
                triggerCurrent = currentMin;
            }

            console.log(triggerCurrent);
            this.neurons[0].CalculateTimeStep(triggerCurrent);

            for (let x = 0; x < this.neurons.length; x++) {
                this.neurons[x].CalculateTimeStep(0);
            }
        } else if (currentType === 2) {
            // Random
            let triggerCurrent = getRndInteger(currentMin * 1000, currentMax * 1000) / 1000;
            this.neurons[0].CalculateTimeStep(triggerCurrent);

            for (let x = 0; x < this.neurons.length; x++) {
                this.neurons[x].CalculateTimeStep(0);
            }
        }
    }

    /**
     * Gibt die beteiligten SynapticLIFNeuronen als JSON aus
     * @returns {*[]}
     */
    toJSON() {
        return {
            Neuronen: this.neurons.map(n => {
                return n.toJSON();
            }),
            Verbindungen: this.connections.map(n => {
                return n.toJSON();
            })
        }
    }
}
