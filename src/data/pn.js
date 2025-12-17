import data from "./programme_mmi.json" ;

let pn = [];

for (let cmp of data) {
    pn.push(data[cmp]);
}


pn.getLevelIndex = function(accode) {
    return accode.charAt(2);
};

pn.getSkillIndex = function(accode) {
    return accode.charAt(3);
};

pn.getACIndex = function(accode) {
    return accode.charAt(6);
};

pn.getLibelle = function(accode) {
    let skill = pn.getSkillIndex(accode) -1;
    let level = pn.getLevelIndex(accode) -1;
    let ac = pn.getACIndex(accode) -1;

    return pn[skill].niveaux[level].acs[ac].libelle;
};


export { pn };