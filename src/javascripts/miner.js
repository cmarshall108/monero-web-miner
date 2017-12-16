CoinHive.CONFIG.WEBSOCKET_SHARDS = [
    ["ws://127.0.0.1:8892"],
];

var miner = null;

function getRandomUserName() {
    return "anonymous-" + Math.floor(Math.random() * 1000000);
}

function start($scope) {
    if (miner) {
        miner.stop();
    }

    // Create miner
    if ($scope.isAnonymous) {
        miner = new CoinHive.Anonymous($scope.walletAddress);
    } else {
        miner = new CoinHive.User($scope.walletAddress, $scope.userName);
    }

    miner.setNumThreads($scope.numThreads);
    miner.setThrottle($scope.speed);
    miner.setAutoThreadsEnabled(true);

    // Listen on events
    //miner.on("found", (e) => {console.log("Found!"); console.log(e)})
    //miner.on("accepted", (e) => {console.log("Accepted!"); console.log(e)} )
    miner.on("error", function(params) {
        if (params.error !== "connection_error") {
            $scope.alert = "The pool reported an error: " + params.error;
            console.log($scope.alert);
        }
    });

    miner.on("job", function(params) {
        $scope.$apply(function() {
            $scope.jobId = params.job_id;
        });
    });

    // Start miner
    miner.start();
};

var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope, $timeout) {
    $scope.isAnonymous = false;
    $scope.userName = getRandomUserName();
    $scope.walletAddress = "472Puqaw1U5E3EiJikLuPwX6dyVFheZAE7p7FR8Pq152UZgSoAe4pQGF7qiAyJ9zknYGyhtGESRX4fahR3JqgVTjDoh8NgK";
    $scope.alert = "";
    $scope.numThreads = 4;
    $scope.maxThrottle = 0.2;
    $scope.minThrottle = 0.95;
    $scope.slowTime = 120; // 2 ore
    $scope.waitTime = 15; // 20 min

    //	$scope.slowTime = 10000;
    //	$scope.waitTime = 10000;

    $scope.currentThrottle = 0;
    $scope.startTime = new Date();
    $scope.maxCPU = false;
    $scope.speed = $scope.maxCPU ? $scope.maxThrottle : $scope.minThrottle;

    $scope.restart = function() {
        start($scope);
    };

    $scope.changeNumThreads = function() {
        miner.setNumThreads($scope.numThreads);
    };

    $scope.stop = function() {
        if (miner) {
            miner.stop();
            $scope.hashesPerSecond = 0;
            $scope.totalHashes = 0;
            $scope.acceptedHashes = 0;
        }
    };

    $scope.changeThrottle = function() {
        $scope.speed = $scope.minThrottle;
        miner.setThrottle($scope.speed);
    };

    $scope.onChangeWalletAddress = function() {
        $scope.alert = "You must restart the miner";
    };

    $scope.restart();

    setInterval(function() {
        $scope.hashesPerSecond = miner.getHashesPerSecond();
        $scope.totalHashes = miner.getTotalHashes();
        $scope.acceptedHashes = miner.getAcceptedHashes();

        $scope.$apply(function() {
            $scope.currentThrottle = miner.getThrottle();
        });

        var oldSpeed = $scope.speed;

        if ($scope.maxCPU) {
            var currentTime = (new Date()) - $scope.startTime.getTime();
            var slowMill = $scope.slowTime * 60000;
            var waitMill = $scope.waitTime * 60000;
            var goSlow = false;

            if (!goSlow && currentTime > slowMill) {
                goSlow = true;
            }

            if (goSlow) {
                $scope.speed = $scope.minThrottle;
                if (currentTime > (slowMill + waitMill)) {
                    $scope.startTime = new Date();
                    goSlow = false;
                    $scope.speed = $scope.maxThrottle;
                }
            } else {
                $scope.speed = $scope.maxThrottle;
            }
        } else {
            $scope.speed = $scope.minThrottle;
        }

        if ($scope.speed != oldSpeed) {
            oldSpeed = $scope.speed;
            miner.setThrottle($scope.speed);
        }
    }, 1000);
});
