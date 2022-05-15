// https://www.youtube.com/watch?v=y2-sgZh49dQ
// https://github.com/BlastWind/D3.js-Tutorial
// https://github.com/BlastWind/D3.js-Tutorial

// https://observablehq.com/@chinwobble/force-layout
// https://www.pluralsight.com/guides/creating-force-layout-graphs-in-d3

class NetworkGraph {
    constructor() {
        this.neurons = [];
        this.connections = [];

        this.graph = this.GetGraphData(this.neurons, this.connections);

        //initilize svg or grab svg
        this.svg = d3.select("svg");
        this.width = this.svg.attr("width");
        this.height = this.svg.attr("height");

        this.link = this.svg
            .append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.graph.links)
            .enter()
            .append("line")
            .attr("stroke-width", function (d) {
                return 3;
            });

        this.node = this.svg
            .append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(this.graph.nodes)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("fill", function (d) {
                return "red";
            })
            .call(
                drag(this.simulation)
            );

        this.simulation = d3
            .forceSimulation(this.graph.nodes)
            .force(
                "link",
                d3
                    .forceLink()
                    .id(function (d) {
                        return d.name;
                    })
                    .links(this.graph.links)
            )

            .force("charge", d3.forceManyBody().strength(-30))
            .force("center", d3.forceCenter(this.width / 2, this.height / 2))
            .on("tick", ticked);

        function ticked() {
            this.link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            this.node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        }

        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }
    }

    GetGraphData(neurons = [], connections = []) {
        /*return {
            nodes: this.neurons,
            links: this.connections
        }*/

        return {
            nodes: [
                {name: "Alice"},
                {name: "Bob"},
                {name: "Chen"},
                {name: "Dawg"},
                {name: "Ethan"},
                {name: "George"},
                {name: "Frank"},
                {name: "Hanes"}
            ],
            links: [
                {source: "Alice", target: "Bob"},
                {source: "Chen", target: "Bob"},
                {source: "Dawg", target: "Chen"},
                {source: "Hanes", target: "Frank"},
                {source: "Hanes", target: "George"},
                {source: "Dawg", target: "Ethan"}
            ]
        }
    }

}