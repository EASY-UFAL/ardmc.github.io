import HorizontalList from "../components/horizontal_list.js";
import CameraFrame from "../components/camera_frame.js";

class FlixPage {
    constructor(title,identifier,buttonList=[]) {
        this.title = title
        this.identifier = identifier;
        this.buttonList = buttonList;
    }

    draw(){
        const pageContent = document.getElementById('page-content');
        pageContent.innerHTML = "";

        const header = document.createElement('div');
        header.className = 'header';
        const pageTitle = document.createElement('div');
        pageTitle.className = 'text-menu';
        pageTitle.innerHTML = this.title;
        header.appendChild(pageTitle);

        pageContent.appendChild(header);
        const list = new HorizontalList(this.buttonList);
        const cameraFrame = new CameraFrame(list);
        pageContent.appendChild(cameraFrame.draw());

    }

}

export default FlixPage;