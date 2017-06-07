'use strict';

goog.provide('Blockly.Blocks.demo'); // Deprecated
goog.provide('Blockly.Constants.Demo');

goog.require('Blockly.Blocks');


/**
 * Common HSV hue for all blocks in this category.
 * This should be the same as Blockly.Msg.COLOUR_HUE.
 * @readonly
 */
Blockly.Constants.Demo.HUE = 120;
/** @deprecated Use Blockly.Constants.Colour.HUE */
Blockly.Blocks.demo.HUE = Blockly.Constants.Demo.HUE;

Blockly.defineBlocksWithJsonArray([{
  "type": "demo_d1",
  "message0": "demo %1",
  "args0": [{
    "type": "input_value",
    "name": "NAME"
  }],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}]);
