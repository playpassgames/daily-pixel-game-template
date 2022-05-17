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

                        // create canvas according to pixel data
                        const canvas = document.createElement('canvas');
                        canvas.width = pixels.width;
                        canvas.height = pixels.height;
                        const context = canvas.getContext('2d');

                        // create copy of pixels to keep source pixels intact
                        var blurredImageData = context.createImageData(pixels.width, pixels.height);
                        blurredImageData.data.set(pixels.data.slice());

                        // blur the pixels copy
                        let blurFactor = Number(pixelatedElement.getAttribute("blur"));
                        if (blurFactor > 0) {
                            StackBlur.imageDataRGBA(blurredImageData, 0, 0, blurredImageData.width, blurredImageData.height, blurFactor);
                        }

                        context.putImageData(blurredImageData, 0, 0);
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