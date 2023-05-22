import Button from "../components/button.js";
import HorizontalList from "../components/horizontal_list.js";
import CameraFrame from "../components/camera_frame.js";
import OtherPage from "./other_page.js";

class PowerConfigPage {
    constructor() {}

    draw(){
        const pageContent = document.getElementById('page-content');
        pageContent.innerHTML = "";

        const header = document.createElement('div');
        header.className = 'header';
        const pageTitle = document.createElement('div');
        pageTitle.className = 'text-menu';
        pageTitle.innerHTML = 'Potência';
        header.appendChild(pageTitle);

        pageContent.appendChild(header);
        
        

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

export default PowerConfigPage;