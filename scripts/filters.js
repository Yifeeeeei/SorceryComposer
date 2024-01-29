// this is where we define our filters
// a filter filts throught the displaying_card_infos and returns a new array of card_infos

function split_filters() {
    // remove all blank spaces
    input_filter = input_filter.replaceAll("；", ";");
    input_filter = input_filter.replaceAll(/\s/g, "");
    let filters = input_filter.split(";");
    // delete empty filters
    for (let i = 0; i < filters.length; i++) {
        if (filters[i] == "") {
            filters.splice(i, 1);
            i--;
        }
    }
    console.log(filters);
    return filters;
}

function get_card_features(card_info) {
    let features = [];
    features.push(card_info.name);
    features.push(card_info.type);
    features.push(card_info.category);
    features.push(card_info.tag);
    features.push(card_info.description);
    return features;
}

function does_card_satisfy_basic_filter(card_info, basic_filter) {
    let features = get_card_features(card_info);
    for (let i = 0; i < features.length; i++) {
        if (features[i].includes(basic_filter)) {
            return true;
        }
    }
    return false;
}

function filter_all() {
    // get the input value
    input_filter = document.getElementById("input_filter").value;
    let filters = split_filters();
    displaying_card_infos = [];
    for (let i = 0; i < all_card_infos.length; i++) {
        let failed = false;
        for (let j = 0; j < filters.length; j++) {
            if (
                !does_card_satisfy_basic_filter(all_card_infos[i], filters[j])
            ) {
                failed = true;
                break;
            }
        }
        if (!failed) {
            displaying_card_infos.push(all_card_infos[i]);
        }
    }
}
