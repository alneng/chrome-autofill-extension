const shippingInfo = {
    "checkout_email": '',
    "checkout_shipping_address_first_name": '',
    "checkout_shipping_address_last_name": '',
    "checkout_shipping_address_address1": '',
    "checkout_shipping_address_address2": '',
    "checkout_shipping_address_city": '',
    "checkout_shipping_address_zip": '',
    "checkout_shipping_address_phone": '',
    "checkout_shipping_address_country": 'United States',
    "checkout_shipping_address_province": 'MA',
}

const billingInfo = {
    "number": '1234567812345678',
    "name": 'Full Name',
    "expiry": 'MM/YY',
    "verification_value": 'CVV'
}

const userSettings = {
    "webhook": "",
    "Shopify Autofill": true,
    "Shopify ACO": true
}

// init variables
chrome.runtime.onInstalled.addListener(() => {
    let shippingFieldsArr = [
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
    let billingFieldsArr = [
        "number",
        "name",
        "expiry",
        "verification_value"
    ]
    let userSettingsArr = [
        "webhook",
        "Shopify Autofill",
        "Shopify ACO"
    ]
    shippingFieldsArr.forEach((field) => {
        chrome.storage.sync.get(field, (result) => {
            if (result[field] == undefined || result[field] == "undefined") {
                chrome.storage.sync.set(JSON.parse(`{ "${field}": "${shippingInfo[field]}" }`));
            }
        })
    })
    billingFieldsArr.forEach((field) => {
        chrome.storage.sync.get(field, (result) => {
            if (result[field] == undefined) {
                chrome.storage.sync.set(JSON.parse(`{ "${field}": "${billingInfo[field]}" }`));
            }
        })
    })
    userSettingsArr.forEach((field) => {
        chrome.storage.sync.get(field, (result) => {
            if (result[field] == undefined || result[field] == "undefined") {
                if (typeof (userSettings[field]) != "boolean")
                    chrome.storage.sync.set(JSON.parse(`{ "${field}": "${userSettings[field]}" }`));
                else
                    chrome.storage.sync.set(JSON.parse(`{ "${field}": false }`));
            }
        })
    })
});

// on tab url change or reload
chrome.tabs.onUpdated.addListener(function (tabIdFunc, changeInfo, tab) {
    if (changeInfo.status == "completedOrder") {
        // check if page is order confirmed
    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'completeCheckout') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'completeShopifyCheckout' });
        });
    }
});
