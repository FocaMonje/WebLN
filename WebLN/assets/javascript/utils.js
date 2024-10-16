
// function mouseDragged() {
//   let zoomFactor = map(zoomSettings.zoom, 15, 50, 0.5, 2);
//   let mouseXAdj = (mouseX - centerX - controls.view.x) / zoomFactor + centerX;
//   let mouseYAdj = (mouseY - centerY - controls.view.y) / zoomFactor + centerY;

//   if (draggingNode) {
//       draggingNode.x = mouseXAdj;
//       draggingNode.y = mouseYAdj;
//       activeGraph.prepareJSONObject();
//   } else {
//       draggingNode = activeNodes.findNode(mouseXAdj, mouseYAdj);
//   }
// }

function mouseReleased() {
  draggingNode = null;
}

function modifyNodeName() {
  let node = activeNodes.nodeSelected;
  if (node) {
      node.label = labelInput.value();
  }
}

function doZoom(event) {
    const direction = event.deltaY > 0 ? -1 : 1;
    const factor = 0.05;
    const zoom = direction * factor;
  
    const wx = (mouseX - controls.view.x) / (width * controls.view.zoom);
    const wy = (mouseY - controls.view.y) / (height * controls.view.zoom);
  
    controls.view.x -= wx * width * zoom;
    controls.view.y -= wy * height * zoom;
    controls.view.zoom += zoom;
}

function resetButtonStyles() {
  // Restablecer el estilo del menú desplegable
  const modeDropdown = document.getElementById('modeDropdown');
  if (modeDropdown) {
      modeDropdown.style.backgroundColor = '';
  }
  hideAnimationControls();
}

function moveView(deltaX, deltaY) {
    // Actualizar el desplazamiento para el canvas
    scrollX -= deltaX;
    scrollY -= deltaY;

    // Ajustar la vista del canvas
    translate(deltaX, deltaY);
    
    // Redibujar el canvas
    redraw();
    
    // activeGraph.prepareJSONObject(); // Actualizar el grafo
}

function modifyEdgeInfo(){
    let edge = activeGraph.edges.selectedEdge;
    if (edge) {
        edge.explicacion = edgeInput.value();
    }
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function centerCanvas(cnv) {
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    cnv.position(x, y);
}

function draw_grid(w, h, alpha_val){

    let colorGrid = color(0,150,150);
  
    push();
    for (let i = initYear; i < lastYear; i += 100){
      colorGrid.setAlpha(alpha_val);
      stroke(colorGrid);
      line(i, 0, i, h);
      fill(colorGrid);
      textSize(16);
      if (i == initYear) continue;
      text(str(i), i + 20, h - 20);
    }
    
    let cont = 0;
    for (let i = alturaDibujo; i > 0; i -= Math.floor(alturaDibujo / maxVal)){
      colorGrid.setAlpha(alpha_val);
      stroke(colorGrid);
      line(initYear +  35 ,i, initYear + lastYear, i);
      fill(colorGrid);
      textSize(12);
      text(str(maxVal - cont + 1), initYear+ 20, alturaDibujo - i  + 15);
      cont += 1;
    }
    
    pop();
   
}

function indiceDeInvento(invento_id, arrayInventos){
    
    for (let i = 0; i < arrayInventos.length; i += 1){
      if(invento_id === arrayInventos[i].id)
        return i;
    }
    return -1;
    
}

  
function coordCanvasReales(xCanvas, yCanvas){

    const realX = (xCanvas - scrollX) * 1/zoomX ;
    let realY = (yCanvas - scrollY) * 1/zoomY;
    
    realY = (2 * (alturaDibujo - realY) / maxVal) ;

    return {x:realX, y:realY};

}

function coordRealesCanvas(year, valencia){

  let xCanvas = year;
  let intevaloVal = Math.floor(alturaDibujo / maxVal);
  let yCanvas = alturaDibujo - valencia * intevaloVal;

  return {x:xCanvas, y:yCanvas};

}

function updateIncreaseXZoom() {
    zoomXPlus();
    redraw();
}

function updateDecreaseXZoom() {
    zoomXMinus();
    redraw();
}

function updateIncreaseYZoom() {
    zoomYPlus();
    redraw();
}

function updateDecreaseYZoom() {
    zoomYMinus();
    redraw();
}

// Función para manejar las teclas presionadas
function keyPressed() {
    switch (key) {
      case 'q':
        resetZoom();
        break;
      case 'z':
        zoomXMinus();
        break;
      case 'x':
        zoomXPlus();
        break;
      case 'd':
        zoomYPlus();
        break;
      case 'c':
        zoomYMinus();
        break;
    }
}

function resetZoom(){
  zoomX = 1;
  zoomY = 1;
  scrollX = -1 * initYear;
  scrollY = 0;
}

function zoomXPlus(){
  zoomX += 0.05;
  scrollX -= 75;
}

function zoomXMinus(){
  zoomX -= 0.05;
  scrollX += 75;
}

function zoomYPlus(){
  zoomY += 0.05;
  scrollY -= 24.0;
}

function zoomYMinus(){
  zoomY -= 0.05;
  scrollY += 24.0;
}

function deepCopy(object){
  // https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy

  return JSON.parse(JSON.stringify(object));
}

function objetoVacio(objeto){
  // La función verifica si el objeto está vacio o si no existe
  if(!objeto){
    return true;
  }
  return Object.keys(objeto).length == 0;
}

function adjustValencia(){

  for (let i = 0; i < state.graph.nodes.nodesList.length; i++) {
    let node = state.graph.nodes.nodesList[i];
    let valencia = 0;
    for (let j = 0; j < state.graph.edges.edgesList.length; j++) {
      let edge = state.graph.edges.edgesList[j];
      if(edge.source.label == node.label ){
        valencia += 1
        edge.source.valencia = valencia;
      }
    }
    node.valencia = valencia;
  }
}



function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function deleteObject(obj) {   Object.keys(obj).forEach(key => delete obj[key]); }

// Función para registrar ganadores
function registerWinners() {
  console.log("Intentando registrar ganadores...");
  fetch('../WebLN/src/ganadores.php')
      .then(response => response.text())
      .then(data => console.log('Ganadores registrados: ', data))
      .catch(error => console.error('Error al registrar los ganadores:', error));
}
