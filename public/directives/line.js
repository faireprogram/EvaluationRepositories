(function(global) {

    'use strict';
    var main_module = global.main_module;

    // Uncomment to style it like Apple Watch
    var opts = {
        chart: {
            type: 'column',
            options3d: {
                enabled: false,
                alpha: 10,
                beta: 25,
                depth: 50
            }
        },
        colors: [
            "#f03333", "#445878","#F6F792", "#436EEE", "#00C5CD","#8A0917", "#00FF00", "#ED9121"
        ],
        title: {
            text: 'Daily Message Data'
        },
        subtitle: {
            text: null
        },
        plotOptions: {
            line: {
                depth: 25
            }
        },
        xAxis: {
            // categories: Highcharts.getOptions().lang.shortWeeks
            categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

        },
        yAxis: {
            title: {
                text: 'message  amount'
            }
        }
        // series: [{
        //     name: 'Room1',
        //     data: [2, 3, 9, 4, 3, 5, 1]
        // }, {
        //     name: 'Room2',
        //     data: [4, 2, 1, 4, 1, 2, 1]
        // }, {
        //     name: 'Room3',
        //     data: [4, 2, 2, 4, 5, 3, 3]
        // }, {
        //     name: 'Room4',
        //     data: [5, 12, 2, 4, 2, 0, 3]
        // }, {
        //     name: 'Room5',
        //     data: [9, 8, 9, 6, 4, 15, 11]
        // }, {
        //     name: 'Room6',
        //     data: [2, 3, 1, 14, 8, 2, 9]
        // }]
    };

    main_module.directive('chartDirective', function() {
        return {
            controller: ['$scope', '$http', '$q',
                function($scope, $http, $q) {
                    var defer = $q.defer();
                    $http.post('api/roomStatistics/week').success(function(datas) { 
                        var series = [];
                        for(var roomId in datas) {
                            var data = [];
                            datas[roomId].forEach(function(room) {
                                data.push(room.count);
                            });

                            var room = {
                                name: roomId,
                                data: data
                            };
                            series.push(room);
                        };
                        opts.series = series;
                        defer.resolve(opts);
                    });

                    $scope.promise = defer.promise;
                }
            ],

            link: function(scope, element, attr) {
                scope.promise.then(function(opts) {
                    opts.chart.renderTo = element[0];
                    Highcharts.chart(opts);
                })
            }
        };
    });
})(this);
