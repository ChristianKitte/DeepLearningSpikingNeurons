/**
 * Stellt eine generalisierte Verbindung zwischen zwei Neuronen dar. Bei der Verbindung wird zufällig
 * ein Widerstand der Verbindung eingestellt. Der Bereich kann mithilfe der für die Erstellung benötigten
 * Parameter eingestellt und auch zu einem späteren Zeitpunkt festgelegt werden.
 *
 * https://github.com/rafinskipg/neural-network-js/blob/master/src/connection.js
 */
class Connection {
    /**
     * Der Konstruktor
     * @param from Der Ausgangspunkt der Verbindung (Ein Neuron)
     * @param to Der Zielpunkt der Verbindung (Ein Neuron)
     * @param resistentMin Der Minimale Widerstand der Verbindung in Ohm
     * @param resistentMax Der maximale Widerstand der Verbindung in Ohm
     */
    constructor(from, to, resistentMin, resistentMax) {
        this.from = from;
        this.to = to;

        this.resistentMin = resistentMin;
        this.resistentMax = resistentMax;

        this.inputCurrent = 0;
        this.isActive = false;

        // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        this.resistant = Math.random() * (resistentMax - resistentMin) + resistentMin
        let test = 0;
    }

    /**
     * Gibt die aktuelle Connection als JSON aus
     * @returns {{IsActive: boolean, ResistentMin, From, To, Resistant: *, ResistentMay, InputCurrent: number}}
     */
    toJSON() {
        return {
            From: this.from,
            To: this.to,
            ResistentMin: this.resistentMin,
            ResistentMax: this.resistentMax,
            InputCurrent: this.inputCurrent,
            IsActive: this.isActive,
            Resistant: this.resistant
        }
    }


    /**
     * Gibt den durch die Verbindung fließenden Strom an. Dieser hängt von dem Potential des Quellneurons
     * sowie des Widerstandes der Verbindung ab
     */
    RefreshCurrent() {
        if (this.from != null && this.resistant !== 0 && !isNaN(this.resistant)) {
            let sourcePotential = this.from.GetCurrentState().Pulse;
            this.inputCurrent = sourcePotential / this.resistant;
        } else {
            this.inputCurrent = 0;
        }

        return this.inputCurrent;
    }
}