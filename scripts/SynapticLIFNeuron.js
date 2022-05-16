/**
 * Die Klasse SynapticLIFNeuron erweitert die Klasse LIFNeuron um die Fähigkeit, einfach in ein Netzwerk eingebunden
 * werden zu können.
 *
 * https://github.com/rafinskipg/neural-network-js/blob/master/src/connection.js
 */
class SynapticLIFNeuron extends LIFNeuron {
    /**
     * Der Konstruktor
     * @param props Die übergebenen Eigenschaften
     */
    constructor(props) {
        super(props);

        this.id = 0;

        this.inputConnections = [];
        this.outputConnection = [];

        this.incomingCurrent = 0;

        this.spiking = false;
        this.outgoingVoltag = 0;

        this.incomingConnections = 0;
        this.incomingActiveConnections = 0
        this.outgoingConnection = 0;
    }

    /**
     * Gibt den aktuellen Zustand und Conenctions als JSON aus
     * @returns {{OutputConnections: number, IncommingCurrent: number, InputConnections: number, OutgoingConnections: number, Id: number, IncommingActiveConenctions: number, IncommingConnections: number, OutgoingVoltage: number, Spiking: boolean}}
     */
    toJSON() {
        return {
            Id: this.id,
            InputConnections: this.inputConnections.map(n => {
                n.toJSON();
            }),
            OutputConnections: this.outputConnection.map(n => {
                n.toJSON();
            }),
            IncommingCurrent: this.incomingCurrent,
            Spiking: this.spiking,
            OutgoingVoltage: this.outgoingVoltag,
            IncommingConnections: this.incomingConnections,
            IncommingActiveConenctions: this.incomingActiveConnections,
            OutgoingConnections: this.outgoingConnection
        }
    }

    /**
     * Verarbeitet alle aktuellen Verbindungen und berechnet die Antwort des LIF Neurons. Als Ergebnis werden Daten
     * zum aktuellen Zustand zurück gegeben.
     * @param triggerCurrrent Der in das Modell fließende initiale Strom
     * @returns {{OutgoingConnections: number, IncomingCurrent: number, IncomingActiveConnections: number, IncomingConnections: number, Spiking: boolean}}
     * Gibt alle Wichtigen Infos zum Zustand des Objektes zurück
     * @constructor
     */
    CalculateTimeStep(triggerCurrrent) {
        this.incomingCurrent = this.GetIncomingCurrent(triggerCurrrent);

        this.ExecuteStep(this.incomingCurrent, 1);

        this.spiking = this.u_out > 0;
        this.outgoingVoltag = this.u_out;

        this.incomingConnections = this.inputConnections.length;
        this.incomingActiveConnections = this.GetIncomingActiveConnection();
        this.outgoingConnection = this.outputConnection.length;

        if (this.spiking) {
            console.log("Pulse von " + +this.id);
        }

        return {
            IncomingCurrent: this.incomingCurrent,
            Spiking: this.spiking,
            Pulse: this.outgoingVoltag,
            IncomingConnections: this.incomingConnections,
            IncomingActiveConnections: this.incomingActiveConnections,
            OutgoingConnections: this.outgoingConnection
        };
    }

    /**
     * Berechnet auf Basis des aktuellen Stroms und eines delta T den nächsten Wert des Neuron.
     * @param current Der in das Modell fließende Strom
     * @param dt Delta T zwischen zwei Schritten (Default = 1)
     * @constructor
     */
    ExecuteStep(current, dt = 1) {
        this.i_app = current;
        this.dt = dt;

        this.get_potential_op();
    }

    /**
     * Gibt die Summe aller eingehenden Ströme zurück. Diese ergeben sich durch das Aufsummieren aller Einzelströme.
     * @param triggerCurrrent Ein extern anstoßender Strom, der zu den eingehenden Strömen des Netzes aufaddiert wird.
     * @returns {*} {number} Die Summe aller eingehenden Ströme
     */
    GetIncomingCurrent(triggerCurrrent) {
        let sumCurrent = triggerCurrrent;

        if (isNaN(triggerCurrrent)) {
            sumCurrent = 0;
        }

        for (let x = 0; x < this.inputConnections.length; x++) {
            sumCurrent = sumCurrent + this.inputConnections[x].RefreshCurrent();
        }

        return sumCurrent;
    }

    /**
     * Gibt die Anzahl der eingehenden aktiven Verbindungen an. Eine Verbindung ist aktiv, wenn sie einen
     * Strom generiert.
     * @returns {number} Die Anzahl der Verbindungen
     * @constructor
     */
    GetIncomingActiveConnection() {
        let sumCountIncome = 0;

        let countIncome = this.inputConnections.map(
            obj => {
                if (obj > 0) {
                    return 1;
                } else {
                    return 0;
                }
            });

        sumCountIncome = countIncome.reduce(
            (prevValue, curValue) => prevValue + curValue, 0
        );

        return sumCountIncome;
    }

    /**
     * Der Aktuelle Zustand des Modells
     * @returns {{OutgoingConnections: number, IncomingCurrent: number, Pulse: number, IncomingActiveConnections: number, IncomingConnections: number, Spiking: boolean}}
     * Gibt alle Wichtigen Infos zum Zustand des Objektes zurück
     * @constructor
     */
    GetCurrentState() {
        return {
            IncomingCurrent: this.incomingCurrent,
            Spiking: this.spiking,
            Pulse: this.outgoingVoltag,
            IncomingConnections: this.incomingConnections,
            IncomingActiveConnections: this.incomingActiveConnections,
            OutgoingConnections: this.outgoingConnection
        };
    }
}