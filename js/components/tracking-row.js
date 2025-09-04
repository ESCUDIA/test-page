export default class trackingRow extends HTMLElement {
    constructor(data) {
        super();

        if (data) {
            this._date = data.date;
            this._number = data.trackingNumber;
            this._carrier = data.carrier;
            this._details = data.details;
            this._status = data.lastLocation.status;
            this._updateDate = data.lastLocation.date;
            this._updateTime = data.lastLocation.time;
            this._data = true;
        } else {
            this._data = false;
        }

        const template = document.querySelector("template#tracking-row").content;
        const instance = template.cloneNode(true);

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(instance);

        this.$date = this.shadowRoot.querySelector(".date");
        this.$number = this.shadowRoot.querySelector(".number");
        this.$status = this.shadowRoot.querySelector(".update .status");
        this.$updateDate = this.shadowRoot.querySelector(".update .update-date");
        this.$updateTime = this.shadowRoot.querySelector(".update .update-time");
        this.$carrier = this.shadowRoot.querySelector(".carrier");
        this.$details = this.shadowRoot.querySelector(".details");
    }

    connectedCallback() {
        if (this._data) {
            this.setAttribute("date", this._date);
            this.setAttribute("number", this._number);
            this.setAttribute("carrier", this._carrier);
            this.setAttribute("details", this._details);
            this.setAttribute("status", this._status);
            this.setAttribute("update-date", this._updateDate);
            this.setAttribute("update-time", this._updateTime);
        } else {
            this._date = this.getAttribute("date");
            this._number = this.getAttribute("number");
            this._carrier = this.getAttribute("carrier");
            this._details = this.getAttribute("details");
            this._status = this.getAttribute("status");
            this._updateDate = this.getAttribute("update-date");
            this._updateTime = this.getAttribute("update-time");
        }

        this.render();
    }

    render() {
        this.$date.innerText = this._date;
        this.$number.innerText = this._number;
        this.$status.innerText = this._status;
        this.$updateDate.innerText = this._updateDate;
        this.$updateTime.innerText = this._updateTime;
        this.$carrier.innerText = this._carrier;
        this.$details.innerText = this._details;
    }
}

fetch("/html/components/tracking-row.html").then((res) => {
    return res.text();
}).then((temp) => {
    document.body.insertAdjacentHTML('beforeend', temp);
    customElements.define("tracking-row", trackingRow);
})