export default class loginForm extends HTMLElement {
    constructor(app) {
        super();

        const template = document.querySelector("template#login-form").content;
        const instance = template.cloneNode(true);
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(instance);

        this.auth = app.auth();
        this.$email = this.shadowRoot.querySelector("#email");
        this.$password = this.shadowRoot.querySelector("#password");
        this.$submit = this.shadowRoot.querySelector("#submit"); 
    }

    connectedCallback() {
        this.$submit.onclick = () => {
            if (this.$email.checkValidity() && this.$password.checkValidity()) {
                console.log("Login Submit");
                let email = this.$email.value;
                let password = this.$password.value;
                this.auth.signInWithEmailAndPassword(email, password).catch(function(err) {
                   alert(err.message);
                });
            } else {
                this.$email.reportValidity();
                this.$password.reportValidity();
            }
        }
    }
}

fetch("../../html/components/login-form.html").then((res) => {
    return res.text();
}).then((temp) => {
    document.body.insertAdjacentHTML('beforeend', temp);
    customElements.define("login-form", loginForm);
})