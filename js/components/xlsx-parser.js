export default class xlsxParser extends HTMLElement {
    constructor(data) {
        super();

        this._whs = data.warehouses;

        const template = document.querySelector("template#xlsx-parser").content;
        const instance = template.cloneNode(true);

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(instance);

        this.$fileInput = this.shadowRoot.querySelector("input.file");
        this.$selectWarehouse = this.shadowRoot.querySelector("select.warehouse");
        this.$button = this.shadowRoot.querySelector("button.parse");
    }

    connectedCallback() {
        for (let wh of this._whs) {
            let opt = document.createElement("option");
            opt.value = wh.id;
            opt.innerText = wh.Name;
            this.$selectWarehouse.appendChild(opt);
        }
        this.$button.addEventListener('click', (e) => {
            let file = this.$fileInput.files[0];
            this.parseProducts(file);
        });

    }

    parseProducts(file) {
        let reader = new FileReader();
        reader.onload = (e) => {
            let data = new Uint8Array(e.target.result);
            let wb = XLSX.read(data, {type:'array'});
            let priceList = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            let products = [];
            priceList.forEach((product, index) => {
                let p = {
                    productId: `10${index}`,
                    product: product.PRODUCTO.trim(),
                    price: parseInt(product.PRECIO),
                    stock: 50,
                    quantity: 0,
                };
                p.product = product.MARCA ? `${product.MARCA} ${p.product}` : p.product;
                products.push(p);            
            }); 
            this.dispatchEvent(new CustomEvent("parsed", {detail: {
                products: products,
                warehouse: this.$selectWarehouse.value, 
            }}));             
        };
        reader.readAsArrayBuffer(file);
    }

    parseSmartFilter(e) {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = (e) => {
            let data = new Uint8Array(e.target.result);
            let wb = XLSX.read(data, {type:'array'});
            let sheet = wb.Sheets[wb.SheetNames[0]];
            let range = XLSX.utils.decode_range(sheet['!ref']);
            let filters = [];
            let c = range.s.c;
            for (let r = range.s.r; r <= range.e.r; r++) {
                let cell = XLSX.utils.encode_cell({r, c});
                let f = sheet[cell].w;
                filters.push(f);
            } 
            this.dispatchEvent(new CustomEvent("parsed", {detail: filters}));          
        };
        reader.readAsArrayBuffer(file);
    }
}

fetch("/html/components/xlsx-parser.html").then((res) => {
    return res.text();
}).then((temp) => {
    document.body.insertAdjacentHTML('beforeend', temp);
    customElements.define("xlsx-parser", xlsxParser);
});