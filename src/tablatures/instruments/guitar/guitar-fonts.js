
/**
 * Dedicated fonts for violin tabs
 */

/**
 * Set here the fonts used by renderer/drawer 
 * for the violin plugin
 * @param {} tune 
 */
function setGuitarFonts(tune) {
  tune.formatting.tabnumberfont = { face: "\"Times New Roman\"", size: 9, weight: "normal", style: "normal", decoration: "none" };
  tune.formatting.tabgracefont = { face: "\"Times New Roman\"", size: 7, weight: "normal", style: "normal", decoration: "none" };
}

module.exports = setGuitarFonts;
