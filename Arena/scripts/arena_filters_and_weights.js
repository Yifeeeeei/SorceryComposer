// weight functions
function arena_weight_function_for_main_deck(card_info) {
    let w = 1;
    if (is_legend(card_info)) {
        w = w * 0.4;
    }
    return w;
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
