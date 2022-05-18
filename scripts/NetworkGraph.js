let _neurons = [];
let _connections = [];

const lineGenerator = d3.line();

let simulation;
let tooltip = addTooltip();

let svg;
let _svgNodes;
let _svgLinks;

/**
 * Erzeugt einen neuen Graphen
 * @param network Das zugrundeliegende Netzwerk
 * @returns {*} Die D3 Simulation
 */
function createGraph(network) {
    svg = createSvg();

    updateData(network);
    _svgNodes = addNodes(_neurons);
    _svgLinks = addLinks(_connections);
    simulation = initializeSimulation();

    return simulation
}

/**
 * Erstellt aus der übergebenen Netzbeschreibung zwei für d3 geeignete Array der Nodes und Edges und
 * legt diese ab.
 * @param network Die Beschreibung des darzustellenden Netzwerkes
 */
function updateData(network) {
    let graph = GetGraphData(network.neurons, network.connections);

    _neurons = graph.nodes;
    _connections = graph.links;
}

/**
 * Erzeugt das unterliegende SVG Element zur Ausgabe des Graphen
 * @returns {svg} Das unterleigende SVG Element
 */
function createSvg() {
    // eventuell vorhandenen vorherigen Graphen entfernen
    d3.select("#svgOutput").remove();

    return d3.select("div#container")
        .append("svg")
        .attr("id", "svgOutput")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 400 400")
        .classed("svg-content", true);
}

/**
 * Initialisiert die Simulation
 * @returns {*}
 */
function initializeSimulation() {
    return d3.forceSimulation(_neurons)
        .force('charge', d3.forceManyBody() // Legt die Anziehung zwischen den Knoten fest
            .strength(-500)) // negative Werte führen zu Abstoßung
        .force('link', d3.forceLink(_connections) // Unterstützt Links zwischen Knoten
            .id(d => d.Id)  // definiert die ID der Nodes (Default wird der Inex genutzt)
            .distance(50)) // definiert die Abstände
        .force('center', d3.forceCenter(200, 200)) // definert das Zentrum der Simulation
        .on("tick", tick);
}

/**
 * Handler für d3 Tick
 */
function tick() {
    _svgNodes.attr("cx", function (d) {
        return d.x;
    });
    _svgNodes.attr("cy", function (d) {
        return d.y;
    });


    _svgLinks.attr('d', d => lineGenerator([
        [d.source.x, d.source.y],
        [d.target.x, d.target.y]])
    )
}

/**
 * Fügt den übergeordneten SVG Element die übergebenen Nodes (Neuronen) hinzu und initialisiert deren
 * Verhalten.
 * @param nodes Die hinzuzufügenden Notes (Neuronen)
 * @returns {*} Die SVG Nodes
 */
function addNodes(nodes) {
    return svg.selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('class', 'networkNodeInactive')
        .attr('r', 5)
        .attr('fill', 'blue')
        .attr("width", function (d) {
            return d.size + 5;
        })
        .attr("height", function (d) {
            return d.size + 5;
        })
        .on("mouseover", function (d) {
            d3.select(this)
                .transition()
                .duration(350)
                .attr("r", 10)
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .transition()
                .duration(350)
                .attr("r", 5)
        })
        .on('mouseover.tooltip', function (event, d) {
            tooltip.transition()
                .duration(300)
                .style("opacity", .8);
            tooltip.html(
                "ID : " + d.Id + "</br>" +
                "InputConnections : " + d.InputConnections + "</br>" +
                "OutputConnections : " + d.OutputConnections + "</br>" +
                "IncommingCurrent : " + d.IncommingCurrent + "</br>" +
                "Spiking : " + d.Spiking + "</br>" +
                "OutgoingVoltage : " + d.OutgoingVoltage + "</br>" +
                "IncommingConnections : " + d.IncommingConnections + "<p/>" +
                "IncommingActiveConenctions : " + d.IncommingActiveConenctions + "</br>" +
                "OutgoingConnections : " + d.OutgoingConnections + "</br>")
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout.tooltip", function () {
            tooltip.transition()
                .duration(100)
                .style("opacity", 0);
        })
        .call(d3.drag()  //sets the event listener for the specified typenames and returns the drag behavior.
            .on("start", dragstarted) //start - after a new pointer becomes active (on mousedown or touchstart).
            .on("drag", dragged)      //drag - after an active pointer moves (on mousemove or touchmove).
            .on("end", dragended) //end - after an active pointer becomes inactive (on mouseup, touchend or touchcancel).
        );
}

/**
 * Fügt den übergeordneten SVG Element die übergebenen Links/Edges (Connections) hinzu und initialisiert deren
 * Verhalten.
 * @param links Die hinzuzufügenden Links/Edges (Connections)
 * @returns {*} Die SVG Links
 */
function addLinks(links) {
    // link initialisieren
    return svg
        .selectAll('path.link')
        .data(links)
        .enter()
        .append('path')
        .attr("class", "links")  // funktioniert noch nicht so richtig
        .attr('stroke', 'black')
        .attr('fill', 'none');
}

/**
 * Fügt einen Tooltip hinzu
 * @returns {*} Der zu verwendende Tooltip
 */
function addTooltip() {
    let tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    return tooltip;
}

/**
 * Event Handler für Drag Start
 * @param event Das Event
 * @param d Der Node
 */
function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();//sets the current target alpha to the specified number in the range [0,1].
    d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
    d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
}

/**
 * Event Handler für Dragged
 * @param event Das Event
 * @param d Der Node
 */
function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

/**
 * Event Handler für DragEnd
 * @param event Das Event
 * @param d Der Node
 */
function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

/**
 * Erzeugt die für den Graphen benötigten Datasets (Nodes, Edges)
 * @param neurons Ein Array der beteiligten Neuronen
 * @param connections Ein array der vorhandenen Verbindungen
 * @returns {{nodes: *[], links: *[]}} Ein Array
 */
function GetGraphData(neurons = [], connections = []) {
    let nodes = [];
    let links = [];

    neurons.forEach(
        (neuron) => {
            nodes.push({
                Id: neuron.id,
                InputConnections: neuron.inputConnections.length,
                OutputConnections: neuron.outputConnection.length,
                IncommingCurrent: neuron.incomingCurrent,
                Spiking: neuron.spiking,
                OutgoingVoltage: neuron.outgoingVoltag,
                IncommingConnections: neuron.incomingConnections,
                IncommingActiveConenctions: neuron.incomingActiveConnections,
                OutgoingConnections: neuron.outgoingConnection,
            });
        }
    );

    connections.forEach(
        (connection) => {
            links.push(
                {source: connection.from.id, target: connection.to.id}
            )
        }
    );

    return {
        nodes: nodes,
        links: links
    };
}

function Update(network) {
    /*
    updateData(network);

    let nodeElements = svg.selectAll('circle')
        .data(_neurons, function (d) {
            return d.id
        });

    let enterSelection = nodeElements.enter().append('circle').attr("r", 10);

    simulation.nodes(_neurons);
    simulation.force("link").links(_connections);
    simulation.alphaTarget(0.1).restart();

    let nodeElements = svg.selectAll('circle').enter();

    for (let x = 0; x < nodeElements.length; x++) {
        console.log(_svgNodes.nodes[x].toJSON());
    }*/

}

function CreateNodeArray(network, id) {
    const box = document.getElementById(id);

    for (let x = 0; x < network.neurons.length; x++) {
        let newSpan = document.createElement('div');
        let newNode = network.neurons[x];

        newSpan.id = newNode.id;
        newSpan.classList.add('NodeArrayElement');

        box.appendChild(newSpan);
    }
}

function UpdateNodeArray(network, id) {
    for (let x = 0; x < network.neurons.length; x++) {
        let newNode = network.neurons[x];
        let newHtmlNode = document.getElementById(newNode.id);

        newHtmlNode.classList.remove('NodeArrayElement');
        newHtmlNode.classList.remove('inactiveNodeArrayElement');
        newHtmlNode.classList.remove('activeNodeArrayElement');

        if (newNode.spiking) {
            newHtmlNode.classList.add('activeNodeArrayElement')
        } else {
            newHtmlNode.classList.add('inactiveNodeArrayElement')
        }
    }
}

//https://www.mediaevent.de/css/display-flex.html
//https://bobbyhadz.com/blog/javascript-create-element-with-class
//https://www.javascripttutorial.net/javascript-dom/javascript-createelement/
