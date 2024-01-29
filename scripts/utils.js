function hello_utils() {
    console.log("Hello from utils.js");
}

function read_all_card_infos() {
    let all_cards_info_json_path = "resources/all_card_infos.json";
    var card_infos = [];
    $.getJSON(all_cards_info_json_path, function (json) {
        card_infos = json;
    });
    return card_infos;
}
