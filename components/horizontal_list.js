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
            slide.style.transform = `translateX(${(indx) * 100}%)`;
        });

        return list;
    }

    slideTo(button){
        this.currentSlide = parseInt(button.id);
        this.children.forEach((slide, indx) => {
            slide.style.transform = `translateX(${100 * ((indx) - this.currentSlide)}%)`;
        });
    }

    slideToIndex(i){
        this.currentSlide = i;
        if(this.currentSlide < 0)
            this.currentSlide = 0;
        if(this.currentSlide > this.maxSlide)
            this.currentSlide = this.maxSlide;
        this.children.forEach((slide, indx) => {
            slide.style.transform = `translateX(${100 * ((indx) - this.currentSlide)}%)`;
        });
    }

    nextSlide(){
        // check if current slide is the last and reset current slide
        if (this.currentSlide === this.maxSlide) {
            this.currentSlide = 0;
        } else {
            this.currentSlide++;
        }

        //   move slide by -100%
        this.children.forEach((slide, indx) => {
            slide.style.transform = `translateX(${100 * (indx - this.currentSlide)}%)`;
        });
    }

    previousSlide(){
        // check if current slide is the first and reset current slide to last
        if (this.currentSlide === 0) {
            this.currentSlide = this.maxSlide;
        } else {
            this.currentSlide--;
        }

        //   move slide by 100%
        this.children.forEach((slide, indx) => {
            slide.style.transform = `translateX(${100 * (indx - this.currentSlide)}%)`;
        });
    }

    clearButtons() {
        this.childrenObj.forEach((button) => {
            button.unselect();
        })
    }
}

export default HorizontalList;
