function hello_utils() {
    console.log("Hello from utils.js");
}

function encode(numbers) {
    // join by space
    let encoded = numbers.join(" ");
    return encoded;
}

function decode(encoded) {
    let numbers = [];
    encoded = encoded.replaceAll("//", " ");

    numbers = encoded.split(/(\s+)/).filter(function (e) {
        return e.trim().length > 0;
    });

    for (let i = 0; i < numbers.length; i++) {
        try {
            numbers[i] = parseInt(numbers[i]);
        } catch (err) {
            alert("Invalid deck code: " + numbers[i] + " is not a number!");
            numbers.splice(i, 1);
            i--;
        }
    }
    return numbers;
}

// this function will display all cards in displaying_card_infos onto the page
function show_cards() {
    for (let i = 0; i < displaying_card_infos.length; i++) {
        const card_info = displaying_card_infos[i];
        let card_ele = get_card_element_by_card_info(card_info, i);
        card_ele.setAttribute("idx", i);
        document.getElementById("collections_list").appendChild(card_ele);
    }
}

function show_decks() {
    const deck_elements = [deck_main, deck_ability, deck_extra];
    const deck_list = ["main", "ability", "extra"];
    for (let i = 0; i < 3; i++) {
        deck_elements[i].innerHTML = "";
        for (let j = 0; j < current_deck[deck_list[i]].length; j++) {
            const card_info = current_deck[deck_list[i]][j];
            let deck_card_container = document.createElement("div");
            deck_card_container.className = "deck_card_container";

            let card_name_ele = document.createElement("div");
            card_name_ele.setAttribute("idx", j);
            card_name_ele.setAttribute("card_number", card_info.number);
            card_name_ele.setAttribute("img_src", get_image_src(card_info));
            card_name_ele.innerHTML = card_info.name;
            card_name_ele.onclick = onclick_deck_card_name;

            if (is_legend(card_info)) {
                card_name_ele.innerHTML += " ✡";
            }
            card_name_ele.className = "deck_card";
            deck_card_container.appendChild(card_name_ele);
            let deck_minus_button = document.createElement("button");
            deck_minus_button.innerHTML = "-";
            deck_minus_button.className = "deck_minus_button";
            deck_minus_button.setAttribute("deck_name", deck_list[i]);
            deck_minus_button.setAttribute("idx", j);
            deck_minus_button.onclick = onclick_deck_minus_button;

            deck_card_container.appendChild(deck_minus_button);

            deck_elements[i].appendChild(deck_card_container);
        }
    }
    document.getElementById("main_header").innerHTML =
        "<strong>" +
        "MAIN " +
        current_deck["main"].length +
        "/30" +
        "</strong>";
    document.getElementById("ability_header").innerHTML =
        "<strong>" +
        "ABILITY " +
        current_deck["ability"].length +
        "/12" +
        "</strong>";
    document.getElementById("extra_header").innerHTML =
        "<strong>" + "EXTRA " + current_deck["extra"].length + "</strong>";
}

function onclick_button_build(event) {
    const card_numbers = decode(input_deck_code.value);
    console.log(card_numbers);
    current_deck = { main: [], ability: [], extra: [] };
    for (let i = 0; i < card_numbers.length; i++) {
        if (card_number_to_idx[card_numbers[i]] == undefined) {
            alert("Invalid deck code!");
            return;
        }
        const card_info = all_card_infos[card_number_to_idx[card_numbers[i]]];
        const deck = find_deck_for_card(card_info);
        current_deck[deck].push(card_info);
    }
    sort_cards_by_number(current_deck["main"]);
    sort_cards_by_number(current_deck["ability"]);
    sort_cards_by_number(current_deck["extra"]);
    show_decks();
}

function onclick_button_export(event) {
    let card_numbers = [];
    for (let i = 0; i < current_deck["main"].length; i++) {
        card_numbers.push(current_deck["main"][i].number);
    }
    for (let i = 0; i < current_deck["ability"].length; i++) {
        card_numbers.push(current_deck["ability"][i].number);
    }
    for (let i = 0; i < current_deck["extra"].length; i++) {
        card_numbers.push(current_deck["extra"][i].number);
    }
    let encoded = encode(card_numbers);
    input_deck_code.value = encoded;

    navigator.clipboard.writeText(encoded).then(function (x) {
        alert("Deck code copied to clipboard");
    });
    // alert("Deck code copied to clipboard!");
}

function onclick_deck_card_name(event) {
    // clear shader's children
    show_element(shader);
    shader.innerHTML = "";
    let card_src = event.target.getAttribute("img_src");
    let zoom_img = document.createElement("img");
    zoom_img.className = "zoom";
    zoom_img.src = card_src;
    shader.appendChild(zoom_img);
}

function onclick_deck_minus_button(event) {
    const deck_name = event.target.getAttribute("deck_name");
    const idx = event.target.getAttribute("idx");
    current_deck[deck_name].splice(idx, 1);
    show_decks();
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

function find_deck_for_card(card_info) {
    if (card_info.type == "英雄" || card_info.tag.includes("衍生")) {
        return "extra";
    } else if (card_info.type == "技能") {
        return "ability";
    } else if (card_info.type == "生物" || card_info.type == "道具") {
        return "main";
    } else {
        return "extra";
    }
}

function onclick_add_button(event) {
    const idx = event.target.getAttribute("idx");
    const card_info = displaying_card_infos[idx];
    const deck = find_deck_for_card(card_info);
    current_deck[deck].push(card_info);
    sort_cards_by_number(current_deck[deck]);
    show_decks();
}

function get_header_element_by_card_info(card_info, idx) {
    let header_div = document.createElement("div");
    header_div.className = "card_header";

    let name_div = document.createElement("div");
    name_div.className = "card_name";
    name_div.innerHTML = "<strong>" + card_info.name + "</strong>";

    let add_button = document.createElement("button");
    add_button.className = "card_add_button";
    add_button.innerHTML = "+";
    add_button.setAttribute("card_number", card_info.number);
    add_button.setAttribute("idx", idx);
    add_button.onclick = onclick_add_button;

    header_div.appendChild(name_div);
    header_div.appendChild(add_button);
    return header_div;
}

function get_card_element_by_card_info(card_info, idx) {
    const card_div = document.createElement("li");
    card_div.className = "card" + " " + get_class_name_by_card_info(card_info);
    const header_div = get_header_element_by_card_info(card_info, idx);
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
