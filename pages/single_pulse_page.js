import Button from "../components/button.js";
import PropertyButton from "../components/property_button.js";
import HorizontalList from "../components/horizontal_list.js";
import CameraFrame from "../components/camera_frame.js";
import SurgeryPage from "./surgery_page.js";
import ModeConfigurationPage from "./mode_configuration_page.js";
import DurationConfigPage from "./duration_config_page.js";
class SinglePulsePage {
    constructor() {}

    draw(){
        const pageContent = document.getElementById('page-content');
        pageContent.innerHTML = "";

        const header = document.createElement('div');
        header.className = 'header';
        const pageTitle = document.createElement('div');
        pageTitle.className = 'text-menu';
        pageTitle.innerHTML = 'Pulso Único';
        header.appendChild(pageTitle);

        pageContent.appendChild(header);

        const button1 = new PropertyButton('b1', 'Duração', 25, 1000, 25, 'ms', ()=>{this.goToDurationConfigPage()});
        const button2 = new Button('b2', 'Cancelar', ()=>{this.goToModeConfigurationPage()});
        const button3 =  new Button('b3', 'Confirmar', ()=>{this.goToSurgeryPage()});

        const buttonsArr = [button1, button2, button3];
        const list = new HorizontalList(buttonsArr);


        const cameraFrame = new CameraFrame(list);
        pageContent.appendChild(cameraFrame.draw());

    }

    goToDurationConfigPage(){
        const page = new DurationConfigPage(25, 1000, 25, 25, 'ms');
        page.draw();
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

export default SinglePulsePage;