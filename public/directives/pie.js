(function(global) {


    'use strict';
    var main_module = global.main_module;

    // Uncomment to style it like Apple Watch
    var opts = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Weekly Message Distribution'
        },
        colors: [
            "#f03333", "#F6F792", "#436EEE", "#00C5CD", "#00FF00", "#ED9121"
        ],
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        }
    };

    main_module.directive('chartSecond', function(UtilService) {
        return {
            controller: ['$scope', '$http', '$q',
                function($scope, $http, $q) {
                    var defer = $q.defer();
                    $http.post('api/roomStatistics/weekTotal').success(function(datas) {
                        var series = [];
                        datas.forEach(function(data) {
                            series.push({
                                name: data.rid,
                                y: data.count
                            });
                        });
                        opts.series = [{
                            name: 'Total',
                            data: series
                        }];
                        defer.resolve(opts);
                        console.log('xxxx');
                    });
                    $scope.promise = defer.promise;
                }
            ],
            link: function(scope, element, attr) {
                scope.promise.then(function(opts) {
                    opts.chart.renderTo = element[0];
                    Highcharts.chart(opts);
                });
            }
        }
    });
})(this);