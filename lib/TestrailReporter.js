const moment = require('moment');
const request = require('sync-request');
const chalk = require('chalk');
const shared = require("./shared.js");

class TestRailReporter {
    constructor(emitter) {
        const results = [];
        let requestObj = null;

        emitter.on('beforeDone', (err, args) => {
            console.log('\n', chalk.magenta.underline.bold('(TestRail Reporter)'));
            if (results.length > 0) {
                const domain = process.env.TESTRAIL_DOMAIN;
                const username = process.env.TESTRAIL_USERNAME;
                const apikey = process.env.TESTRAIL_PASSWORD;
                const projectId = process.env.TESTRAIL_PROJECT_ID;
                const suiteId = process.env.TESTRAIL_SUITE_ID;
                const auth = Buffer.from(`${username}:${apikey}`).toString('base64');
                let runId = process.env.TESTRAIL_RUN_ID;
                let title = process.env.TESTRAIL_RUN_NAME || `Automated test run ${moment().format('DD-MM-YYYY HH:mm:ss')}`;

                if (!domain) {
                    console.log("missing 'TESTRAIL_DOMAIN' env variable");
                    return;
                }
                if (!username) {
                    console.log("missing 'TESTRAIL_USERNAME' env variable");
                    return;
                }
                if (!apikey) {
                    console.log("missing 'TESTRAIL_PASSWORD' env variable");
                    return;
                }
                if (!projectId) {
                    console.log("missing 'TESTRAIL_PROJECT_ID' env variable");
                    return;
                }

                let response;
                if (!runId) {
                    // Add a new test run if no run id was specified
                    response = request('POST', `https://${domain}/index.php?/api/v2/add_run/${projectId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Basic ${auth}`,
                        },
                        json: {
                            name: title,
                            suite_id: suiteId,
                        },
                    });
                    if (response.statusCode == 200) {
                        runId = JSON.parse(response.getBody()).id;
                    }
                    else {
                        console.error(response.getBody());
                        return;
                    }
                }

                // Add results
                response = request('POST', `https://${domain}/index.php?/api/v2/add_results_for_cases/${runId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Basic ${auth}`,
                    },
                    json: {
                        results,
                    },
                });
                if (response.statusCode == 200) {
                    console.log('\n', " - Results are published to " + chalk.magenta("https://" + domain + "/index.php?/runs/view/" + runId), '\n');
                } else {
                    console.error(response.getBody());
                    return;
                }
            } else {
                console.error('\nnewman-reporter-testrail-e2e: No test cases were found.');
            }
        });

        emitter.on('request', (err, args) => {
            requestObj = args.request;
        });

        emitter.on('assertion', (err, args) => {
            const customComment = process.env.CUSTOM_COMMENT;
            var caseIds = shared.titleToCaseIds(args.assertion);
            var defectId = shared.titleToDefectId(args.assertion);
            caseIds.forEach(caseId => {
                var lastResult = {
                    case_id: caseId,
                    status_id: (err) ? 5 : 1,
                };

                if (err) {
                    var errMsg = `# Postman result: #\n Script name: ${args.item.name}\nMethod     : ${requestObj.method}\nUrl        : ${requestObj.url}\n\nAssert: ${args.assertion}\nError : *${err.message}*`;
                    if (customComment !== undefined) {
                        errMsg = `${customComment}\n\n${errMsg}`;
                    }
                    lastResult.comment = errMsg;

                    if (defectId) {
                        lastResult.defects = defectId;
                    }
                };

                // If the user maps multiple matching TestRail cases,
                // we need to fail all of them if one fails
                const matchingResultIndex = results.findIndex(prevResult =>
                    prevResult.case_id === lastResult.case_id);
                if (matchingResultIndex > -1) {
                    if (lastResult.status_id === 5 && results[matchingResultIndex].status_id !== 5) {
                        results[matchingResultIndex] = lastResult;
                    }
                } else {
                    results.push(lastResult);
                }
            });
        });
    }
}

module.exports = TestRailReporter;
