import * as playpass from "playpass";
import {asyncHandler, showScreen} from "../../boilerplate/screens";
import state from "../../state";

import {choices} from "../../../content/autocomplete.json";

const STARTING_BLUR = 40;
const template = document.querySelector("#game-screen");
template.addEventListener(
    "active",
    asyncHandler(async () => {
        // Take new users to help screen first
        const sawTutorial = await playpass.storage.get("sawTutorial");
        if (!sawTutorial) {
            playpass.storage.set("sawTutorial", true);
            showScreen("#help-screen");
        }

        const pixelImage = template.querySelector(`#game-image`);
        pixelImage.setAttribute("src", new URL(`../../../content/images/${state.getCurrentAnswerImageFile()}`, import.meta.url).href);

        const guessInput = template.querySelector("auto-complete");
        guessInput.choices = choices;

        template.querySelector("form").onsubmit = event => {
            event.preventDefault();

            const guess = guessInput.value?.trim();

            // ignore empty forms
            if (!guess) {
                return;
            }

            state.submit(guess);

            if (state.isDone()) {
                showScreen("#results-screen");
            } else {
                guessInput.value = "";
                updatePlayingScreen();
            }
        };

        if (state.isDone()) {
            // The player has already played today, show results
            showScreen("#results-screen");
            return;
        }

        updatePlayingScreen();
    }),
);

function updatePlayingScreen() {
    template.querySelector(`#guesses`).innerHTML = "";

    const remaining = state.attempts - state.store.guesses.length;

    const image = template.querySelector(`#game-image`);
    image.setAttribute("blur", STARTING_BLUR - (7 * state.store.guesses.length));

    template.querySelector("#guessesRemaining").textContent = remaining + " guesses remaining";
}
