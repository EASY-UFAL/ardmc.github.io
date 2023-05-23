import Button from "../components/button.js";
import HorizontalList from "../components/horizontal_list.js";
import CameraFrame from "../components/camera_frame.js";
import OtherPage from "./other_page.js";
import PropertyBar from "../components/property_bar.js";

class PowerConfigPage {
    constructor(min,max,value,step) {
        this.min = min
        this.max = max
        this.value = value
        this.step = step
        
    }

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
        
        const propertyvalue = document.createElement('div');
        propertyvalue.className = 'property-value'
        propertyvalue.innerHTML = this.value
        pageContent.appendChild(propertyvalue)

        const propertybar = new PropertyBar('b1',this.value,()=>{alert("teste!")})
        
        

        // const buttonsArr = [propertybar];
        // const list = new HorizontalList(buttonsArr);


        const cameraFrame = new CameraFrame(propertybar);
        pageContent.appendChild(cameraFrame.draw());

    }

    goToOtherPage() {
        const page = new OtherPage();
        page.draw();
    }
}

export default PowerConfigPage;