angular.module('modelCompanyApp').
directive('companyBar', ['$window', 'ObjectService',
    function($window, ObjectService) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                attribute: "@",
                average: "=",
                format: "@",
                label: "@",
                mess: "@",
                national: "=",
                sort: "@"
            },
            link: function(scope, element, attrs) {
                var svg;

                scope.$watch('data', function(newVal) {
                    if (newVal && scope.sort !== "order") {
                        render(newVal);
                    }
                    else if (newVal && scope.national && scope.sort)
                        render(newVal);
                });


                angular.element($window).bind('resize', function() {
                    if (svg && scope.data) {
                        element.empty();
                        render(scope.data);
                    }
                })

                function render(data) {
                    data = ObjectService.construct(data, scope.attribute, scope.mess);
                    // data = _.reject(data, function(d) {
                    //     return d.label === "NA";
                    // });

                    data = _.sortBy(data, function(d) {
                        return scope.sort === "order" ? _.find(scope.national, function(e) { return e.label === d.label; }).order : d.label;
                    });

                    var margin, width, height, x, y;
                    if ($(window).width() < 786) {
                        margin = {
                            top: 2,
                            right: 10,
                            bottom: 2,
                            left: 60
                        }     
                    }
                    else {
                        margin = {
                            top: 2,
                            right: 10,
                            bottom: 2,
                            left: 80
                        }
                    }


                    var barHeight = 30;
                    var elemWidth = $('.container-fluid').width();
                    var elemHeight = barHeight;
                    width = elemWidth - margin.left - margin.right;
                    height = elemHeight - margin.top - margin.bottom;

                    var calcdWidth = 0;
                    _.each(data, function(d) {
                        calcdWidth += d.value;
                    })

                    var scaler = width / calcdWidth;
                    _.each(data, function(d) {
                        d.value = d.value * scaler;
                    })

                    svg = d3.select(element[0]).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .direction('n')
                        .offset([2, 0])
                        .html(function(d) { 
                            var m = Math.round(d.value/scaler) === 1 ? " man, " : " men, ";
                            return d.label.toUpperCase() + " | " +
                                Math.round(d.value/scaler) + m + Math.round(d.percentage)+"%"; 
                        });
                    svg.call(tip);

                    svg.append("text")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("dy", function(d) {
                            return barHeight / 2 + 2;
                        })
                        .attr("dx", function(d) {
                            return $(window).width() < 786 ? -3 : -10
                        })
                        .attr("class", "lbl-xs")
                        .attr("text-anchor", "end")
                        .text(scope.label);

                    var runner = 0;
                    var item = svg.selectAll(".bar-item")
                        .data(data).enter().append("g")
                        .attr("transform", function(d) {
                            var value = angular.copy(runner);
                            runner += d.value;
                            return "translate(" + value + "," + 0 + ")";
                        });

                    item.append("rect")
                        .attr("class", "bar")
                        .attr("fill", function(d, i) {
                            return d.color;
                        })
                        .attr("x", 0)
                        .attr("width", function(d) {
                            return d.value;
                        })
                        .attr("y", 0)
                        .attr("height", barHeight)
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide);
                }
            }
        }
    }
])
