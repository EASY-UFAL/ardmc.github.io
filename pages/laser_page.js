import HorizontalList from "../components/horizontal_list.js";
import CameraFrame from "../gesture_recognition/camera_frame.js";

class LaserPage {
  constructor(
    procedureType,
    procedureSpec,
    title,
    identifier,
    buttonList = []
  ) {
    this.procedureType = procedureType;
    this.procedureSpec = procedureSpec;
    this.title = title;
    this.identifier = identifier;
    this.buttonList = buttonList;
  }

  draw() {
    const pageContent = document.getElementById("page-content");
    pageContent.innerHTML = "";

    const header = document.createElement("div");
    header.className = "header";
    const pageTitle = document.createElement("div");
    pageTitle.className = "text-menu";
    pageTitle.innerHTML = this.title;
    header.appendChild(pageTitle);
    pageContent.appendChild(header);
    const list = new HorizontalList(this.buttonList);
    const cameraFrame = new CameraFrame(list);
    pageContent.appendChild(cameraFrame.draw());
  }
}

function trocaParam(titulo, valoratual, blablabla) {
  let tempPage = ParamPage("parametros da pagina"); //cria pagina
  let novoValor = tempPage.build(); // constrói pagina de troca de parametros,
  // projetada pra retornar um valor
  if (valoratual != novoValor) {
    var button = buttonArray.find("identificador do botão");
    button.valorAtual = novoValor;
  }
}
export default LaserPage;
