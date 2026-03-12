Hooks.once("init", () => {
    game.settings.register("mrkb-background-display", "mode", {
        name: "Display Mode",
        hint: "Set the display mode for the background display widget.",
        scope: "world",
        config: false,
        type: String,
        choices: {
            "off": "Off",
            "image": "Image",
            "background": "Background"
        },
        default: "off",
        onChange: (value) => Display.remoteMode(value)
    });
    game.settings.register("mrkb-background-display", "image", {
        name: "Display Image",
        hint: "Set the image URL to be displayed on the display widget.",
        scope: "world",
        config: false,
        type: String,
        default: "",
        onChange: (value) => Display.remoteImage(value)
    });
    game.settings.register("mrkb-background-display", "size", {
        name: "MRKB.DisplaySize",
        hint: "MRKB.DisplaySizeHint",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "contain": "MRKB.DisplaySizeContain",
            "cover": "MRKB.DisplaySizeCover",
            "multi": "MRKB.DisplaySizeMulti"
        },
        icon: "fa-solid fa-arrows-alt",
        default: "multi",
        onChange: (value) => Display.remoteSize(value)
    });
    game.settings.register("mrkb-background-display", "position", {
        name: "MRKB.DisplayPosition",
        hint: "MRKB.DisplayPositionHint",
        scope: "world",
        config: true,
        type: String,
        choices: {
            top: "MRKB.DisplayPositionTop",
            center: "MRKB.DisplayPositionCenter",
            bottom: "MRKB.DisplayPositionBottom"
        },
        default: "center",
        onChange: (value) => Display.remotePosition(value)
    });
    game.settings.register("mrkb-background-display", "opacity", {
        name: "MRKB.DisplayOpacity",
        hint: "MRKB.DisplayOpacityHint",
        scope: "world",
        config: true,
        type: Number,
        default: 0.2,
        range: {
            min: 0,
            step: 0.01,
            max: 1
        },
        onChange: (value) => Display.remoteOpacity(value)
    });
});
Hooks.once("ready", () => {
    Display._create();
});
Hooks.on("getSceneControlButtons", (sceneControls) => {
    if (!game.user.isGM) return;
    Display.getControlButtons(sceneControls);
});

class Display {
    static _create() {
        const backgroundImage = document.createElement("img");
        backgroundImage.id = "display-image-background";
        backgroundImage.className = "display-image";
        backgroundImage.src = this.getImage();

        const foregroundImage = document.createElement("img");
        foregroundImage.id = "display-image-foreground";
        foregroundImage.className = "display-image";
        foregroundImage.src = this.getImage();

        const display = document.createElement("div");
        display.id = "mrkb-display";
        this.#setDisplayStyle({ display });
        display.append(backgroundImage, foregroundImage);

        document.querySelector("canvas#board").after(display);

        const module = game.modules.get("mrkb-background-display");
        module.API = this.#getApi();
    }
    static getControlButtons(sceneControls) {
        const tools = {
            visible: {
                name: "visible",
                title: "MRKB.VisibleDisplay",
                icon: "fa-solid fa-eye",
                order: 1,
                active: this.getMode() === "image",
                onChange: () => this.setMode("image")
            },
            invisible: {
                name: "invisible",
                title: "MRKB.InvisibleDisplay",
                icon: "fa-solid fa-eye-slash",
                order: 2,
                active: this.getMode() === "off",
                onChange: () => this.setMode("off")
            },
            background: {
                name: "background",
                title: "MRKB.BackgroundDisplay",
                icon: "fa-solid fa-image-portrait",
                order: 3,
                active: this.getMode() === "background",
                onChange: () => this.setMode("background")
            },
            browser: {
                name: "browser",
                title: "MRKB.ImageBrowser",
                icon: "fa-solid fa-folder",
                order: 98,
                button: true,
                onChange: () => this.#openImageBrowser()
            },
            remove: {
                name: "remove",
                title: "MRKB.RemoveImage",
                icon: "fa-solid fa-trash",
                order: 99,
                button: true,
                onChange: () => this.setImage("")
            }
        };
        Hooks.call("getDisplayControlButtons", tools);
        const activeTool =
            this.getMode() === "image"
                ? "visible"
                : this.getMode() === "off"
                  ? "invisible"
                  : "background";
        sceneControls.display = {
            name: "display",
            title: "MRKB.Display",
            icon: "fa-solid fa-image",
            layer: "display",
            tools: tools,
            activeTool: activeTool,
            onChange: (event, active) => {}
        };
    }
    static #openImageBrowser() {
        const filePicker = new ImageBrowser();
        filePicker.render();
    }
    static getMode() {
        return game.settings.get("mrkb-background-display", "mode");
    }
    static setMode(mode) {
        game.settings.set("mrkb-background-display", "mode", mode);
    }
    static remoteMode(mode) {
        this.#setDisplayStyle({ mode });
    }
    static getImage() {
        return game.settings.get("mrkb-background-display", "image");
    }
    static setImage(src) {
        game.settings.set("mrkb-background-display", "image", src);
    }
    static remoteImage(src) {
        const target = document.querySelectorAll(`.display-image`);
        target.forEach((t) => {
            t.src = src;
        });
    }
    static getSize() {
        return game.settings.get("mrkb-background-display", "size");
    }
    static setSize(size) {
        game.settings.set("mrkb-background-display", "size", size);
    }
    static remoteSize(size) {
        this.#setDisplayStyle({ size });
    }
    static getPosition() {
        return game.settings.get("mrkb-background-display", "position");
    }
    static setPosition(position) {
        game.settings.set("mrkb-background-display", "position", position);
    }
    static remotePosition(position) {
        this.#setDisplayStyle({ position });
    }
    static getOpacity() {
        return game.settings.get("mrkb-background-display", "opacity");
    }
    static setOpacity(opacity) {
        game.settings.set("mrkb-background-display", "opacity", opacity);
    }
    static remoteOpacity(opacity) {
        this.#setDisplayStyle({ opacity });
    }
    static #setDisplayStyle({ display, mode, size, position, opacity } = {}) {
        display ??= document.querySelector("#mrkb-display");
        mode ??= this.getMode();
        size ??= this.getSize();
        position ??= this.getPosition();
        opacity ??= this.getOpacity();

        display.className = `${mode} ${size} ${position}`;
        display.style.setProperty("--image-opacity", opacity);
    }

    static #getApi() {
        return {
            getMode: this.getMode,
            setMode: this.setMode,
            getImage: this.getImage,
            setImage: this.setImage,
            getSize: this.getSize,
            setSize: this.setSize,
            getPosition: this.getPosition,
            setPosition: this.setPosition,
            getOpacity: this.getOpacity,
            setOpacity: this.setOpacity
        };
    }
}

class ImageBrowser extends foundry.applications.apps.FilePicker.implementation {
    constructor(
        options = {
            id: "file-picker",
            type: "image",
            popOut: true,
            activeSource: "data",
            galleryMode: "thumbs",
            callback: (path) => Display.setImage(path)
        }
    ) {
        super(options);
        this.targetId = options.id;
    }
}
