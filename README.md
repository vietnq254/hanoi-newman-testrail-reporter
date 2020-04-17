# TestRail Reporter for newman

[![version](https://img.shields.io/npm/v/newman-reporter-testrail-e2e.svg)](https://www.npmjs.com/package/newman-reporter-testrail-e2e)
[![downloads](https://img.shields.io/npm/dt/newman-reporter-testrail-e2e.svg)](https://www.npmjs.com/package/newman-reporter-testrail-e2e)
[![MIT License](https://img.shields.io/github/license/vietnq254/newman-reporter-testrail-e2e.svg)](https://github.com/vietnq254/newman-reporter-testrail-e2e/blob/master/README.md)

Publishes [newman](https://github.com/postmanlabs/newman/) runs on TestRail.

## Install
> The installation should be global if Newman is installed globally, local otherwise. (Replace -g from the command below with -S for a local installation)

```shell
$ npm install -g newman-reporter-testrail-e2e
```

## Usage

### Prefix all test assertions you wish to map with the test number.
Include the letter C. You may map more than one test case to an assertion.
```Javascript
pm.test("C226750 C226746 Status code is 200", function () {
    pm.response.to.have.status(200);
});
```
Add defect ID for specific test:
```Javascript
// pattern 'postman-defect=<defect_id>'
pm.test("C226750 C226746 Status code is 200 postman-defect=NCT-1234", function () {
    pm.response.to.have.status(200);
});
```
### Export the following environment variables.

| Environment Variable | Description |
| --- | --- |
| TESTRAIL_DOMAIN | Domain name of your TestRail instance (e.g. _instance.testrail.com_). |
| TESTRAIL_USERNAME | TestRail username / email. |
| TESTRAIL_PASSWORD | TestRail password or [API key](http://docs.gurock.com/testrail-api2/accessing#username_and_api_key). |
| TESTRAIL_PROJECT_ID | TestRail project id. |
| TESTRAIL_RUN_ID (optional) | TestRail run id.  Update a specific run instead of creating a new run. If this variable is not set then a new TestRun will be created. |
| TESTRAIL_SUITE_ID (optional) |TestRail suite id. |
| TESTRAIL_RUN_NAME (optional) |New TestRun name. It is used in case no TESTRAIL_RUN_ID. |
| CUSTOM_COMMENT (optional) |Custom comment. It is be added with error comment for test result. |

### Run newman with the reporter option
`-r testrail-e2e`

Example:

```shell
TESTRAIL_DOMAIN=example.testrail.com
TESTRAIL_USERNAME=user_name
TESTRAIL_PASSWORD=password_or_key
TESTRAIL_PROJECT_ID=99
TESTRAIL_RUN_ID=20

newman run collection.json -r testrail-e2e
```

## TestRail Settings

To increase security, the TestRail team suggests using an API key instead of a password. You can see how to generate an API key [here](http://docs.gurock.com/testrail-api2/accessing#username_and_api_key).

If you maintain your own TestRail instance on your own server, it is recommended to [enable HTTPS for your TestRail installation](http://docs.gurock.com/testrail-admin/admin-securing#using_https).

For TestRail hosted accounts maintained by [Gurock](http://www.gurock.com/), all accounts will automatically use HTTPS.

You can read the whole TestRail documentation [here](http://docs.gurock.com/).

## Author

NGUYEN Viet - [github](https://github.com/vietnq254)

## License

This project is licensed under the [MIT license](/LICENSE).

## Acknowledgments

* [billylamv](https://github.com/billylam), author of the [newman-reporter-testrail](https://github.com/billylam/newman-reporter-testrail) repository that was cloned.