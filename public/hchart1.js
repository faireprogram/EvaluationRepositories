(function() {
    // Uncomment to style it like Apple Watch
    var opts = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'weekly message statistics'
        },
        colors: [
            "#f03333", "F6F792", "#436EEE", "#00C5CD", "#00FF00", "#ED9121"
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
        },
        series: [{
            name: 'Brands',
            data: [{
                name: 'room1',
                y: 56.33
            }, {
                name: 'room2',
                y: 24.03
            }, {
                name: 'room3',
                y: 10.38
            }, {
                name: 'room4',
                y: 4.77
            }, {
                name: 'room5',
                y: 0.91
            }, {
                name: 'Temp rooms',
                y: 0.2
            }]
        }]
    };

    function callback() {
        //
        //        // Move icon
        //        this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8])
        //            .attr({
        //                'stroke': '#FFCC33',
        //                'stroke-linecap': 'round',
        //                'stroke-linejoin': 'round',
        //                'stroke-width': 2,
        //                'zIndex': 10
        //            })
        //            .translate(190, 26)
        //            .add(this.series[2].group);
        //
        //        // Exercise icon
        //        this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8]) //, 'M', 8, -8, 'L', 16, 0, 8, 8])
        //            .attr({
        //                'stroke': '#FFCC33',
        //                'stroke-linecap': 'round',
        //                'stroke-linejoin': 'round',
        //                'stroke-width': 2,
        //                'zIndex': 10
        //            })
        //            .translate(190, 61)
        //            .add(this.series[2].group);
        //
        //        // Stand icon
        //        this.renderer.path(['M', 0, 8, 'L', 0, -8, 'M', -8, 0, 'L', 0, -8, 8, 0])
        //            .attr({
        //                'stroke': '#FFCC33',
        //                'stroke-linecap': 'round',
        //                'stroke-linejoin': 'round',
        //                'stroke-width': 2,
        //                'zIndex': 10
        //            })
        //            .translate(190, 96)
        //            .add(this.series[2].group);
    };
    angular.module('main')
        .service('myChartUtil', function() {
            this.extendDeep = function() {
                angular.forEach(arguments, function(obj) {
                    if (obj !== dst) {
                        angular.forEach(obj, function(value, key) {
                            if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                                extendDeep(dst[key], value);
                            } else {
                                dst[key] = value;
                            }
                        });
                    }
                });
                return dst;
            }
        })
        .directive('chartSecond', function(myChartUtil) {
            return {
                link: function(scope, element, attr) {
                    console.log('chart link', angular.element(element));
                    opts.chart.renderTo = element[0];
                    if (attr.theme) {
                        opts = myChartUtil.extendDeep(opts, {
                            chart: {
                                backgroundColor: 'white'
                            },
                            colors: ['#F62366', '#9DFF02', '#0CCDD6'],
                            title: {
                                style: {
                                    color: 'silver'
                                }
                            },
                            tooltip: {
                                style: {
                                    color: 'silver'
                                }
                            }
                        });
                        console.log(opts);
                    }
                    console.log('chart dir init', opts);
                    Highcharts.chart(opts, callback);
                }
            }
        });
})();
