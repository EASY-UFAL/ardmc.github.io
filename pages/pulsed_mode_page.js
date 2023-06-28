import Button from "../components/button.js";
import PropertyButton from "../components/property_button.js";
import HorizontalList from "../components/horizontal_list.js";
import CameraFrame from "../gesture_recognition/camera_frame.js";
import ModeConfigurationPage from "./mode_configuration_page.js";
import SurgeryPage from "./surgery_page.js";
import DurationConfigPage from "./duration_config_page.js";
import RepetitionConfigPage from "./repetition_config_page.js";
import FrequencyConfigPage from "./frequency_config_page.js";

class PulsedModePage {
  constructor() {}

  draw() {
    const pageContent = document.getElementById("page-content");
    pageContent.innerHTML = "";

    const header = document.createElement("div");
    header.className = "header";
    const pageTitle = document.createElement("div");
    pageTitle.className = "text-menu";
    pageTitle.innerHTML = "Pulsado";
    header.appendChild(pageTitle);

    pageContent.appendChild(header);

    const button1 = new PropertyButton(
      "b1",
      "Duração",
      25,
      1000,
      25,
      "ms",
      () => {
        this.goToDurationConfigPage();
      }
    );
    const button2 = new PropertyButton(
      "b2",
      "Repetição",
      1,
      100,
      0.5,
      "ms",
      () => {
        this.goToRepetitionConfigPage();
      }
    );
    const button3 = new PropertyButton(
      "b3",
      "Frequência",
      33.3,
      1000,
      33.3,
      "Hz",
      () => {
        this.goToFrequencyConfigPage();
      }
    );
    const button4 = new Button("b4", "Cancelar", () => {
      this.goToModeConfigurationPage();
    });
    const button5 = new Button("b5", "Confirmar", () => {
      this.goToSurgeryPage();
    });

    const buttonsArr = [button1, button2, button3, button4, button5];
    const list = new HorizontalList(buttonsArr);

    const cameraFrame = new CameraFrame(list);
    pageContent.appendChild(cameraFrame.draw());
  }

  goToDurationConfigPage() {
    const page = new DurationConfigPage(
      "pulsed-mode-duration",
      25,
      1000,
      25,
      25,
      "ms"
    );
    page.draw();
  }

  goToRepetitionConfigPage() {
    const page = new RepetitionConfigPage(
      "pulsed-mode-repetition",
      1,
      100,
      1,
      0.5,
      "ms"
    );
    page.draw();
  }

  goToFrequencyConfigPage() {
    const page = new FrequencyConfigPage(
      "pulsed-mode-frequency",
      33.3,
      1000,
      33.3,
      0.1,
      "Hz"
    );
    page.draw();
  }

  goToModeConfigurationPage() {
    const page = new ModeConfigurationPage();
    page.draw();
  }

  goToSurgeryPage() {
    const page = new SurgeryPage();
    page.draw();
  }
}

export default PulsedModePage;
