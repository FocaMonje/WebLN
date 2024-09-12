

class State {
    constructor() {
        let startNodes = new Nodes();
        let startEdges = new Edges();

        this.mode = "editorMode";     // Modos : "editorMode", "gameMode" , etc
        this.tool = "draw";       // Herramientas: "draw" , "delete"  
        this.graph = new GraphManager(startNodes, startEdges);
        this.selectedNode = {};
        this.selectedEdge = {};

        this.numNodesGame = 2;
        this.countdown = 120; // Cronometro del Juego
        this.gameNodes = [];
        this.gameEdges = [];
        this.score = 0;
        this.nodesUnderMouse = [];
        this.torneo_id = null;
        this.usuario_id = null;
    }

    get modo(){
        return this.mode;
    }
    set modo(m){
        this.mode = m;
    }
    get herramienta(){
        return this.tool;
    }
    set herramienta(herr){
        this.tool = herr;
    }
    get grafo(){
        return this.graph;
    }
    set grafo(grafo){
        this.graph = grafo;
    }
    get nodoSeleccionado(){
        return this.selectedNode;
    }
    set nodoSeleccionado(nodo){
        this.selectedNode = nodo;
    }
    get arcoSeleccionado(){
        return this.selectedEdge;
    }
    set arcoSeleccionado(edge){
        this.selectedEdge = edge;
    }
    get torneoID() {
        return this.torneo_id;
    }
    set torneoID(id) {
        this.torneo_id = id;
    }

    get usuarioID() {
        return this.usuario_id;
    }
    set usuarioID(id) {
        this.usuario_id = id;
    }
    

}

function initState(){

    state = {};
    state = new State();

     // Usar los valores que se pasaron desde PHP
    if (window.state) {
        // Asignar el ID del torneo y usuario desde el objeto window.state
        state.torneoID = window.state.torneoID || null;  // Establece a null si no existe
        state.usuarioID = window.state.usuarioID || null; // Establece a null si no existe
    }

    // Verifica que se han asignado correctamente los IDs
    console.log('Torneo ID initState:', state.torneoID);
    console.log('Usuario ID initState:', state.usuarioID);

    // Cargar el grafo
    fetch('assets/data/Grafo_cartas_inventos.json')
    .then((response) => response.json())
    .then((json) => state.graph.rebuildGraph(json));
}

// FUNCIONES QUE CAMBIAN EL ESTADO 

function addNode(estado, node){
   estado.graph.nodes.addNode(node.year, node.valencia, node.label);                       
}

function changeNode(estado, node , newLabel){
    estado.graph.nodes.changeNode(node.label, newLabel);
}

function deleteNode(estado, node){
   estado.graph.nodes.deleteNode(node);
} 

function addEdge(estado, node1, node2, explicacion = ''){
    estado.graph.addEdge(node1, node2, explicacion = '');                       
}

function changeEdge(estado, edge , newExplicacion){
    estado.graph.edges.changeEdge(edge.explicacion, newExplicacion);
}

function removeEdge(estado, edge){
    estado.graph.edges.removeEdge(edge);
} 

// El listener va al final del archivo para asegurarse de que todo el código anterior se haya definido y que el DOM esté listo
document.addEventListener("DOMContentLoaded", function() {
    // Llama a la función initState para inicializar el estado
    initState();

    // Comprueba que los valores se establecieron correctamente
    console.log('Estado inicial Listener:', state);
    console.log('Usuario ID Listener:', state.usuarioID);
    console.log('Torneo ID Listener:', state.torneoID);
});