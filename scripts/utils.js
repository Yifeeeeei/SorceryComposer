function hello_utils() {
    console.log("Hello from utils.js");
}

async function readJsonFile(jsonPath) {
    try {
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error reading the JSON file:", error);
    }
}

// tag cards to create different border colors
function get_class_name_by_card_info(card_info) {
    switch (card_info.category) {
        case "?":
            return "ele_none";
        case "无":
            return "ele_none";
        case "火":
            return "ele_fire";
        case "水":
            return "ele_water";
        case "气":
            return "ele_air";
        case "地":
            return "ele_earth";
        case "光":
            return "ele_light";
        case "暗":
            return "ele_dark";
        default:
            return "ele_unknown";
    }
}

function is_legend(card_info) {
    if (
        card_info.tag.indexOf("传奇") != -1 ||
        card_info.tag.indexOf("传说") != -1
    ) {
        return true;
    }
    return false;
}

function get_information_bar_by_card_info(card_info) {
    const information_div = document.createElement("div");
    information_div.className = "card_information_bar";
    information_div.innerHTML =
        card_info.type + " " + card_info.category + " " + card_info.tag;
    if (is_legend(card_info)) {
        information_div.innerHTML += " ✡";
    }
    return information_div;
}

function get_discription_element_by_card_info(card_info) {
    if (card_info.description == "") {
        return null;
    }
    const description_div = document.createElement("div");
    description_div.className = "card_description";
    description_div.innerHTML = card_info.description;
    return description_div;
}

function get_card_element_by_card_info(card_info) {
    const card_div = document.createElement("li");
    card_div.className = "card" + " " + get_class_name_by_card_info(card_info);
    card_div.id = card_info.number;
    card_div.innerHTML = card_info.name;

    // 类别 + 标签 + 属性 + 稀有度
    const information_bar_element = get_information_bar_by_card_info(card_info);
    if (information_bar_element) {
        card_div.appendChild(information_bar_element);
    }

    // 卡牌描述
    const description_element = get_discription_element_by_card_info(card_info);
    if (description_element) {
        card_div.appendChild(description_element);
    }

    return card_div;
}
