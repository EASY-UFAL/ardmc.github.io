class PropertyButton {
    constructor(id, text, min, max, value, unit, onClick) {
        this.id = id;
        this.text = text;
        this.min = min
        this.max = max
        this.value = value
        this.unit = unit
        this.onClick = onClick;
    }

    draw(){
        const div = document.createElement('div');
        div.className = 'slide';
        this.button = document.createElement('button');
        this.button.className = 'button-action';
        this.button.setAttribute('role', 'button');
        this.button.id = this.id;
        this.button.innerHTML = this.text+':<br/>'+this.value+' '+this.unit;
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

export default PropertyButton;