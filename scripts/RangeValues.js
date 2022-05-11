/**
 * Die gesammte Zeitdauer der Ausgabe in ms
 * @type {number}
 */
let rangeTgesamtValue = 0;
/**
 * Die Zeit zwischen zwei Rechenschritte in ms
 * @type {number}
 */
let rangeDtValue = 0;
/**
 * Die Zeit eines Impulses in ms
 * @type {number}
 */
let rangeTimpulseValue = 0;
/**
 * Die Stromstärke eines Impulses oder die maximale Höhe einer zufälligen Stromstärke
 * @type {number}
 */
let rangeImaxValue = 0;
/**
 * Der Widerstand zwischen zwei Neuronen in Ohm
 * @type {number}
 */
let rangeRmaxValue = 0;
/**
 * Die Art des Stromverlaufs 1=gleichförmiger Impuls, 2=zufällige Kurve
 * @type {number}
 */
let currentTypeValue = 1;

setIntialValue();

// d=>{} funktioniert nicht, functio(){} ja!
// Dies Script muss am Ende des HTML geladen werden, da sonst der Slider nciht gefunden wird...
d3.select('#range-tgesamt')
    .on("input", function () {
        rangeTgesamtValue = +this.value;
        let txt = "Aktueller Wert: " + rangeTgesamtValue.toString() + " ms";
        d3.select('#range-tgesamt-value').text(txt);
        runSimulation();
    });

d3.select('#range-dt')
    .on("input", function () {
        rangeDtValue = +this.value;
        let txt = "Aktueller Wert: " + rangeDtValue.toString() + " ms";
        d3.select('#range-dt-value').text(txt);
        runSimulation();
    });

d3.select('#range-timpulse')
    .on("input", function () {
        rangeTimpulseValue = +this.value;
        let txt = "Aktueller Wert: " + rangeTimpulseValue.toString() + " ms";
        d3.select('#range-timpulse-value').text(txt);
        runSimulation();
    });

d3.select('#range-imax')
    .on("input", function () {
        rangeImaxValue = +this.value;
        let txt = "Aktueller Wert: " + rangeImaxValue.toString() + " mA";
        d3.select('#range-imax-value').text(txt);
        runSimulation();
    });

d3.select('#range-rmax')
    .on("input", function () {
        rangeRmaxValue = +this.value;
        let txt = "Aktueller Wert: " + rangeRmaxValue.toString() + " Ohm";
        d3.select('#range-rmax-value').text(txt);
        runSimulation();
    });

// Bei Option und einer Zahl als Value kommt es regelmäßig zu NaN. Value bei select im Script und Html muss
// also eine Zahl sein
d3.select('#current-type')
    .on("change", function () {
        currentTypeValue = +this.value;
        runSimulation();
    });

// Liest die aktuell im Html gesetzten Werte aus, belegt die Variablen und setzt den initialen Texte
function setIntialValue() {
    rangeTgesamtValue = document.getElementById('range-tgesamt').getAttribute('value');
    let txt1 = "Aktueller Wert: " + rangeTgesamtValue.toString() + " ms";
    d3.select('#range-tgesamt-value').text(txt1);

    rangeDtValue = document.getElementById('range-dt').getAttribute('value');
    let txt2 = "Aktueller Wert: " + rangeDtValue.toString() + " ms";
    d3.select('#range-dt-value').text(txt2);

    rangeTimpulseValue = document.getElementById('range-timpulse').getAttribute('value');
    let txt3 = "Aktueller Wert: " + rangeTimpulseValue.toString() + " ms";
    d3.select('#range-timpulse-value').text(txt3);

    rangeImaxValue = document.getElementById('range-imax').getAttribute('value');
    let txt4 = "Aktueller Wert: " + rangeImaxValue.toString() + " mA";
    d3.select('#range-imax-value').text(txt4);

    rangeRmaxValue = document.getElementById('range-rmax').getAttribute('value');
    let txt5 = "Aktueller Wert: " + rangeRmaxValue.toString() + " Ohm";
    d3.select('#range-rmax-value').text(txt5);

    currentTypeValue = document.getElementById('current-type').value;
    runSimulation();
}
