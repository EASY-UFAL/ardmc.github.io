import Button from "../components/button.js";
import HorizontalList from "../components/horizontal_list.js";
import CameraFrame from "../components/camera_frame.js";
import SurgeryPage from "./surgery_page.js";
import ContinuousModePage from "./continuous_mode_page.js";
import PulsedModePage from "./pulsed_mode_page.js";
import SinglePulsePage from "./single_pulse_page.js";
class ModeConfigurationPage {
    constructor() {}

    draw(){
        const pageContent = document.getElementById('page-content');
        pageContent.innerHTML = "";

        const header = document.createElement('div');
        header.className = 'header';
        const pageTitle = document.createElement('div');
        pageTitle.className = 'text-menu';
        pageTitle.innerHTML = 'Modo de Disparo';
        header.appendChild(pageTitle);

        pageContent.appendChild(header);

        const button1 = new Button('b1', 'Contínuo', ()=>{this.goToContinuousModePage()});
        const button2 = new Button('b2', 'Pulsado', ()=>{this.goToPulsedModePage()});
        const button3 = new Button('b3', 'Pulso Único', ()=>{this.goToSinglePulsePage()});
        const button4 = new Button('b4', 'Voltar', ()=>{this.goToSurgeryPage()});

        const buttonsArr = [button1, button2, button3, button4];
        const list = new HorizontalList(buttonsArr);


        const cameraFrame = new CameraFrame(list);
        pageContent.appendChild(cameraFrame.draw());

    }


    goToContinuousModePage() {
        const page = new ContinuousModePage();
        page.draw();
    }

    goToPulsedModePage(){
        const page = new PulsedModePage();
        page.draw();
    }

    goToSinglePulsePage(){
        const page = new SinglePulsePage()
        page.draw()
    }
    goToSurgeryPage() {
        const page = new SurgeryPage();
        page.draw();
    }
}

export default ModeConfigurationPage;