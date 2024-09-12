function initTimeLineMode(){

    const timerElement = document.getElementById('timer'); // Asegúrate de que el ID es correcto
    if (timerElement) {
        timerElement.textContent = 'Time: ' + state.countdown; // Mostrar el tiempo inicial
        timerElement.style.display = 'block'; // Asegúrate de que el temporizador esté visible
    }

    countdownInterval = setInterval(() => {
        state.countdown--;
        if (timerElement) {
            timerElement.textContent = 'Tiempo: ' + state.countdown;
        }
        if (state.countdown <= 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);

    checkTimeLineModeInterval = setInterval(() => {
        if(state.countdown <= 0){
            endTimeLineMode();
        }
    },500);

}

function enterTimeLineMode() {

    // Ocultar las flechas (edges) y asegurar que los nodos sean visibles
    state.graph.edges.edgesList.forEach(edge => {
        edge.visible = false; // Ocultar todas las flechas
    });

    // Ocultar la ventana de fin del juego si está visible
    // const gameOverWindow = document.getElementById("game-over-window");
    // if (gameOverWindow) {
    //     gameOverWindow.style.display = 'none'; // Asegúrate de que esta línea está correcta
    // }

     // Ocultar todos los nodos y mostrar solo los seleccionados para el juego
     state.graph.nodes.setAllNodesInvisible();

    // Seleccionar state.numNodesGame nodos al azar y guardarlos en state.gameNodes = [];
    state.gameNodes = [];
    let allNodes = state.graph.nodes.nodesList;
    console.log("allNodes: ", allNodes);

    let contador = 0;
    while (contador < state.numNodesGame) {
        const randomIndex = Math.floor(randomIntFromInterval(0,allNodes.length - 1));
        const selectedNode = allNodes.slice(randomIndex, randomIndex + 1)[0];  

        // Mira de no seleccionar dos veces el mismo nodo
        let nodoYaSeleccionado = false;
        for ( node_ of state.gameNodes){
            if(node_.label == selectedNode.label ){
                nodoYaSeleccionado = true;
            }
        }
        if (nodoYaSeleccionado == true){
            nodoYaSeleccionado = false;
            continue;
        }
        // Marca el nodo como seleccionado , lo hace visible y lo guarda en state.gameNodes 
        for ( node of state.graph.nodes.nodesList){
            if(node.label == selectedNode.label && node.visible == false){
                
                contador += 1;
                if(contador > 10){
                    break;
                }
                node.visible = true;
                state.gameNodes.push(node);
                state.gameNodes.sort((a, b) => a.year - b.year);
                console.log (state.gameNodes);
            }
        }
    }
    // Distribuye los nodos en pantalla sin que se toquen
    const espaciado = 150;
    var nodosEspaciados = [];
    var ind = 0;

    while( nodosEspaciados.length < state.gameNodes.length){
        var nodo = state.gameNodes[ind];
        nodo.xGame = randomIntFromInterval(1200, 1900);
        nodo.yGame = randomIntFromInterval(40, 400);

        // ¿Se superpone a otro nodo?
        var overlapping = false;
        for ( var i = 0; i < nodosEspaciados.length; i++  ){
            var otroNodo = nodosEspaciados[i];
            var d = dist(nodo.xGame, nodo.yGame, otroNodo.xGame, otroNodo.yGame);
            if (d < espaciado) {
                overlapping = true;
              }
        }
         // If not keep it!
    if (!overlapping) {
        nodosEspaciados.push(nodo);
        ind += 1;
      }
    }
    
    state.selectedNode = state.gameNodes[0];
    state.graph.prepareJSONObject(); // Actualizar el gráfico
}


function initTimeLineGame(){
   
    state.modo = "timeLineMode";
    initTimeLineMode();
    enterTimeLineMode();

}


// function updateScore(points = 1){

//     state.score += points ;
//     const scoreElement = document.getElementById('score'); // Asegúrate de que el ID es correcto
//     if (scoreElement) {
//         scoreElement.textContent = 'Score: ' + state.score; // Mostrar el tiempo inicial
//         scoreElement.style.display = 'block'; // Asegúrate de que el temporizador esté visible
//     }
//     if(points > 0){
//         scoreElement.style.color = "green";
//     } else {
//         scoreElement.style.color = "red";
//     }
// }

//Esta versión de updateScore envía la puntuación al archivo PHP
function updateScore(points = 1) {
    state.score += points;
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = 'Score: ' + state.score;
        scoreElement.style.display = 'block';
    }
    if (points > 0) {
        scoreElement.style.color = "green";
    } else {
        scoreElement.style.color = "red";
    }

    console.log('Torneo ID:', state.torneoID); 
    console.log('Usuario ID:', state.usuarioID); 
    console.log('Score:', state.score); 


    // Enviar la puntuación al servidor
    fetch('../WebLN/src/guardarPuntuacion.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // usuario_id: state.usuarioID,
            // torneo_id: state.torneo_id, 
            score: state.score
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la red');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Puntuación guardada correctamente.');
        } else {
            console.error('Error al guardar la puntuación:', data.error);
        }
    })
    .catch(error => {
        console.error('Error de red al guardar la puntuación:', error);
    });
}


function endTimeLineMode(){

    state.mode = "endGameMode";
    let finalScoreElement = document.getElementById('finalScore') ;
    finalScoreElement.textContent = 'Final Score: ' + state.score; // Mostrar el tiempo inicial
    finalScoreElement.style.color = 'red'; // Asegúrate de que el temporizador esté visible

    // Guardar la puntuación en la base de datos
    fetch('../src/guardarPuntuacion.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            torneo_id: state.torneoID,
            usuario_id: state.usuarioID, 
            score: state.score
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Puntuación guardada:', data);
        } else {
            console.error('Error al guardar la puntuación:', data.error);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
    
}




