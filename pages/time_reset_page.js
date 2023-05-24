import Button from "../components/button.js";
import HorizontalList from "../components/horizontal_list.js";
import CameraFrame from "../components/camera_frame.js";
import MainPage from "./main_page.js";
import SurgeryPage from "./surgery_page.js";

class ResetTimerPage {
    constructor() {}

    draw(){
        const pageContent = document.getElementById('page-content');
        pageContent.innerHTML = "";

        const header = document.createElement('div');
        header.className = 'header';
        const pageTitle = document.createElement('div');
        pageTitle.className = 'text-menu';
        pageTitle.innerHTML = 'Deseja zerar os contadores de tempo e de energia?';
        header.appendChild(pageTitle);

        pageContent.appendChild(header);

        const button1 = new Button('b1', 'Sim', ()=>{this.goToSurgeryPage()});
        const button2 = new Button('b2', 'Não', ()=>{this.goToSurgeryPage()});
        
        const buttonsArr = [button1, button2];
        const list = new HorizontalList(buttonsArr);


        const cameraFrame = new CameraFrame(list);
        pageContent.appendChild(cameraFrame.draw());

    }

    goToMainPage() {
        const page = new MainPage();
        page.draw();
    }
    goToSurgeryPage() {
        const page = new SurgeryPage();
        page.draw();
    }
}

export default ResetTimerPage;