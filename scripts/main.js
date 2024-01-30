// setting up everything for the first time
async function setup() {
    // read the files
    all_card_infos = await readJsonFile("resources/all_card_infos.json");
    sort_cards_by_number(all_card_infos);
    console.log(all_card_infos.length, "all card infos read");
    // display all cards
    displaying_card_infos = all_card_infos;
    // create a card div for each card
    show_cards();

    // set shader
    shader = document.getElementById("shader");
    // set decks
    deck_main = document.getElementById("deck_main");
    deck_ability = document.getElementById("deck_ability");
    deck_extra = document.getElementById("deck_extra");

    // set up input_deck_code
    input_deck_code = document.getElementById("input_deck_code");
    // set up button_build
    button_build = document.getElementById("button_build");

    // set up card_number_to_idx
    for (let i = 0; i < all_card_infos.length; i++) {
        card_number_to_idx[all_card_infos[i].number] = i;
    }
}

function main() {
    console.log("Hello from main.js");
    setup();
}

main();
