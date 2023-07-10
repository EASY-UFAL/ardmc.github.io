class ModeButton {
    constructor(id, selectedMode,modes=[],options=[], onClick) {
        this.id = id;
        this.selectedMode = selectedMode;
        this.modes = modes
        this.options = options;
        this.onClick = onClick;
    }

    draw(){
        const div = document.createElement('div');
        div.className = 'slide';
        this.button = document.createElement('button');
        this.button.className = 'button-action';
        this.button.setAttribute('role', 'button');
        this.button.id = this.id;
        if(String(this.selectedMode).startsWith("pulsed")){
            this.button.innerHTML = 'Modo:Pulsado<br/>'+this.options[2].value+' '+'Hz';
        }
        else if(String(this.selectedMode).startsWith("single")){
            this.button.innerHTML = 'Modo:Pulso único<br/>'+this.options[0].value+' '+'ms';
        }
        else{
            this.button.innerHTML = 'Modo:<br/>Contínuo';
        }
        this.button.addEventListener('click', this.onClick);
        div.appendChild(this.button);

        return div;
    }

    select() {
        this.button.style.borderColor = 'red';
    }

    unselect() {
        this.button.style.borderColor = 'gray';
    }
    
}

export default ModeButton;