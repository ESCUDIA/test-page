export default class shippingForm extends HTMLElement {
    constructor(data) {
        super();

        const template = document.querySelector("template#shipping-form").content;
        const instance = template.cloneNode(true);
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(instance);

        this.$openBtn = this.shadowRoot.querySelector(".open-btn");
        this.$title = this.shadowRoot.querySelector("span.title");


        this.$firstName = this.shadowRoot.querySelector("#first-name");
        this.$lastName = this.shadowRoot.querySelector("#last-name");
        this.$business = this.shadowRoot.querySelector("#business");
        this.$birthday = this.shadowRoot.querySelector("#birthday");

        this.$taxId = this.shadowRoot.querySelector("#tax-id");
        this.$licenseId = this.shadowRoot.querySelector("#license-id");
        this.$speciality = this.shadowRoot.querySelector("#speciality");
        this.$profession = this.shadowRoot.querySelector("#profession");
        this.$agent = this.shadowRoot.querySelector("#agent");
        this.$role = this.shadowRoot.querySelector("#role");

        this.$street = this.shadowRoot.querySelector("#street");
        this.$streetNumber = this.shadowRoot.querySelector("#street-number");
        this.$street2Number = this.shadowRoot.querySelector("#street-2-number");
        this.$col = this.shadowRoot.querySelector("#col");
        this.$zip = this.shadowRoot.querySelector("#zip");
        this.$municipality = this.shadowRoot.querySelector("#municipality");
        this.$city = this.shadowRoot.querySelector("#city");
        this.$state = this.shadowRoot.querySelector("#state");
        this.$country = this.shadowRoot.querySelector("#country");
        this.$phone = this.shadowRoot.querySelector("#phone");
        this.$phone2 = this.shadowRoot.querySelector("#phone2");

        this.$email = this.shadowRoot.querySelector("#email");


        if (data) {
            this.title = data.title ? data.title : 'CUENTA';
            this.new = data.new;
            this.admin = data.admin;
            this.advanced = data.advanced;
            this.closed = data.closed;

            if (data.profile) {
                this.profile = data.profile;
            }
        }

        this.$openBtn.addEventListener("click", (e) => {
            // this.toggleAttribute("open");
            this.closed = !this.closed;
            // this.$listBtn.classList.toggle("fa-chevron-down");
            // this.$listBtn.classList.toggle("fa-chevron-up");
        });

        this.onkeypress = (e) => {
            var key = e.charCode || e.keyCode || 0;
            if (key == 13) {
                this.submit();
            }
        }

        this.$firstName.addEventListener("input", () => {
            this.firstName = this.$firstName.value ? this.$firstName.value.toUpperCase() : '';
        });
        this.$lastName.addEventListener("input", () => {
            this.lastName = this.$lastName.value ? this.$lastName.value.toUpperCase() : '';
        });
        this.$business.addEventListener("input", () => {
            this.business = this.$business.value ? this.$business.value.toUpperCase() : '';
        });
        this.$birthday.addEventListener("change", () => {
            this.birthday = this.$birthday.value ? this.$birthday.value : '';
        });

        this.$taxId.addEventListener("input", () => {
            this.taxId = this.$taxId.value ? this.$taxId.value.toUpperCase() : '';
        });
        this.$licenseId.addEventListener("input", () => {
            this.licenseId = this.$licenseId.value ? this.$licenseId.value.toUpperCase() : '';
        });
        this.$speciality.addEventListener("input", () => {
            this.speciality = this.$speciality.value ? this.$speciality.value.toUpperCase() : '';
        });
        this.$profession.addEventListener("input", () => {
            this.profession = this.$profession.value ? this.$profession.value.toUpperCase() : '';
        });
        this.$agent.addEventListener("change", () => {
            this.agent = this.$agent.value ? this.$agent.value : '';
        });
        this.$role.addEventListener("change", () => {
            this.role = this.$role.value ? this.$role.value : '';
        });


        this.$street.addEventListener("input", () => {
            this.street = this.$street.value ? this.$street.value.toUpperCase() : '';
        });
        this.$streetNumber.addEventListener("input", () => {
            this.streetNumber = this.$streetNumber.value ? this.$streetNumber.value.toUpperCase() : '';
        });
        this.$street2Number.addEventListener("input", () => {
            this.street2Number = this.$street2Number.value ? this.$street2Number.value.toUpperCase() : '';
        });
        this.$col.addEventListener("change", () => {
            this.col = this.$col.value ? this.$col.value.toUpperCase() : '';
        });

        this.$zip.addEventListener("input", () => {
            this.zip = this.$zip.value ? this.$zip.value.replace(/\D/g, '') : '';
            if (this.$zip.checkValidity()) {
                this.dispatchEvent(new CustomEvent("zip", { detail: this.zip, bubbles: true }));
            }
        });

        this.$city.addEventListener("input", () => {
            this.city = this.$city.value ? this.$city.value.toUpperCase() : '';
        });

        this.$municipality.addEventListener("input", () => {
            this.municipality = this.$municipality.value ? this.$municipality.value.toUpperCase() : '';
        });
        this.$state.addEventListener("input", () => {
            this.state = this.$state.value ? this.$state.value.toUpperCase() : '';
        });
        this.$country.addEventListener("input", () => {
            this.country = this.$country.value ? this.$country.value.toUpperCase() : '';
        });
        this.$phone.addEventListener("input", () => {
            this.phone = this.$phone.value ? this.$phone.value.replace(/\D/g, '') : '';
        });
        this.$phone2.addEventListener("input", () => {
            this.phone2 = this.$phone2.value ? this.$phone2.value.replace(/\D/g, '') : '';
        });

        this.$email.addEventListener("input", () => {
            this.email = this.$email.value ? this.$email.value.toLowerCase().replace(/\s/g, '') : '';
        });

    }

    connectedCallback() {
    }

    static get observedAttributes() {
        return ['title', 'first-name', 'last-name', 'business', 'birthday', 'tax-id', 'license-id', 'speciality', 'profession', 'agent', 'role', 'street', 'street-number', 'street-2-number', 'col', 'zip', 'municipality', 'city', 'state', 'country', 'phone', 'phone2', 'email', 'new',];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'title':
                this.$title.textContent = newValue;
                break;
            case 'first-name':
                this.$firstName.value = newValue;
                break;
            case 'last-name':
                this.$lastName.value = newValue;
                break;
            case 'business':
                this.$business.value = newValue;
                break;
            case 'birthday':
                this.$birthday.value = newValue;
                break;
            case 'tax-id':
                this.$taxId.value = newValue;
                break;
            case 'license-id':
                this.$licenseId.value = newValue;
                break;
            case 'speciality':
                this.$speciality.value = newValue;
                break;
            case 'profession':
                this.$profession.value = newValue;
                break;
            case 'agent':
                this.$agent.value = newValue;
                break;
            case 'role':
                this.$role.value = newValue;
                break;
            case 'street':
                this.$street.value = newValue;
                break;
            case 'street-number':
                this.$streetNumber.value = newValue;
                break;
            case 'street-2-number':
                this.$street2Number.value = newValue;
                break;
            case 'col':
                this.$col.value = newValue;
                break;
            case 'zip':
                this.$zip.value = newValue;
                break;
            case 'municipality':
                this.$municipality.value = newValue;
                break;
            case 'city':
                this.$city.value = newValue;
                break;
            case 'state':
                this.$state.value = newValue;
                break;
            case 'country':
                this.$country.value = newValue;
                break;
            case 'phone':
                this.$phone.value = newValue;
                break;
            case 'phone2':
                this.$phone2.value = newValue;
                break;
            case 'email':
                this.$email.value = newValue;
                break;
            case 'new':
                this.$email.disabled = this.new ? false : true;
                break;
            default:
        }
    }

    colOptions(data) {
        this.$col.innerHTML = '';
        let $option = document.createElement('option');
        $option.value = '';
        $option.innerText = '---';
        this.$col.appendChild($option);
        for (let zip of data) {
            let $option = document.createElement('option');
            $option.value = zip.col.toUpperCase();
            $option.innerText = (zip.extended ? '(EXTENDED) ' : '') + zip.col.toUpperCase();
            this.$col.appendChild($option);
        }
    }

    colOption(zip) {
        this.$col.innerHTML = '';
        let $option = document.createElement('option');
        $option.value = zip.toUpperCase();
        $option.innerText = zip.toUpperCase();
        this.$col.appendChild($option);
        this.col = zip.toUpperCase();
    }

    agentOptions(data) {
        this.$agent.innerHTML = '';
        let $option = document.createElement('option');
        $option.value = '';
        $option.innerText = '---';
        this.$agent.appendChild($option);
        for (let agent of data) {
            let $option = document.createElement('option');
            $option.value = agent.uid;
            $option.innerText = agent.name.toUpperCase();
            this.$agent.appendChild($option);
        }
    }

    agentOption(agent) {
        this.$agent.innerHTML = '';
        let $option = document.createElement('option');
        $option.value = agent.uid;
        $option.innerText = agent.name.toUpperCase();
        this.$agent.appendChild($option);
        this.agent = agent.uid;
    }

    checkValidity() {
        if (this.$firstName.checkValidity() &&
        this.$lastName.checkValidity() &&
        this.$street.checkValidity() &&
        this.$streetNumber.checkValidity() &&
        this.$col.checkValidity() &&
        this.$zip.checkValidity() &&
        this.$municipality.checkValidity() &&
        this.$city.checkValidity() &&
        this.$state.checkValidity() &&
        this.$country.checkValidity() &&
        this.$phone.checkValidity()) {
            return true;
        } else {
            
            this.$firstName.reportValidity();
            this.$lastName.reportValidity();
            this.$street.reportValidity();
            this.$streetNumber.reportValidity();
            this.$col.reportValidity();
            this.$zip.reportValidity();
            this.$municipality.reportValidity();
            this.$city.reportValidity();
            this.$state.reportValidity();
            this.$country.reportValidity();
            this.$phone.reportValidity();

        }

    }

    submit() {
        if (this.checkValidity()) {
            if (!this.new) {
                let profile = this.profile;
                this.dispatchEvent(new CustomEvent("profileUpdate", { detail: { profile }, bubbles: true }));
            } else {           
                    let profile = this.profile;
                    this.dispatchEvent(new CustomEvent("createShipping", { detail: { profile }, bubbles: true }));
            }

        } else {
            this.dispatchEvent(new CustomEvent("notification", { detail: { message: 'Porfavor llena todos los campos obligatorios.' }, bubbles: true }));
        }
    }

    get profile() {
        let data = {
            uid: this.uid,
            firstName: this.firstName,
            lastName: this.lastName,
            business: this.business,
            birthday: this.birthday,
            taxId: this.taxId,
            licenseId: this.licenseId,
            speciality: this.speciality,
            profession: this.profession,
            agent: this.agent,
            role: this.role,
            street: this.street,
            streetNumber: this.streetNumber,
            street2Number: this.street2Number,
            col: this.col,
            zip: this.zip,
            municipality: this.municipality,
            city: this.city,
            state: this.state,
            country: this.country,
            phone: this.phone,
            phone2: this.phone2,
            email: this.email,
        }
        return data;
    }

    get user() {
        let data = {
            uid: this.uid,
            firstName: this.firstName,
            lastName: this.lastName,
            business: this.business,
            email: this.email,
            phone: this.phone,
        }
        return data;
    }

    get address() {
        let data = {
            street: this.street,
            streetNumber: this.streetNumber,
            street2Number: this.street2Number,
            col: this.col,
            zip: this.zip,
            city: this.city,
            municipality: this.municipality,
            state: this.state,
            country: this.country,
            phone: this.phone,
        }
        return data;
    }

    get title() {
        return this.getAttribute("title");
    }
    get uid() {
        return this.getAttribute("uid");
    }
    get ref() {
        return this.getAttribute("ref");
    }
    get firstName() {
        return this.getAttribute("first-name");
    }
    get lastName() {
        return this.getAttribute("last-name");
    }
    get business() {
        return this.getAttribute("business");
    }
    get birthday() {
        return this.getAttribute("birthday");
    }
    get taxId() {
        return this.getAttribute("tax-id");
    }
    get licenseId() {
        return this.getAttribute("license-id");
    }
    get speciality() {
        return this.getAttribute("speciality");
    }
    get profession() {
        return this.getAttribute("profession");
    }
    get agent() {
        return this.getAttribute("agent");
    }
    get role() {
        return this.getAttribute("role");
    }
    get street() {
        return this.getAttribute("street");
    }
    get streetNumber() {
        return this.getAttribute("street-number");
    }
    get street2Number() {
        return this.getAttribute("street-2-number");
    }
    get col() {
        return this.getAttribute("col");
    }
    get zip() {
        return this.getAttribute("zip");
    }
    get municipality() {
        return this.getAttribute("municipality");
    }
    get city() {
        return this.getAttribute("city");
    }
    get state() {
        return this.getAttribute("state");
    }
    get country() {
        return this.getAttribute("country");
    }
    get phone() {
        return this.getAttribute("phone");
    }
    get phone2() {
        return this.getAttribute("phone2");
    }
    get email() {
        return this.getAttribute("email");
    }
    get connection() {
        return this.getAttribute("connection");
    }
    get operation() {
        return this.getAttribute("operation");
    }
    get admin() {
        return this.hasAttribute('admin');
    }
    get advanced() {
        return this.hasAttribute('advanced');
    }
    get new() {
        return this.hasAttribute('new');
    }
    get closed() {
        return this.hasAttribute('closed');
    }

    set profile(data) {
        data.uid ? this.uid = data.uid : null;
        data.firstName ? this.firstName = data.firstName : null;
        data.lastName ? this.lastName = data.lastName : null;
        data.business ? this.business = data.business : null;
        data.birthday ? this.birthday = data.birthday : null;
        data.taxId ? this.taxId = data.taxId : null;
        data.licenseId ? this.licenseId = data.licenseId : null;
        data.speciality ? this.speciality = data.speciality : null;
        data.profession ? this.profession = data.profession : null;
        data.agent ? this.agentOption(data.agent) : null;
        data.role ? this.role = data.role : null;
        data.street ? this.street = data.street : null;
        data.streetNumber ? this.streetNumber = data.streetNumber : null;
        data.street2Number ? this.street2Number = data.street2Number : null;
        data.col ? this.colOption(data.col) : null;
        data.zip ? this.zip = data.zip : null;
        data.municipality ? this.municipality = data.municipality : null;
        data.city ? this.city = data.city : null;
        data.state ? this.state = data.state : null;
        data.country ? this.country = data.country : null;
        data.phone ? this.phone = data.phone : null;
        data.email ? this.email = data.email : null;
    }

    set title(data) {
        this.setAttribute("title", data);
    }
    set uid(data) {
        this.setAttribute("uid", data);
    }
    set ref(data) {
        this.setAttribute("ref", data);
    }
    set firstName(data) {
        this.setAttribute("first-name", data);
    }
    set lastName(data) {
        this.setAttribute("last-name", data);
    }
    set business(data) {
        this.setAttribute("business", data);
    }
    set birthday(data) {
        this.setAttribute("birthday", data);
    }
    set taxId(data) {
        this.setAttribute("tax-id", data);
    }
    set licenseId(data) {
        this.setAttribute("license-id", data);
    }
    set speciality(data) {
        this.setAttribute("speciality", data);
    }
    set profession(data) {
        this.setAttribute("profession", data);
    }
    set agent(data) {
        this.setAttribute("agent", data);
    }
    set role(data) {
        this.setAttribute("role", data);
    }
    set street(data) {
        this.setAttribute("street", data);
    }
    set streetNumber(data) {
        this.setAttribute("street-number", data);
    }
    set street2Number(data) {
        this.setAttribute("street-2-number", data);
    }
    set col(data) {
        this.setAttribute("col", data);
    }
    set zip(data) {
        this.setAttribute("zip", data);
    }
    set municipality(data) {
        this.setAttribute("municipality", data);
    }
    set city(data) {
        this.setAttribute("city", data);
    }
    set state(data) {
        this.setAttribute("state", data);
    }
    set country(data) {
        this.setAttribute("country", data);
    }
    set phone(data) {
        this.setAttribute("phone", data);
    }
    set phone2(data) {
        this.setAttribute("phone2", data);
    }
    set email(data) {
        this.setAttribute("email", data);
    }
    set connection(data) {
        this.setAttribute("connection", data);
    }
    set new(value) {
        if (value) {
            this.setAttribute('new', '');
        } else {
            this.removeAttribute('new');
        }
    }
    set admin(value) {
        if (value) {
            this.setAttribute('admin', '');
        } else {
            this.removeAttribute('admin');
        }
    }
    set advanced(value) {
        if (value) {
            this.setAttribute('advanced', '');
        } else {
            this.removeAttribute('advanced');
        }
    }
    set closed(value) {
        if (value) {
            this.setAttribute('closed', '');
        } else {
            this.removeAttribute('closed');
        }
    }

}

fetch("/test-page/html/components/shipping-form.html").then((res) => {
    return res.text();
}).then((temp) => {
    document.body.insertAdjacentHTML('beforeend', temp);
    // let template = document.querySelector("template#shipping-form");
    // window.ShadyCSS && window.ShadyCSS.prepareTemplate(template, 'shipping-form');
    customElements.define("shipping-form", shippingForm);
})