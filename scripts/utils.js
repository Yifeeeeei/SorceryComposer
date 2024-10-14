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
    document.getElementById("collections_list").innerHTML = "";
    for (let i = 0; i < displaying_card_infos.length; i++) {
        const card_info = displaying_card_infos[i];
        let card_ele = get_card_element_by_card_info(card_info, i);
        card_ele.setAttribute("idx", i);
        document.getElementById("collections_list").appendChild(card_ele);
    }
}

function mouseover_card_name_element(event) {
    popup_img.setAttribute("src", event.target.getAttribute("img_src"));
    show_element(popup_img);
}
function mouseout_card_name_element(event) {
    hide_element(popup_img);
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
            card_name_ele.addEventListener(
                "mouseover",
                mouseover_card_name_element
            );
            card_name_ele.addEventListener(
                "mouseout",
                mouseout_card_name_element
            );

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
        "主要卡组 " +
        current_deck["main"].length +
        "/30" +
        "</strong>";
    document.getElementById("ability_header").innerHTML =
        "<strong>" +
        "技能卡组 " +
        current_deck["ability"].length +
        "/10" +
        "</strong>";
    document.getElementById("extra_header").innerHTML =
        "<strong>" + "额外卡组 " + current_deck["extra"].length + "</strong>";
    show_deck_info();
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
    let encoded = "";
    for (let i = 0; i < current_deck["main"].length; i++) {
        card_numbers.push(current_deck["main"][i].number);
    }
    encoded = encoded + encode(card_numbers) + " // ";
    card_numbers = [];
    for (let i = 0; i < current_deck["ability"].length; i++) {
        card_numbers.push(current_deck["ability"][i].number);
    }
    encoded = encoded + encode(card_numbers) + " // ";
    card_numbers = [];
    for (let i = 0; i < current_deck["extra"].length; i++) {
        card_numbers.push(current_deck["extra"][i].number);
    }
    encoded = encoded + encode(card_numbers);

    input_deck_code.value = encoded;

    navigator.clipboard.writeText(encoded).then(function (x) {
        alert("卡组代码已经复制到剪贴板");
    });
    // alert("Deck code copied to clipboard!");
}

function onclick_deck_card_name(event) {
    // clear shader's children
    show_element(shader);
    shader.innerHTML = "";
    let card_src = event.target.getAttribute("img_src");
    zoom_img.src = card_src;
    set_zoom_text(
        get_card_info_by_number(event.target.getAttribute("card_number"))
    );
    show_element(zoom_info);
    show_element(zoom_img);
    show_element(zoom_text);
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
            // throw new Error("Network response was not ok");
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error reading the JSON file:", error);
        return null;
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
    category = card_info.category;
    category = category.replaceAll("?", "无");
    for (const placeholder in element_placeholders) {
        category = category.replaceAll(
            placeholder,
            `<img src="${element_placeholders[placeholder]}" class="card_information_bar_inline_image inline_image">`
        );
    }

    information_div.innerHTML =
        card_info.type + " " + category + " " + card_info.tag;
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
    description = card_info.description;
    description_div.innerHTML = description;
    return description_div;
}

function hide_element(element) {
    element.setAttribute("hidden", "true");
    if (!element.classList.contains("hidden")) {
        element.classList.add("hidden");
    }
    return element;

    // add hidden to class name
}
function show_element(element) {
    if (element.hasAttribute("hidden")) {
        element.removeAttribute("hidden");
    }
    // return element;
    // remove hidden from class name
    if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
    }
    return element;
}

function get_dummy_img_src(card_info) {
    return "resources/dummy.jpg";
}

function get_image_src(card_info) {
    return "https://yifeeeeei.github.io/SorceryImages/" + card_info.output_path;
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

function get_zoom_elements_str(card_category, card_elements) {
    let eles = [];
    let nums = [];
    eles.push(card_category);
    nums.push(0);
    for (let i = 0; i < Object.keys(card_elements).length; i++) {
        if (Object.keys(card_elements)[i] == card_category) {
            nums[0] = card_elements[card_category];
        } else {
            eles.push(Object.keys(card_elements)[i]);
            nums.push(card_elements[Object.keys(card_elements)[i]]);
        }
    }
    let rt_str = "";
    for (let i = 0; i < eles.length; i++) {
        if (nums[i] > 0) {
            rt_str += nums[i] + " " + eles[i] + " ";
        }
    }
    // replace place holders with inline images
    rt_str = rt_str.replaceAll("?", "无");
    for (const placeholder in element_placeholders) {
        rt_str = rt_str.replaceAll(
            placeholder,
            `<img src="${element_placeholders[placeholder]}" class="zoom_text_inline_image inline_image">`
        );
    }
    return rt_str;
}

function set_zoom_text(card_info) {
    let html_template = ``;
    let zoom_number_str = card_info.number.toString();
    let zoom_type_str = card_info.type;
    let zoom_name_str = card_info.name;
    let zoom_category_str = card_info.category;
    let zoom_tag_str = card_info.tag;
    html_template += `<li><strong>${zoom_name_str}</strong></li>`;

    // replace ? with 无 to in category str
    zoom_category_str = zoom_category_str.replaceAll("?", "无");
    // use inline images for elements
    for (const placeholder in element_placeholders) {
        zoom_category_str = zoom_category_str.replaceAll(
            placeholder,
            `<img src="${element_placeholders[placeholder]}" class="zoom_text_inline_image inline_image">`
        );
    }

    html_template += `<li>${zoom_number_str} ${zoom_type_str} ${zoom_category_str} ${zoom_tag_str}</li>`;

    let zoom_cost_str = get_zoom_elements_str(
        card_info.category,
        card_info.elements_cost
    );
    html_template += `<li><strong>条件:</strong> ${zoom_cost_str}</li>`;
    let zoom_expense_str = get_zoom_elements_str(
        card_info.category,
        card_info.elements_expense
    );
    if (zoom_expense_str != "") {
        html_template += `<li><strong>代价:</strong> ${zoom_expense_str}</li>`;
    }
    let zoom_gain_str = get_zoom_elements_str(
        card_info.category,
        card_info.elements_gain
    );
    if (zoom_gain_str != "") {
        html_template += `<li><strong>负载:</strong> ${zoom_gain_str}</li>`;
    }

    if (card_info.life > 0) {
        html_template += `<li><strong>生命:</strong> ${card_info.life.toString()}</li>`;
    }
    if (card_info.attack > 0) {
        html_template += `<li><strong>攻击:</strong> ${card_info.attack.toString()}</li>`;
    }
    if (card_info.power > 0) {
        html_template += `<li><strong>威力:</strong> ${card_info.power.toString()}</li>`;
    }
    if (card_info.duration > 0) {
        html_template += `<li><strong>持续:</strong> ${card_info.duration.toString()}</li>`;
    }
    if (card_info.description != "") {
        // replace place holders with inline images
        description = card_info.description;

        for (const placeholder in description_placeholders) {
            description = description.replaceAll(
                placeholder,
                `<img src="${description_placeholders[placeholder]}" class="zoom_text_inline_image inline_image">`
            );
        }

        html_template += `<li><strong>效果:</strong> ${description}</li>`;
    }
    if (card_info.spawns.length > 0) {
        html_template += `<li><strong>衍生:</strong> ${card_info.spawns.join(
            " "
        )}</li>`;
    }
    if (card_info.version_name != "") {
        html_template += `<li><strong>版本:</strong> ${card_info.version_name}</li>`;
    }

    if (card_info.quote != "") {
        html_template += `<li><i> ${card_info.quote}</i></li>`;
    }
    html_template = "<ul>" + html_template + "</ul>";
    zoom_text.innerHTML = html_template;
}

function onclick_img_element(event) {
    // clear shader's children
    show_element(shader);
    shader.innerHTML = "";
    let card_src = event.target.src;
    zoom_img.src = card_src;
    set_zoom_text(
        get_card_info_by_number(event.target.getAttribute("card_number"))
    );
    show_element(zoom_info);
    show_element(zoom_img);
    show_element(zoom_text);
}

function onclick_shader(event) {
    hide_element(shader);
    hide_element(zoom_img);
    hide_element(zoom_info);
    hide_element(zoom_text);
    hide_element(popup_img);
    hide_element(popup_hint);
}

function find_deck_for_card(card_info) {
    // 衍生物第三位为0
    if (card_info.number[2] == 0) {
        return "extra";
    } else if (card_info.type == "技能") {
        return "ability";
    } else if (card_info.type == "伙伴" || card_info.type == "道具") {
        return "main";
    } else {
        return "extra";
    }
}

function get_card_info_by_number(card_number) {
    for (let i = 0; i < all_card_infos.length; i++) {
        if (all_card_infos[i].number == card_number) {
            return all_card_infos[i];
        }
    }
}

function onclick_add_button(event) {
    const idx = event.target.getAttribute("idx");
    const card_info = displaying_card_infos[idx];
    const deck = find_deck_for_card(card_info);
    current_deck[deck].push(card_info);
    sort_cards_by_number(current_deck[deck]);
    // add spawns
    const spawns = card_info.hasOwnProperty("spawns") ? card_info.spawns : [];
    for (let i = 0; i < spawns.length; i++) {
        // parse it to int then to string
        let spawn_number = parseInt(spawns[i]).toString();
        const spawn_info = get_card_info_by_number(spawn_number);
        const spawn_deck = find_deck_for_card(spawn_info);
        let card_already_in_extra_deck = false;
        for (let j = 0; j < current_deck[spawn_deck].length; j++) {
            if (current_deck[spawn_deck][j].number == spawn_number) {
                card_already_in_extra_deck = true;
                break;
            }
        }
        if (card_already_in_extra_deck) {
            continue;
        }
        current_deck[spawn_deck].push(spawn_info);
        sort_cards_by_number(current_deck[spawn_deck]);
    }
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

    card_div.style.width = card_width;
    card_div.style.height = card_height;
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

function onclick_zoomin() {
    const current_width = parseInt(card_width.slice(0, -2));
    const current_height = parseInt(card_height.slice(0, -2));
    card_width = Math.ceil(current_width * zoom_ratio).toString() + "px";
    card_height = Math.ceil(current_height * zoom_ratio).toString() + "px";
    var all_cards = document.getElementsByClassName("card");
    for (let i = 0; i < all_cards.length; i++) {
        all_cards[i].style.width = card_width;
        all_cards[i].style.height = card_height;
    }
}

function onclick_zoomout() {
    const current_width = parseInt(card_width.slice(0, -2));
    const current_height = parseInt(card_height.slice(0, -2));
    card_width = Math.floor(current_width / zoom_ratio).toString() + "px";
    card_height = Math.floor(current_height / zoom_ratio).toString() + "px";
    var all_cards = document.getElementsByClassName("card");
    for (let i = 0; i < all_cards.length; i++) {
        all_cards[i].style.width = card_width;
        all_cards[i].style.height = card_height;
    }
}

function onclick_hint() {
    onclick_shader();
    // show_element(popup);
    show_element(popup_hint);
    show_element(shader);
}

function get_deck_curve(card_infos) {
    let curve_dict = {};
    for (let i = curve_min; i <= curve_max; i++) {
        curve_dict[i] = 0;
    }
    for (let i = 0; i < card_infos.length; i++) {
        let card_info = card_infos[i];
        let card_cost = 0;
        for (let i = 0; i < Object.keys(card_info.elements_cost).length; i++) {
            const key = Object.keys(card_info.elements_cost)[i];
            card_cost += card_info.elements_cost[key];
        }
        if (card_cost > curve_max) {
            card_cost = curve_max;
        }
        curve_dict[card_cost] += 1;
    }
    return curve_dict;
}

function get_deck_component(card_infos) {
    let component_dict = { 伙伴: 0, 道具: 0, 装备: 0, 消耗品: 0, 地形: 0 };
    for (let i = 0; i < card_infos.length; i++) {
        let card_info = card_infos[i];
        if (card_info.type === "伙伴") {
            component_dict["伙伴"] += 1;
        } else {
            component_dict["道具"] += 1;
        }
        if (
            card_info.tag.includes("卷轴") ||
            card_info.tag.includes("药剂") ||
            card_info.tag.includes("符文")
        ) {
            component_dict["消耗品"] += 1;
        }
        if (
            card_info.tag.includes("武器") ||
            card_info.tag.includes("饰物") ||
            card_info.tag.includes("神器") ||
            card_info.tag.includes("防具") ||
            card_info.tag.includes("用具")
        ) {
            component_dict["装备"] += 1;
        }
        if (card_info.tag.includes("地形")) {
            component_dict["地形"] += 1;
        }
    }
    return component_dict;
}

function show_deck_info() {
    let main_curve = get_deck_curve(current_deck["main"]);
    main_labels = [];
    for (let i = curve_min; i < curve_max; i++) {
        main_labels.push(i.toString());
    }
    main_labels.push(curve_max.toString() + "+");
    let main_data = [];
    for (let i = curve_min; i <= curve_max; i++) {
        main_data.push(main_curve[i]);
    }
    main_deck_curve_chart_reference = draw_bar_plot(
        document.getElementById("main_deck_curve_canvas"),
        main_data,
        main_labels,
        main_deck_curve_chart_reference,
        "MAIN"
    );

    let ability_curve = get_deck_curve(current_deck["ability"]);
    let ability_labels = [];
    for (let i = curve_min; i < curve_max; i++) {
        ability_labels.push(i.toString());
    }
    ability_labels.push(curve_max.toString() + "+");
    let ability_data = [];
    for (let i = curve_min; i <= curve_max; i++) {
        ability_data.push(ability_curve[i]);
    }
    ability_deck_curve_chart_reference = draw_bar_plot(
        document.getElementById("ability_deck_curve_canvas"),
        ability_data,
        ability_labels,
        ability_deck_curve_chart_reference,
        "ABILITY"
    );

    let main_component = get_deck_component(current_deck["main"]);
    let main_component_labels = Object.keys(main_component);
    let main_component_data = Object.values(main_component);
    main_deck_components_chart_reference = draw_bar_plot(
        document.getElementById("main_deck_components_canvas"),
        main_component_data,
        main_component_labels,
        main_deck_components_chart_reference,
        ""
    );
}

function draw_bar_plot(canvas, data, labels, chart_reference, title = "") {
    // if the canvas has no chart
    if (chart_reference === null) {
        let ctx = canvas.getContext("2d");
        chart_reference = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: "#F17C67",
                        borderColor: "#F17C67",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1, // Set the step size to 1 to ensure only integers are shown
                            callback: function (value) {
                                if (Number.isInteger(value)) {
                                    return value; // Only return the tick if it is an integer
                                }
                            },
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true, // Show the title
                        text: title, // Set the title text
                    },
                },
            },
        });
    } else {
        // update the chart
        chart_reference.data.datasets[0].data = data;
        chart_reference.labels = labels;
        chart_reference.update();
    }
    return chart_reference;
}

function toggle_deck_info_onclick() {
    // if hidden
    if (deck_info.classList.contains("hidden")) {
        show_element(deck_info);
    } else {
        hide_element(deck_info);
    }
}

function onclick_refresh() {
    show_cards();
    show_decks();
    show_deck_info();
}
