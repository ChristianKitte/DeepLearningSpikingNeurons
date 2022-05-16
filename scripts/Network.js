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
                        newConnection.resistant = minResistance;
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
    computeNexStep(dt) {

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