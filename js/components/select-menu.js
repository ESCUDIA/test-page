export default class selectMenu extends HTMLElement {
    constructor(buttons) {
        super();

        if (buttons) {
            this.buttons = buttons;
        } else {
            this.buttons = [];
        }

        const template = document.querySelector("template#select-menu").content;
        const instance = template.cloneNode(true);


        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(instance);

        this.$buttonTemplate = this.shadowRoot.querySelector("template#select-menu_button").content;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        for (let btn of this.buttons) {
            let b = this.newButton(btn);
        }
    }

    newButton(button) {
        let instance = this.$buttonTemplate.cloneNode(true);
        let icon = instance.querySelector("i.fas");
        let span = instance.querySelector("span");
        let btn = instance.querySelector("button")

        icon.classList.add(button.icon);
        span.innerText = button.text;

        btn.addEventListener("click", (e) => {
            console.log(button.event)
            this.dispatchEvent(new Event(button.event));
        });

        this.shadowRoot.appendChild(instance);

        return btn;
    }
}

fetch("/test-page/html/components/select-menu.html").then((res) => {
    return res.text();
}).then((temp) => {
    document.body.insertAdjacentHTML('beforeend', temp);
    customElements.define("select-menu", selectMenu);
});