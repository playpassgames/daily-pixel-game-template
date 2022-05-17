import "./pixelated-img-element.css";
import * as StackBlur from "stackblur-canvas";
import getPixels from "image-pixels";

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
                } else if (change.attributeName.includes("blur")) {
                    const originSrc = pixelatedElement.getAttribute("src");
                    getPixels(originSrc, function(err, pixels) {
                        if (err) {
                            return;
                        }
                        let blurFactor = Number(pixelatedElement.getAttribute("blur"));
                        if (blurFactor > 0) {
                            StackBlur.imageDataRGBA(pixels, 0, 0, pixels.width, pixels.height, blurFactor);
                        }

                        const canvas = document.createElement('canvas');
                        canvas.width = pixels.width;
                        canvas.height = pixels.height;
                        const context = canvas.getContext('2d');

                        context.putImageData(pixels, 0, 0);
                        image.src = canvas.toDataURL();
                    });  
                }
            });
        });

        observer.observe(this, {attributes : true});
    }
}

export const pixelatedImageTagName = "pixelated-img";

window.customElements.define(pixelatedImageTagName, PixelatedImage);