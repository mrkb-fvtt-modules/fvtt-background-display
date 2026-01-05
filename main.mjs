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
        default: "image",
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
        backgroundImage.src = Display.getImage();

        const foregroundImage = document.createElement("img");
        foregroundImage.id = "display-image-foreground";
        foregroundImage.className = "display-image";
        foregroundImage.src = Display.getImage();

        const display = document.createElement("div");
        display.id = "mrkb-display";
        display.className = `${Display.getMode()} ${Display.getSize()}`;
        display.append(backgroundImage, foregroundImage);

        document.querySelector("canvas#board").after (display);
    }
    static getControlButtons(sceneControls) {
        const tools = {
            visible: {
                name: "visible",
                title: "MRKB.VisibleDisplay",
                icon: "fa-solid fa-eye",
                active: Display.getMode() === "image",
                onChange: () => Display.setMode("image")
            },
            invisible: {
                name: "invisible",
                title: "MRKB.InvisibleDisplay",
                icon: "fa-solid fa-eye-slash",
                active: Display.getMode() === "off",
                onChange: () => Display.setMode("off")
            },
            background: {
                name: "background",
                title: "MRKB.BackgroundDisplay",
                icon: "fa-solid fa-image-portrait",
                active: Display.getMode() === "background",
                onChange: () => Display.setMode("background")
            },
            browser: {
                name: "browser",
                title: "MRKB.ImageBrowser",
                icon: "fa-solid fa-folder",
                button: true,
                onChange: () => Display.openImageBrowser()
            },
            remove: {
                name: "remove",
                title: "MRKB.RemoveImage",
                icon: "fa-solid fa-trash",
                button: true,
                onChange: () => Display.setImage("")
            }
        }
        Hooks.call("getDisplayControlButtons", tools);
        const activeTool = Display.getMode() === "image" ? "visible" : Display.getMode() === "off" ? "invisible" : "background";
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
    static openImageBrowser() {
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
        const display = document.querySelector("#mrkb-display");
        display.className = `${mode} ${Display.getSize()}`;
    }
    static getImage() {
        return game.settings.get("mrkb-background-display", "image");
    }
    static setImage(src) {
        game.settings.set("mrkb-background-display", "image", src);
    }
    static remoteImage(src) {
        const target = document.querySelectorAll(`.display-image`);
        target.forEach((t) => {t.src = src});
    }
    static getSize() {
        return game.settings.get("mrkb-background-display", "size");
    }
    static setSize(size) {
        game.settings.set("mrkb-background-display", "size", size);
    }
    static remoteSize(size) {
        const display = document.querySelector("#mrkb-display");
        display.className = `${Display.getMode()} ${size}`;
    }
}


class ImageBrowser extends FilePicker {
    constructor(options = {
        id: "file-picker",
        type: "image",
        popOut: true,
        activeSource: "data",
        galleryMode: "thumbs",
        callback: (path) => Display.setImage(path)
    }) {
        super(options);
        this.targetId = options.id;
    }
}