import Button from "../components/button.js";
import HorizontalList from "../components/horizontal_list.js";
import CameraFrame from "../gesture_recognition/camera_frame.js";
import OtherPage from "./other_page.js";
import PropertyBar from "../components/property_bar.js";

class FrequencyConfigPage {
  constructor(id, min, max, value, step, unit) {
    this.id = id;
    this.min = min;
    this.max = max;
    this.value = value;
    this.step = step;
    this.unit = unit;
  }

  draw() {
    const pageContent = document.getElementById("page-content");
    pageContent.innerHTML = "";
    pageContent.className = "digital-page";

    const header = document.createElement("div");
    header.className = "header";
    const pageTitle = document.createElement("div");
    pageTitle.className = "text-menu";
    pageTitle.innerHTML = "Frequência";
    header.appendChild(pageTitle);
    pageContent.appendChild(header);

    const propertyvalue = document.createElement("div");
    propertyvalue.id = this.id;
    propertyvalue.value = this.value;
    propertyvalue.className = "property-value";
    propertyvalue.innerHTML = this.value + " " + this.unit;
    pageContent.appendChild(propertyvalue);

    const propertybar = new PropertyBar(
      "b1",
      this.value,
      () => {
        alert("teste!");
      },
      this.min,
      this.max,
      this.step
    );

    const cameraFrame = new CameraFrame(
      propertybar,
      this.id,
      this.min,
      this.max,
      this.value,
      this.step,
      this.unit
    );
    pageContent.appendChild(cameraFrame.draw());
  }

  goToOtherPage() {
    const page = new OtherPage();
    page.draw();
  }
}

export default FrequencyConfigPage;
