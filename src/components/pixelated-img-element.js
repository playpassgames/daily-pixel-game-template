import "./pixelated-img-element.css";

const template = `
    <img name="answerImage" />
`;

export class PixelatedImage extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = template;

        const image = this.querySelector("img[name=answerImage]");
        let pixelatedElement = this;

        let observer = new MutationObserver(function(changes) {
            changes.forEach(change => {
                if (change.attributeName.includes("src")) {
                    image.src = pixelatedElement.getAttribute("src");
                }
            });
        });

        observer.observe(this, {attributes : true});
    }
}

export const pixelatedImageTagName = "pixelated-img";

window.customElements.define(pixelatedImageTagName, PixelatedImage);