import Button from "../components/button.js";
import HorizontalList from "../components/horizontal_list.js";
import CameraFrame from "../gesture_recognition/camera_frame.js";
import OtherPage from "./other_page.js";

class MainPage {
  constructor() {}

  draw() {
    const pageContent = document.getElementById("page-content");
    pageContent.innerHTML = "";

    const header = document.createElement("div");
    header.className = "header";
    const pageTitle = document.createElement("div");
    pageTitle.className = "text-menu";
    pageTitle.innerHTML = "Menu Principal";
    header.appendChild(pageTitle);

    pageContent.appendChild(header);

    const button1 = new Button("b1", "Cirurgia", () => {
      this.goToOtherPage();
    });
    const button2 = new Button("b2", "Terapia", () => {
      // alert("Terapia");
    });
    const button3 = new Button("b3", "Configurações", () => {
      // alert("Configurações");
    });
    const button4 = new Button("b4", "Bloquear", () => {
      // alert("Bloquear");
    });

    const buttonsArr = [button1, button2, button3, button4];
    const list = new HorizontalList(buttonsArr);

    const cameraFrame = new CameraFrame(list);
    pageContent.appendChild(cameraFrame.draw());
  }

  goToOtherPage() {
    const page = new OtherPage();
    page.draw();
  }
}

export default MainPage;
