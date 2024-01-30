function hello_utils() {
    console.log("Hello from utils.js");
}

function sort_cards_by_number(card_infos) {
    card_infos.sort((a, b) => {
        return a.number - b.number;
    });
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
    if (card_info.tag.includes("传奇") || card_info.tag.includes("传说")) {
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

function hide_element(element) {
    element.setAttribute("hidden", "true");
    return element;
}
function show_element(element) {
    if (element.hasAttribute("hidden")) {
        element.removeAttribute("hidden");
    }
    return element;
}

function get_dummy_img_src(card_info) {
    return "resources/dummy.jpg";
}

function get_image_src(card_info) {
    dic = {
        "?": "无",
        火: "火",
        水: "水",
        气: "气",
        地: "地",
        光: "光",
        暗: "暗",
    };

    return (
        "https://yifeeeeei.github.io/SorceryImages/images/" +
        card_info.type +
        "/" +
        dic[card_info.category] +
        "/" +
        card_info.number +
        "_" +
        card_info.name +
        ".jpg"
    );
}

function get_img_element_by_card_info(card_info) {
    const img_element = document.createElement("img");
    img_element.className = "card_img";
    // img_element.src = get_dummy_img_src(card_info);
    img_element.src = get_image_src(card_info);
    img_element.setAttribute("card_number", card_info.number);
    img_element.onclick = onclick_img_element;
    return img_element;
}

function onclick_img_element(event) {
    // clear shader's children
    show_element(shader);
    shader.innerHTML = "";
    let card_src = event.target.src;
    let zoom_img = document.createElement("img");
    zoom_img.className = "zoom";
    zoom_img.src = card_src;
    shader.appendChild(zoom_img);
}

function onclick_shader(event) {
    hide_element(shader);
    shader.innerHTML = "";
}

function get_header_element_by_card_info(card_info) {
    let header_div = document.createElement("div");
    header_div.className = "card_header";

    let name_div = document.createElement("div");
    name_div.className = "card_name";
    name_div.innerHTML = "<strong>" + card_info.name + "</strong>";

    let add_button = document.createElement("button");
    add_button.className = "card_add_button";
    add_button.innerHTML = "+";
    add_button.setAttribute("card_number", card_info.number);

    header_div.appendChild(name_div);
    header_div.appendChild(add_button);
    return header_div;
}

function get_card_element_by_card_info(card_info) {
    const card_div = document.createElement("li");
    card_div.className = "card" + " " + get_class_name_by_card_info(card_info);
    const header_div = get_header_element_by_card_info(card_info);
    card_div.appendChild(header_div);
    // 卡牌图片
    const img_element = get_img_element_by_card_info(card_info);

    // 类别 + 标签 + 属性 + 稀有度
    const information_bar_element = get_information_bar_by_card_info(card_info);

    // 卡牌描述
    const description_element = get_discription_element_by_card_info(card_info);

    if (information_bar_element) {
        card_div.appendChild(information_bar_element);
    }

    if (description_element && !img_element) {
        card_div.appendChild(description_element);
    }

    if (img_element) {
        card_div.appendChild(img_element);
    }
    return card_div;
}

function button_filter_clicked() {
    console.log("button_filter_clicked");
    filter_all();
    // clear the list
    document.getElementById("collections_list").innerHTML = "";
    // show all cards
    show_cards();
}
