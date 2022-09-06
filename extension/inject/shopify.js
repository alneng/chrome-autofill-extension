window.addEventListener('load', async function () {
    function checkStatus(itemInLocalStorage) {
        return chrome.storage.sync.get(itemInLocalStorage)
    }

    const responseAutofill = await checkStatus("Shopify Autofill")
    const statusAutofill = responseAutofill["Shopify Autofill"]
    const responseACO = await checkStatus("Shopify ACO")
    const statusACO = responseACO["Shopify ACO"]

    if (statusAutofill)
        autofillShippingInfoInputs(statusACO)

    if (statusACO)
        selectShippingRate()
})

// billing checkout
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'completeShopifyCheckout') {
        let completeCheckout = setTimeout(() => {
            continueToNextStep();
            clearTimeout(completeCheckout);
        }, 1000)
    }
});
function continueToNextStep() {
    let continueButton = document.querySelector('.step__footer__continue-btn');
    continueButton.click();
};

// shipping info
async function autofillShippingInfoInputs(acoStatus) {

    function toggleEmailOffers() {
        if (document.getElementById("checkout_buyer_accepts_marketing") != undefined && document.getElementById("checkout_buyer_accepts_marketing").checked == true)
            document.getElementById("checkout_buyer_accepts_marketing").checked = false
    }

    function continueToNextScreenFromShippingInfo() {
        if (document.getElementById("checkout_buyer_accepts_marketing") != undefined && acoStatus)
            document.querySelector('.step__footer__continue-btn').click()
    }

    let fieldInputArr = [
        "checkout_email",
        "checkout_shipping_address_first_name",
        "checkout_shipping_address_last_name",
        "checkout_shipping_address_address1",
        "checkout_shipping_address_address2",
        "checkout_shipping_address_city",
        "checkout_shipping_address_zip",
        "checkout_shipping_address_phone",
        "checkout_shipping_address_country",
        "checkout_shipping_address_province"
    ]

    fieldInputArr.forEach((field) => {
        chrome.storage.sync.get(field, (result) => {
            let elemSelector = "#" + field
            if (document.querySelector(elemSelector) != undefined)
                document.querySelector(elemSelector).setAttribute("value", result[field])
        });
    })

    toggleEmailOffers()
    setTimeout(() => {
        continueToNextScreenFromShippingInfo()
    }, 500)
}

// select lowest shipping rate
async function selectShippingRate() {

    function continueToNextScreenFromShippingRate(elem) {
        if (elem != undefined)
            document.querySelector('.step__footer__continue-btn').click()
    }

    function checkAcoStatus() {
        chrome.storage.sync.get("Shopify ACO", (data) => {
            console.log(data["Shopify ACO"])
            return data["Shopify ACO"]
        })
    }

    let shippingInputLabels = []
    if (document.querySelectorAll(".content-box__row")[1] != undefined
        && document.querySelectorAll(".content-box__row")[1].children[0].children[1] != undefined) {

        for (var i = 1; i < document.querySelectorAll(".content-box__row").length; i++) {
            shippingInputLabels.push(document.querySelectorAll(".content-box__row")[i])
        }
        let lowestPrice = 99999
        let lowestCostElem = undefined
        shippingInputLabels.forEach((label) => {
            var price = label.children[0].children[1].children[1].children[0].innerHTML.replace("$", "")
            price = price.replaceAll("\n", "")
            price = price.replaceAll(" ", "")
            if (price.toLowerCase() == "free") {
                lowestCostElem = label
                lowestPrice = -99999
            } else if (price < lowestPrice) {
                lowestCostElem = label
            }
        })
        lowestCostElem.children[0].children[0].children[0].checked = true

        setTimeout(() => {
            continueToNextScreenFromShippingRate(lowestCostElem)
        }, 200)

    }
}