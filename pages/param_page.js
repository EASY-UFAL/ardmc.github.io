import CameraFrame from "../components/camera_frame.js";
import PropertyBar from "../components/property_bar.js";
import PropertyButton from "../components/property_button.js";

class ParamPage {
    constructor(title,min,max,value,step,unit,onAccept,onCancel) {
        this.title = title
        this.min = min
        this.max = max
        this.value = value
        this.step = step
        this.unit = unit
        this.onAccept = onAccept;
        this.onCancel = onCancel;
        
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
        
        const propertyvalue = document.createElement('div');
        propertyvalue.className = 'property-value'
        propertyvalue.innerHTML = this.value+' '+this.unit
        pageContent.appendChild(propertyvalue)
        const accbutton = document.createElement('button')
        accbutton.innerHTML = 'aceitar'
        accbutton.addEventListener('click',this.onAccept)
        pageContent.appendChild(accbutton)
        const cancbutton =document.createElement('button')
        cancbutton.addEventListener('click',this.onCancel)
        cancbutton.innerHTML = 'cancelar'
        pageContent.appendChild(cancbutton)

        const propertybar = new PropertyBar('b1',this.value,()=>{alert("teste!")})
        


        const cameraFrame = new CameraFrame(propertybar);
        pageContent.appendChild(cameraFrame.draw());

    }
    changeParam(id,title,min,max,step,unit,func){
        return new PropertyButton(id,title,min,max,step,this.value+1,unit,func);
        // return new PropertyButton(id,title,min,max,step,this.value,unit,func);
    }
}

export default ParamPage;