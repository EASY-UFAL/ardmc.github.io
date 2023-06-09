import Button from "../components/button.js";
import HorizontalList from "../components/horizontal_list.js";
import CameraFrame from "../gesture_recognition/camera_frame.js";
import PropertyButton from "../components/property_button.js";
import MainPage from "./main_page.js";
import ModeConfigurationPage from "./mode_configuration_page.js";
import OtherPage from "./other_page.js";
import PowerConfigPage from "./power_config_page.js";
import ResetTimerPage from "./time_reset_page.js";

class SurgeryPage {
  constructor() {}

  draw() {
    const pageContent = document.getElementById("page-content");
    pageContent.innerHTML = "";

    const header = document.createElement("div");
    header.className = "header";
    const pageTitle = document.createElement("div");
    pageTitle.className = "text-menu";
    pageTitle.innerHTML = "Cirurgia";
    header.appendChild(pageTitle);

    pageContent.appendChild(header);

    const button1 = new Button("b1", "Em Espera", () => {
      this.switchState();
    });
    const button2 = new PropertyButton(
      "b2",
      "Potência",
      0.5,
      9.0,
      0.5,
      "W",
      () => {
        this.goToPowerConfigPage();
      }
    );
    // const button3 = new Button('b3', 'Modo', ()=>{alert('Modo')});
    const button3 = new Button("b3", "Modo", () => {
      this.goToModeConfigPage();
    });
    const button4 = new PropertyButton(
      "b4",
      "Tempo",
      0,
      1000000,
      0,
      "s",
      () => {
        this.goToResetTimerPage();
      }
    );
    const button5 = new PropertyButton(
      "b5",
      "Energia",
      0,
      1000000,
      0,
      "J",
      () => {
        // alert("Energia");
      }
    );
    const button6 = new Button("b6", "Menu", () => {
      this.goToMainPage();
    });
    const button7 = new Button("b7", "Testar Fibra", () => {
      // alert("Testar Fibra");
    });
    const button8 = new Button("b8", "Voltar", () => {
      this.goToOtherPage();
    });

    const buttonsArr = [
      button1,
      button2,
      button3,
      button4,
      button5,
      button6,
      button7,
      button8,
    ];
    const list = new HorizontalList(buttonsArr);

    const cameraFrame = new CameraFrame(list);
    pageContent.appendChild(cameraFrame.draw());
  }

  switchState() {
    var button = document.getElementById("0");
    if (button.text === "Em Espera") {
      button.text = "Disponível";
    } else {
      button.text = "Em Espera";
    }
    button.innerHTML = button.text;
  }

  goToModeConfigPage() {
    const page = new ModeConfigurationPage();
    page.draw();
  }

  goToMainPage() {
    const page = new MainPage();
    page.draw();
  }

  goToOtherPage() {
    const page = new OtherPage();
    page.draw();
  }

  goToPowerConfigPage() {
    const page = new PowerConfigPage(
      "power-config-page",
      0.5,
      9,
      0.5,
      0.5,
      "W"
    );
    page.draw();
  }
  goToResetTimerPage() {
    const page = new ResetTimerPage();
    page.draw();
  }
}

export default SurgeryPage;
