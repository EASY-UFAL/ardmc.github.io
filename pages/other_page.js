import Button from "../components/button.js";
import HorizontalList from "../components/horizontal_list.js";
import CameraFrame from "../components/camera_frame.js";
import MainPage from "./main_page.js";

class OtherPage {
    constructor() { }

    draw() {
        const pageContent = document.getElementById('page-content');
        pageContent.innerHTML = "";
        pageContent.className = "analogic-page";

        const header = document.createElement('div');
        header.className = 'header';
        const pageTitle = document.createElement('div');
        pageTitle.className = 'text-menu';
        pageTitle.innerHTML = 'Menu Secundário';
        header.appendChild(pageTitle);

        pageContent.appendChild(header);

        // const button1 = new Button('b1', 'Botão 1', () => { this.goToMainPage() });
        // const button2 = new Button('b2', 'Botão 2', () => { alert('Terapia') });

        // const buttonsArr = [button1, button2];
        const buttonsArr = [];
        const list = new HorizontalList(buttonsArr);


        const cameraFrame = new CameraFrame(list);
        pageContent.appendChild(cameraFrame.draw());

    }

    goToMainPage() {
        const page = new MainPage();
        page.draw();
    }
}

export default OtherPage;