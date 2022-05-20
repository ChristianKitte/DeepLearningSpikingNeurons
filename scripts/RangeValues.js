/////////////////
// Werte Global
/////////////////

/**
 * True, wenn ein Sound bei jedem Spiken ausgegeben werden soll, ansonsten false
 * @type {boolean}
 */
let playSoundOnSpike = false;

/////////////////
// Werte Lösung 1
/////////////////

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

/////////////////
// Werte Lösung 2
/////////////////

/**
 * Die Anzahl der Neuronen im Netz
 * @type {number}
 */
let rangeCountNeuronenValue = 0;
/**
 * Die untere Schranke des Zufallswertes für den Widerstand in Ohm
 * @type {number}
 */
let rangeWiderstandMinValue = 0;
/**
 * Die Zeit eines Impulses in ms
 * @type {number}
 */
let rangeTNetzImpulseValue = 0;
/**
 * Die ober Schranke des Zufallswertes für den Widerstand in Ohm
 * @type {number}
 */
let rangeWiderstandMaxValue = 0;
/**
 * Die minimale Höhe des Stromes in mA (entspricht der unteren Grenze (Typ: Zufällig))
 * @type {number}
 */
let rangeINetzMinValue = 0;
/**
 * Die maximale Höhe des Stromes in mA (entspricht der Impulsstärke (Typ: Puls) oder oberen Grenze (Typ: Zufällig))
 * @type {number}
 */
let rangeINetzMaxValue = 0;
/**
 * Die Art des Stromverlaufs 1=gleichförmiger Impuls, 2=zufällige Kurve
 * @type {number}
 */
let NetCurrentTypeValue = 1;

setIntialValue();

// d=>{} funktioniert nicht, functio(){} ja!
// Dies Script muss am Ende des HTML geladen werden, da sonst der Slider nciht gefunden wird...

/////////////////
// Werte Global
/////////////////

d3.select('#check-playSound')
    .on("change", function () {
        playSoundOnSpike = !!d3.select("#check-playSound").property("checked");
    })

/////////////////
// Werte Lösung 1
/////////////////
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

/**
 * Bei Option und einer Zahl als Value kommt es regelmäßig zu NaN. Value bei select im Script und Html muss
 * also eine Zahl sein
 */
d3.select('#current-type')
    .on("change", function () {
        currentTypeValue = +this.value;
        runSimulation();
    })
    .property('value', currentTypeValue);

/////////////////
// Werte Lösung 2
/////////////////

d3.select('#range-countNeuronen')
    .on("input", function () {
        rangeCountNeuronenValue = +this.value;
        let txt = "Aktueller Wert: " + rangeCountNeuronenValue.toString() + " LIF Neuronen";
        d3.select('#range-countNeuronen-value').text(txt);
        createNetworkGraph();
    });

d3.select('#range-widerstandMin')
    .on("input", function () {
        rangeWiderstandMinValue = +this.value;
        let txt = "Aktueller Wert: " + rangeWiderstandMinValue.toString() + " Ohm";
        d3.select('#range-widerstandMin-value').text(txt);
        createNetworkGraph();
    });

d3.select('#range-widerstandMax')
    .on("input", function () {
        rangeWiderstandMaxValue = +this.value;
        let txt = "Aktueller Wert: " + rangeWiderstandMaxValue.toString() + " Ohm";
        d3.select('#range-widerstandMax-value').text(txt);
        createNetworkGraph();
    });

d3.select('#range-tNetzImpulse')
    .on("input", function () {
        rangeTNetzImpulseValue = +this.value;
        let txt = "Aktueller Wert: " + rangeTNetzImpulseValue.toString() + " ms";
        d3.select('#range-tNetzImpulse-value').text(txt);
        createNetworkGraph();
    });

d3.select('#range-iNetzMin')
    .on("input", function () {
        rangeINetzMinValue = +this.value;
        let txt = "Aktueller Wert: " + rangeINetzMinValue.toString() + " mA";
        d3.select('#range-iNetzMin-value').text(txt);
        createNetworkGraph();
    });

d3.select('#range-iNetzMax')
    .on("input", function () {
        rangeINetzMaxValue = +this.value;
        let txt = "Aktueller Wert: " + rangeINetzMaxValue.toString() + " mA";
        d3.select('#range-iNetzMax-value').text(txt);
        createNetworkGraph();
    });

/**
 * Bei Option und einer Zahl als Value kommt es regelmäßig zu NaN. Value bei select im Script und Html muss
 * also eine Zahl sein
 */
d3.select('#netzCurrent-type')
    .on("change", function () {
        NetCurrentTypeValue = +this.value;
        //createNetworkGraph();
    })
    .property('value', NetCurrentTypeValue);

/**
 * Liest die aktuell im Html für Lösung 1 und 2 gesetzten Werte aus, belegt die Variablen und setzt den initialen Texte
 */
function setIntialValue() {
    /////////////////
    // Werte Global
    /////////////////
    playSoundOnSpike = !!d3.select("#check-playSound").property("checked");

    /////////////////
    // Werte Lösung 1
    /////////////////
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

    CurrentTypeValue = document.getElementById('current-type').value;

    /////////////////
    // Werte Lösung 2
    /////////////////
    rangeCountNeuronenValue = document.getElementById('range-countNeuronen').getAttribute('value');
    let txt6 = "Aktueller Wert: " + rangeCountNeuronenValue.toString() + " LIF Neuronen";
    d3.select('#range-countNeuronen-value').text(txt6);

    rangeWiderstandMinValue = document.getElementById('range-widerstandMin').getAttribute('value');
    let txt7 = "Aktueller Wert: " + rangeWiderstandMinValue.toString() + " Ohm";
    d3.select('#range-widerstandMin-value').text(txt7);

    rangeWiderstandMaxValue = document.getElementById('range-widerstandMax').getAttribute('value');
    let txt8 = "Aktueller Wert: " + rangeWiderstandMaxValue.toString() + " Ohm";
    d3.select('#range-widerstandMax-value').text(txt8);

    rangeTNetzImpulseValue = document.getElementById('range-tNetzImpulse').getAttribute('value');
    let txt9 = "Aktueller Wert: " + rangeTNetzImpulseValue.toString() + " ms";
    d3.select('#range-tNetzImpulse-value').text(txt9);

    rangeINetzMinValue = document.getElementById('range-iNetzMin').getAttribute('value');
    let txt10 = "Aktueller Wert: " + rangeINetzMinValue.toString() + " mA";
    d3.select('#range-iNetzMin-value').text(txt10);

    rangeINetzMaxValue = document.getElementById('range-iNetzMax').getAttribute('value');
    let txt11 = "Aktueller Wert: " + rangeINetzMaxValue.toString() + " mA";
    d3.select('#range-iNetzMax-value').text(txt11);

    NetCurrentTypeValue = document.getElementById('netzCurrent-type').value;
}
