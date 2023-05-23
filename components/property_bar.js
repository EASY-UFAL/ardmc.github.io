class PropertyBar {
    constructor(id, value, onClick) {
        this.id = id;
        this.value = value;
        this.onClick = onClick;
    }

    draw(){
        const div = document.createElement('div');
        div.className = 'property-bar';
        this.propertyvalue = document.createElement('div');
        this.propertyvalue.className = 'property-value-progress';
        this.propertyvalue.setAttribute('role', 'property-bar');
        this.propertyvalue.id = this.id;
        this.propertyvalue.style.width = '5%'
        this.propertyvalue.addEventListener('click', this.onClick);
        div.appendChild(this.propertyvalue);

        return div;
    }

    // select() {
    //     this.button.style.borderColor = 'red';
    // }

    // unselect() {
    //     this.button.style.borderColor = 'gray';
    // }
}

export default PropertyBar;