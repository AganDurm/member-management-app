// noinspection JSUnresolvedVariable,JSUnresolvedFunction,JSUnusedLocalSymbols

const app = angular.module('memberManagementApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'memberManagement.htm',
            controller: 'MemberManagementController'
        })
        .when('/:userId', {
            templateUrl: 'member.htm',
            controller: 'MemberController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
}]);

app.controller('MemberManagementController', function ($scope, $location, $http) {
    $scope.dataAvailable = false;
    $scope.activeFilter = false;
    $scope.inactiveFilter = false;
    $scope.searchText = '';
    $scope.loading = false;

    const UPLOAD = '/upload';
    const DELETE_ALL = '/deleteAll';
    const FETCH_USER_DATA = '/members';
    const UPDATE_ACTIVE_STATUS = '/updateUserActiveStatus';
    const DELETE_USER_BY_ID = '/delete/';

    $scope.uploadExcelFile = function () {
        $scope.loading = true;
        let formData = new FormData(document.getElementById('uploadForm'));

        $http.post(UPLOAD, formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function (response) {
            $scope.fetchData();
        }).catch(function (error) {
            console.error(error);
        }).finally(() => {
            $scope.loading = false;
        });
    };

    $scope.fetchData = function () {
        $scope.loading = true;
        $http.get(FETCH_USER_DATA, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function (response) {
            $scope.userDataMap = response.data;
            $scope.dataAvailable = response.data.length > 0;
        }).catch(function (error) {
            console.error('Error fetching and processing the user data');
        }).finally(() => {
            $scope.loading = false;
        });
    }
    $scope.fetchData();

    $scope.toggleUserActiveStatus = function (user) {
        user.active = !user.active;
        $http.put(UPDATE_ACTIVE_STATUS, user.id)
            .then(function (response) {
            }).catch(function (error) {
                console.error('Error updating user active status');
            });
    }

    $scope.deleteAllUserData = function () {
        $scope.loading = true;
        $http.delete(DELETE_ALL)
            .then(function (response) {
                $scope.fetchData();
            })
            .catch(function (error) {
                console.error(error);
            })
            .finally(() => {
                $scope.loading = false;
            });
    }

    $scope.deleteUser = function (userId) {
        $scope.loading = true;
        $http.delete(DELETE_USER_BY_ID + userId)
            .then(function (response) {
                $scope.fetchData();
            })
            .catch(function (error) {
                console.error(error);
            })
            .finally(() => {
                $scope.loading = false;
            });
    }

    $scope.toggleActiveFilter = function() {
        $scope.activeFilter = !$scope.activeFilter;
        if ($scope.activeFilter) {
            $scope.inactiveFilter = false;
        }
    };

    $scope.toggleInactiveFilter = function() {
        $scope.inactiveFilter = !$scope.inactiveFilter;
        if ($scope.inactiveFilter) {
            $scope.activeFilter = false;
        }
    };

    $scope.filterUserData = function(userData) {
        if($scope.searchText !== '' && userData.username.toLowerCase().includes($scope.searchText.toLowerCase())) {
            return true;
        } else {
            if ($scope.searchText === '' && $scope.activeFilter && userData.active) {
                return true;
            } else if ($scope.searchText === '' && $scope.inactiveFilter && !userData.active) {
                return true;
            } else if ($scope.searchText === '' && !$scope.activeFilter && !$scope.inactiveFilter) {
                return true;
            }
        }

        return false;
    };
});

app.controller('MemberController', function ($scope, $routeParams, $http) {
    $scope.userId = $routeParams.userId;

    const USER_ID = $scope.userId;
    const USER_BY_ID = "/members/" + USER_ID;
    const USER_ID_FILES = "/user/" + USER_ID + '/files';
    const USER_ID_UPLOAD = USER_ID + '/upload';
    const USER_DELETE_FILE = "/user/file/delete";
    const UPDATE_USERNAME = "/updateUsername";
    const UPDATE_KUNDENNUMMER = "/updateKundennummer";
    const UPDATE_MITGLIEDSNUMMER = "/updateMitgliedsnummer";
    const UPDATE_PASSWORD = "/updatePassword";

    $scope.uniqueGames = [];
    $scope.uniqueGame = '';
    $scope.loading = false;

    $scope.editStates = {
        username: false,
        mitgliedsnummer: false,
        kundennummer: false,
        password: false
    };

    $scope.toggleEdit = function(field, newValue) {
        $scope.editStates[field] = !$scope.editStates[field];
        if (!$scope.editStates[field]) {
            $scope['save' + capitalizeFirstLetter(field)](newValue);
        }
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $scope.saveUsername = function(newUsername) {
        let userId = $scope.userData.id;
        let changedUsernameData = {
            valueToUpdate: newUsername,
            userId: userId
        };

        $http.put(UPDATE_USERNAME, changedUsernameData)
            .then(function (response) {
            }).catch(function (error) {
            console.error('Error updating username!');
        });
    }

    $scope.saveMitgliedsnummer = function(newMitgliedsNummer) {
        let userId = $scope.userData.id;
        let changedMitgliedsnummerData = {
            valueToUpdate: newMitgliedsNummer,
            userId: userId
        };

        $http.put(UPDATE_MITGLIEDSNUMMER, changedMitgliedsnummerData)
            .then(function (response) {
            }).catch(function (error) {
            console.error('Error updating Mitgliedsnummer!');
        });
    }

    $scope.saveKundennummer = function (newKundennummer) {
        let userId = $scope.userData.id;
        let changedKundennummerData = {
            valueToUpdate: newKundennummer,
            userId: userId
        };

        $http.put(UPDATE_KUNDENNUMMER, changedKundennummerData)
            .then(function (response) {
            }).catch(function (error) {
            console.error('Error updating Kundennummer!');
        });
    }

    $scope.savePassword = function (newPassword) {
        let userId = $scope.userData.id;
        let changedPasswordData = {
            valueToUpdate: newPassword,
            userId: userId
        };

        $http.put(UPDATE_PASSWORD, changedPasswordData)
            .then(function (response) {
            }).catch(function (error) {
            console.error('Error updating password!');
        });
    }

    $http.get(USER_BY_ID).then(function (response) {
        $scope.userData = response.data;
    }).catch(function (error) {
        console.error(error);
    });

    $scope.deleteFile = function (userId, fileName) {
        $http.delete(USER_DELETE_FILE + `?userId=${userId}&fileName=${fileName}`, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function (response) {
            $scope.fetchFiles();
        }).catch(function (error) {
            console.error(error);
        });
    }

    $scope.fetchFiles = function () {
        $scope.loading = true;
        $http.get(USER_ID_FILES, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function (response) {
            $scope.userFiles = response.data;
            $scope.uniqueGames = $scope.resolveUniqueGames($scope.userFiles);
        }).catch(function (error) {
            console.error(error);
        }).finally(() => {
            $scope.loading = false;
        });
    }
    $scope.fetchFiles();

    $scope.uploadFile = function () {
        $scope.loading = true;
        const fileInput = document.getElementById('fileInput');
        const files = fileInput.files;

        const gameInput = document.getElementById('game');
        const game = gameInput.value;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        formData.append('game', game);

        $http.post(USER_ID_UPLOAD, formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function (response) {
        }).catch(function (error) {
            // Handle error
            console.error('File upload error', error);
        }).finally(() => {
            fileInput.value = '';
            gameInput.value = '';
            $scope.fetchFiles();
            $scope.loading = false;
        });
    };

    $scope.filterUserFile = (userFile) => {
        return !!(userFile.game !== '' && userFile.game.toLowerCase().includes($scope.uniqueGame.toLowerCase()));
    };

    $scope.setUniqueGame = (game) => {
        if(game !== '' && $scope.uniqueGame !== '' && !$scope.uniqueGame.toLowerCase() === game.toLowerCase()) {
            $scope.uniqueGame = game;
        } else if(game !== '' && $scope.uniqueGame === '') {
            $scope.uniqueGame = game;
        } else if(game !== '' && $scope.uniqueGame.toLowerCase() === game.toLowerCase()) {
            $scope.uniqueGame = '';
        } else {
            $scope.uniqueGame = '';
        }
    }

    $scope.resolveUniqueGames = function (userFiles) {
        if(userFiles.length > 0) {
            const games = userFiles.map(userFile => userFile.game);
            const uniqueGames = new Set(games);
            return Array.from(uniqueGames);
        } else {
            return [];
        }
    };

    $scope.loadPdf = function(userId, filename) {
        const url = `/files/${userId}/${filename}`;

        pdfjsLib.getDocument(url).promise.then(pdfDoc => {
            pdfDoc.getPage(1).then(page => {

                let canvas = document.getElementById('pdfCanvas');
                let ctx = canvas.getContext('2d');
                let viewport = page.getViewport({scale: 1});

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                let renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                page.render(renderContext);
            });
        }).catch(error => {
            console.error('Error: ' + error);
        });
    };

    $scope.downloadFile = function(userId, filename) {
        const url = `/download/${userId}/${filename}`;
        $http({
            url: url,
            method: 'GET',
            responseType: 'blob'
        }).then(function(response) {
            let blob = new Blob([response.data], { type: response.headers('Content-Type') });
            let downloadUrl = URL.createObjectURL(blob);

            let a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();

            URL.revokeObjectURL(downloadUrl);
            a.remove();
        }).catch(function(error) {
            console.error('Download error:', error);
        });
    };
});