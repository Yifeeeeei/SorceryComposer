console.log("Hello from main.js");

// setting up everything

async function setup() {
    // read the files
    card_infos = await readJsonFile("resources/all_card_infos.json");
    console.log(card_infos.length, "card infos read");
    // create a card div for each card
    card_infos.forEach((card_info) => {
        const card_div = document.createElement("div");
        card_div.className = "card";
        card_div.id = card_info.number;
        card_div.innerHTML = card_info.name;
        document.getElementById("collections").appendChild(card_div);
    });
}

setup();
