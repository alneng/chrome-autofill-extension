window.addEventListener('load', async function () {
    function checkStatus(itemInLocalStorage) {
        return chrome.storage.sync.get(itemInLocalStorage)
    }

    const responseAutofill = await checkStatus("Shopify Autofill")
    const statusAutofill = responseAutofill["Shopify Autofill"]
    const responseACO = await checkStatus("Shopify ACO")
    const statusACO = responseACO["Shopify ACO"]

    let fieldInputArr = [
        "number",
        "name",
        "expiry",
        "verification_value"
    ]
    let paymentFields = {};
    fieldInputArr.forEach((field) => {
        chrome.storage.sync.get(field, (result) => {
            paymentFields[field] = result[field]
        })
    })

    if (statusAutofill) {
        this.window.setTimeout(() => {
            Object.keys(paymentFields).forEach(id => {
                fillField(id, paymentFields[id]);
            });
        }, 5)
    }

    if (statusACO) {
        this.window.setTimeout(() => {
            chrome.runtime.sendMessage({ action: 'completeCheckout' });
        }, 25)
    }

})

function fillField(id, value) {
    let element = document.getElementById(id);
    if (element) {
        element.focus();

        element.value = value;
        element.dispatchEvent(new Event('change'));

        element.blur();
    }
}