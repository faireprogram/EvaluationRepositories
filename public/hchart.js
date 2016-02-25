(function() {
    // Uncomment to style it like Apple Watch
    var opts = {
        chart: {
            type: 'column',
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 25,
                depth: 50
            }
        },
        title: {
            text: 'Weekly Chat Traffic Statisitcs'
        },
        subtitle: {
            text: 'Take a look, did you study this week?'
        },
        plotOptions: {
            column: {
                depth: 25
            }
        },
        xAxis: {
           // categories: Highcharts.getOptions().lang.shortWeeks
                       categories: ['Mon', 'Tus', 'Wed', 'Thur', 'Fri','Sat','Sun']

        },
        yAxis: {
            title: {
                text:'message  amount'
            }
        },
        series: [{
            name: 'Room1',
            data: [2, 3, 9, 4, 3, 5, 1]
        },{
            name:'Room2',
            data: [4,2, 1, 4, 1, 5, 1]
        },{
            name:'Room3',
            data: [4,2,2, 4, 1, 5, 3]
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
        .directive('chartDirective', function(myChartUtil) {
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