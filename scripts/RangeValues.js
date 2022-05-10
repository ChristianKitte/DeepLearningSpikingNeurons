let rangeTgesamtValue = 0;
let rangeDtValue = 0;
let rangeTimpulseValue = 0;
let rangeImaxValue = 0;
let currentTypeValue = 1; // 1=Impuls, 2=Random

// d=>{} funktioniert nicht, functio(){} ja!
// Dies Script muss am Ende des HTML geladen werden, da sonst der Slider nciht gefunden wird...
d3.select('#range-tgesamt')
    .on("input", function () {
        rangeTgesamtValue = +this.value;
        let txt = "Aktueller Wert: " + rangeTgesamtValue.toString() + " ms";
        d3.select('#range-tgesamt-value').text(txt);
    });

d3.select('#range-dt')
    .on("input", function () {
        rangeDtValue = +this.value;
        let txt = "Aktueller Wert: " + rangeDtValue.toString() + " ms";
        d3.select('#range-dt-value').text(txt);
    });

d3.select('#range-timpulse')
    .on("input", function () {
        rangeTimpulseValue = +this.value;
        let txt = "Aktueller Wert: " + rangeTimpulseValue.toString() + " ms";
        d3.select('#range-timpulse-value').text(txt);
    });

d3.select('#range-imax')
    .on("input", function () {
        rangeImaxValue = +this.value;
        let txt = "Aktueller Wert: " + rangeImaxValue.toString() + " mA";
        d3.select('#range-imax-value').text(txt);
    });

// Bei Option und einer Zahl als Value kommt es regelmäßig zu NaN. Value bei select im Script und Html muss
// also eine Zahl sein
d3.select('#current-type')
    .on("change", function () {
        currentTypeValue = +this.value;
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

    currentTypeValue = document.getElementById('current-type').value;
}

setIntialValue();