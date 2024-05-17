var all_card_infos;
var displaying_card_infos;
var input_filter = "";
var shader;
var current_deck = { main: [], ability: [], extra: [] };
var deck_main;
var deck_ability;
var deck_extra;
var card_number_to_idx = {};
var input_deck_code;
var button_build;

var popup_hint;
var popup_img;
var card_width = "200px";
var card_height = "330px";
var zoom_ratio = 1.25;
var zoom_img;

var curve_min = 0;
var curve_max = 7;
var main_deck_curve_chart_reference = null;
var ability_deck_curve_chart_reference = null;
var main_deck_components_chart_reference = null;

var update_card_numbers = [];
