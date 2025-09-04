export default class accountCard extends HTMLElement {
    constructor() {
        super();

        const template = document.querySelector("template#account-card").content;
        const instance = template.cloneNode(true);
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(instance);

        this.$accountHolder = this.shadowRoot.querySelector("#account-holder");
        this.$bank = this.shadowRoot.querySelector("#bank");
        this.$card = this.shadowRoot.querySelector("#card");
        this.$clabe = this.shadowRoot.querySelector("#clabe");
        this.$accountNumber = this.shadowRoot.querySelector("#account-number");

        this.$update = this.shadowRoot.querySelector("#update"); 
        this.$delete = this.shadowRoot.querySelector("#delete"); 
    }

    connectedCallback() {
        this.$update.onclick = () => {
            if (this.$accountHolder.checkValidity() 
            && this.$bank.checkValidity()
            && this.$card.checkValidity()
            && this.$clabe.checkValidity()
            && this.$accountNumber.checkValidity()) {
                console.log("Valid");
            } else {
                this.$accountHolder.reportValidity(); 
                this.$bank.reportValidity();
                this.$card.reportValidity();
                this.$clabe.reportValidity();
                this.$accountNumber.reportValidity();
            }
        }
    }
}

fetch("./html/components/account-card.html").then((res) => {
    return res.text();
}).then((temp) => {
    document.body.insertAdjacentHTML('beforeend', temp);
    customElements.define("account-card", accountCard);
})