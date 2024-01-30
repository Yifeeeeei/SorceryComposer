// this function will display all cards in displaying_card_infos onto the page
function show_cards() {
    for (let i = 0; i < displaying_card_infos.length; i++) {
        const card_info = displaying_card_infos[i];
        let card_ele = get_card_element_by_card_info(card_info);
        card_ele.setAttribute("idx", i);
        document.getElementById("collections_list").appendChild(card_ele);
    }
}

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
}

function main() {
    console.log("Hello from main.js");
    setup();
}

main();
