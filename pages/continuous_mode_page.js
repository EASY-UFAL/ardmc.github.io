import Button from "../components/button.js";
import HorizontalList from "../components/horizontal_list.js";
import CameraFrame from "../components/camera_frame.js";
import SurgeryPage from "./surgery_page.js";
import ModeConfigurationPage from "./mode_configuration_page.js";

class ContinuousModePage {
    constructor() {}

    draw(){
        const pageContent = document.getElementById('page-content');
        pageContent.innerHTML = "";

        const header = document.createElement('div');
        header.className = 'header';
        const pageTitle = document.createElement('div');
        pageTitle.className = 'text-menu';
        pageTitle.innerHTML = 'Contínuo';
        header.appendChild(pageTitle);

        pageContent.appendChild(header);

        const button1 = new Button('b1', 'Cancelar', ()=>{this.goToModeConfigurationPage()});
        const button2 =  new Button('b2', 'Confirmar', ()=>{this.goToSurgeryPage()});

        const buttonsArr = [button1, button2];
        const list = new HorizontalList(buttonsArr);


        const cameraFrame = new CameraFrame(list);
        pageContent.appendChild(cameraFrame.draw());

    }

    goToModeConfigurationPage(){
        const page = new ModeConfigurationPage();
        page.draw();
    }
    goToSurgeryPage() {
        const page = new SurgeryPage();
        page.draw();
    }
}

export default ContinuousModePage;