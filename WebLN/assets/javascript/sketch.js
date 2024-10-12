
var manager ;

function setup() {
    
    canvas = createCanvas(canvas_width, canvas_height);
    centerCanvas(canvas);

    // initHtml();

    manager = new SceneManager();

    manager.addScene(Scene1);
    manager.addScene(Scene2);
    manager.addScene(Scene3);

    manager.showNextScene();
}
    

function draw() {
    manager.draw();
}

function mousePressed(){
    manager.handleEvent("mousePressed");
}

function keyPressed(){
    manager.handleEvent("keyPressed");
}


class Scene1 {

    enter(){
        this.textX = 10;
        this.textY = 0;

<<<<<<< HEAD:assets/javascript/sketch.js
        background("#D7D9F2");
        textAlign(CENTER);

        textFont('Eater');
        fill("blue");
=======
        background("#EAEAEA");
        textAlign(CENTER);

        textFont('Labrada');
        fill("black");
        textSize(32);
>>>>>>> Implementacion-Pago-LNbits:WebLN/assets/javascript/sketch.js
        text("Inicio del juego\n" +
        "Presiona una tecla o el ratón \n\n" +
        "Para comenzar.", width / 2, height / 2);

    }

    draw() {
       
    }

    keyPressed(){
        this.sceneManager.showNextScene();
    }

    mousePressed(){
        this.sceneManager.showNextScene();
    }
}

class Scene2 {

    enter(){
        initState();
        setTimeout(initTimeLineGame, 2000);
    }

    setup(){
        
    }

    draw(){

        background(220);
        
        push();
        translate(scrollX , scrollY);
        scale(zoomX,zoomY);
        
        state.graph.findEdgeUnderMouse();

        findNodesUnderMouse();
    
        state.graph.drawGraph();

        if(state.mode == "endGameMode"){
            this.sceneManager.showNextScene();
        }
    }

    mousePressed(){
        executeByMode();
    }

    keyPressed(){

    }

    
}

class Scene3 {

    enter(){

        this.textX = 10;
        this.textY = 0;

<<<<<<< HEAD:assets/javascript/sketch.js
        background("#D7D9F2");
        textAlign(CENTER);

        textFont('Eater');
        fill("red");
=======
        background("#EAEAEA");
        textAlign(CENTER);

        textFont('Labrada');
        fill("red");
        textSize(32);
>>>>>>> Implementacion-Pago-LNbits:WebLN/assets/javascript/sketch.js
        text("Game Over \n\n\n" +
        " Tu puntuación es " + state.score + " \n\n"+
        "Presiona una tecla o el ratón.\n\n" +
        "Para volver a empezar.", width / 2, height / 2);
        
        // Llamar a la función para registrar ganadores
        registerWinners(); 
    }

    keyPressed(){
        this.sceneManager.showNextScene();
    }

    mousePressed(){
        this.sceneManager.showNextScene();
    }
}