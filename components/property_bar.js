class PropertyBar {
    constructor(id, value, onClick) {
        this.id = id;
        this.value = value;
        this.onClick = onClick;
    }

    draw(){
        // const div = document.createElement('div');
        // div.className = 'property-bar';
        // this.propertyvalue = document.createElement('div');
        // this.propertyvalue.className = 'property-value-progress';
        // this.propertyvalue.setAttribute('role', 'property-bar');
        // this.propertyvalue.id = this.id;
        // this.propertyvalue.style.width = '5%'
        // this.propertyvalue.addEventListener('click', this.onClick);
        // div.appendChild(this.propertyvalue);

        // return div;

        const progressContainer = document.createElement('div');

        const progressBar = document.createElement("progress");
        progressBar.setAttribute("id", "dynamicProgressBar");
        progressBar.setAttribute("value", "0");
        progressBar.setAttribute("max", "100");

        progressBar.style.width = "100%";
        progressBar.style.height = "30px";
        progressBar.style.backgroundColor = "#4CAF50";

        progressContainer.appendChild(progressBar);

        this.startProgress(progressBar);

        return progressContainer;
    }

    startProgress(progressBar) {
        var value = 0;
        var interval = setInterval(function() {
            if (value >= 100) {
                clearInterval(interval);
            } else {
                value += 1;
                progressBar.value = value; // AQUI QUE DEFINE O VALOR DA BARRA
            }
        }, 100);
    }

    clearButtons(){

    }

    // select() {
    //     this.button.style.borderColor = 'red';
    // }

    // unselect() {
    //     this.button.style.borderColor = 'gray';
    // }
}

export default PropertyBar;