var app = angular.module('collabApp', []);

var init = function () {
    gapiService.initGapi(postInitiation);
}

app.controller('interactionController', function ($scope) {

    $scope.rows = [];
    $scope.messageContent = 'content';
    $scope.onlineUserCount = 0;
    $scope.onlineUserCountString = "";

    var postInitiation = function () {
        // load all your assets
    }

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

        var callback_j2h3l4kjhdlaks = function (event) {
            // get the value of the input
            var value = $cell[0].innerHTML;

            var cell = {};
            cell.row = row;
            cell.col = col;
            cell.value = value;

            $scope.saveCellContent(row, col, value);
        };

        $cell.blur(callback_j2h3l4kjhdlaks);
    }

    /**
     * Simple function to request the backend to print the peers list.
     */
    $scope.printPeersList = function () {

    }


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

    }

    $scope.setupGoogleAPI = function () {

        $.getScript("https://apis.google.com/js/api.js", function () {

            // Load the Realtime API, no auth needed.
            gapi.load('auth:client,drive-realtime,drive-share', start);

            function start() {
                var doc = gapi.drive.realtime.newInMemoryDocument();
                var model = doc.getModel();
                var collaborativeString = model.createString();
                collaborativeString.setText('Welcome to the Quickstart App!');
                model.getRoot().set('demo_string', collaborativeString);
                wireTextBoxes(collaborativeString);
                document.getElementById('json_button').addEventListener('click', function () {
                    document.getElementById('json_textarea').value = model.toJson();
                });
            }

            // Connects the text boxes to the collaborative string.
            function wireTextBoxes(collaborativeString) {
                var textArea1 = document.getElementById('text_area_1');
                var textArea2 = document.getElementById('text_area_2');
                gapi.drive.realtime.databinding.bindString(collaborativeString, textArea1);
                gapi.drive.realtime.databinding.bindString(collaborativeString, textArea2);
            }

        });
    }

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
    }

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
    }

    /**
     * Update the online user counter and trigger a UI update.
     * @param message
     */
    $scope.updateOnlineUserCount = function (message) {
        console.log("We received a new online user count");
        console.log(message);
        $scope.onlineUserCount = message.content;
        $scope.onlineUserCountString = $scope.onlineUserCount + " online users";
        $scope.$apply();
    }

    /**
     * Start the process to save a cell value in the backend.
     * @param row
     * @param column
     * @param value
     */
    $scope.saveCellContent = function (row, column, value) {
        var fem = FrontEndMessaging.getInstance();
        var cell = {};
        cell.row = row;
        cell.col = column;
        cell.value = value;
        var msg = MessagePassing.MessageToBack(MessagePassing.MessageTypes.NEW_CELL_VALUE, cell);
        fem.sendMessage(msg);
    }

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
                $scope.saveCellContent(randomRow, randomCol, value);
            } else {
                window.clearInterval($scope.interval);
            }

        };

        $scope.interval = setInterval(intervalFunction, test.frequency);
    }

    console.log("Hello!");
    $scope.setupSpreadsheet();
});