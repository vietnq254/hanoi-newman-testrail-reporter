/**
 * Search for all applicable test cases
 * @param title
 * @returns {any}
 */
module.exports.titleToCaseIds = function titleToCaseIds(title) {
    var caseIds = [];
    const testCaseIdRegExp = /\bT?C(\d+)\b/g;
    let match;
    while ((match = testCaseIdRegExp.exec(title)) !== null) {
        caseIds.push(match[1]);
    }
    return caseIds;
}

/**
 * Search for defect
 * @param title: contains pattern 'postman-defect=<Defect_id>', i.e 'postman-defect=NCT-1234'
 * @returns {any}
 */
module.exports.titleToDefectId = function titleToDefectId(title) {
    const defectIdRegExp = /\bpostman-defect=(\w+-\d+)\b/gm;
    let match;
    while ((match = defectIdRegExp.exec(title)) !== null) {
        return match[1];
    }
    return undefined;
}