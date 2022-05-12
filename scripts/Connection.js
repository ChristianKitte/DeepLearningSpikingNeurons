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
        this.resistentMay = resistentMax;

        this.inputCurrent = 0;
        this.isActive = false;

        // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        this._resistant = Math.random() * (resistentMax - resistentMin) + min
    }

    /**
     * Gibt den Wert des Widerstands der Verbundung zurück
     * @returns {number} Der Widerstand in Ohm
     */
    get resistant() {
        return this._resistant;
    }

    /**
     * Setzt den Wert des Widerstands der Verbindung
     * @param value Der Widerstand in Ohm
     */
    set resistant(value) {
        this._resistant = value;
    }

    /**
     * Gibt den durch die Verbindung fließenden Strom an. Dieser hängt von dem Potential des Quellneurons
     * sowie des Widerstandes der Verbindung ab
     */
    get current() {
        if (this.from != null && this._resistant !== 0 && !isNaN(this._resistant)) {
            let sourcePotential = this.from.GetCurrentState().Pulse;
            this.inputCurrent = sourcePotential / this._resistant;
        } else {
            this.inputCurrent = 0;
        }
    }


}