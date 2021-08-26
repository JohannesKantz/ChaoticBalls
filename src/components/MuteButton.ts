import globals from "../globals";

import mute from "../img/mute.svg";
import sound from "../img/sound.svg";

import styles from "../styles/mute-button.module.scss";

export function createMuteButton(parent: HTMLElement): void {
    const div: HTMLDivElement = document.createElement("div");
    parent.appendChild(div);
    div.classList.add(styles["sound-options"]);
    const button: HTMLButtonElement = document.createElement("button");
    div.appendChild(button);
    button.classList.add(styles["mute-button"]);

    const update = () => {
        button.innerHTML = `<img src=${
            globals.soundEnabled ? sound : mute
        } alt="mute"></img>`;
    };
    update();

    button.addEventListener("click", () => {
        globals.soundEnabled = !globals.soundEnabled;
        update();
    });
}
