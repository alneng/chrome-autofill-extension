let page = document.getElementById("user-info-container")

function handleNewInput(event, fieldInput) {
    let newValue = event.target.value;
    chrome.storage.sync.set(JSON.parse(`{"${fieldInput}": "${newValue}"}`));
}

function handleNewBooleanInput(event, fieldInput) {
    let newValue = event.target.checked;
    chrome.storage.sync.set(JSON.parse(`{"${fieldInput}": ${newValue}}`));
}

function constructShippingInfoInputs() {
    page.replaceChildren()

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

    fieldInputArr.forEach((item) => {
        chrome.storage.sync.get(item, (data) => {
            let currentItem = data[item];

            let div = document.createElement("div")
            div.classList.add("input-container")

            let input = document.createElement("input")
            input.value = currentItem
            input.name = item
            input.classList.add("input-inp")

            let label = document.createElement("label")
            label.innerHTML = item
            label.setAttribute("for", item)
            label.classList.add("input-label")

            input.addEventListener("keyup", (event) => {
                handleNewInput(event, item)
            })
            div.append(label)
            div.append(input)
            page.appendChild(div)
        });
    })

}

function constructBillingInfoInputs() {
    page.replaceChildren()

    let fieldInputArr = [
        "number",
        "name",
        "expiry",
        "verification_value"
    ]

    fieldInputArr.forEach((item) => {
        chrome.storage.sync.get(item, (data) => {
            let currentItem = data[item];

            let div = document.createElement("div")
            div.classList.add("input-container")

            let input = document.createElement("input")
            input.value = currentItem
            input.name = item
            input.classList.add("input-inp")

            let label = document.createElement("label")
            label.innerHTML = item
            label.setAttribute("for", item)
            label.classList.add("input-label")

            input.addEventListener("keyup", (event) => {
                handleNewInput(event, item)
            })
            div.append(label)
            div.append(input)
            page.appendChild(div)
        });
    })

}

function constructSettingsInputs() {
    page.replaceChildren()

    let userSettingsArr = [
        "webhook",
        "Shopify Autofill",
        "Shopify ACO"
    ]

    userSettingsArr.forEach((item) => {
        chrome.storage.sync.get(item, (data) => {
            let currentItem = data[item];

            let div = document.createElement("div")
            div.classList.add("input-container")

            let label = document.createElement("label")
            label.innerHTML = item
            label.setAttribute("for", item)
            label.classList.add("input-label")

            let input = document.createElement("input")
            if (typeof (currentItem) == "boolean") {
                input.type = "checkbox"
                input.checked = currentItem
                input.classList.add("input-checkbox")
                label.classList.add("inline")
                input.addEventListener("click", (event) => {
                    handleNewBooleanInput(event, item)
                })
            } else {
                input.value = currentItem
                input.classList.add("input-inp")
            }
            input.name = item

            input.addEventListener("keyup", (event) => {
                handleNewInput(event, item)
            })

            div.append(label)
            div.append(input)
            page.appendChild(div)
        });
    })

}

constructShippingInfoInputs()
constructBillingInfoInputs()
constructSettingsInputs()