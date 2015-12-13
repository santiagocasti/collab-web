function initGAPI() {
    angular.element(document).ready(function () {
        console.log("initGAPI function after loading api.js");
        window.init();
    });
}

app.controller('interactionController', ['$scope', "$window", function ($scope, $window) {

    $scope.rows = [];
    $scope.crdtMap = {};
    $scope.realtimeUtils = undefined;
    $scope.messageContent = 'content';
    $scope.onlineUserCount = 0;
    $scope.onlineUserCountString = "";

    $window.init = function () {
        $scope.$apply($scope.loadDriveAPI());
    };

    $scope.getReplicaIdentityString = function () {
        return getRandomInt(1, 1000000) + '.' + (new Date().getTime());
    };

    $scope.replicaIdentifier = $scope.getReplicaIdentityString();

    $scope.handleAuth = function () {

        var CLIENT_ID = '1077685420865-3ja0alihhchqinibd4p5ft9lpr9svp9j.apps.googleusercontent.com';
        //var SCOPES = "https://www.googleapis.com/auth/drive.file";

        $scope.realtimeUtils = new utils.RealtimeUtils({clientId: CLIENT_ID});

        authorize();

        function authorize() {
            console.log("0");
            $scope.realtimeUtils.authorize(function (response) {
                console.log("1");
                if (response.error) {
                    console.log("2");
                    var button = document.getElementById('auth_button');
                    button.classList.add('visible');
                    button.addEventListener('click', function () {
                        $scope.realtimeUtils.authorize(function () {
                            $scope.start();
                        }, true);
                    });
                } else {
                    console.log("3");
                    $scope.start();
                }
            }, false);
        }
    };

    $scope.start = function () {
        var id = $scope.realtimeUtils.getParam('id');
        if (id) {
            console.log("We got a valid fileID: " + id);
            $scope.realtimeUtils.load(id.replace('/', ''), $scope.fileLoaded, $scope.fileInitialize);
        } else {
            $scope.realtimeUtils.createRealtimeFile('New Quickstart File', function (createResponse) {
                window.history.pushState(null, null, '?id=' + createResponse.id);
                $scope.realtimeUtils.load(createResponse.id, $scope.fileLoaded, $scope.fileInitialize);
            });
        }
    };


    $scope.loadDriveAPI = function () {
        gapi.load("auth:client,drive-realtime,drive-share", function () {
            console.log("Google Drive API loaded!");
            $scope.handleAuth();
        });
    };

    $scope.fileInitialize = function (model) {
        console.log("file initialize");
        $scope.crdtMap = model.createMap({});
        model.getRoot().set('demo_map', $scope.crdtMap);
        $scope.hookUpEventListener();
    };

    $scope.fileLoaded = function (doc) {
        console.log("file loaded");
        $scope.crdtMap = doc.getModel().getRoot().get('demo_map');
        $scope.hookUpEventListener();
        $scope.$apply($scope.updateRowsModel($scope.crdtMap.items()));
    };

    $scope.hookUpEventListener = function () {
        $scope.crdtMap.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, function (event) {

            if (event.isLocal == true) {
                console.log("local change");
            } else {
                console.log("Map values changed:");
                console.log($scope.crdtMap.items());
                $scope.$apply($scope.updateRowsModel($scope.crdtMap.items()));
            }
        });
    };

    $scope.updateRowsModel = function (items) {
        var row, col, value, finalValue, register;
        items.forEach(function (element) {
            finalValue = '';
            console.log(element);
            row = element[0].split('-')[0];
            col = element[0].split('-')[1];

            register = CRDT.newRegisterFromJSON(element[0], element[1]);
            value = register.getValue();
            console.log("row[" + row + "] col[" + col + "] = " + value);

            if (value.length == 1) {
                finalValue = value[0];
            } else {
                value.forEach(function (val) {
                    finalValue = finalValue + val + '|';
                });
            }

            $scope.rows[row][col].value = finalValue;
        });

    };

    /**
     * When a cell is clicked this method sets up the "editing mode"
     * and all the necessary callbacks to handle it.
     * @param row
     * @param col
     */
    $scope.cellClicked = function (row, col) {

        if (col == 0) {
            log("Ignoring this column because it's the one that indicates the numbers");
            return;
        }

        console.log("Cell clicked [" + row + "," + col + "]");

        // get the cell
        var $cell = $("#cell" + row + "-" + col);

        var callback_j2h3l4kjhdlaks = function () {
            // get the value of the input
            var value = $cell[0].innerHTML;

            var id = row + '-' + col;

            var register;
            if (typeof $scope.crdtMap.id == 'undefined') {
                register = $scope.crdtMap.id;
            } else {
                register = CRDT.newRegister(id);
            }
            /** @register MVRegister */
            register.setValue($scope.replicaIdentifier, value);

            $scope.replicate(id, register);
        };

        $cell.blur(callback_j2h3l4kjhdlaks);
    };

    $scope.replicate = function (id, register) {
        // set the value in the collaborative map
        console.log("We should replicate [ " + id + " => " + register.toJSON() + "]");
        $scope.crdtMap.set(id, register.toJSON());
        console.log($scope.crdtMap);
    };

    /**
     * Simple function to request the backend to print the peers list.
     */
    $scope.printPeersList = function () {

    };


    /**
     * Method that just sets up the cells values
     */
    $scope.setupSpreadsheet = function () {

        var i;
        var cell0;
        for (i = 0; i < 15; ++i) {

            cell0 = $scope.rows.length + 1;

            $scope.rows[$scope.rows.length] = [
                {'value': cell0, 'row': i, 'col': 0, 'edit': false},
                {'value': " ", 'row': i, 'col': 1, 'edit': false},
                {'value': " ", 'row': i, 'col': 2, 'edit': false},
                {'value': " ", 'row': i, 'col': 3, 'edit': false},
                {'value': " ", 'row': i, 'col': 4, 'edit': false},
                {'value': " ", 'row': i, 'col': 5, 'edit': false},
                {'value': " ", 'row': i, 'col': 6, 'edit': false},
                {'value': " ", 'row': i, 'col': 7, 'edit': false},
                {'value': " ", 'row': i, 'col': 8, 'edit': false}
            ]
        }

    };

    /**
     * Function to determine the cell styling based on the position.
     * @param row
     * @param column
     * @returns {string}
     */
    $scope.getCellClass = function (row, column) {
        if (column !== 0) {
            return "tg-031e";
        } else {
            return "tg-afp9";
        }
    };

    /**
     * Update the cell value on the controller, and trigger a UI update.
     * @param content
     */
    $scope.updateCell = function (content) {

        var value;
        content.forEach(function (cell) {
            value = "";
            if (typeof cell.value == 'string' ||
                    typeof cell.value == 'number') {
                value = cell.value;
            } else if (cell.value.length == 1) {
                value = cell.value[0];
            } else {
                cell.value.forEach(function (element) {
                    value = value + element + " | ";
                });
            }

            $scope.rows[cell.row][cell.col].value = value;

            console.log("Updating cell [" + cell.row + "," + cell.col + "] with value [" + value + "]");

        });
        $scope.$apply();
    };

    /**
     * Run a test editing random cells with random values.
     * @param test
     */
    $scope.runTest = function (test) {

        console.log("Starting a new test:");
        console.log(test);

        var intervalFunction = function () {

            if (test.numUpdates > 0) {
                test.numUpdates -= 1;

                var randomCol = getRandomInt(1, 8);
                var randomRow = getRandomInt(1, 14);
                var value = test.numUpdates;

                console.log("[" + new Date().getTime() + "] Updating cell [" + (randomRow + 1) + "," + randomCol + "] = " + value);

                var cell = {};
                cell.col = randomCol;
                cell.row = randomRow;
                cell.value = value;

                $scope.updateCell([cell]);
                //$scope.saveCellContent(randomRow, randomCol, value);
            } else {
                window.clearInterval($scope.interval);
            }

        };

        $scope.interval = setInterval(intervalFunction, test.frequency);
    };

    $scope.setupSpreadsheet();
}]);