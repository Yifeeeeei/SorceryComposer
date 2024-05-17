async function arena_main_loop() {
    arena_card_info_added = null;
    // choose hero card
    arena_prepare_candidates(arena_filter_hero);
    await arena_wait_till_card_added();
    arena_chosen_element = arena_card_info_added.category;
    // choose main deck
    arena_card_info_added = null;

    for (let i = 0; i < 30; i++) {
        arena_prepare_candidates(
            arena_create_filter_function_for_main_deck(
                "main",
                arena_chosen_element
            )
        );
        await arena_wait_till_card_added();
        arena_card_info_added = null;
    }
    // choose ability deck
    for (let i = 0; i < 12; i++) {
        arena_prepare_candidates(
            arena_create_filter_function_for_ability_deck(
                "ability",
                arena_chosen_element
            )
        );
        await arena_wait_till_card_added();
        arena_card_info_added = null;
    }
    console.log("Arena main loop finished");
    // click the export button
    document.getElementById("button_export").click();
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function arena_wait_till_card_added(interval = 100) {
    while (arena_card_info_added === null) {
        await sleep(interval);
    }
}

// filter function for arena
function arena_filter_hero(card_info) {
    return card_info.type === "英雄";
}

function arena_filter_deck_on_element(deck_name, target_element, card_info) {
    if (
        find_deck_for_card(card_info) == deck_name &&
        (card_info.category == target_element || card_info.category == "?")
    ) {
        return true;
    }
    return false;
}

function arena_create_filter_function_for_main_deck(deck_name, target_element) {
    return function (card_info) {
        // no spawn cards
        if (card_info.number[2] == "0") {
            return false;
        }
        let element_result = arena_filter_deck_on_element(
            deck_name,
            target_element,
            card_info
        );
        return element_result;
    };
}
function arena_create_filter_function_for_ability_deck(
    deck_name,
    target_element
) {
    return function (card_info) {
        if (card_info.number[2] == "0") {
            return false;
        }
        let element_result = arena_filter_deck_on_element(
            deck_name,
            target_element,
            card_info
        );
        if (!element_result) {
            return false;
        }
        // no duplicate cards in current ability deck
        for (let i = 0; i < current_deck["ability"].length; i++) {
            if (current_deck["ability"][i].number == card_info.number) {
                return false;
            }
        }
        return true;
    };
}

// this function choose the corresponding cards and displays them
function arena_prepare_candidates(filter_function) {
    ok_card_infos = [];
    for (let i = 0; i < all_card_infos.length; i++) {
        if (filter_function(all_card_infos[i])) {
            ok_card_infos.push(all_card_infos[i]);
        }
    }

    // randomly choose some cards with no duplication
    displaying_card_infos = [];
    for (let i = 0; i < arena_candidate_number; i++) {
        let idx = Math.floor(Math.random() * ok_card_infos.length);
        displaying_card_infos.push(ok_card_infos[idx]);
        ok_card_infos.splice(idx, 1);
    }
    show_cards();
}

// for arena onclick, rewirte the add button function
function onclick_add_button(event) {
    if (arena_card_info_added !== null) {
        return;
    }
    const idx = event.target.getAttribute("idx");
    const card_info = displaying_card_infos[idx];
    const deck = find_deck_for_card(card_info);
    current_deck[deck].push(card_info);
    sort_cards_by_number(current_deck[deck]);
    // add spawns
    const spawns = card_info.hasOwnProperty("spawns") ? card_info.spawns : [];
    for (let i = 0; i < spawns.length; i++) {
        const spawn_info = get_card_info_by_number(spawns[i]);
        current_deck[find_deck_for_card(spawn_info)].push(spawn_info);
        sort_cards_by_number(current_deck[find_deck_for_card(spawn_info)]);
    }
    show_decks();
    // clear displaying cards
    displaying_card_infos = [];
    show_cards();
    // inform a card is chosen
    arena_card_info_added = card_info;
}

// overwrite show_decks() function

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
            // no minus button here
            // let deck_minus_button = document.createElement("button");
            // deck_minus_button.innerHTML = "-";
            // deck_minus_button.className = "deck_minus_button";
            // deck_minus_button.setAttribute("deck_name", deck_list[i]);
            // deck_minus_button.setAttribute("idx", j);
            // deck_minus_button.onclick = onclick_deck_minus_button;

            // deck_card_container.appendChild(deck_minus_button);

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
    show_deck_info();
}
