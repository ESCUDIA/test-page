export {default as productRow} from "./components/product-row.js";
export {default as loginForm} from "./components/login-form.js";
export {default as selectMenu} from "./components/select-menu.js";
export {default as orderSummary} from "./components/order-summary.js";
export {default as trackingRow} from "./components/tracking-row.js";
export {default as xlsxParser} from "./components/xlsx-parser.js";
export {default as accountCard} from "./components/account-card.js";
export {default as shippingForm} from "./components/shipping-form.js";


export async function init() {
    await customElements.whenDefined("product-row");
    await customElements.whenDefined("login-form");
    await customElements.whenDefined("select-menu");
    await customElements.whenDefined("order-summary");
    await customElements.whenDefined("tracking-row");
    await customElements.whenDefined("xlsx-parser");
    await customElements.whenDefined("account-card");
    await customElements.whenDefined("shipping-form");
    return;
}