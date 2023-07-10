import Button from "../components/button.js";
import PropertyButton from "../components/property_button.js";
import ModeButton from "../components/mode_button.js";
import FlixPage from "./flix_page.js";
import pageList from "../page_list.json" assert { type: "json" };
import LaserPage from "./laser_page.js";
import ParamPage from "./param_page.js";


class PageBuilder{
    constructor() {
        this.createdPages = [];
        this.currentLaserPage = null;
        this.lastPage = null;

    }
    build(pageString){
        if(!this.createdPages.some((element)=> element.identifier===pageString,pageString)){
            if(pageString.includes("surgeryPage")){
                this.surgeryBuild(pageString);
                return ;
            }
            else if(pageString.startsWith("pulsed")){
                this.pulsedModeBuild(pageString)
                return;
            }
            else if(pageString.startsWith("singlePulse")){
                this.singlePulseBuild(pageString)
            }
            else{
                var targetPageJSON = pageList[pageString];
                // console.log(targetPageJSON);
                const buttonArray = [];
                let buttonCount= 1;
                Object.keys(targetPageJSON.buttons).forEach(button=>{
                    //console.log(targetPageJSON.buttons[button]);
                    if(targetPageJSON.buttons[button].type === "Button"){
                        buttonArray.push(new Button(`b${buttonCount}`,targetPageJSON.buttons[button].title,()=>{this.build(targetPageJSON.buttons[button].redirect)}));
                }
                    buttonCount++;
            });
            const page = new FlixPage(targetPageJSON.title,pageString,buttonArray);
            
            this.createdPages.push(page);
            page.draw();
            return;
        }
        }
        else{
            let nextPage = this.createdPages.find(pageString)
            nextPage.draw();
            return;
        }
    }

    surgeryBuild(pageString){
        const splitted = pageString.split('.')
        let surgeryPage = splitted[0];
        let surgeryType = splitted[1];
        let targetPageJSON = pageList[surgeryPage][surgeryType];
        let buttonArray = [];
        let buttonCount= 1;
        Object.keys(targetPageJSON.buttons).forEach(button=>{
            // console.log(targetPageJSON.buttons[button]);
        if(targetPageJSON.buttons[button].type === "Button"){
            if(targetPageJSON.buttons[button].redirect === "toggleButton"){
                buttonArray.push(new Button(`b${buttonCount}`,targetPageJSON.buttons[button].title,()=>{this.toggle("Em espera","Disponível")}));
            }
            else{
                buttonArray.push(new Button(`b${buttonCount}`,targetPageJSON.buttons[button].title,()=>{this.build(targetPageJSON.buttons[button].redirect)}));
            }
        }
        else if(targetPageJSON.buttons[button].type === "PropertyButton"){
            if(targetPageJSON.buttons[button].redirect ==="resetTimer"){
                buttonArray.push(new PropertyButton(`b${buttonCount}`,targetPageJSON.buttons[button].title,targetPageJSON.buttons[button].min,targetPageJSON.buttons[button].max,targetPageJSON.buttons[button].step,targetPageJSON.buttons[button].currentValue,targetPageJSON.buttons[button].unit,()=>{this.build(targetPageJSON.buttons[button].redirect)}));
            }
            else if(targetPageJSON.buttons[button].redirect === "changeParam"){
                buttonArray.push(new PropertyButton(`b${buttonCount}`,targetPageJSON.buttons[button].title,targetPageJSON.buttons[button].min,targetPageJSON.buttons[button].max,targetPageJSON.buttons[button].step,targetPageJSON.buttons[button].currentValue,targetPageJSON.buttons[button].unit,()=>{this.changeParam(targetPageJSON.buttons[button])}));

            }
        }
        else if(targetPageJSON.buttons[button].type === "ModeButton"){
            let selectedMode = targetPageJSON.buttons[button].selectedMode;
            let availableModes = this.getModes(targetPageJSON.buttons[button].modes);
            let currentModeParams = this.getModeParams(selectedMode);
            buttonArray.push(new ModeButton(`b${buttonCount}`,selectedMode,availableModes,currentModeParams,()=>{this.changeMode()}));
        }
        buttonCount++;
    });
    
    const laserPage = new LaserPage(surgeryPage,surgeryType,targetPageJSON.title,pageString,buttonArray)

    this.currentLaserPage = laserPage;
    this.createdPages.push(laserPage);
    laserPage.draw();
    }


    getModes(modesJSON){
        let availableModes = [];
        Object.values(modesJSON).forEach(mode=>{
            console.log
            availableModes.push(mode);
        });
        return availableModes;
    }
    getModeParams(selectedMode){
        
        if (selectedMode==="continuous"){

            let optionsJSON = pageList["continuous"];
            let optButtonCount=1;
            let optionsButtonArray =[];
            Object.keys(optionsJSON.buttons).forEach(button=>{
                if(optionsJSON.buttons[button].redirect==="modeConfirm"){
                    optionsButtonArray.push(new Button(`b${optButtonCount}`,optionsJSON.buttons[button].title,()=>{this.modeConfirm(selectedMode)}));
                }
                else{
                    optionsButtonArray.push(new Button(`b${optButtonCount}`,optionsJSON.buttons[button].title,()=>{this.modeCancel()}));
                }
                optButtonCount++;
            });
            return optionsButtonArray;
        }
        else{
            const splittedOpt = selectedMode.split('.')
            let pulseType = splittedOpt[0];
            let laserType = splittedOpt[1];
            let optionsJSON = pageList[pulseType][laserType];
            let optButtonCount=1
            let optionsButtonArray =[]
            Object.keys(optionsJSON.buttons).forEach(button=>{
                if(optionsJSON.buttons[button].type === "Button"){
                    if(optionsJSON.buttons[button].redirect==="modeConfirm"){
                        optionsButtonArray.push(new Button(`b${optButtonCount}`,optionsJSON.buttons[button].title,()=>{this.modeConfirm(selectedMode)}));
                    }
                    else{
                        optionsButtonArray.push(new Button(`b${optButtonCount}`,optionsJSON.buttons[button].title,()=>{this.modeCancel()}));
                    }
                }
                else{
                    optionsButtonArray.push(new PropertyButton(`b${optButtonCount}`,optionsJSON.buttons[button].title,optionsJSON.buttons[button].min,optionsJSON.buttons[button].max,optionsJSON.buttons[button].step,optionsJSON.buttons[button].currentValue,optionsJSON.buttons[button].unit,()=>{this.changeParam(optionsJSON.buttons[button])}));
                }
                optButtonCount++
            });
            return optionsButtonArray;
        }
        
    }


    redirect(pageString){
        if(!this.createdPages.some(pageString)){
            this.build(pageString);
        }
        

    }
    toggle(a,b){
        var button = document.getElementById("0")
        if (button.text === a){
            button.text = b
        }
        else{
            button.text = a
        }
        button.innerHTML = button.text
    }

    changeParam(pageData){
        this.lastPage= this.createdPages[this.createdPages.length-1];
        this.createParamPage(pageData);

    }
    createParamPage(pageData){
        this.currentParamPage = new ParamPage(pageData.title,pageData.min,pageData.max,pageData.step,pageData.currentValue,pageData.unit,()=>{this.acceptChanges(pageData.title)},()=>{this.discardChanges()})
        this.currentParamPage.draw();

    }

    acceptChanges(desiredParam){    
        console.log(this.lastPage.buttonList) 
        const desiredIndex = this.lastPage.buttonList.findIndex((button)=>button.text===desiredParam);
        var propertyValue = document.getElementsByClassName("property-value")[0].innerHTML;
        propertyValue = propertyValue.replace(/[^0-9\.]+/g, "");
        console.log(propertyValue);
 
        console.log(desiredIndex);
        let button = this.lastPage.buttonList[desiredIndex]
        // this.lastPage.buttonList[desiredIndex]=this.currentParamPage.changeParam(button.id,button.text,button.min,button.max,button.step,button.unit,button.onClick);
        this.lastPage.buttonList[desiredIndex]=new PropertyButton(button.id,button.text,button.min,button.max,button.step,propertyValue,button.unit,button.onClick);
        
        if(this.lastPage instanceof LaserPage){
            console.log("pagina de cirurgia");
            this.currentLaserPage=this.lastPage;
        }
        this.lastPage.draw();
    }
    //gesto de cancelamento
    discardChanges(){
        this.lastPage.draw();
    }
    changeMode(){
        const opts = this.currentLaserPage.buttonList[2].modes;
        console.log(opts)
        let buttonList = []
        let buttonCount=1
        opts.forEach(mode=>{
            console.log(mode);
            if(mode==="continuous"){
                buttonList.push(new Button(`b${buttonCount}`,"Contínuo",()=>{this.chooseMode(mode)}));
            }
            else if(String(mode).startsWith("pulsed")){
                buttonList.push(new Button(`b${buttonCount}`,"Pulsado",()=>{this.chooseMode(mode)}));
            }
            else if(String(mode).startsWith("single")){
                buttonList.push(new Button(`b${buttonCount}`,"Pulso único",()=>{this.chooseMode(mode)}));
            }
            buttonCount++;
        });
        buttonList.push(new Button(`b${buttonCount}`,"Voltar",()=>{this.currentLaserPage.draw()}));

        const modePage = new FlixPage("Modo","modeConfigPage",buttonList);
        // this.lastPage=modePage;
        
        this.createdPages.push(modePage);

        modePage.draw();
    }
    chooseMode(mode){
        this.lastPage= this.createdPages[this.createdPages.length-1];
        let buttonList = this.getModeParams(mode);
        if(mode==="continuous"){
            var modePage = new FlixPage("Modo Contínuo",mode,buttonList);
        }
        else if(String(mode).startsWith("pulsed")){
            var modePage = new FlixPage("Modo Pulsado",mode,buttonList);
        }
        else if(String(mode).startsWith("single")){
            var modePage = new FlixPage("Modo Pulso único",mode,buttonList);
        }
        
        this.createdPages.push(modePage);
        modePage.draw();
    }
    modeConfirm(selectedMode){
        console.log(this.currentLaserPage.buttonList[2]);
        this.currentLaserPage.buttonList[2].selectedMode = selectedMode;
        this.currentLaserPage.buttonList[2].options = this.lastPage.buttonList;
        this.currentLaserPage.draw();

    }
    modeCancel(){
        this.changeMode();
    }
}

export default PageBuilder;