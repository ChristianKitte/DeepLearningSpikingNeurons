/**
 * Gibt ein Plotly Scatter Plot innerhalb des übergebenen Containers aus. Hierfür werden alle auszugebenen
 * Daten als Array übergeben.
 * @param divID Die ID eines DIV Elementes als Container
 * @param spannungIntern Ausgabewerte: Interne Spannung eines LIF Neuron (Membranpotential)
 * @param SpannungExtern Ausgabewerte: Externe Spannung eines LIF Neuron (Aktionspotential, Spike)
 * @param strom Ausgabewerte: Eingehender Strom (Ladestrom)
 * @param zeit Die Zeitpukte der übergebenen Zustände
 * @constructor
 */
function DrawGraph2(divID, spannungIntern, SpannungExtern, strom, zeit) {
    var strom = {
        x: zeit,
        y: strom,
        type: 'scatter',
        name: 'Strom'
    };

    var spannungIntern = {
        x: zeit,
        y: spannungIntern,
        type: 'scatter',
        name: 'Spannung intern'
    };

    var spannungExtern = {
        x: zeit,
        y: SpannungExtern,
        type: 'scatter',
        name: 'Impuls'
    };

    var data = [spannungIntern, spannungExtern, strom];

    var layout = {
        title: 'Strom und Spannung über die Zeit',
        xaxis: {
            title: 'Zeit in ms',
            showgrid: false,
            zeroline: false
        },
        yaxis: {
            title: 'Stärke Strom / Spannung in mA, mV',
            range: [0, 2],
            showline: false
        }
    };

    Plotly.newPlot(divID, data, layout);
}