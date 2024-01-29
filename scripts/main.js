// this function will display all cards in displaying_card_infos onto the page
function show_cards() {
    displaying_card_infos.forEach((card_info) => {
        const card_div = get_card_element_by_card_info(card_info);
        document.getElementById("collections").appendChild(card_div);
    });
}

// setting up everything for the first time
async function setup() {
    // read the files
    all_card_infos = await readJsonFile("resources/all_card_infos.json");
    console.log(all_card_infos.length, "all card infos read");

    // display all cards
    displaying_card_infos = all_card_infos;
    // create a card div for each card
    show_cards();
}

function main() {
    console.log("Hello from main.js");
    setup();
}

main();
