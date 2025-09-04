export default class orderSummary extends HTMLElement {
    constructor(data) {
        super();
        this._warehouse = data.warehouse; 
        this._color = data.color; 
        this.getProducts = data.getProducts;
        this.placeOrder = data.placeOrder;

        this.items = {};

        const template = document.querySelector("template#order-summary").content;
        const instance = template.cloneNode(true);

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(instance);

        this.$title = this.shadowRoot.querySelector(".title");
        this.$quantity = this.shadowRoot.querySelector(".quantity");
        this.$total = this.shadowRoot.querySelector(".total");
        this.$sendBtn = this.shadowRoot.querySelector("#send");
        this.$success = this.shadowRoot.querySelector(".success");
        this.$fail = this.shadowRoot.querySelector(".fail");
        this.$connecting = this.shadowRoot.querySelector(".connecting");
        this.$spinner = this.shadowRoot.querySelector(".spinner-wrapper");
    }

    connectedCallback() {
        this.render(); 
        this.getProducts().then((res) => {
            this._backup = res.backup;
            this._auth = res.data.auth;
            this.$connecting.classList.add("hidden");
            this.$success.classList.remove("hidden");
            this.$spinner.classList.add("hidden");
            this.dispatchEvent(new CustomEvent("productsSuccess", {detail: res.data.products}));
        }).catch((err) => {
            this.$connecting.classList.add("hidden");
            this.$fail.classList.remove("hidden");
            this.$spinner.classList.add("hidden");
            this.dispatchEvent(new CustomEvent("error", {detail: err}));
        });
        this.$sendBtn.addEventListener("click", (e) => {
            let order = {
              backup: this._backup,
              auth: this._auth,
              items: []
            }
            for (let item in this.items) {
              order.items.push(this.items[item]);
            }
            order.items.sort(this.sortItems);
            if (order.items.length > 0) {
                let accept = confirm(`Click OK to confirm order.`);
                if (accept) {
                  this.placeOrder(order).then((res) => {
                    this.$connecting.classList.add("hidden");
                    this.$success.classList.remove("hidden");
                    this.items = {};
                    this.render();
                    this.dispatchEvent(new CustomEvent("orderSuccess", {detail: res.data}));
                  }).catch((err) => {
                    console.log(err);
                    this.$connecting.classList.add("hidden");
                    this.$fail.classList.remove("hidden");
                    this.dispatchEvent(new CustomEvent("error", {detail: err}));
                  });
                  this.$success.classList.add("hidden");
                  this.$fail.classList.add("hidden");
                  this.$connecting.classList.remove("hidden");
                }
              } else {
                let err = new Error("No selected products.")
                this.dispatchEvent(new CustomEvent("error", {detail: err}));
              }
        });
        
    }

    update(item) {
        if (item.quantity <= 0) {
            delete this.items[item.productId];
        } else {
            this.items[item.productId] = item;
        }
        this.render();
    }

    render() {
        this.$title.innerText = this._warehouse;
        this.style = `--color: ${this._color};`;

        let mxnFormatter = Intl.NumberFormat('es-US', {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2
        });

        let summary = this.summary();
        this.$quantity.innerText = `PRODUCTS: ${summary.quantity}`;
        this.$total.innerText = mxnFormatter.format(summary.total);
    }

    summary() {
        let quantity = 0;
        let total = 0;
        for (let item in this.items) {
            quantity += this.items[item].quantity;
            total += (this.items[item].quantity * this.items[item].price);
        }
        return { quantity, total };
    }

    sortItems(a, b) {
        if (a.product < b.product) {
          return -1;
        }
        if (a.product > b.product) {
          return 1;
        }
        return 0;
    }

    get color() {
      return this._color;
    }

    get warehouse() {
      return this._warehouse;
    }

}

fetch("../../html/components/order-summary.html").then((res) => {
    return res.text();
}).then((temp) => {
    document.body.insertAdjacentHTML('beforeend', temp);
    customElements.define("order-summary", orderSummary);
})