class HorizontalList {
    constructor(children) {
        this.children = [];
        this.childrenObj = [];
        children.forEach((item, i) => {
            item.id = i;
            this.children.push(item.draw());
            this.childrenObj.push(item)
        });
        this.maxSlide = this.children.length - 1;
        this.currentSlide = 0;
    }

    draw(){
        const list = document.createElement('div');
        list.className = 'slider';

        this.children.forEach(item => {
            list.appendChild(item);
        });

        this.children.forEach((slide, indx) => {
            slide.style.transform = `translateX(${(indx+1) * 100}%)`;
        });

        return list;
    }

    slideTo(button){
        this.currentSlide = parseInt(button.id);
        this.children.forEach((slide, indx) => {
            slide.style.transform = `translateX(${100 * ((indx+1) - this.currentSlide)}%)`;
        });
    }

    clearButtons() {
        this.childrenObj.forEach((button) => {
            button.unselect();
        })
    }
}

export default HorizontalList;
