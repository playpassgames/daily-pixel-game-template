import "./pixelated-img-element.css";

const template = `
    <img name="answerImage" />
`;

export class PixelatedImage extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = template;

        const image = this.querySelector("img[name=answerImage]");
        image.src = `../../content/images/0.jpg`;
    }
}

export const pixelatedImageTagName = "pixelated-img";

window.customElements.define(pixelatedImageTagName, PixelatedImage);