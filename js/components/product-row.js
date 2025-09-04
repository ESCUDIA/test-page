export default class productRow extends HTMLElement {
    constructor(data) {
        super();

        if (data) {
            this._warehouse = data.warehouse;
            this._productId = data.productId;
            this._product = data.product;
            this._price = data.price;
            this._stock = data.stock;
            this._quantity = data.quantity;
            this._starred = data.starred;
            this._data = true;
        } else {
            this._data = false;
        }

        const template = document.querySelector("template#product-row").content;
        const instance = template.cloneNode(true);

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(instance);

        this.$productId = this.shadowRoot.querySelector(".product-id");
        this.$product = this.shadowRoot.querySelector(".product");
        this.$stock = this.shadowRoot.querySelector(".stock");
        this.$price = this.shadowRoot.querySelector(".price");
        this.$input = this.shadowRoot.querySelector("input");
    }

    static get observedAttributes() {
        return ['quantity', 'warehouse'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "quantity") {
            this._quantity = parseInt(newValue);
            if (this._quantity <= 0) {
                this.$input.value = null;
                this.removeAttribute("selected");
            } else {
                this.$input.value = this._quantity;
                this.setAttribute("selected", '');
            }
            this.dispatchEvent(new CustomEvent("onChange", {detail: this._productId}));
        }
        if (name == "warehouse") {
            this._warehouse = newValue;
        }
    }

    connectedCallback() {

        if (this._data) {
            this.setAttribute("warehouse", this._warehouse);
            this.setAttribute("product-id", this._productId);
            this.setAttribute("product", this._product);
            this.setAttribute("stock", this._stock);
            this.setAttribute("price", this._price);
            this.setAttribute("quantity", this._quantity);
            if(this._starred) {
                this.setAttribute("starred", '');
            }
        } else {
            this._warehouse = this.getAttribute("warehouse");
            this._productId = this.getAttribute("product-id");
            this._product = this.getAttribute("product");
            this._stock = parseInt(this.getAttribute("stock"));
            this._price = parseInt(this.getAttribute("price"));
            this._quantity = parseInt(this.getAttribute("quantity"));
            this._starred = this.hasAttribute("starred");
        }

        this.$input.addEventListener("input", ()=> {
            this._quantity = this.$input.value ? parseInt(this.$input.value) : 0;
            if (this._quantity > this._stock) {
                this._quantity = this._stock;
            }
            this.setAttribute("quantity", this._quantity);                 
        });

        this.render();

    }

    render() {

        this.$productId.textContent = this._productId;
        this.$product.textContent = this._product;
        this.$price.textContent = `$ ${this._price}`;
        this.$stock.textContent = this._stock;
        this.$input.value = this._quantity <= 0 ? null: this._quantity;
        this._stock ? this.$input.max = this._stock : 0;

    }

    set quantity(quantity) {
        this.setAttribute("quantity", quantity);
    }
    set warehouse(warehouse) {
        this.setAttribute("warehouse", warehouse);
    }
    set color(color) {
        this.style = `--color: ${color};`;
    }
    get warehouse() {
        return this.getAttribute('warehouse');
    }
    get quantity() {
        return this.getAttribute('quantity');
    }
    get productId() {
        return this.getAttribute('product-id');
    }
    get product() {
        return this.getAttribute('product');
    }
    get price() {
        return this.getAttribute('price');
    }
    get stock() {
        return this.getAttribute('stock');
    }
    get starred() {
        return this._starred;
    }
    get item() {
        return {
            productId: this._productId,
            product: this._product,
            price: this._price,
            stock: this._stock,
            quantity: this._quantity,
        }
    }
}

fetch("../../html/components/product-row.html").then((res) => {
    return res.text();
}).then((temp) => {
    document.body.insertAdjacentHTML('beforeend', temp);
    customElements.define("product-row", productRow);
})