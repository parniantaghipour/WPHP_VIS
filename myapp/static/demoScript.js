var selectedPoint;
var oldmousePosition;
var isdragging;
var path;
var circlesBetween;
var nextCircle;
var slope;
var isDragging_controller = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;
var timeline_hight = 200;
var peopele_timeline_hight = 400;
var compare_array = [];
var compare_index = 0;
var colors = ["#ff6752", "#386c74", "#44c6f2", "#8b2c83", "#4e98f3", "3a427d", "#abd533", "#65b651", "#5176f1", "#808080", "#cd3c3d"]
var spiral_flag = 0;
var timelineMargin = 30;
var year_changed = []
var people_timeline_open = 0;
var People_timeline_open_ids = []
var firm_timeline_open = 0;
var firm_timeline_open_ids = []
var publication_timeline_open = 0;
var publication_open_ids = []
var first_timeline = 100
var second_timeline = 550
var third_timeline = 950
var nullposition = 120
var downtitleposition = 1800
var triangles_year = "10";
controller1Cx = 600
controller2Cx = 700

// var textures = [
//     d3.patternLines().id("diagonal-lines").stroke("gray").background("none"),     // Diagonal lines texture
//     d3.patternDots().id("dots").radius(1).background("none").color("gray"),      // Dots texture
//     d3.patternCrosshatch().id("crosshatch").stroke("gray").background("none")    // Crosshatch texture
// ];


// svg.append("defs").selectAll("pattern")
//     .data(textures)
//     .enter().append("pattern")
//     .attr("id", function(d) { return d.id(); })
//     .attr("width", "8")
//     .attr("height", "8")
//     .call(function(pattern) { pattern.append("rect").attr("width", "8").attr("height", "8").attr("fill", "white"); })
//     .call(function(pattern) { pattern.append("path").attr("d", d3.path().moveTo(0, 0).lineTo(0, 8).lineTo(8, 0)).attr("stroke-width", "1").attr("stroke", "gray"); });

font_family = "Helvetica";
var margin = {
    top: 60,
    right: 20,
    bottom: 30,
    left: 50
},
    width = 1250 - margin.left - margin.right,
    height = 3000 - margin.top - margin.bottom;
var svg = d3.select("#timeline")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var svg2 = d3.select("#timeline")
    .append("svg")
    .attr("x", width + 10) // x coordinate
    .attr("y", 0)
    .attr("width", 700)
    .attr("height", height)
    .style("background-color", "white");// svg2.append("rect")
//     .attr("width", "100%")
//     .attr("height", "100%")
//     .style("background-color", "lightblue");
var yScale = d3.scaleTime()
    .domain([new Date("1650"), new Date("1836")])
    .range([120, 1710]);
var rectHeight = Math.floor(1500 / (1836 - 1665))
// headers and drop down filters
// var dropdown = svg2
//     .append('foreignObject')
//     .attr('x', 50)
//     .attr('y', 20)
//     .attr('width', 300)
//     .attr('height', 120)
// // var dropdown2 = svg2
// //     .append('foreignObject')
// //     .attr('x', 325)
// //     .attr('y', 20)
// //     .attr('width', 300)
// //     .attr('height', 40)

// // var dropdown3 = svg2
// //     .append('foreignObject')
// //     .attr('x', 625)
// //     .attr('y', 20)
// //     .attr('width', 300)
// //     .attr('height', 40)
var dropdown = svg2
    .append('foreignObject')
    .attr('x', 50)
    .attr('y', 125)
    .attr('width', 300)
    .attr('height', 25)
var dropdown2 = svg2
    .append('foreignObject')
    .attr('x', 50)
    .attr('y', 175)
    .attr('width', 300)
    .attr('height', 25)

var dropdown3 = svg2
    .append('foreignObject')
    .attr('x', 50)
    .attr('y', 225)
    .attr('width', 300)
    .attr('height', 25)
// Create a select element inside the dropdown menu container
svg2.append('text')
    .attr('x', 50) // set the x position
    .attr('y', 70) // set the y position
    .text('Filters')
    .style('font-size', '50px')
    .style('font-weight', 'bold') // make the text bold
    // .style('font-style', 'italic')
    .style("fill", colors[10])
    .style("opacity", 0.7);

svg2.append('text')
    .attr('x', 50) // set the x position
    .attr('y', 120) // set the y position
    .text('Persons')
    .style("fill", colors[10]);
var select = dropdown.append('xhtml:select')
    .style('width', '60%')
    .style('border-color', colors[7])
    .attr('class', 'persons_selector')
    .on('change', function () {
        var roleValue = d3.select(this).property('value');
        var selectedName = d3.select(this).property('selectedOptions')[0].textContent;
        var genreValue = d3.select('.genre_selector').property('value');
        var firmValue = d3.select('.firm_selector').property('value');
        // cite_update(roleValue, genreValue, firmValue);
    });
var genderSelect = dropdown.append('xhtml:select')
    .style('width', '40%')
    .attr('class', 'gender_selector')
    .style('border-color', colors[7])
    .on('change', function () {

        // cite_update(roleValue, genderValue, firmValue);
    });
svg2.append('text')
    .attr('x', 50) // set the x position
    .attr('y', 170) // set the y position
    .text('Titles')
    .style("fill", colors[10]);
var select2 = dropdown2.append('xhtml:select')
    .attr('class', 'genre_selector')
    .style('border-color', colors[8])
    .style('width', '100%')
svg2.append('text')
    .attr('x', 50) // set the x position
    .attr('y', 220) // set the y position
    .text('Firms')
    .style("fill", colors[10]);

var select3 = dropdown3.append('xhtml:select')
    .attr('class', 'firm_selector')
    .style('border-color', colors[3])
    .style('width', '100%')


var button = svg2.append("rect")
    .attr("x", 50)
    .attr("y", 275)
    .attr("width", 100)
    .attr("height", 30)
    .attr("fill", colors[10])
    .attr("rx", 15) // make the corners round
    .attr("ry", 15)
    .style("stroke", "white")
    .style("stroke-width", 2)
    .style("opacity", 0.5)
    .style("cursor", "pointer") // make it appear clickable
    .on("click", function () {
        var roleValue = d3.select('.persons_selector').property('value');
        var genreValue = d3.select('.genre_selector').property('value');
        var firmValue = d3.select('.firm_selector').property('value');
        var genderValue = d3.select('.gender_selector').property('value');
        cite_update(roleValue, genreValue, firmValue, genderValue);
    })
buttonTXT = svg2.append("text")
    .text("Filter")
    .style("pointer-events", "none")
    .attr("x", +button.attr("x") + (+button.attr("width") / 2))
    .attr("y", +button.attr("y") + (+button.attr("height") / 2))
    .attr("fill", colors[10])
    .attr("font-size", "16px")
    .attr("text-anchor", "middle")
    .style('font-weight', 'bold') // make the text bold
    .attr("alignment-baseline", "middle")
    .attr("dominant-baseline", "middle");

var foreignObjdetail = svg2.append("foreignObject")
    .attr("x", 50)
    .attr("y", 425)
    .attr("width", 600)
    .attr("height", 1800);




var filterdata1 = [
    { value: '0', name: 'All Roles' },
    { value: '1', name: 'Author' },
    { value: '2', name: 'Publisher' },
    { value: '3', name: 'Bookseller' },
    { value: '4', name: 'Printer' },
    { value: '5', name: 'Editor' },
    { value: '6', name: 'Translator' },
    { value: '7', name: 'Engraver' },
    { value: '9', name: 'Introducer' },
    { value: '10', name: 'Illustrator' },
    { value: '11', name: 'Compiler' },
    { value: '12', name: 'Composer' },
    { value: '13', name: 'Contributor' },
    // { value: '14', name: 'Donor' },
    // { value: '15', name: 'Former Owner' },
    // { value: '16', name: 'Copyright Holder' },
    // { value: '17', name: 'Dedicatee' },
    // { value: '18', name: 'Associated Name' },
    // { value: '19', name: 'Associated Name' },
    // { value: '20', name: 'Stereotyper' },
    // { value: '21', name: 'Binding Designer' },
    // { value: '22', name: 'Binder' },
    // { value: '23', name: 'Adopter' },
    // { value: '24', name: 'Lithographer' },
    // { value: '25', name: 'Cartographer' },
    // { value: '26', name: 'Printer Of Plates' },
    // { value: '27', name: 'Licensor' },
    // { value: '28', name: 'Sculptor' },
    // { value: '29', name: 'Publisher Of Plates' },
    // { value: '30', name: 'Proprietor' },
    // { value: '31', name: 'Artist' },
    // { value: '32', name: 'Plaintiff' }
    // { value: '33', name: 'Papermaker' }
];

var genre_filter_data = [
    { value: '0', name: 'All Genre' },
    { value: '1', name: 'Fiction' },
    { value: '2', name: 'Fiction Novel' },
    { value: '3', name: 'Fiction Tale' },
    { value: '4', name: 'Fiction Story' },
    { value: '5', name: 'Poetry' },
    { value: '6', name: 'Poetry Lyric' },
    { value: '7', name: 'Poetry Collection' },
    { value: '8', name: 'Poetry Dramatic' },
    { value: '9', name: 'Poetry Epic' },
    { value: '10', name: 'Drama' },
    { value: '11', name: 'Science/Natural History/Medicine' },
    { value: '12', name: 'Music' },
    { value: '13', name: 'Education' },
    { value: '14', name: 'Travel/Tourism/Topography' },
    { value: '16', name: 'History' },
    { value: '18', name: 'Juvenile Literature' },
    { value: '19', name: 'Unknown' },
    { value: '21', name: 'Domestic' },
    { value: '22', name: 'Letters' },
    { value: '23', name: 'Essays' },
    { value: '24', name: 'Biography' },
    { value: '25', name: 'Memoirs' },
    { value: '26', name: 'Fiction Romance' },
    { value: '27', name: 'Works' },
    { value: '29', name: 'Religion/Biblical' },
    { value: '31', name: 'Political Writing' },
    { value: '34', name: 'Miscellany' },
    { value: '38', name: 'Catalogue/Advertisement/Prospectus/Directory/List' },
    { value: '40', name: 'Legal' },
    { value: '43', name: 'Annual Periodical' },
    { value: '44', name: 'Literary Criticism/Critical Editions' }
];
var gender_filter_data = [
    { value: '0', name: 'All Gender' },
    { value: '1', name: 'Female' },
    { value: '2', name: 'Male' },
    { value: '3', name: 'Undefined' },

];
var genrecolors = {
    '0': 'gray',
    '1': 'purple',
    '2': 'blue',
    '3': 'green',
    '4': '#ffd866',
    '5': 'orange',
    '6': 'pink',
    '7': 'teal',
    '8': 'cyan',
    '9': 'magenta',
    '10': 'red',
    '11': 'brown',
    '12': 'lime',
    '13': 'indigo',
    '14': 'olive',
    '16': 'navy',
    '18': 'silver',
    '19': 'black',
    '21': 'maroon',
    '22': 'aqua',
    '23': 'coral',
    '24': 'gold',
    '25': 'lavender',
    '26': 'salmon',
    '27': 'tan',
    '29': 'crimson',
    '31': 'darkgreen',
    '34': 'darkorange',
    '38': 'darkslategray',
    '40': 'darkviolet',
    '43': 'sienna',
    '44': 'slateblue'
};
var personRoleColors = {
    '1': 'red',
    '2': 'indigo',
    '3': '#ffd866',
    '4': 'green',
    '5': 'blue',
    '6': 'purple',
    '7': 'pink',
    '8': 'teal',
    '9': 'cyan',
    '10': 'magenta',
    '11': 'brown',
    '12': 'gray'
};
var firmRoleColors = {
    '1': 'red',
    '2': 'indigo',
    '3': 'green',
    '4': '#ffd866'
};
function getColor(value) {
    return personRoleColors[value] || 'gray';
}
function getfirmColor(value) {
    return firmRoleColors[value] || 'gray';

}
var firm_filter_data = [
    { value: '0', name: 'All Roles' },
    { value: '1', name: 'Unknown' },
    { value: '2', name: 'Publisher' },
    { value: '3', name: 'Printer' },
    { value: '4', name: 'Bookseller' }
];

var legendData = [
    { color: 'red', role: 'Author' },
    { color: 'indigo', role: 'Publisher' },
    { color: '#ffd866', role: 'Bookseller' },
    { color: 'green', role: 'Printer' },
    { color: 'blue', role: 'Editor' },
    { color: 'purple', role: 'Translator' },
    { color: 'pink', role: 'Engraver' },
    { color: 'teal', role: 'Introducer' },
    { color: 'cyan', role: 'Illustrator' },
    { color: 'magenta', role: 'Compiler' },
    { color: 'brown', role: 'Composer' },
    { color: 'gray', role: 'Contributor' }
];

var firmLegendData = [
    { color: 'red', role: 'Unknown' },
    { color: 'indigo', role: 'Publisher' },
    { color: 'green', role: 'Printer' },
    { color: 'yellow', role: 'Bookseller' }
];
var patternLegend = [
    { gender : "Woman", pattern:"url(#diagonal-stripe-2-white) " },
    { gender : "Man", pattern:"url(#diagonal-stripe-1-white) " },
    { gender : "Unknown", pattern:"url(#crosshatch-white)" }
]
// .style("fill", function (d, i) {
//     if (d.people_name == "[Woman]") {
//         return "url(#diagonal-stripe-2) " + colors[7]
//     }
//     else if (d.people_name == "[Man]") {
//         return "url(#diagonal-stripe-1)"
//     }
//     else if (d.people_name == null) {
//         return "url(#crosshatch)"
//     }
// })
var LegendG = svg2.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(400, 50)");

var legendItems = LegendG.selectAll(".legend-item")
    .data(legendData)
    .enter()
    .append("g")
    .attr("class", "legend-item");


legendItems.append("rect")
    .attr("x", 0)
    .attr("y", function (d, i) { return i * 30; }) // Adjust the vertical position as needed
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", function (d) { return d.color; });

// Append the label
legendItems.append("text")
    .attr("x", 30)
    .attr("y", function (d, i) { return i * 30 + 15; }) // Adjust the vertical position as needed
    .text(function (d) { return d.role; });

var LegendPatternG = svg2.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(500, 50)");

var legendpatternItems = LegendPatternG.selectAll(".legend-item2")
    .data(patternLegend)
    .enter()
    .append("g")
    .attr("class", "legend-item2");


legendpatternItems.append("rect")
    .attr("x", 0)
    .attr("y", function (d, i) { return i * 30; }) // Adjust the vertical position as needed
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", function (d) { return d.pattern; });

// Append the label
legendpatternItems.append("text")
    .attr("x", 30)
    .attr("y", function (d, i) { return i * 30 + 15; }) // Adjust the vertical position as needed
    .text(function (d) { return d.gender; });


select3.selectAll('option')
    .data(firm_filter_data)
    .enter()
    .append('option')
    .attr('value', function (d) {
        return d.value;
    })
    .text(function (d) {
        return d.name;
    })
    .on('click', function (d) {
        // Do something when an option is clicked
        console.log('Clicked:', d.name);
    });
select2.selectAll('option')
    .data(genre_filter_data)
    .enter()
    .append('option')
    .attr('value', function (d) {
        return d.value;
    })
    .text(function (d) {
        return d.name;
    })
    .on('click', function (d) {
        // Do something when an option is clicked
        console.log('Clicked:', d.name);
    });

select.selectAll('option')
    .data(filterdata1)
    .enter()
    .append('xhtml:option')
    .attr('value', function (d) {
        return d.value;
    })
    .text(function (d) {
        return d.name;
    })
    .on('click', function (d) {
        // Do something when an option is clicked
        console.log('Clicked:', d.name);
    });
genderSelect.selectAll('option')
    .data(gender_filter_data)
    .enter()
    .append('xhtml:option')
    .attr('value', function (d) {
        return d.value;
    })
    .text(function (d) {
        return d.name;
    })
    .on('click', function (d) {
        // Do something when an option is clicked
        console.log('Clicked:', d.name);
    });
// Create the axis for the timeline
const axis = d3.axisRight(yScale)
    .tickFormat(d3.format("y"));


/////////////////////////////////////////////
// data = d3.json('http://127.0.0.1:8000/all-book-by-year/?start_year=1700&end_year=1837').then(function (response) {
//     // Log the response data to the console
//     // console.log(response.books_by_year);
//     data = response.books_by_year;
//     draw2(data);
// });
function draw2(data) {
    var sizeScale = d3.scaleLinear()
        .domain([1, 180])
        .range([10, 80])
    var year_bookSel = svg.selectAll(".book")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "book-year");

    var year_bookCircles = year_bookSel.append("rect")
        .attr("x", function (d) {

            return 550 - (sizeScale(d.size) / 2)
        })
        .attr("y", function (d) {
            if (d.year == "empty" || d.year == null || d.year == "" || d.year == "null") {
                return nullposition - (rectHeight / 2);
            }
            return yScale(new Date(d.year.substring(0, 4))) - 3;
        })
        .attr("width", function (d) {
            return sizeScale(d.size)
        })
        .attr("height", rectHeight)
        // .append("circle")
        .attr("class", "book")
        .attr("data-click-count", 0)
        .style("cursor", "pointer") // make it appear clickable
        .attr("year", function (d) { return d.year })
        .attr("id", function (d) {
            return "book_year_circle" + d.year;
        })
        // .attr("cx", 450)
        // .attr("cy", function (d) {
        //     if (d.year ==  "empty"){
        //         return 60;
        //     } 
        //     console.log("print", d.year.substring(0, 4), yScale(new Date(d.year.substring(0, 4))));
        //     return yScale(new Date(d.year.substring(0, 4)));
        // })
        // .attr("r", function (d) {
        //     return sizeScale(d.size)
        // })
        .style("fill", colors[8])
        .attr("opacity", 0.7)
        .on("mouseover", function (e, d) {
            create_the_paths_publication(d)
        })
        .on("mouseout", function (d) {
            d3.selectAll("#path").remove()
        })
        .on("click", function (e, d) {
            circleY = +d3.select(this).attr("y") + rectHeight / 2
            circleID = d3.select(this).attr("id")
            year = d3.select(this).attr("year")
            if (d3.select(this).attr("data-click-count") == 0) {
                showPubs(d.books, parseFloat(circleY), circleID, d.year);
                // year_changed.push(d.year)
                var yearFound = false;

                for (var i = 0; i < year_changed.length; i++) {
                    if (year_changed[i].year === d.year) {
                        year_changed[i].count++; // If year already exists, increment the count
                        yearFound = true;
                        break;
                    }
                }

                if (!yearFound) {
                    year_changed.push({ year: d.year, count: 1 }); // If year does not exist, add it to the year_changed array
                }
                d3.select(this).attr("data-click-count", 1)
            }
            else if (d3.select(this).attr("data-click-count") == 1) {
                // year_changed = year_changed.filter(function (yearIn) {
                //     return yearIn !== d.year;
                // });
                if (year == triangles_year) {
                    svg.selectAll("#polygon").remove();
                    svg.selectAll("#polygon_people").remove();
                    d3.selectAll("foreignObject")
                        .selectAll("p")
                        .style("font-weight", "normal");
                }
                year_changed.forEach(function (yearObj) {
                    if (yearObj.year === d.year) {
                        if (yearObj.count === 1) {
                            hideWindows(d.firms, parseFloat(circleY) + 3, circleID);
                            year_changed = year_changed.filter(function (item) {
                                return item !== yearObj;
                            });
                        } else {
                            related_foreignObject = svg.selectAll("foreignObject")
                                .filter(function () {
                                    return d3.select(this).attr("id") === circleID;
                                }).remove();
                            yearObj.count--;
                        }
                        return; // Exit the loop
                    }
                });
                d3.select(this).attr("data-click-count", 0)
            }
        })


}

////////////////////////////////////

var linesizeScale = d3.scaleLog()
    .domain([1, 100])
    .range([2, 5])



function pushDown(circleY) {
    circleY = circleY + .5
    d3.selectAll("[class^='person-timeline-text']")
        .filter(function () {
            return +d3.select(this).attr("y") > circleY;
        }).attr("tranform", function () {
            var text = d3.select(this);
            var currentTransform = text.attr("transform");
            var existingY = parseFloat(currentTransform.split(",")[2].trim());
            var newY = existingY + 100;
            newTransform = currentTransform.replace(existingY, newY)
            text.attr("transform", newTransform);
        })
    d3.selectAll("[class^='firm-timeline-text']")
        .filter(function () {
            return +d3.select(this).attr("y") > circleY;
        }).attr("tranform", function () {
            var text = d3.select(this);
            var currentTransform = text.attr("transform");
            var existingY = parseFloat(currentTransform.split(",")[2].trim());
            var newY = existingY + 100;
            newTransform = currentTransform.replace(existingY, newY)
            text.attr("transform", newTransform);
        })
    console.log("test veeruson ")
    svg.selectAll("text")
        .filter(function () {
            console.log(d3.select(this).node().parentNode)
            return +d3.select(this).attr("y") > circleY;
        }).transition()
        .duration(500)
        .attr("y", function () {
            return (+d3.select(this).attr("y") + 100)
        })
    helperpath = d3.selectAll("[class^='pathfixed']").filter(function () {
        var path = d3.select(this).node(); // Get the DOM node of the path element
        var startPoint = path.getPointAtLength(0); // Get the start point of the path
        var endPoint = path.getPointAtLength(1);
        return +startPoint.y > circleY;
    }).attr("transform", function () {
        var path = d3.select(this);
        var pathData = path.attr("d");
        console.log("pathData", pathData)
        var regex = /(\d+\.?\d*),(\d+\.?\d*)/g;
        var matches = pathData.match(regex);
        console.log("matches", matches)
        if (matches && matches.length === 2) {
            var coords = matches.map(function (match) {
                var parts = match.split(",");
                return [parseFloat(parts[0]), parseFloat(parts[1])];
            });

            var newCoords = coords.map(function (coord) {
                return [coord[0], coord[1] + 100];
            });

            var newPathData = "M " + newCoords[0][0] + "," + newCoords[0][1] + " L " + newCoords[1][0] + "," + newCoords[1][1];

            path.transition()
                .duration(500)
                .attr("d", newPathData);
        }
    });

    d3.selectAll("[class^='person-timeline-path']")
        .filter(function () {
            var path = d3.select(this).node(); // Get the DOM node of the path element
            // var pathLength = path.getTotalLength(); // Get the total length of the path

            var startPoint = path.getPointAtLength(0); // Get the start point of the path
            var endPoint = path.getPointAtLength(1);
            return +startPoint.y > circleY;
        }).attr("tranform", function () {
            var path = d3.select(this);

            var currentTransform = path.attr("transform"); // Get the current transform attribute value
            if (currentTransform) {
                var existingY = parseFloat(currentTransform.split(",")[1].trim());
                var newY = existingY + 100;
                newTransform = currentTransform.split(",")[0] + "," + newY.toString() + ")"
                path.transition()
                    .duration(500).attr("transform", newTransform);
            } else {
                path.transition()
                    .duration(500).attr("transform", "translate(0,100)");
            }
        })
    d3.selectAll("[class^='firm-timeline-path']")
        .filter(function () {
            var path = d3.select(this).node(); // Get the DOM node of the path element
            // var pathLength = path.getTotalLength(); // Get the total length of the path

            var startPoint = path.getPointAtLength(0); // Get the start point of the path
            var endPoint = path.getPointAtLength(1);
            return +startPoint.y > circleY;
        }).attr("tranform", function () {
            var path = d3.select(this);

            var currentTransform = path.attr("transform"); // Get the current transform attribute value
            if (currentTransform) {
                var existingY = parseFloat(currentTransform.split(",")[1].trim());
                var newY = existingY + 100;
                newTransform = currentTransform.split(",")[0] + "," + newY.toString() + ")"
                path.transition()
                    .duration(500).attr("transform", newTransform);
            } else {
                path.transition()
                    .duration(500).attr("transform", "translate(0,100)");
            }
        })

    d3.selectAll("[class^='person-timeline-path']")
        .filter(function () {
            var path = d3.select(this).node(); // Get the DOM node of the path element
            var pathLength = path.getTotalLength(); // Get the total length of the path

            var startPoint = path.getPointAtLength(0); // Get the start point of the path
            var endPoint = path.getPointAtLength(pathLength);
            return (+endPoint.y > circleY) && (+startPoint.y <= circleY);
        }).attr("tranform", function () {
            var path = d3.select(this);
            var pathData = path.attr("d");
            var regex = /L\s*(\d+),(\d+)/i;
            var match = regex.exec(pathData);
            var currentX = parseInt(match[1]);
            var currentY = parseInt(match[2]);
            // Calculate the new coordinates for the second point
            var newX = currentX; // Update the X-coordinate
            var newY = currentY + 100; // Update the Y-coordinate

            // Update the path data with the new coordinates
            var newPathData = pathData.replace(regex, `L ${newX},${newY}`);

            // Update the path with the modified path data
            path.transition()
                .duration(500).attr("d", newPathData);
        })
    d3.selectAll("[class^='firm-timeline-path']")
        .filter(function () {
            var path = d3.select(this).node(); // Get the DOM node of the path element
            var pathLength = path.getTotalLength(); // Get the total length of the path

            var startPoint = path.getPointAtLength(0); // Get the start point of the path
            var endPoint = path.getPointAtLength(pathLength);
            return (+endPoint.y > circleY) && (+startPoint.y <= circleY);
        }).attr("tranform", function () {
            var path = d3.select(this);
            var pathData = path.attr("d");
            var regex = /L\s*(\d+),(\d+)/i;
            var match = regex.exec(pathData);
            var currentX = parseInt(match[1]);
            var currentY = parseInt(match[2]);
            // Calculate the new coordinates for the second point
            var newX = currentX; // Update the X-coordinate
            var newY = currentY + 100; // Update the Y-coordinate

            // Update the path data with the new coordinates
            var newPathData = pathData.replace(regex, `L ${newX},${newY}`);

            // Update the path with the modified path data
            path.transition()
                .duration(500).attr("d", newPathData);
        })
    svg.selectAll("foreignObject")
        .filter(function () {
            return +d3.select(this).attr("y") + 100 > circleY;
        }).transition()
        .duration(500)
        .attr("y", function () {
            return (+d3.select(this).attr("y") + 100)
        })
    svg.selectAll("circle").filter(function (d) {
        return d3.select(this).attr("cy") > circleY;
    })
        .transition()
        .duration(500)
        .attr("cy", function () {
            return (+d3.select(this).attr("cy") + 100)
        });
    svg.selectAll("rect").filter(function (d) {
        return +d3.select(this).attr("y") + 3 > circleY;
    })
        .transition()
        .duration(500)
        .attr("y", function () {
            return (+d3.select(this).attr("y") + 100)
        });


    svg.selectAll("polygon").filter(function (d) {
        return d3.select(this).attr("points").split(/[, ]+/)[3] > circleY;
    })
        .transition()
        .duration(500)
        .attr("points", function (d) {


            let points = d3.select(this).attr("points");
            let pointArray = points.split(/[, ]+/);
            pointArray[1] = parseInt(pointArray[1]) + 100;
            pointArray[3] = parseInt(pointArray[3]) + 100;
            pointArray[5] = parseInt(pointArray[5]) + 100;
            console.log(pointArray)
            // join the modified point array back into a string
            return pointArray.join(",");

        })
}
function hideWindows(firsms, circleY, circleID,) {


    related_foreignObject = svg.selectAll("foreignObject")
        .filter(function () {
            return d3.select(this).attr("id") === circleID;
        }).remove();
    svg.selectAll("text")
        .filter(function () {
            return +d3.select(this).attr("y") > circleY;
        }).transition()
        .duration(500)
        .attr("y", function () {
            return (+d3.select(this).attr("y") - 100)
        });
    d3.selectAll("[class^='person-timeline-text']")
        .filter(function () {
            return +d3.select(this).attr("y") > circleY;
        }).attr("tranform", function () {
            var text = d3.select(this);
            var currentTransform = text.attr("transform");
            var existingY = parseFloat(currentTransform.split(",")[2].trim());
            var newY = existingY - 100;
            newTransform = currentTransform.replace(existingY, newY)
            text.attr("transform", newTransform);
        })
    d3.selectAll("[class^='firm-timeline-text']")
        .filter(function () {
            return +d3.select(this).attr("y") > circleY;
        }).attr("tranform", function () {
            var text = d3.select(this);
            var currentTransform = text.attr("transform");
            var existingY = parseFloat(currentTransform.split(",")[2].trim());
            var newY = existingY - 100;
            newTransform = currentTransform.replace(existingY, newY)
            text.attr("transform", newTransform);
        })
    helperpath = d3.selectAll("[class^='pathfixed']").filter(function () {
        var path = d3.select(this).node(); // Get the DOM node of the path element
        var startPoint = path.getPointAtLength(0); // Get the start point of the path
        var endPoint = path.getPointAtLength(1);
        return +startPoint.y > circleY;
    }).attr("transform", function () {
        var path = d3.select(this);
        var pathData = path.attr("d");
        console.log("pathData", pathData)
        var regex = /(\d+\.?\d*),(\d+\.?\d*)/g;
        var matches = pathData.match(regex);
        console.log("matches", matches)
        if (matches && matches.length === 2) {
            var coords = matches.map(function (match) {
                var parts = match.split(",");
                return [parseFloat(parts[0]), parseFloat(parts[1])];
            });

            var newCoords = coords.map(function (coord) {
                return [coord[0], coord[1] - 100];
            });

            var newPathData = "M " + newCoords[0][0] + "," + newCoords[0][1] + " L " + newCoords[1][0] + "," + newCoords[1][1];

            path.transition()
                .duration(500)
                .attr("d", newPathData);
        }
    });
    d3.selectAll("[class^='person-timeline-path']")
        .filter(function () {
            var path = d3.select(this).node(); // Get the DOM node of the path element
            var startPoint = path.getPointAtLength(0); // Get the start point of the path
            var endPoint = path.getPointAtLength(1);
            return +startPoint.y > circleY;
        }).attr("tranform", function () {
            var path = d3.select(this);

            var currentTransform = path.attr("transform"); // Get the current transform attribute value
            if (currentTransform) {
                var existingY = parseFloat(currentTransform.split(",")[1].trim());
                var newY = existingY - 100;
                newTransform = currentTransform.split(",")[0] + "," + newY.toString() + ")"
                path.transition()
                    .duration(500).attr("transform", newTransform);
            } else {
                path.transition()
                    .duration(500).attr("transform", "translate(0, -100)");
            }
        })
    d3.selectAll("[class^='firm-timeline-path']")
        .filter(function () {
            var path = d3.select(this).node(); // Get the DOM node of the path element
            var startPoint = path.getPointAtLength(0); // Get the start point of the path
            var endPoint = path.getPointAtLength(1);
            return +startPoint.y > circleY;
        }).attr("tranform", function () {
            var path = d3.select(this);

            var currentTransform = path.attr("transform"); // Get the current transform attribute value
            if (currentTransform) {
                var existingY = parseFloat(currentTransform.split(",")[1].trim());
                var newY = existingY - 100;
                newTransform = currentTransform.split(",")[0] + "," + newY.toString() + ")"
                path.transition()
                    .duration(500).attr("transform", newTransform);
            } else {
                path.transition()
                    .duration(500).attr("transform", "translate(0, -100)");
            }
        })
    d3.selectAll("[class^='person-timeline-path']")
        .filter(function () {
            var path = d3.select(this).node(); // Get the DOM node of the path element
            var pathLength = path.getTotalLength(); // Get the total length of the path

            var startPoint = path.getPointAtLength(0); // Get the start point of the path
            var endPoint = path.getPointAtLength(pathLength);
            return (+endPoint.y > circleY) && (+startPoint.y <= circleY);
        }).attr("tranform", function () {
            var path = d3.select(this);
            var pathData = path.attr("d");
            var regex = /L\s*(\d+),(\d+)/i;
            var match = regex.exec(pathData);
            var currentX = parseInt(match[1]);
            var currentY = parseInt(match[2]);
            // Calculate the new coordinates for the second point
            var newX = currentX; // Update the X-coordinate
            var newY = currentY - 100; // Update the Y-coordinate

            // Update the path data with the new coordinates
            var newPathData = pathData.replace(regex, `L ${newX},${newY}`);

            // Update the path with the modified path data
            path.transition()
                .duration(500).attr("d", newPathData);
        })
    d3.selectAll("[class^='firm-timeline-path']")
        .filter(function () {
            var path = d3.select(this).node(); // Get the DOM node of the path element
            var pathLength = path.getTotalLength(); // Get the total length of the path

            var startPoint = path.getPointAtLength(0); // Get the start point of the path
            var endPoint = path.getPointAtLength(pathLength);
            return (+endPoint.y > circleY) && (+startPoint.y <= circleY);
        }).attr("tranform", function () {
            var path = d3.select(this);
            var pathData = path.attr("d");
            var regex = /L\s*(\d+),(\d+)/i;
            var match = regex.exec(pathData);
            var currentX = parseInt(match[1]);
            var currentY = parseInt(match[2]);
            // Calculate the new coordinates for the second point
            var newX = currentX; // Update the X-coordinate
            var newY = currentY - 100; // Update the Y-coordinate

            // Update the path data with the new coordinates
            var newPathData = pathData.replace(regex, `L ${newX},${newY}`);

            // Update the path with the modified path data
            path.transition()
                .duration(500).attr("d", newPathData);
        })
    svg.selectAll("rect").filter(function (d) {
        return d3.select(this).attr("y") > circleY;
    })
        .transition()
        .duration(500)
        .attr("y", function () {
            return (+d3.select(this).attr("y") - 100)
        });
    svg.selectAll("circle").filter(function (d) {
        return +d3.select(this).attr("cy") > circleY;
    })
        .transition()
        .duration(500)
        .attr("cy", function () {
            return (+d3.select(this).attr("cy") - 100)
        })

    svg.selectAll("foreignObject")
        .filter(function () {
            return +d3.select(this).attr("y") > circleY;
        }).transition()
        .duration(500)
        .attr("y", function () {
            return (+d3.select(this).attr("y") - 100)
        })
    svg.selectAll("polygon").filter(function (d) {
        return d3.select(this).attr("points").split(/[, ]+/)[3] > circleY;
    })
        .transition()
        .duration(500)
        .attr("points", function (d) {

            let points = d3.select(this).attr("points");
            let pointArray = points.split(/[, ]+/);
            console.log(pointArray)
            pointArray[1] = parseInt(pointArray[1]) - 100;
            pointArray[3] = parseInt(pointArray[3]) - 100;
            pointArray[5] = parseInt(pointArray[5]) - 100;
            console.log(pointArray)
            // join the modified point array back into a string
            return pointArray.join(",");

        })

}
function showFirms(firms, circleY, circleID, year) {
    triangle_firm = svg.selectAll("polygon").filter(function (d) {
        return (d3.select(this).attr("year") == year) && (d3.select(this).attr("type") == "firm");
    })
    rectInRange = svg.selectAll("rect").filter(function (d) {
        return d3.select(this).attr("y") > circleY && d3.select(this).attr("y") < circleY + 99;
    })

    if (rectInRange.size() != 0) {
        pushDown(circleY + 3);

    }
    container = svg.append("foreignObject")
        .attr("class", "firms-list")
        .attr("id", circleID)
        .attr("x", third_timeline - 50)
        .attr("y", circleY + 6) // adjust the spacing between the divs as needed
        .attr("width", 200)
        .attr("height", 93)
        .style("z-index", 9999)
        .style("background-color", "white");

    firmsList = container.append("xhtml:div")
        .style("overflow", "auto")
        //   .style("background-color", "black")
        .style("width", "180 px")
        .style("height", "80px")
        .style("max-height", "200px")
        .style("border", `1px solid ${colors[3]}`)
        .style("padding", "5px")
        .attr("class", "firms-list")
        // .style("top", "30px") // adjust the top position as needed
        // .style("left", "20px") // adjust the left position as needed
        .style("overflow-y", "scroll") // add a scrollbar to the div\

    firmsItemsall = firmsList.selectAll("div")
        .data(firms)
        .enter()
        .append("div")
        .style("list-style-type", "none")
    // .style("display", "flex")
    // .style("align-items", "center");
    firmItems = firmsItemsall.append("div")
        .style("list-style-type", "none")
        .style("display", "flex")
        .style("align-items", "center");
    firmItems.append("p")
        .text(d => d.firm)
        .style("width", "150px")
        .style("cursor", "pointer") // make it appear clickable
        .style("font-family", font_family)
        .style("font-weight", "normal")
        .attr("class", function (d) {
            id = d.firm_id
            return "firms-name" + id.toString()
        })
        .attr("id", function (d) { return d.firm; })
        .attr("data-click-count", 0)
        .on("mouseover", function (e, d) {
            textBounding = d3.select(this).node().getBoundingClientRect();
            working_years = d.working_years
            var counts = countValues(working_years);
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            firstX = +textBounding.left;
            firstY = +textBounding.top + scrollTop;
            for (var key in counts) {
                secondY = +d3.select(" #book_year_circle" + key + ".book").attr("y")
                // const pathData = `M ${firstX},${firstY} Q ${(third_timeline + second_timeline) / 2},${+firstY + 3} ${second_timeline},${+secondY + 3}`;
                const pathData = `M ${firstX},${+firstY} 
                Q ${firstX + (second_timeline - firstX) / 3},${+firstY + 3} ${(firstX + second_timeline) / 2},${((+secondY) + (+firstY)) / 2 + 3} 
                Q ${firstX + (second_timeline - firstX) * 2 / 3},${+secondY + 3} ${second_timeline},${+secondY + 3}`;

                svg.append("path")
                    .attr("id", function (d, i) { return "path" })
                    .attr("d", pathData)
                    .attr("stroke", "black")
                    .attr("stroke", "url(#stroke-gradient)")
                    // .attr("stroke-dasharray", "4,4")
                    .attr("opacity", 0.7)
                    .attr("fill", "none")
                    .style("pointer-events", "none")
                    .attr("stroke-width", linesizeScale(counts[key]));
            }
        })
        .on("mouseout", function (d) {
            d3.selectAll("#path").remove()
        })
        .on("click", function (e, d) {
            if (d3.select(this).attr("data-click-count") == 0) {
                id = d.firm_id
                fullName = d.firm
                openPopupWindow(3, d.fullinformationfirm)
                position = second_timeline + 100 + firm_timeline_open * 20;
                if (d3.select(this).style("color") == "rgb(0, 0, 0)") {
                    selectedcolor = colors[0];
                } else {
                    selectedcolor = d3.select(this).style("color");
                }
                oneFirmTimeline(id.toString(), position, selectedcolor, circleY, fullName, 1800, circleID)
                firm_timeline_open_ids.push(id.toString())
                firm_timeline_open = firm_timeline_open + 1;
                d3.select(this).attr("data-click-count", 1)
            }
            else if (d3.select(this).attr("data-click-count") == 1) {
                id = d.firm_id
                oneFirmTimelineRemove(id.toString(), firm_timeline_open_ids)
                d3.select(this).attr("data-click-count", 0)
                firm_timeline_open = firm_timeline_open - 1;
                firm_timeline_open_ids = firm_timeline_open_ids.filter(function (openId) {
                    return openId !== id.toString();
                });
            }
        });
    firmItems.insert("input", "p + *")
        .attr("type", "color")
        .style("width", "20px")
        .style("height", "20px")
        .style("margin-left", "5px")
        .style("border-radius", "50%")
        .style("overflow", "hidden")
        .style("border", "none")
        .style("background-image", "conic-gradient(red, orange, yellow, green, blue, indigo, violet)")
        .style("background-size", "cover")
        .style("padding", "2")
        .style("appearance", "none")
        .style("outline", "none")
        .on("change", function (event, d) {
            id = d.firm_id
            const color = event.target.value;
            d3.select(this.parentNode).select("p")
                .style("color", color);
            // var myTimelineG = d3.selectAll(".person-timeline"+ id.toString());

            // Select all of the circles within that g element
            var myTimelineCircles = d3.selectAll(".firm_timeline_circle" + id.toString());
            d3.selectAll(".firm-timeline-text" + id.toString()).style("fill", color);
            // Change the color of the circles
            myTimelineCircles.style("fill", color);
            d3.json('http://127.0.0.1:8000/get_one_firm_book/?id_n=' + id.toString()).then(function (response) {
                // var sizeScale = d3.scaleLinear()
                //     .domain([1, 20])
                //     .range([2, 5])
                data = response.firm_books;
                max_year = response.max_value;
                min_year = response.min_value;
                for (let i = 0; i < data.length; i++) {
                    const year = data[i].year;
                    // const foreignObject = document.querySelector(`#fo_${year}`);
                    var foreignObject = d3.select("#" + "book_year_circle" + year.toString() + ".pubs-list");
                    // var specificP = foreignObj.select(".persons-name" + id.toString());

                    if (foreignObject) {
                        const bookList = data[i].bookList;

                        for (let j = 0; j < bookList.length; j++) {
                            const bookId = bookList[j].book[0];
                            // const book = document.querySelector(`#book_${bookId}`);
                            const book = foreignObject.select(".titles-name" + bookId.toString());
                            if (book) {
                                book.style("color", color)
                                // Change color to red
                            }
                        }
                    }
                }
            })
        });
    triangle_firm.each(function (d) {
        data = d
        firmList = data.firmList;
        for (let i = 0; i < firmList.length; i++) {
            const firmId = firmList[i].firm[0];


            const firm = container.select(".firms-name" + firmId.toString());
            if (firm) {
                firm.style("font-weight", "bold");
                if(firm.node() != null){
                    const foreignObjectElement = container.node();
                    const boldOptionPosition = firm.node().getBoundingClientRect();
                    const scrollTopPosition = +boldOptionPosition.y;
                    console.log(scrollTopPosition)
                    firmsList.node().scrollTo({top:scrollTopPosition - circleY, behavior: 'smooth' });
                }
            }
        }
    })
    // var peopletimelineItems = peopleItemsall.append("div");
    // const timelines = peopletimelineItems.append("svg")
    //     .attr("class", "timeline")
    //     .attr("width", 150)
    //     .attr("height", 20);
    // const groups = timelines.selectAll("g")
    //     .data(d => countValues(d.working_years))
    //     .enter()
    //     .append("g")


    // // Add a bar for each year with the height based on the number of publications
    // const bars = timelines.selectAll(".bar")
    //     .data(d => {
    //         return countValuesformatting(d.working_years)
    //     })
    //     .enter()
    //     .append("rect")
    //     .attr("class", "bar")
    //     .attr("x", (d, i) => {
    //         //   const index = peopleData[0].timeline.findIndex(x => x.year === d.key);
    //         //   return index * (circleRadius * 2 + circleSpacing);
    //         return i * 3;
    //     })
    //     .attr("y", d => 20 - (d.size * 3))
    //     .attr("width", 3)
    //     .attr("height", d => d.size * 3)
    //     .style("fill", colors[1]);

}
function showPubs(pubs, circleY, circleID, year) {
    circles_to_check = svg.selectAll("circle").filter(function (d) {
        return d3.select(this).attr("year") == year;
    })
    rectInRange = svg.selectAll("rect").filter(function (d) {
        return d3.select(this).attr("y") > circleY && d3.select(this).attr("y") < circleY + 99;
    })

    if (rectInRange.size() != 0) {
        pushDown(circleY);

    }
    container = svg.append("foreignObject")
        .attr("class", "pubs-list")
        .attr("id", circleID)
        .attr("x", second_timeline - 100)
        .attr("y", circleY + 6) // adjust the spacing between the divs as needed
        .attr("width", 200)
        .attr("height", 93)
        .style("z-index", 9999)
        .style("background-color", "white");

    pubsList = container.append("xhtml:div")
        .style("overflow", "auto")
        //   .style("background-color", "black")
        .style("width", "150 px")
        .style("height", "80px")
        .style("max-height", "93px")
        .style("border", `1px solid ${colors[8]}`)
        .style("padding", "5px")
        .attr("class", "pubs-list")
        // .style("top", "30px") // adjust the top position as needed
        // .style("left", "20px") // adjust the left position as needed
        .style("overflow-y", "scroll") // add a scrollbar to the div\

    pubsItemsall = pubsList.selectAll("div")
        .data(pubs)
        .enter()
        .append("div")
        .style("list-style-type", "none")
    // .style("display", "flex")
    // .style("align-items", "center");
    pubItems = pubsItemsall.append("div")
        .style("list-style-type", "none")
        .style("display", "flex")
        .style("align-items", "center");
    pubItems.append("p")
        .attr("year", year)
        .style("cursor", "pointer") // make it appear clickable
        .text(d => d[1])
        .attr("class", function (d) {
            id = d[0]
            return "titles-name" + id.toString()
        })
        .attr("id", function (d) { return d[0]; })
        .attr("data-click-count", 0)
        .style("font-family", font_family)
        .style("font-weight", "normal")
        .on("mouseover", function (e, d) {
            console.log(d);
            textBounding = d3.select(this).node().getBoundingClientRect();
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            firstX = +textBounding.right;
            // firstY = +textBounding.top + scrollTop;
            console.log(e)
            firstY = +e.pageY
            firstXleft = +textBounding.left;

            d3.json('http://127.0.0.1:8000/get_one_book/?id_n=' + d[0].toString()).then(function (response) {
                firm_roles = response.firm_roles
                people_role = response.people_role
                console.log("this book data ", people_role)
                const triangles = svg.selectAll("firmspath")
                    .data(firm_roles)
                    .enter()
                    .append("path")
                    .style("pointer-events", "none")
                    .attr("id", function (d, i) { return "firmspath" })
                    .attr("d", function (d) {
                        console.log(d)
                        year = d.year
                        firmsY = nullposition
                        if (year != "" && year != null && year != "null" && year.length == 4) {
                            // secondY = yScale(new Date(key))
                            firmsY = +d3.select(" #firm_circle" + year + ".firm").attr("y")
                        }
                        const pathData = `M ${firstX},${firstY + 3} Q ${(second_timeline + third_timeline) / 2},${+firstY + 3} ${third_timeline},${+firmsY + 3}`;
                        return pathData
                    })
                    // .attr("stroke", "black")
                    .attr("stroke", "url(#stroke-gradient)")
                    // .attr("stroke-dasharray", "4,4")
                    // .attr("opacity", 0.1)
                    .attr("fill", "none")
                    .attr("stroke-width", linesizeScale(d.size));
                const trianglespeople = svg.selectAll("peoplepath")
                    .data(people_role)
                    .enter()
                    .append("path")
                    .style("pointer-events", "none")
                    .attr("id", function (d, i) { return "peoplepath" })
                    .attr("d", function (d) {
                        console.log(d)
                        year = d.year
                        peopleY = nullposition
                        if (year != "" && year != null && year != "null" && year.length == 4 && year) {
                            // secondY = yScale(new Date(key))
                            peopleY = +d3.select(" #people_circle" + year + ".people").attr("y")
                            console.log(peopleY)
                        }
                        const pathData = `M ${firstXleft},${firstY + 3} Q ${(second_timeline + first_timeline) / 2},${+firstY + 3} ${first_timeline},${+peopleY + 3}`;
                        return pathData
                    })
                    // .attr("stroke", "black")
                    .attr("stroke", "url(#stroke-gradient)")
                    // .attr("stroke-dasharray", "4,4")
                    // .attr("opacity", 0.1)
                    .attr("fill", "none")
                    .attr("stroke-width", linesizeScale(d.size));
            })
        })
        .on("mouseout", function () {
            d3.selectAll("#peoplepath").remove()
            d3.selectAll("#firmspath").remove()


        })
        .on("click", function (e, d) {
            if (d3.select(this).attr("data-click-count") == 0) {
                triangles_year = d3.select(this).attr("year")
                console.log("triangles_year", triangles_year)
                svg.selectAll("#polygon").remove();
                svg.selectAll("#polygon_people").remove()
                d3.selectAll("foreignObject")
                    .selectAll("p")
                    .style("font-weight", "normal");
                id = d[0]
                // fullName = d.firm
                // position = 500 + firm_timeline_open * 20;
                // oneFirmTimeline(id.toString(), position, d3.select(this).style("color"), circleY, fullName)
                // firm_timeline_open_ids.push(id.toString())
                // firm_timeline_open = firm_timeline_open + 1;
                d3.json('http://127.0.0.1:8000/get_one_book/?id_n=' + id.toString()).then(function (response) {
                    openPopupWindow(2, response);
                    firm_roles = response.firm_roles
                    people_role = response.people_role
                    // var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    // firstX = +textBounding.right;
                    // firstY = +textBounding.top + scrollTop;
                    const trianglesfirms = svg.selectAll("polygon")
                        .data(firm_roles)
                        .enter()
                        .append("polygon")
                        .attr("year", d => d.year)
                        .attr("type", "firm")
                        .attr("id", function (d, i) { return "polygon" })
                        .attr("points", function (d) {
                            console.log(d)
                            year = d.year
                            firmsY = nullposition
                            if (year != "" && year != null && year != "null" && year.length == 4) {
                                // secondY = yScale(new Date(key))
                                firmsY = +d3.select(" #firm_circle" + year + ".firm").attr("y")
                            }
                            return `${third_timeline - 20},${firmsY - 2} ${third_timeline - 15},${firmsY + 3} ${third_timeline - 20},${firmsY + 8}`
                        })



                    const trianglespeople = svg.selectAll("polygon_people").data(people_role)
                        .enter()
                        .append("polygon")
                        .attr("year", d => d.year)
                        .attr("type", "people")
                        .attr("id", function (d, i) {
                            console.log("id")
                            return "polygon_people"
                        })
                        .attr("points", function (d) {
                            year = d.year
                            peopleY = nullposition
                            if (year != "" && year != null && year != "null" && year.length == 4 && year) {
                                // secondY = yScale(new Date(key))
                                peopleY = +d3.select(" #people_circle" + year + ".people").attr("y")
                            }
                            return `${first_timeline + 40},${peopleY - 2} ${first_timeline + 35},${peopleY + 3} ${first_timeline + 40},${peopleY + 8}`
                        })




                    for (let i = 0; i < firm_roles.length; i++) {
                        const year = firm_roles[i].year;
                        // const foreignObject = document.querySelector(`#fo_${year}`);
                        var foreignObject = d3.select("#" + "firm_circle" + year.toString() + ".firms-list");

                        // var specificP = foreignObj.select(".persons-name" + id.toString());

                        if (foreignObject) {
                            const firmList = firm_roles[i].firmList;
                            content = foreignObject.select(".firms-list")
                            for (let j = 0; j < firmList.length; j++) {
                                const firmId = firmList[j].firm[0];
                                // const book = document.querySelector(`#book_${bookId}`);
                                const firm = foreignObject.select(".firms-name" + firmId.toString());
                                console.log("book", firm)
                                if (firm) {
                                    firm.style("font-weight", "bold");
                                    if(firm.node() != null){
                                        const foreignObjectElement = container.node();
                                        const boldOptionPosition = firm.node().getBoundingClientRect();
                                        const scrollTopPosition = +boldOptionPosition.y;
                                        content.node().scrollTo({top:scrollTopPosition - circleY, behavior: 'smooth' });
                                    }
                                    
                                }
                            }
                        }
                    }
                    for (let i = 0; i < people_role.length; i++) {
                        const year = people_role[i].year;
                        // const foreignObject = document.querySelector(`#fo_${year}`);
                        var foreignObject = d3.select("#" + "people_circle" + year.toString() + ".writers-list");

                        // var specificP = foreignObj.select(".persons-name" + id.toString());

                        if (foreignObject) {
                            const personList = people_role[i].personList;
                            content = foreignObject.select(".writers-list")
                            for (let j = 0; j < personList.length; j++) {
                                const personId = personList[j].person[0];
                                // const book = document.querySelector(`#book_${bookId}`);
                                const person = foreignObject.select(".persons-name" + personId.toString());
                                if (person) {
                                    person.style("font-weight", "bold");
                                    if(person.node() != null){
                                        const foreignObjectElement = container.node();
                                        const boldOptionPosition = person.node().getBoundingClientRect();
                                        const scrollTopPosition = +boldOptionPosition.y;
                                        content.node().scrollTo({top:scrollTopPosition - circleY, behavior: 'smooth' });
                                    }
                                }
                            }
                        }
                    }
                })
                d3.select(this).attr("data-click-count", 1)
            }
            else if (d3.select(this).attr("data-click-count") == 1) {
                svg.selectAll("#polygon").remove();
                svg.selectAll("#polygon_people").remove()
                for (let i = 0; i < firm_roles.length; i++) {
                    const year = firm_roles[i].year;
                    // const foreignObject = document.querySelector(`#fo_${year}`);
                    var foreignObject = d3.select("#" + "firm_circle" + year.toString() + ".firms-list");

                    // var specificP = foreignObj.select(".persons-name" + id.toString());

                    if (foreignObject) {
                        const firmList = firm_roles[i].firmList;

                        for (let j = 0; j < firmList.length; j++) {
                            const firmId = firmList[j].firm[0];
                            // const book = document.querySelector(`#book_${bookId}`);
                            const firm = foreignObject.select(".firms-name" + firmId.toString());
                            console.log("book", firm)
                            if (firm) {
                                firm.style("font-weight", "normal");
                            }
                        }
                    }
                }
                for (let i = 0; i < people_role.length; i++) {
                    const year = people_role[i].year;
                    // const foreignObject = document.querySelector(`#fo_${year}`);
                    var foreignObject = d3.select("#" + "people_circle" + year.toString() + ".writers-list");

                    // var specificP = foreignObj.select(".persons-name" + id.toString());

                    if (foreignObject) {
                        const personList = people_role[i].personList;

                        for (let j = 0; j < personList.length; j++) {
                            const personId = personList[j].person[0];
                            // const book = document.querySelector(`#book_${bookId}`);
                            const person = foreignObject.select(".persons-name" + personId.toString());
                            if (person) {
                                person.style("font-weight", "normal");
                            }
                        }
                    }
                }
                d3.select(this).attr("data-click-count", 0)

            }

        });
    circles_to_check.each(function (d) {
        color = d3.select(this).style("fill");
        data = d
        bookList = data.bookList;
        for (let i = 0; i < bookList.length; i++) {
            const book = bookList[i].book;
            bookId = book[0]
            console.log(bookId)
            bookname = container.select(".titles-name" + bookId.toString());
            console.log(bookname)
            if (bookname) {
                bookname.style("color", color)
                // Change color to red
                if(bookname.node() != null){
                    const foreignObjectElement = container.node();
                    const boldOptionPosition = bookname.node().getBoundingClientRect();
                    const scrollTopPosition = +boldOptionPosition.y;
                    pubsList.node().scrollTo({top:scrollTopPosition - circleY, behavior: 'smooth' });
                }
            }
            // // const foreignObject = document.querySelector(`#fo_${year}`);
            // var foreignObject = d3.select("#" + "book_year_circle" + year.toString() + ".pubs-list");
            // console.log(foreignObject)
            // var specificP = foreignObj.select(".persons-name" + id.toString());

            // if (foreignObject) {
            //     const bookList = data[i].bookList;

            // for (let j = 0; j < bookList.length; j++) {
            //     const bookId = bookList[j].book[0];
            //     // const book = document.querySelector(`#book_${bookId}`);
            // const book = foreignObject.select(".titles-name" + bookId.toString());
            // console.log("book", book)
            // if (book) {
            //     book.style("color", color)
            //     // Change color to red
            // }
            // }
            // }
        }
    })

    // var peopletimelineItems = peopleItemsall.append("div");
    // const timelines = peopletimelineItems.append("svg")
    //     .attr("class", "timeline")
    //     .attr("width", 150)
    //     .attr("height", 20);
    // const groups = timelines.selectAll("g")
    //     .data(d => countValues(d.working_years))
    //     .enter()
    //     .append("g")


    // // Add a bar for each year with the height based on the number of publications
    // const bars = timelines.selectAll(".bar")
    //     .data(d => {
    //         return countValuesformatting(d.working_years)
    //     })
    //     .enter()
    //     .append("rect")
    //     .attr("class", "bar")
    //     .attr("x", (d, i) => {
    //         //   const index = peopleData[0].timeline.findIndex(x => x.year === d.key);
    //         //   return index * (circleRadius * 2 + circleSpacing);
    //         return i * 3;
    //     })
    //     .attr("y", d => 20 - (d.size * 3))
    //     .attr("width", 3)
    //     .attr("height", d => d.size * 3)
    //     .style("fill", colors[1]);

}
function showWriters(people, circleY, circleID, year) {
    triangle_people = svg.selectAll("polygon").filter(function (d) {
        return (d3.select(this).attr("year") == year) && (d3.select(this).attr("type") == "people");
    })
    rectInRange = svg.selectAll("rect").filter(function (d) {
        return d3.select(this).attr("y") > circleY && d3.select(this).attr("y") < circleY + 99;
    })

    if (rectInRange.size() != 0) {
        pushDown(circleY + 3);

    }
    container = svg.append("foreignObject")
        .attr("class", "writers-list")
        .attr("id", circleID)
        .attr("x", first_timeline - 50)
        .attr("y", circleY + 6) // adjust the spacing between the divs as needed
        .attr("width", 200)
        .attr("height", 93)
        .style("z-index", 9999)
        .style("background-color", "white");

    peopleList = container.append("xhtml:div")
        .style("overflow", "auto")
        //   .style("background-color", "black")
        .style("width", "180 px")
        .style("height", "80px")
        .style("max-height", "200px")
        .style("border", `1px solid ${colors[7]}`)
        .style("padding", "5px")
        .attr("class", "writers-list")
        // .style("top", "30px") // adjust the top position as needed
        // .style("left", "20px") // adjust the left position as needed
        .style("overflow-y", "scroll") // add a scrollbar to the div\

    peopleItemsall = peopleList.selectAll("div")
        .data(people)
        .enter()
        .append("div")
        .style("list-style-type", "none")
    // .style("display", "flex")
    // .style("align-items", "center");
    peopleItems = peopleItemsall.append("div")
        .style("list-style-type", "none")
        .style("display", "flex")
        .style("align-items", "center");
    peopleItems.append("p")
        .style("width", "150px")
        .style("cursor", "pointer") // make it appear clickable
        .attr("class", function (d) {
            id = d.people_id
            return "persons-name" + id.toString()
        })
        .style("font-family", font_family)
        .style("font-weight", "normal")
        .text(d => d.people_name + " " + d.people_LName)
        .attr("id", function (d) { return d.people_name + " " + d.people_LName; })
        .attr("data-click-count", 0)
        .on("mouseover", function (e, d) {
            textBounding = d3.select(this).node().getBoundingClientRect();
            working_years = d.working_years
            var counts = countValues(working_years);
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            firstX = +textBounding.right;
            firstY = +textBounding.top + scrollTop;
            for (var key in counts) {
                secondY = nullposition - rectHeight / 2
                if (key != null && key != "" && key != " " && key != "null") {
                    secondY = +d3.select(" #book_year_circle" + key + ".book").attr("y")
                }
                // const pathData = `M ${firstX},${firstY} Q ${(first_timeline + second_timeline) / 2},${+firstY + 3} ${second_timeline},${+secondY + 3}`;
                const pathData = `M ${firstX},${+firstY} 
                    Q ${firstX + (second_timeline - firstX) / 3},${+firstY + 3} ${(firstX + second_timeline) / 2},${((+secondY) + (+firstY)) / 2 + 3} 
                    Q ${second_timeline - (second_timeline - firstX) / 3},${+secondY + 3} ${second_timeline},${+secondY + 3}`;


                svg.append("path")
                    .style("pointer-events", "none")
                    .attr("id", function (d, i) { return "path" })
                    .attr("d", pathData)
                    .attr("stroke", "url(#stroke-gradient)")
                    // .attr("stroke-dasharray", "4,4")
                    .attr("opacity", 0.7)
                    .attr("fill", "none")
                    .attr("stroke-width", linesizeScale(counts[key]));
            }
        })
        .on("mouseout", function (d) {
            d3.selectAll("#path").remove()
        })
        .on("click", function (e, d) {
            if (d3.select(this).attr("data-click-count") == 0) {
                openPopupWindow(1, d.person)
                id = d.people_id
                fullName = d.people_name + " " + d.people_LName
                position = second_timeline - 100 - people_timeline_open * 20;
                min_date = d.min_date;
                console.log("position", position)
                if (d3.select(this).style("color") == "rgb(0, 0, 0)") {
                    selectedcolor = colors[0];
                } else {
                    selectedcolor = d3.select(this).style("color");
                }

                onePersonTimeline(id.toString(), position, selectedcolor, circleY, fullName, min_date, circleID)
                People_timeline_open_ids.push(id.toString())
                people_timeline_open = people_timeline_open + 1;
                d3.select(this).attr("data-click-count", 1)
            }
            else if (d3.select(this).attr("data-click-count") == 1) {
                id = d.people_id
                onePersonTimelineRemove(id.toString(), People_timeline_open_ids)
                d3.select(this).attr("data-click-count", 0)
                people_timeline_open = people_timeline_open - 1;
                People_timeline_open_ids = People_timeline_open_ids.filter(function (openId) {
                    return openId !== id.toString();
                });
            }
        });
    peopleItems.insert("input", "p+ *")
        .attr("type", "color")
        .style("width", "20px")
        .style("height", "20px")
        .style("margin-left", "5px")
        .style("border-radius", "50%")
        .style("overflow", "hidden")
        .style("border", "none")
        .style("background-image", "conic-gradient(red, orange, yellow, green, blue, indigo, violet)")
        .style("background-size", "cover")
        .style("padding", "2")
        .style("appearance", "none")
        .style("outline", "none")
        .on("change", function (event, d) {
            id = d.people_id
            const color = event.target.value;
            d3.select(this.parentNode).select("p")
                .style("color", color);
            // var myTimelineG = d3.selectAll(".person-timeline"+ id.toString());

            // Select all of the circles within that g element
            var myTimelineCircles = d3.selectAll(".person_timeline_circle" + id.toString());
            d3.selectAll(".person-timeline-text" + id.toString()).style("fill", color);
            // Change the color of the circles
            myTimelineCircles.style("fill", color);
            d3.selectAll(".spiral-circle").filter(function (d) {
                personID = d3.select(this).attr("person_id")
                bookID = d3.select(this).attr("book_id")
                return (personID == id.toString())
            }).style("fill", color)
            d3.json('http://127.0.0.1:8000/get_one_person_book/?id_n=' + id).then(function (response) {
                data = response.person_books;
                for (let i = 0; i < data.length; i++) {
                    const year = data[i].year;
                    // const foreignObject = document.querySelector(`#fo_${year}`);
                    var foreignObject = d3.select("#" + "book_year_circle" + year.toString() + ".pubs-list");
                    // var specificP = foreignObj.select(".persons-name" + id.toString());

                    if (foreignObject) {
                        const bookList = data[i].bookList;

                        for (let j = 0; j < bookList.length; j++) {
                            const bookId = bookList[j].book[0];
                            // const book = document.querySelector(`#book_${bookId}`);
                            const book = foreignObject.select(".titles-name" + bookId.toString());
                            console.log("book", book)
                            if (book) {
                                book.style("color", color)
                                // Change color to red
                            }
                        }
                    }
                }
            })
        });

    // var peopletimelineItems = peopleItemsall.append("div");
    // const timelines = peopletimelineItems.append("svg")
    //     .attr("class", "timeline")
    //     .attr("width", 150)
    //     .attr("height", 21);
    // const groups = timelines.selectAll("g")
    //     .data(d => countValues(d.working_years))
    //     .enter()
    //     .append("g")

    // var scale = d3.scaleLog()
    //     .domain([1, 700]) // input range
    //     .range([1, 7]);

    // Add a bar for each year with the height based on the number of publications
    // const bars = timelines.selectAll(".bar")
    //     .data(d => {
    //         console.log(countValuesformatting(d.working_years))
    //         return countValuesformatting(d.working_years)
    //     })
    //     .enter()
    //     .append("rect")
    //     .attr("class", "bar")
    //     .attr("x", (d, i) => {
    //         //   const index = peopleData[0].timeline.findIndex(x => x.year === d.key);
    //         //   return index * (circleRadius * 2 + circleSpacing);
    //         return i * 3;
    //     })
    //     .attr("y", d => {
    //         return 21 - (scale(d.size) * 3)
    //     })
    //     .attr("width", 3)
    //     .attr("height", d => scale(d.size) * 3)
    //     .style("fill", colors[1]);



    triangle_people.each(function (d) {
        data = d
        personList = data.personList;
        for (let i = 0; i < personList.length; i++) {
            const personId = personList[i].person[0];


            const person = container.select(".persons-name" + personId.toString());
            if (person) {
                person.style("font-weight", "bold");
                if(person.node() != null){
                    const foreignObjectElement = container.node();
                    const boldOptionPosition = person.node().getBoundingClientRect();
                    const scrollTopPosition = +boldOptionPosition.y;
                    peopleList.node().scrollTo({top:scrollTopPosition - circleY, behavior: 'smooth' });
                }
            }
        }
    })
}
function onePersonTimelineRemove(id, People_timeline_open_ids) {
    d3.json('http://127.0.0.1:8000/get_one_person_book/?id_n=' + id).then(function (response) {
        var sizeScale = d3.scaleLinear()
            .domain([1, 20])
            .range([2, 5])
        data = response.person_books;
        max_year = response.max_value;
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            const year = data[i].year;
            // const foreignObject = document.querySelector(`#fo_${year}`);
            var foreignObject = d3.select("#" + "book_year_circle" + year.toString() + ".pubs-list");
            console.log(foreignObject)
            // var specificP = foreignObj.select(".persons-name" + id.toString());

            if (foreignObject) {
                const bookList = data[i].bookList;

                for (let j = 0; j < bookList.length; j++) {
                    const bookId = bookList[j].book[0];
                    // const book = document.querySelector(`#book_${bookId}`);
                    const book = foreignObject.select(".titles-name" + bookId.toString());
                    console.log("book", book)
                    if (book) {
                        book.style("color", "black")
                        // Change color to red
                    }
                }
            }
        }
    })
    var onePersonTimelineG = svg.selectAll(".person-timeline" + id.toString());
    // Remove the group and all its child elements (including the circles)
    onePersonTimelineG.remove();

    d3.selectAll(".spiral-circle").filter(function (d) {
        personID = d3.select(this).attr("person_id")
        return personID == id.toString()
    }).remove()
    d3.select(".person-timeline-text" + id.toString()).remove();
    d3.select(".person-timeline-path" + id.toString()).remove();

    var index = People_timeline_open_ids.indexOf(id.toString());

    // If the deleted timeline was not the last one, update the positions of the remaining timelines
    if (index < People_timeline_open_ids.length - 1) {
        // Iterate over the remaining open IDs
        People_timeline_open_ids.slice(index + 1).forEach(function (openId) {
            // Get the circles in the current timeline
            var circles = d3.selectAll(".person_timeline_circle" + openId);
            // Update the cx attribute of each circle to shift it to the left
            header = d3.select(".person-timeline-text" + openId)
            header.transition()
                .duration(500)
                .attr("x", function (d) {
                    return parseInt(d3.select(this).attr("x")) + 20;
                }).attr("tranform", function () {
                    var text = d3.select(this);
                    var currentTransform = text.attr("transform");
                    var existingX = parseFloat(currentTransform.split(",")[1].trim());
                    var newX = existingX + 20;
                    newTransform = currentTransform.replace(existingX, newX)
                    text.attr("transform", newTransform);
                });
            circles.transition()
                .duration(500).attr("cx", function (d) {
                    return parseInt(d3.select(this).attr("cx")) + 20;
                });


            d3.select(".person-timeline-path" + openId)
                .attr("tranform", function () {
                    var path = d3.select(this);
                    var pathData = path.attr("d");

                    // Extract the coordinates of the first point
                    var regex = /M\s*(\d+),(\d+)/i;
                    var match = regex.exec(pathData);
                    var currentX1 = parseInt(match[1]);
                    var currentY1 = parseInt(match[2]);

                    // Extract the coordinates of the second point
                    regex = /L\s*(\d+),(\d+)/i;
                    match = regex.exec(pathData);
                    var currentX2 = parseInt(match[1]);
                    var currentY2 = parseInt(match[2]);

                    // Calculate the new coordinates for the first point
                    var newX1 = currentX1 + 20; // Update the X-coordinate

                    // Calculate the new coordinates for the second point
                    var newX2 = currentX2 + 20; // Update the X-coordinate
                    var newY2 = currentY2; // Update the Y-coordinate

                    // Update the path data with the new coordinates
                    var newPathData = pathData.replace(/M\s*(\d+),(\d+)/i, `M ${newX1},${currentY1}`);
                    newPathData = newPathData.replace(/L\s*(\d+),(\d+)/i, `L ${newX2},${newY2}`);

                    // Update the path with the modified path data
                    path.transition()
                        .duration(500).attr("d", newPathData);
                })

        });
    }

    // Remove the deleted ID from the open IDs array
    People_timeline_open_ids = People_timeline_open_ids.filter(function (openId) {
        return openId !== id.toString();
    });

}

function onePersonTimeline(id, timelineLocation, color, position, name, min_date, circleID) {
    d3.json('http://127.0.0.1:8000/get_one_person_book/?id_n=' + id).then(function (response) {
        var sizeScale = d3.scaleLinear()
            .domain([1, 20])
            .range([2, 5])
        data = response.person_books;
        max_year = response.max_value;
        for (let i = 0; i < data.length; i++) {
            const year = data[i].year;
            // const foreignObject = document.querySelector(`#fo_${year}`);
            var foreignObject = d3.select("#" + "book_year_circle" + year.toString() + ".pubs-list");
            // var specificP = foreignObj.select(".persons-name" + id.toString());
            console.log(foreignObject)
            content = foreignObject.select(".pubs-list")
            if (foreignObject) {
                const bookList = data[i].bookList;

                for (let j = 0; j < bookList.length; j++) {
                    const bookId = bookList[j].book[0];
                    // const book = document.querySelector(`#book_${bookId}`);
                    const book = foreignObject.select(".titles-name" + bookId.toString());
                    if (book) {
                        book.style("color", color)
                        if(book.node() != null){
                            console.log("even hereeee")
                            const foreignObjectElement = foreignObject.node();
                            const boldOptionPosition = book.node().getBoundingClientRect();
                            console.log(boldOptionPosition)
                            // content.node().scrollTop = boldOptionPosition.top;
                            const scrollTopPosition = +boldOptionPosition.top;

                            content.node().scrollTo({top:scrollTopPosition - 5, behavior: 'smooth' });
                        }

                    }
                }
            }
        }
        var onePersonTimelineG = svg.selectAll(".person_timeline")
            .data(data)
            .enter()
            .append("g")
            .attr("id", id)
            .attr("class", "person-timeline" + id.toString());
        var sizeScale = d3.scaleLinear()
            .domain([1, 20])
            .range([4, 10])

        svg.append("text")
            .attr("class", "person-timeline-text" + id.toString())
            .attr("id", id.toString())
            .attr("foreignID", circleID)
            .attr("x", timelineLocation)
            .attr("y", position - 10)
            .style("cursor", "pointer") // make it appear clickable
            .attr("transform", "rotate(45, " + timelineLocation + ", " + (position - 10) + ")")
            .attr("text-anchor", "end")
            .style("fill", color)
            .text(name).on("mousedown", function () {
                var label = d3.select(this);
                var timer = setTimeout(function () {
                    // Get the id of the timeline group that contains the circle
                    var timelineId = label.attr("id");
                    // Create a new SVG element to hold the delete button

                    // Append a rect element to the delete button SVG element
                    deleteButton = svg.append("image")
                        .attr("x", +label.attr("x"))
                        .attr("y", +label.attr("y") + 2)
                        .attr("width", 30)
                        .attr("height", 30)
                        .style("cursor", "pointer") // make it appear clickable
                        .attr("xlink:href", "./../static/images/trash.svg")
                        .attr("class", "delete-button")
                        .style("opacity", 0.8);
                    deleteButton.on("click", function () {
                        var foreignObj = d3.select("#" + circleID + " .writers-list");
                        var specificP = foreignObj.select(".persons-name" + id.toString());
                        specificP.attr("data-click-count", 0)
                        // Delete the entire timeline group and its child elements
                        onePersonTimelineRemove(timelineId, People_timeline_open_ids)
                        // d3.select(this).attr("data-click-count", 0)
                        people_timeline_open = people_timeline_open - 1;
                        People_timeline_open_ids = People_timeline_open_ids.filter(function (openId) {
                            return openId !== timelineId;
                        });
                        d3.select(this).remove()
                    });
                }, 1000);

                // Attach a mouseup event listener to cancel the timer if the mouse is released early
                label.on("mouseup", function () {
                    clearTimeout(timer);
                });
            });

        svg.append("path")
            .style("pointer-events", "none")

            .attr("class", "person-timeline-path" + id.toString())
            .attr("d", function () {
                margin = 0
                year_changed.forEach(year_str => {
                    if ((yScale(new Date(max_year.toString()))) > (yScale(new Date(year_str.year)))) {
                        margin = margin + 100;
                    }
                })
                secondY = margin + yScale(new Date(max_year.toString()))
                pathData = `M ${timelineLocation},${position - 10} L ${timelineLocation},${secondY}`;
                return pathData

            })
            .attr("stroke", "black")
            // .attr("stroke", "url(#stroke-gradient)")
            // .attr("stroke-dasharray", "4,4")
            .attr("opacity", 0.1)
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr("style", "pointer-events: none;").lower();

        var onePersonTimelineCircles = onePersonTimelineG.append("circle")
            .attr("class", "person_timeline_circle" + id.toString())
            .attr("id", id.toString())
            .style("cursor", "pointer") // make it appear clickable
            .attr("data-click-count", 0)
            .attr("year", function (d) { return d.year })
            .attr("size", function (d) { return d.size })
            .attr("bookID", function (d) {
                return d.bookList[0].book[0]
            })
            .attr("stroke-width", function (d) {
                if (d.size ==1){
                    return 2

                } else{
                    return 3
                }
            })
            .style("stroke", function (d) {
                if (d.size ==1){
                    return getColor(d.bookList[0].role)

                } else{
                    return "black"
                }
            })
            .attr("cx", timelineLocation)
            .attr("cy", function (d) {
                margin = 0
                if (d.year == null || d.year == " " || d.year == "") {
                    return nullposition
                }
                year_changed.forEach(year_str => {
                    if ((yScale(new Date(d.year))) > (yScale(new Date(year_str.year)))) {
                        margin = margin + 100;
                    }
                })
                return margin + yScale(new Date(d.year))
            })
            .attr("r", function (d) {
                return sizeScale(d.size)
            })
            .style("fill", color)
            .attr("opacity", 0.8)
            .on("click", function (e, d) {
                centerY = +d3.select(this).attr("cy")
                centerX = +d3.select(this).attr("cx")
                size = d.size
                books = d.bookList;
                year = d.year;
                person_id = d.person_id
                const numCircles = size;
                const radius = 8;
                const angleStep = 0.2;
                const spiralradius = radius + (size * angleStep) * 50;
                color = d3.select(this).style("fill")
                if (size == 1) {
                    // d3.json('http://127.0.0.1:8000/get_one_book/?id_n=' + id.toString()).then(function (response) {
                    //     openPopupWindow(2, books[0]);
                    // })
                    if (d3.select(this).attr("data-click-count") == 0) {
                        triangles_year = d3.select(this).attr("year")
                        svg.selectAll("#polygon").remove();
                        svg.selectAll("#polygon_people").remove()
                        d3.selectAll("foreignObject")
                            .selectAll("p")
                            .style("font-weight", "normal");
                        console.log(books[0].book[0])
                        id = books[0].book[0]
                        // fullName = d.firm
                        // position = 500 + firm_timeline_open * 20;
                        // oneFirmTimeline(id.toString(), position, d3.select(this).style("color"), circleY, fullName)
                        // firm_timeline_open_ids.push(id.toString())
                        // firm_timeline_open = firm_timeline_open + 1;
                        d3.json('http://127.0.0.1:8000/get_one_book/?id_n=' + id.toString()).then(function (response) {
                            openPopupWindow(2, response);
                            firm_roles = response.firm_roles
                            people_role = response.people_role
                            // var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                            // firstX = +textBounding.right;
                            // firstY = +textBounding.top + scrollTop;
                            const trianglesfirms = svg.selectAll("polygon")
                                .data(firm_roles)
                                .enter()
                                .append("polygon")
                                .attr("year", d => d.year)
                                .attr("type", "firm")
                                .attr("id", function (d, i) { return "polygon" })
                                .attr("points", function (d) {
                                    year = d.year
                                    firmsY = nullposition
                                    if (year != "" && year != null && year != "null" && year.length == 4) {
                                        // secondY = yScale(new Date(key))
                                        firmsY = +d3.select(" #firm_circle" + year + ".firm").attr("y")
                                    }
                                    return `${third_timeline - 20},${firmsY - 2} ${third_timeline - 15},${firmsY + 3} ${third_timeline - 20},${firmsY + 8}`
                                })



                            const trianglespeople = svg.selectAll("polygon_people").data(people_role)
                                .enter()
                                .append("polygon")
                                .attr("year", d => d.year)
                                .attr("type", "people")
                                .attr("id", function (d, i) {
                                    console.log("id")
                                    return "polygon_people"
                                })
                                .attr("points", function (d) {
                                    year = d.year
                                    peopleY = nullposition
                                    if (year != "" && year != null && year != "null" && year.length == 4 && year) {
                                        // secondY = yScale(new Date(key))
                                        peopleY = +d3.select(" #people_circle" + year + ".people").attr("y")
                                    }
                                    return `${first_timeline + 20},${peopleY - 2} ${first_timeline + 15},${peopleY + 3} ${first_timeline + 20},${peopleY + 8}`
                                })




                            for (let i = 0; i < firm_roles.length; i++) {
                                const year = firm_roles[i].year;
                                // const foreignObject = document.querySelector(`#fo_${year}`);
                                var foreignObject = d3.select("#" + "firm_circle" + year.toString() + ".firms-list");

                                // var specificP = foreignObj.select(".persons-name" + id.toString());

                                if (foreignObject) {
                                    const firmList = firm_roles[i].firmList;
                                    content = foreignObject.select(".firms-list")
                                    for (let j = 0; j < firmList.length; j++) {
                                        const firmId = firmList[j].firm[0];
                                        // const book = document.querySelector(`#book_${bookId}`);
                                        const firm = foreignObject.select(".firms-name" + firmId.toString());
                                        console.log("book", firm)
                                        if (firm) {
                                            firm.style("font-weight", "bold");
                                            if(firm.node() != null){
                                                const foreignObjectElement = foreignObject.node();
                                                const boldOptionPosition = firm.node().getBoundingClientRect();
                                                // content.node().scrollTop = boldOptionPosition.top;
                                                const scrollTopPosition = +boldOptionPosition.y - position + 50;
                    
                                                content.node().scrollTo({top:scrollTopPosition, behavior: 'smooth' });
                                            }
                                        }
                                    }
                                }
                            }
                            for (let i = 0; i < people_role.length; i++) {
                                const year = people_role[i].year;
                                // const foreignObject = document.querySelector(`#fo_${year}`);
                                var foreignObject = d3.select("#" + "people_circle" + year.toString() + ".writers-list");

                                // var specificP = foreignObj.select(".persons-name" + id.toString());

                                if (foreignObject) {
                                    const personList = people_role[i].personList;
                                    content = foreignObject.select(".writers-list")
                                    for (let j = 0; j < personList.length; j++) {
                                        const personId = personList[j].person[0];
                                        // const book = document.querySelector(`#book_${bookId}`);
                                        const person = foreignObject.select(".persons-name" + personId.toString());
                                        if (person) {
                                            person.style("font-weight", "bold");
                                            if(person.node() != null){
                                                const foreignObjectElement = foreignObject.node();
                                                const boldOptionPosition = person.node().getBoundingClientRect();
                                                // content.node().scrollTop = boldOptionPosition.top;
                                                const scrollTopPosition = +boldOptionPosition.y - position + 50;
                    
                                                content.node().scrollTo({top:scrollTopPosition, behavior: 'smooth' });
                                            }
                                        }
                                    }
                                }
                            }
                        })
                        d3.select(this).attr("data-click-count", 1)
                    }
                    else if (d3.select(this).attr("data-click-count") == 1) {
                        svg.selectAll("#polygon").remove();
                        svg.selectAll("#polygon_people").remove()
                        for (let i = 0; i < firm_roles.length; i++) {
                            const year = firm_roles[i].year;
                            // const foreignObject = document.querySelector(`#fo_${year}`);
                            var foreignObject = d3.select("#" + "firm_circle" + year.toString() + ".firms-list");

                            // var specificP = foreignObj.select(".persons-name" + id.toString());

                            if (foreignObject) {
                                const firmList = firm_roles[i].firmList;

                                for (let j = 0; j < firmList.length; j++) {
                                    const firmId = firmList[j].firm[0];
                                    // const book = document.querySelector(`#book_${bookId}`);
                                    const firm = foreignObject.select(".firms-name" + firmId.toString());
                                    console.log("book", firm)
                                    if (firm) {
                                        firm.style("font-weight", "normal");
                                    }
                                }
                            }
                        }
                        for (let i = 0; i < people_role.length; i++) {
                            const year = people_role[i].year;
                            // const foreignObject = document.querySelector(`#fo_${year}`);
                            var foreignObject = d3.select("#" + "people_circle" + year.toString() + ".writers-list");

                            // var specificP = foreignObj.select(".persons-name" + id.toString());

                            if (foreignObject) {
                                const personList = people_role[i].personList;

                                for (let j = 0; j < personList.length; j++) {
                                    const personId = personList[j].person[0];
                                    // const book = document.querySelector(`#book_${bookId}`);
                                    const person = foreignObject.select(".persons-name" + personId.toString());
                                    if (person) {
                                        person.style("font-weight", "normal");
                                    }
                                }
                            }
                        }
                        d3.select(this).attr("data-click-count", 0)

                    }

                }
                if (d.size > 1) {
                    if (d3.select(this).attr("data-click-count") == 0) {
                        d3.selectAll(".spiral-circle").remove()
                        d3.selectAll("[class^='person_timeline_circle']")
                            .attr("opacity", .8);
                        const booksData = books.map((book, index) => {
                            const angle = index * angleStep;
                            const distance = radius + angle * 50;
                            return {
                                book,
                                x: centerX + distance * Math.cos(angle),
                                y: centerY + distance * Math.sin(angle)
                            };
                        });
                        d3.selectAll("[class^='person_timeline_circle']").filter(function (d) {
                            const circleX = d3.select(this).attr("cx");
                            const circleY = d3.select(this).attr("cy");
                            // Calculate the distance between the circle center and the spiral center
                            const distance = Math.sqrt(Math.pow(circleX - centerX, 2) + Math.pow(circleY - centerY, 2));
                            // If the distance is less than the spiral radius, keep the circle in the selection
                            return (distance < spiralradius / 2) && (distance != 0);
                        })
                            // Reduce the opacity of the filtered circles
                            .attr("opacity", 0.2);
                        const bookCircles = svg.selectAll(".spiral-circle")
                            .data(booksData)
                            .enter()
                            .append("circle")
                            .attr("person_id", id.toString())
                            .attr("book_id", year)
                            .attr("class", "spiral-circle")
                            .style("cursor", "pointer") // make it appear clickable
                            .attr("cx", d => d.x)
                            .attr("cy", d => d.y)
                            .attr("r", 4)
                            .attr("opacity", 0.5)
                            .style("fill", color)
                            .attr("stroke-width", 2)
                            .style("stroke", function (d) {
                                return getColor(d.book.role)
                            })
                            .on("click", function (e, d) {
                                id = d.book.book[0]
                                d3.json('http://127.0.0.1:8000/get_one_book/?id_n=' + id.toString()).then(function (response) {
                                    openPopupWindow(2, response);
                                })
                            });
                        d3.select(this).attr("opacity", 1)

                        d3.select(this).attr("data-click-count", 1)
                    }
                    else if (d3.select(this).attr("data-click-count") == 1) {
                        year = d.year;
                        d3.selectAll(".spiral-circle").remove()
                        d3.selectAll("[class^='person_timeline_circle']")
                        .attr("opacity", .8);
                        //filter(function (d) {
                        //     personID = d3.select(this).attr("person_id")
                        //     bookID = d3.select(this).attr("book_id")
                        //     console.log(personID)
                        //     console.log(person_id.toString())
                        //     return (personID == person_id.toString()) && (bookID == year)
                        // }).remove()
                        d3.selectAll("[class^='person_timeline_circle']").filter(function (d) {
                            const circleX = d3.select(this).attr("cx");
                            const circleY = d3.select(this).attr("cy");
    
                            // Calculate the distance between the circle center and the spiral center
                            const distance = Math.sqrt(Math.pow(circleX - centerX, 2) + Math.pow(circleY - centerY, 2));
                            // If the distance is less than the spiral radius, keep the circle in the selection
                            return (distance < spiralradius / 2) && (distance != 0);
                        })
                            // Reduce the opacity of the filtered circles
                        .attr("opacity", .8);
                        d3.select(this).attr("opacity", .8)
    
                        d3.select(this).attr("data-click-count", 0)
                    }
                }

            })
        // .on("mousedown", function () {
        //     var circle = d3.select(this);
        //     var timer = setTimeout(function () {
        //         // Get the id of the timeline group that contains the circle
        //         var timelineId = circle.attr("id");
        //         // Create a new SVG element to hold the delete button

        //         // Append a rect element to the delete button SVG element
        //         deleteButton = svg.append("image")
        //             .attr("x", +circle.attr("cx") - 30)
        //             .attr("y", circle.attr("cy"))
        //             .attr("width", 30)
        //             .attr("height", 30)
        //             .attr("xlink:href", "./../static/images/trash.svg")
        //             .attr("class", "delete-button")
        //             .style("opacity", 0.8);
        //         deleteButton.on("click", function () {
        //             // Delete the entire timeline group and its child elements
        //             onePersonTimelineRemove(timelineId, People_timeline_open_ids)
        //             // d3.select(this).attr("data-click-count", 0)
        //             people_timeline_open = people_timeline_open - 1;
        //             People_timeline_open_ids = People_timeline_open_ids.filter(function (openId) {
        //                 return openId !== timelineId;
        //             });
        //             d3.select(this).remove()
        //         });
        //     }, 1000);

        //     // Attach a mouseup event listener to cancel the timer if the mouse is released early
        //     circle.on("mouseup", function () {
        //         clearTimeout(timer);
        //     });
        // });



    })
}

function oneFirmTimeline(id, timelineLocation, color, position, name, min_date, circleID) {
    d3.json('http://127.0.0.1:8000/get_one_firm_book/?id_n=' + id).then(function (response) {
        // var sizeScale = d3.scaleLinear()
        //     .domain([1, 20])
        //     .range([2, 5])
        data = response.firm_books;
        max_year = response.max_value;
        min_year = response.min_value;
        for (let i = 0; i < data.length; i++) {
            const year = data[i].year;
            // const foreignObject = document.querySelector(`#fo_${year}`);
            var foreignObject = d3.select("#" + "book_year_circle" + year.toString() + ".pubs-list");
            console.log(foreignObject)
            // var specificP = foreignObj.select(".persons-name" + id.toString());

            if (foreignObject) {
                const bookList = data[i].bookList;

                for (let j = 0; j < bookList.length; j++) {
                    const bookId = bookList[j].book[0];
                    // const book = document.querySelector(`#book_${bookId}`);
                    const book = foreignObject.select(".titles-name" + bookId.toString());
                    console.log("book", book)
                    if (book) {
                        book.style("color", color)
                        // Change color to red
                    }
                }
            }
        }
        if (min_year == " ") {
            first_position = nullposition - 13;
        } else {
            margin = 0
            year_changed.forEach(year_str => {
                if ((yScale(new Date(min_year.toString()))) > (yScale(new Date(year_str.year)))) {
                    margin = margin + 100;
                }
            })
            first_position = margin + yScale(new Date(min_year.toString())) - 10
        }
        var oneFirmTimelineG = svg.selectAll(".firm_timeline")
            .data(data)
            .enter()
            .append("g")
            .attr("id", id)
            .attr("class", "firm-timeline" + id.toString());
        var sizeScale = d3.scaleLinear()
            .domain([1, 20])
            .range([3, 10])

        svg.append("text")
            .attr("id", id.toString())
            .attr("class", "firm-timeline-text" + id.toString())
            .attr("x", timelineLocation)
            .attr("y", first_position)
            .attr("transform", "rotate(-45, " + timelineLocation + ", " + first_position + ")")
            .attr("text-anchor", "start")
            .style("fill", color)
            .style("cursor", "pointer") // make it appear clickable
            .text(name)
            .on("mousedown", function () {
                var label = d3.select(this);
                var timer = setTimeout(function () {
                    // Get the id of the timeline group that contains the circle
                    var timelineId = label.attr("id");
                    // Create a new SVG element to hold the delete button

                    // Append a rect element to the delete button SVG element
                    deleteButton = svg.append("image")
                        .attr("x", +label.attr("x"))
                        .attr("y", +label.attr("y") + 2)
                        .attr("width", 30)
                        .attr("height", 30)
                        .style("cursor", "pointer") // make it appear clickable
                        .attr("xlink:href", "./../static/images/trash.svg")
                        .attr("class", "delete-button")
                        .style("opacity", 0.8);
                    deleteButton.on("click", function () {
                        var foreignObj = d3.select("#" + circleID + " .firms-list");
                        var specificP = foreignObj.select(".firms-name" + id.toString());
                        specificP.attr("data-click-count", 0)
                        // Delete the entire timeline group and its child elements
                        oneFirmTimelineRemove(timelineId, firm_timeline_open_ids)
                        // d3.select(this).attr("data-click-count", 0)
                        firm_timeline_open = firm_timeline_open - 1;
                        firm_timeline_open_ids = firm_timeline_open_ids.filter(function (openId) {
                            return openId !== timelineId;
                        });
                        d3.select(this).remove()
                    });
                }, 1000);

                // Attach a mouseup event listener to cancel the timer if the mouse is released early
                label.on("mouseup", function () {
                    clearTimeout(timer);
                });
            });;

        svg.append("path")
            .style("pointer-events", "none")
            .attr("class", "firm-timeline-path" + id.toString())
            .attr("d", function () {
                margin = 0
                year_changed.forEach(year_str => {
                    if ((yScale(new Date(max_year.toString()))) > (yScale(new Date(year_str.year)))) {
                        margin = margin + 100;
                    }
                })
                secondY = margin + yScale(new Date(max_year.toString()))

                pathData = `M ${timelineLocation},${first_position} L ${timelineLocation},${secondY}`;
                return pathData

            })
            .attr("stroke", "black")
            // .attr("stroke", "url(#stroke-gradient)")
            // .attr("stroke-dasharray", "4,4")
            .attr("opacity", 0.1)
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr("style", "pointer-events: none;").lower();

        var oneFirmTimelineCircles = oneFirmTimelineG.append("circle")
            .attr("class", "firm_timeline_circle" + id.toString())
            .attr("year", function (d) { return d.year })
            .attr("size", function (d) { return d.size })
            .attr("id", id.toString())
            .attr("data-click-count", 0)
            .style("cursor", "pointer") // make it appear clickable
            .attr("cx", timelineLocation)
            .attr("cy", function (d) {
                if (d.year == null || d.year == " " || d.year == "") {
                    return nullposition
                }
                margin = 0
                year_changed.forEach(year_str => {
                    if ((yScale(new Date(d.year))) > (yScale(new Date(year_str.year)))) {
                        margin = margin + 100;
                    }
                })
                return margin + yScale(new Date(d.year))
            })
            .attr("r", function (d) {
                return sizeScale(d.size)
            })
            .style("fill", color)
            .attr("stroke-width", function (d) {
                if (d.size ==1){
                    return 2

                } else{
                    return 3
                }
            })
            .style("stroke", function (d) {
                if (d.size ==1){
                    return getfirmColor(d.bookList[0].role)

                } else{
                    return "black"
                }
            })
            .attr("opacity", 0.8)
            .on("click", function (e, d) {
                centerY = +d3.select(this).attr("cy")
                centerX = +d3.select(this).attr("cx")
                size = d.size
                books = d.bookList;
                const numCircles = size;
                const radius = 8;
                const angleStep = 0.2;
                color = d3.select(this).style("fill")
                const spiralradius = radius + (size * angleStep) * 50;
                if (size == 1) {
                    openPopupWindow(2, books[0]);
                }
                if (d3.select(this).attr("data-click-count") == 0) {
                    if (d.size > 1) {
                        d3.selectAll(".spiral-circle").filter(function (d) {
                            firmID = d3.select(this).attr("firm_id")
                            // bookID = d3.select(this).attr("book_id")
                            return (firmID == id.toString())
                        }).remove()
                        d3.selectAll("[class^='firm_timeline_circle']").attr("opacity", 0.5)
                        const booksData = books.map((book, index) => {
                            const angle = index * angleStep;
                            const distance = radius + angle * 50;
                            return {
                                book,
                                x: centerX + distance * Math.cos(angle),
                                y: centerY + distance * Math.sin(angle)
                            };
                        });
                        d3.selectAll("[class^='firm_timeline_circle']").filter(function (d) {
                            const circleX = d3.select(this).attr("cx");
                            const circleY = d3.select(this).attr("cy");
                            // Calculate the distance between the circle center and the spiral center
                            const distance = Math.sqrt(Math.pow(circleX - centerX, 2) + Math.pow(circleY - centerY, 2));
                            // If the distance is less than the spiral radius, keep the circle in the selection
                            return (distance < spiralradius) && (distance != 0);
                        })
                            // Reduce the opacity of the filtered circles
                            .attr("opacity", 0.2);
                        const bookCircles = svg.selectAll(".spiral-circle")
                            .data(booksData)
                            .enter()
                            .append("circle")
                            .style("cursor", "pointer") // make it appear clickable
                            .attr("firm_id", id.toString())
                            .attr("book_id", d => d.book.book[7])
                            .attr("class", "spiral-circle")
                            .attr("cx", d => d.x)
                            .attr("cy", d => d.y)
                            .attr("r", 4)
                            .style("fill", color)
                            .attr("opacity", 0.8)
                            .attr("stroke-width", 2)
                            .style("stroke", function (d) {
                                return getfirmColor(d.book.role)
                            })
                            .on("click", function (e, d) {
                                console.log(d.book)
                                id = d.book.book[0]
                                d3.json('http://127.0.0.1:8000/get_one_book/?id_n=' + id.toString()).then(function (response) {
                                    openPopupWindow(2, response);
                                })
                            });
                        d3.select(this).attr("opacity", 1)

                        d3.select(this).attr("data-click-count", 1)
                    }
                }
                else if (d3.select(this).attr("data-click-count") == 1) {
                    if (d.size > 1) {
                        year = d.year;
                    d3.selectAll(".spiral-circle").remove()
                    d3.selectAll("[class^='firm_timeline_circle']").attr("opacity", 0.8)

                    // .filter(function (d) {
                    //     const circleX = d3.select(this).attr("cx");
                    //     const circleY = d3.select(this).attr("cy");

                    //     // Calculate the distance between the circle center and the spiral center
                    //     const distance = Math.sqrt(Math.pow(circleX - centerX, 2) + Math.pow(circleY - centerY, 2));
                    //     // If the distance is less than the spiral radius, keep the circle in the selection
                    //     return (distance < spiralradius) && (distance != 0);
                    // })
                    //     // Reduce the opacity of the filtered circles
                    d3.select(this).attr("opacity", 0.8)
                    d3.select(this).attr("data-click-count", 0)
                }
            }
            })
        // .on("mousedown", function () {
        //     var circle = d3.select(this);
        //     var timer = setTimeout(function () {
        //         // Get the id of the timeline group that contains the circle
        //         var timelineId = circle.attr("id");
        //         // Create a new SVG element to hold the delete button

        //         // Append a rect element to the delete button SVG element
        //         deleteButton = svg.append("image")
        //             .attr("x", +circle.attr("cx") - 30)
        //             .attr("y", circle.attr("cy"))
        //             .attr("width", 30)
        //             .attr("height", 30)
        //             .attr("xlink:href", "./../static/images/trash.svg")
        //             .attr("class", "delete-button")
        //             .style("opacity", 0.8);
        //         deleteButton.on("click", function () {
        //             // Delete the entire timeline group and its child elements
        //             oneFirmTimelineRemove(timelineId, firm_timeline_open_ids)
        //             // d3.select(this).attr("data-click-count", 0)
        //             firm_timeline_open = firm_timeline_open - 1;
        //             firm_timeline_open_ids = firm_timeline_open_ids.filter(function (openId) {
        //                 return openId !== timelineId;
        //             });
        //             d3.select(this).remove()
        //         });
        //     }, 1000);

        //     // Attach a mouseup event listener to cancel the timer if the mouse is released early
        //     circle.on("mouseup", function () {
        //         clearTimeout(timer);
        //     });
        // });


    })
}
function oneFirmTimelineRemove(id, firm_timeline_open_ids) {
    d3.json('http://127.0.0.1:8000/get_one_firm_book/?id_n=' + id).then(function (response) {
        // var sizeScale = d3.scaleLinear()
        //     .domain([1, 20])
        //     .range([2, 5])
        data = response.firm_books;
        max_year = response.max_value;
        min_year = response.min_value;
        for (let i = 0; i < data.length; i++) {
            const year = data[i].year;
            // const foreignObject = document.querySelector(`#fo_${year}`);
            var foreignObject = d3.select("#" + "book_year_circle" + year.toString() + ".pubs-list");
            console.log(foreignObject)
            // var specificP = foreignObj.select(".persons-name" + id.toString());

            if (foreignObject) {
                const bookList = data[i].bookList;

                for (let j = 0; j < bookList.length; j++) {
                    const bookId = bookList[j].book[0];
                    // const book = document.querySelector(`#book_${bookId}`);
                    const book = foreignObject.select(".titles-name" + bookId.toString());
                    console.log("book", book)
                    if (book) {
                        book.style("color", "black")
                        // Change color to red
                    }
                }
            }
        }
    })
    var oneFirmTimelineG = svg.selectAll(".firm-timeline" + id.toString());
    // Remove the group and all its child elements (including the circles)
    oneFirmTimelineG.remove();

    d3.selectAll(".spiral-circle").filter(function (d) {
        firmID = d3.select(this).attr("firm_id")
        return firmID == id.toString()
    }).remove()
    d3.select(".firm-timeline-text" + id.toString()).remove()
    d3.select(".firm-timeline-path" + id.toString()).remove();

    var index = firm_timeline_open_ids.indexOf(id.toString());
    // If the deleted timeline was not the last one, update the positions of the remaining timelines
    if (index < firm_timeline_open_ids.length - 1) {
        // Iterate over the remaining open IDs
        firm_timeline_open_ids.slice(index + 1).forEach(function (openId) {
            // Get the circles in the current timeline
            var circles = d3.selectAll(".firm_timeline_circle" + openId);
            // Update the cx attribute of each circle to shift it to the left

            header = d3.select(".firm-timeline-text" + openId)
            header.transition()
                .duration(500)
                .attr("x", function (d) {
                    return parseInt(d3.select(this).attr("x")) - 20;
                }).attr("tranform", function () {
                    var text = d3.select(this);
                    var currentTransform = text.attr("transform");
                    var existingX = parseFloat(currentTransform.split(",")[1].trim());
                    var newX = existingX - 20;
                    newTransform = currentTransform.replace(existingX, newX)
                    text.attr("transform", newTransform);
                });
            circles.transition()
                .duration(500)
                .attr("cx", function (d) {
                    return parseInt(d3.select(this).attr("cx")) - 20;
                });
            d3.select(".firm-timeline-path" + openId)
                .attr("transform", function () {
                    var path = d3.select(this);
                    var pathData = path.attr("d");

                    // Extract the coordinates of the first point
                    var regex = /M\s*(\d+),(\d+)/i;
                    var match = regex.exec(pathData);
                    var currentX1 = parseInt(match[1]);
                    var currentY1 = parseInt(match[2]);

                    // Extract the coordinates of the second point
                    regex = /L\s*(\d+),(\d+)/i;
                    match = regex.exec(pathData);
                    var currentX2 = parseInt(match[1]);
                    var currentY2 = parseInt(match[2]);

                    // Calculate the new coordinates for the first point
                    var newX1 = currentX1 - 20; // Update the X-coordinate

                    // Calculate the new coordinates for the second point
                    var newX2 = currentX2 - 20; // Update the X-coordinate
                    var newY2 = currentY2; // Update the Y-coordinate

                    // Update the path data with the new coordinates
                    var newPathData = pathData.replace(/M\s*(\d+),(\d+)/i, `M ${newX1},${currentY1}`);
                    newPathData = newPathData.replace(/L\s*(\d+),(\d+)/i, `L ${newX2},${newY2}`);

                    // Update the path with the modified path data
                    path.transition()
                        .duration(500).attr("d", newPathData);
                })

        });
    }

    // Remove the deleted ID from the open IDs array
    firm_timeline_open_ids = firm_timeline_open_ids.filter(function (openId) {
        return openId !== id.toString();
    });


}

function countValues(list) {
    var counts = {};

    for (var i = 0; i < list.length; i++) {
        var value = list[i];

        if (counts[value]) {
            counts[value]++;
        } else {
            counts[value] = 1;
        }
    }

    return counts;
}

function countValuesformatting(list) {
    var counts = {};
    const smallest = Math.min(...list.filter(num => num >= 1000).map(Number));
    const largest = Math.max(...list.map(Number));
    for (let i = smallest; i <= largest; i++) {
        counts[i.toString()] = 0;
    }
    for (var i = 0; i < list.length; i++) {
        var value = list[i];

        if (counts[value]) {
            counts[value]++;
        } else {
            counts[value] = 1;
        }
    }
    Key_value_list = []
    for (key in counts) {
        Key_value_list.push({ "key": key, "size": counts[key] })
    }
    return Key_value_list;
}
function create_the_paths_publication(data) {
    firms_start_dates = data.firms_start_dates
    people_start_dates = data.people_start_dates
    main_year = data.year
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    firstY = nullposition

    if (main_year != null && main_year != "" && main_year == "null", main_year.length == 4) {
        firstY = d3.select(" #book_year_circle" + main_year + ".book").attr("y")
    }

    svg.selectAll(".book_to_firm_paths")
        .data(firms_start_dates)
        .enter()
        .append("path")
        .style("pointer-events", "none")
        .attr("id", function (d, i) { return "path" })
        .attr("d", function (d, i) {
            secondY = nullposition;
            year = d.start_date
            if (year != "" && year != null && year != "null" && year.length == 4) {
                // secondY = yScale(new Date(key))
                secondY = +d3.select(" #firm_circle" + year + ".firm").attr("y")
            }
            // const pathData = `M ${second_timeline},${+firstY + 3} Q ${(third_timeline + second_timeline) / 2},${+firstY + 3} ${third_timeline},${+secondY + 3}`;
            // // const pathData = `M ${450},${firstY} L ${750},${secondY}`;
            const pathData = `M ${second_timeline},${+firstY + 3} 
                    Q ${second_timeline + (third_timeline - second_timeline) / 3},${+firstY + 3} ${(second_timeline + third_timeline) / 2},${((+secondY) + (+firstY)) / 2 + 3} 
                    Q ${third_timeline - (third_timeline - second_timeline) / 3},${+secondY + 3} ${third_timeline},${+secondY + 3}`;


            return pathData
        })
        // .attr("stroke", "black")
        // .attr("stroke-dasharray", "4,4")
        .attr("opacity", 0.7)
        .attr("stroke", "url(#stroke-gradient)")
        .attr("fill", "none")
        .attr("stroke-width", function (d) {
            return linesizeScale(d.count)
        });


    svg.selectAll(".book_to_people_paths")
        .data(people_start_dates)
        .enter()
        .append("path")
        .style("pointer-events", "none")
        .attr("id", function (d, i) { return "path" })
        .attr("d", function (d, i) {
            secondY = nullposition;
            year = d.start_work_date
            if (year != "" && year != null && year != "null" && year.length == 4 && year) {
                // secondY = yScale(new Date(key))
                secondY = +d3.select(" #people_circle" + year + ".people").attr("y")
            }

            // const pathData = `M ${second_timeline},${+firstY + 3} Q ${(second_timeline + first_timeline) / 2},${+firstY + 3} ${first_timeline},${+secondY + 3}`;
            const pathData = `M ${second_timeline},${+firstY + 3} 
            Q ${second_timeline + (first_timeline - second_timeline) / 3},${+firstY + 3} ${(second_timeline + first_timeline) / 2},${((+secondY) + (+firstY)) / 2 + 3} 
            Q ${second_timeline + (first_timeline - second_timeline) * 2 / 3},${+secondY + 3} ${first_timeline},${+secondY + 3}`;

            return pathData
        })
        // .attr("stroke", "black")
        // .attr("stroke-dasharray", "4,4")
        .attr("opacity", 0.7)
        .attr("stroke", "url(#stroke-gradient)")
        .attr("fill", "none")
        .attr("stroke-width", function (d) {
            return linesizeScale(d.count)
        });



}


// Define the linear gradient
const gradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "stroke-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x4", "100%")
    .attr("y4", "100%");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "black")
    .attr("stop-opacity", "0.8");

gradient.append("stop")
    .attr("offset", "40%")
    .attr("stop-color", colors[9])
    .attr("stop-opacity", "1");
gradient.append("stop")
    .attr("offset", "60%")
    .attr("stop-color", colors[9])
    .attr("stop-opacity", "1");
gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "black")
    .attr("stop-opacity", "0.8");
const reversegradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "reversestroke-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "black")
    .attr("stop-opacity", "0.8");

gradient.append("stop")
    .attr("offset", "40%")
    .attr("stop-color", colors[3])
    .attr("stop-opacity", ".7");
gradient.append("stop")
    .attr("offset", "60%")
    .attr("stop-color", colors[3])
    .attr("stop-opacity", ".7");
gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "black")
    .attr("stop-opacity", "0.8");
// Add click event listener to window object
window.addEventListener("click", function (event) {
    // Get target of click event
    var target = event.target;
    // Check if target is not the delete button
    if (!target.matches(".delete-button")) {
        // If not, hide the delete button
        d3.select('.delete-button').style("display", "none");
    }
});



function screenCleaner() {
    var svg = d3.select("svg");
    svg.selectAll('rect').remove()
    svg.selectAll('circle').remove()
    svg.selectAll('foreignObject').remove()
    svg.selectAll('text').remove()
    svg.selectAll('path').remove()
    svg.selectAll("#polygon").remove();
    svg.selectAll("#polygon_people").remove()
    year_changed = []
    people_timeline_open = 0;
    People_timeline_open_ids = []
    firm_timeline_open = 0;
    firm_timeline_open_ids = []
    publication_timeline_open = 0;
    publication_open_ids = []

}
function openPopupWindow(flag, data) {


    svg2.selectAll("#detai_html").remove();
    // Create an HTML element inside the foreignObject
    if (flag == 1) {
        var htmlElement = foreignObjdetail.append("xhtml:div")
            .attr("id", "detai_html")
            .style("background-color", "white")
            .style("border", "1px solid black")
            .style("padding", "10px")

        d = data
        // htmlElement.html(
        //     "<h2>ID: " + data[0] + "</h2>" +
        //     "<p>Last Name: " + data[1] + "</p>" +
        //     "<p>First Name: " + data[2] + "</p>" +
        //     "<p>Title: " + data[3] + "</p>" +
        //     "<p>Gender: " + data[4] + "</p>" +
        //     "<p>Date of Birth: " + data[5] + "</p>" +
        //     "<p>Date of Death: " + data[6] + "</p>" +
        //     "<p>Place of Birth: " + data[7] + "</p>" +
        //     "<p>Place of Death: " + data[8] + "</p>"
        // );
        person_id_n = data[0].toString();
        d3.json('http://127.0.0.1:8000/get_one_person_from_website/?id_n=' + data[0].toString()).then(function (response) {
            data = response.result
            let html = '';
            data.forEach(pair => {
                const key = Object.keys(pair)[0];
                const value = pair[key];

                // Append the HTML for the current key-value pair to the html string
                html += `<p>${key}: ${value}</p>`;
            });
            html += `<p> Date of First Contribution: ${d[16]}</p>`
            // Set the generated HTML content to the htmlElement
            // htmlElement.html(html);

            let firmListHtml = '<div id="firmList" style="height: 700px; overflow-y: scroll;">';
            htmlElement.html(html + firmListHtml);

            // d3.json('http://127.0.0.1:8000/get_one_person_relatedfirms/?id_n=' + person_id_n).then(function (response) {
            //     firm_contributor = response.person_books
            //     min_date = response.min_value
            //     max_date = response.max_value
            //     firm_number = response.firm_number
            //     const startDate = new Date(min_date);
            //     const endDate = new Date(max_date);
            //     const margin_one_person_firms = { top: 20, right: 20, bottom: 20, left: 20 };
            //     timelinepadding = 5
            //     const width_one_person_firms = 600;
            //     const height_one_person_firms = 700;
            //     const timelineWidth = width_one_person_firms - margin_one_person_firms.left - margin_one_person_firms.right;
            //     const timelineHeight = height_one_person_firms - margin_one_person_firms.top - margin_one_person_firms.bottom;


            //     // Create the SVG container for the timeline visualization
            //     const svg_one_person_firms = d3.select("#firmList")
            //         .append("svg")
            //         .attr("width", timelineWidth)
            //         .attr("height", timelineHeight);

            //     const radius = Math.min(timelineWidth, timelineHeight);
            //     const centerX = margin_one_person_firms.left;
            //     const centerY = timelineHeight - 40;

            //     const xScale_one_person_firms = d3.scaleTime()
            //         .domain([startDate, endDate])
            //         .range([0, radius]);


            // // Create an arc generator for the quarter circle
            // const arcGenerator = d3.arc()
            //     .innerRadius(0)
            //     .outerRadius(radius)
            //     .startAngle(0)
            //     .endAngle(Math.PI / 2);

            // // Generate the quarter circle
            // svg.append("path")
            //     .attr("d", arcGenerator)
            //     .attr("transform", `translate(${centerX},${centerY})`);

            // Calculate the angle for each firm's timeline
            // const numFirms = firm_number;
            // const anglePerFirm = (Math.PI / 2) / numFirms;

            // // Function to convert a year to an angle on the quarter circle
            // function yearToAngle(year) {
            //     const startYear = 2010; // The first year in your dataset
            //     const endYear = 2022; // The last year in your dataset

            //     const yearRange = endYear - startYear;
            //     const yearProgress = (year - startYear) / yearRange;

            //     return yearProgress * (Math.PI / 2);
            // }

            // // Draw timelines for each firm
            // data.forEach((firm, index) => {
            //     const firmTimeline = svg.append("path")
            //         .datum(firm.books)
            //         .attr("d", d3.lineRadial()
            //             .angle(d => yearToAngle(d.year))
            //             .radius(radius)
            //         )
            //         .attr("fill", "none")
            //         .attr("stroke", d3.schemeCategory10[index % 10])
            //         .attr("transform", `translate(${centerX},${centerY})rotate(${index * anglePerFirm * (180 / Math.PI)})`);
            // });
            // firm_contributor.forEach((firm, i) => {
            //     const firmId = firm.firm_id;
            //     const bookList = firm.bookList;
            //     const pathData = `M 0 ${0} L ${timelineWidth} ${0}`; // Path data for a horizontal line

            //     pathcheck = svg_one_person_firms.append("path")
            //         .attr("d", pathData)
            //         .attr("stroke", "black")
            //         .attr("stroke-width", .5)
            //         .style("opacity", .5)
            //         .attr("transform", `translate(${centerX},${centerY})rotate(${-1 * i * anglePerFirm * (180 / Math.PI)})`);
            //     console.log(pathcheck)
            //     angle = -1 * i * anglePerFirm * (180 / Math.PI)
            //     bookList.forEach((d, i) => {

            //         svg_one_person_firms.append("circle")
            //             // .attr("class", circle - ${ index })
            //             .attr("cx", centerX + Math.cos(angle) * xScale_one_person_firms(new Date(d.year)))
            //             .attr("cy", centerY + Math.sin(angle) *xScale_one_person_firms(new Date(d.year))) // Adjust the spacing between lines as needed
            //             .attr("r", 2) // Set the radius of the circles
            //             .attr("fill", getfirmColor(d.role))
            //             .attr("bookid", d.book[0]) // Call a function to determine the color based on the role
            //             .on("mouseover", function (e, data) {
            //                 console.log(d3.select(this).attr("bookid"))
            //                 bookid = d3.select(this).attr("bookid")
            //                 d3.selectAll("[class^='person_timeline_circle']").filter(function (d) {
            //                     const id = d3.select(this).attr("bookID");
            //                     return id == bookid;
            //                 }).attr("fill", "blue")
            //              })
            //     })
            // })









            // Create the SVG container for the timeline visualization

            // d3.range(1700, 1850)
            // x_axis = d3.axisBottom(xscale).ticks(4)
            // .tickFormat(x => `(${x.toFixed(1)})`)
            // year_str_Array = d3.range(Number(min_date), Number(max_date))
            // year_str_Array = year_str_Array.map(d => new Date(d.toString()));
            // // year_str_Array.forEach(d => new Date(d))
            // const xAxis = d3.axisBottom(xScale_one_person_firms).tickValues(year_str_Array).tickFormat(d3.timeFormat("%Y")).tickSize(5) // Add padding between ticks and tick labels
            // lableSpace = 40
            // bottom = svg_one_person_firms.append("g")
            //     .attr("class", "x-axis")
            //     .attr("transform", `translate(${timelinepadding}, ${timelineHeight - lableSpace})`)
            //     .call(xAxis)
            //     .selectAll("text")
            //     .attr("transform", "rotate(-45)")
            //     .style("color", "black")
            //     .style("text-anchor", "end");
            // .append("text")
            // .attr("class", "label")
            // .attr("x", width)
            // .attr("y", -6)
            //                     .text("YEAR");
            // .selectAll(".tick line")
            // .attr("y1", 5)
            // .attr("y2", 0)
            // .attr("stroke", "black")
            // .attr("strokewidth", 1)
            // .attr("y", 5 + 20) // Adjust the vertical position of the year labels
            // .style("text-anchor", "middle")
            // .text(d => d);

            // svg_one_person_firms.append("text")
            //     .attr("class", "x-axis-label")
            //     .attr("x", timelineWidth / 2)
            //     .attr("y", timelineHeight)
            //     .style("text-anchor", "middle")
            //     .text("Years");
            // bottom = svg_one_person_firms.append("g")
            //       .attr("transform", `translate(${margin_one_person_firms.left}, ${timelineHeight})`)
            //       .call(xAxis).selectAll(".tick")
            //       .append("text")
            //       .attr("class", "year-label")
            //       .attr("x", 0)
            //       .attr("y", tickMarkLength + 20) // Adjust the vertical position of the year labels
            //       .style("text-anchor", "middle")
            //       .text(d => d);
            //     console.log("here", xAxis)
            //     console.log(bottom)
            // firm_contributor.forEach((firm, i) => {
            //     const firmId = firm.firm_id;
            //     const bookList = firm.bookList;
            //     y = timelineHeight - i * 4 - 10 - lableSpace
            //     const pathData = `M 0 ${y} L ${timelineWidth} ${y}`; // Path data for a horizontal line

            //     svg_one_person_firms.append("path")
            //         .attr("d", pathData)
            //         .attr("stroke", "black")
            //         .attr("stroke-width", .5)
            //         .style("opacity", .5)
            //     bookList.forEach((d, i) => {

            //         svg_one_person_firms.append("circle")
            //             // .attr("class", circle - ${ index })
            //             .attr("cx", xScale_one_person_firms(new Date(d.year)) + timelinepadding)
            //             .attr("cy", y) // Adjust the spacing between lines as needed
            //             .attr("r", 2) // Set the radius of the circles
            //             .attr("fill", getfirmColor(d.role))
            //             .attr("bookid", d.book[0]) // Call a function to determine the color based on the role
            //             .on("mouseover", function (e, data) {
            //                 console.log(d3.select(this).attr("bookid"))
            //                 bookid = d3.select(this).attr("bookid")
            //                 d3.selectAll("[class^='person_timeline_circle']").filter(function (d) {
            //                     const id = d3.select(this).attr("bookID");
            //                     return id == bookid;
            //                 }).attr("fill", "blue")



            //             })
            //     })
            //     //         // const contributionTimeline = generateContributionTimeline(firm.bookList);
            //     //         // <div class="timeline">${contributionTimeline}</div>
            //     //         // firmListHtml += `<div class="firm-item">
            //     //         //               <h3>${firmName}</h3>
            //     //         //           </div>`;
            // });
            //     // firmListHtml += '</div>';

            //     // Replace the placeholder element with the generated firm list HTML
            //     // htmlElement.html(html + firmListHtml);
        })
        // })

    }
    else if (flag == 2) {
        var htmlElement = foreignObjdetail.append("xhtml:div")
            .attr("id", "detai_html")
            .style("background-color", "white")
            .style("border", "1px solid black")
            .style("padding", "10px")
            .style("overflow-y", "scroll") // add a scrollbar to the div\


        d = data.book
        d3.json('http://127.0.0.1:8000/get_one_title_from_website/?id_n=' + d[0].toString()).then(function (response) {
            data = response.result
            let html = '';
            data.forEach(pair => {
                const key = Object.keys(pair)[0];
                const value = pair[key];
                if (key === 'Firms'){
                    lineColor = colors[3]
                }
                else if (key === 'Contributors'){
                    lineColor = colors[7]
                }
                else if (key === 'Title'){
                    lineColor = colors[8]
                }
                else{
                    lineColor = 'black'
                }

                // Append the HTML for the current key-value pair to the html string with the appropriate styling
                html += `<p style="color: ${lineColor};">${key}: ${value}</p>`;
                // Append the HTML for the current key-value pair to the html string
                // html += `<p>${key}: ${value}</p>`;
            });
            // Set the generated HTML content to the htmlElement
            htmlElement.html(html);
        })
        // htmlElement.html(
        //     "<h2>ID: " + d[0] + "</h2>" +
        //     "<p>Title: " + d[1] + "</p>" +
        //     "<p>Signed Author: " + d[2] + "</p>" +
        //     "<p>Pseudonym: " + d[3] + "</p>" +
        //     "<p>Imprint: " + d[4] + "</p>" +
        //     "<p>Colophon: " + d[5] + "</p>" +
        //     "<p>Location of Printing: " + d[6] + "</p>" +
        //     "<p>Publication Date: " + d[7] + "</p>" +
        //     "<p>Date of First Publication: " + d[8] + "</p>" +
        //     "<p>Format ID: " + d[9] + "</p>" +
        //     "<p>Size (Length): " + d[10] + "</p>" +
        //     "<p>Size (Width): " + d[11] + "</p>" +
        //     "<p>Edition: " + d[12] + "</p>" +
        //     "<p>Volumes: " + d[13] + "</p>" +
        //     "<p>Pagination: " + d[14] + "</p>" +
        //     "<p>Price (Pound): " + d[15] + "</p>" +
        //     "<p>Price (Shilling): " + d[16] + "</p>" +
        //     "<p>Price (Pence): " + d[17] + "</p>" +
        //     "<p>Shelfmark: " + d[18] + "</p>" +
        //     "<p>Checked: " + d[19] + "</p>" +
        //     "<p>Final Attempt: " + d[20] + "</p>" +
        //     "<p>Final Check: " + d[21] + "</p>" +
        //     "<p>Notes: " + d[22] + "</p>" +
        //     "<p>Self-published: " + d[23] + "</p>" +
        //     "<p>Edition Number: " + d[24] + "</p>" +
        //     "<p>Total Price: " + d[25] + "</p>" +
        //     "<p>Copyright: " + d[26] + "</p>" +
        //     "<p>Other Currency ID: " + d[27] + "</p>" +
        //     "<p>Other Price: " + d[28] + "</p>"
        // );

    } else if (flag == 3) {
        var htmlElement = foreignObjdetail.append("xhtml:div")
            .attr("id", "detai_html")
            .style("background-color", "white")
            .style("border", "1px solid black")
            .style("padding", "10px")
        d = data
        d3.json('http://127.0.0.1:8000/get_one_firm_from_website/?id_n=' + d[0].toString()).then(function (response) {
            data = response.result
            console.log(data)
            let html = '';
            data.forEach(pair => {
                const key = Object.keys(pair)[0];
                const value = pair[key];

                // Append the HTML for the current key-value pair to the html string
                html += `<p>${key}: ${value}</p>`;
            });
            // Set the generated HTML content to the htmlElement
            htmlElement.html(html);
        })
    }
    // var popupWindow = window.open("", "popupWindow", "width=400, height=300");

    // // Add content to the popup window
    // var popupContent = document.createElement("div");
    // popupContent.innerHTML = "Details: " + data[1];
    // popupWindow.document.body.appendChild(popupContent);

    // // Add close button to the popup window
    // var closeButton = document.createElement("button");
    // closeButton.innerHTML = "X";
    // closeButton.addEventListener("click", function () {
    //     popupWindow.close();
    // });
    // popupWindow.document.body.appendChild(closeButton);
}
function cite_update(role, genre, firm, gender) {
    screenCleaner()
    svg.append('text')
        .attr('class', 'fixed-text-persons')
        // .style("position", "fixed")
        //     .attr('x', first_timeline - 30) // set the x position
        //     .attr('y', 35) // set the y position
        .text('Persons')
        .style('font-size', '40px')
        .style('font-weight', 'bold') // make the text bold
        .style('font-style', 'italic')
        .style("fill", colors[7]); // make the 

    // Append the second header
    svg.append('text')
        .attr('class', 'fixed-text-books')
        // .attr('x', second_timeline - 30) // set the x position
        // .attr('y', 35) // set the y position
        .text('Titles')
        .style('font-size', '40px')
        .style('font-weight', 'bold') // make the text bold
        .style('font-style', 'italic')
        .style("fill", colors[8]); // make the 

    // Append the third header
    svg.append('text')
        // .style("position", "fixed")
        .attr('class', 'fixed-text-firms')
        // .attr('x', third_timeline - 30) // set the x position
        // .attr('y', 35) // set the y position
        .text('Firms')
        .style('font-size', '40px')
        .style('font-weight', 'bold') // make the text bold
        .style('font-style', 'italic')
        .style("fill", colors[3]); // make the 

    svg.append('text')
        .attr('x', third_timeline - 40) // set the x position
        .attr('y', nullposition - 6) // set the y position
        .text('Missing time')
        .style('font-size', '14px')
        .style('font-weight', 'bold') // make the text bold
        .style('font-style', 'italic');
    svg.append('text')
        .attr('x', first_timeline - 40) // set the x position
        .attr('y', nullposition - 6) // set the y position
        .text('Missing time')
        .style('font-size', '14px')
        .style('font-weight', 'bold') // make the text bold
        .style('font-style', 'italic'); // make the 

    // Append the second header
    svg.append('text')
        .attr('x', second_timeline - 40) // set the x position
        .attr('y', nullposition - 6) // set the y position
        .text('Missing time')
        .style('font-size', '14px')
        .style('font-weight', 'bold') // make the text bold
        .style('font-style', 'italic');

    svg.append('text')
        .attr('x', first_timeline - 30) // set the x position
        .attr('y', downtitleposition) // set the y position
        .text('Persons')
        .style('font-size', '30px')
        .style('font-weight', 'bold') // make the text bold
        .style('font-style', 'italic') // make the 
        .style("fill", colors[7]); // make the 


    // Append the second header
    svg.append('text')
        .attr('x', second_timeline - 30) // set the x position
        .attr('y', downtitleposition) // set the y position
        .text('Titles')
        .style('font-size', '30px')
        .style('font-weight', 'bold') // make the text bold
        .style('font-style', 'italic')
        .style("fill", colors[8]); // make the 

    svg.append('text')
        .attr('x', first_timeline - 20) // set the x position
        .attr('y', 80) // set the y position
        .text('no name')
        .style('font-size', '14px')
        .style('font-weight', 'bold') // make the text bold
        .style('font-style', 'italic');
    // Append the third header
    svg.append('text')
        .attr('x', third_timeline - 30) // set the x position
        .attr('y', downtitleposition) // set the y position
        .text('Firms')
        .style('font-size', '30px')
        .style('font-weight', 'bold') // make the text bold
        .style('font-style', 'italic')
        .style("fill", colors[3]); // make the 

    svg.selectAll("circle-year")
        .data(d3.range(1650, 1840).filter(function (d) {
            return d % 10 != 0;
        }))
        .enter()
        .append("circle")
        .attr("cx", 35)
        .attr("cy", d => yScale(new Date(d.toString())))
        .attr("r", 2)
        .attr("opacity", 0.3)
        .attr("data-click-count", 0)
        .on("mouseover", function (e, d) {
            year = d.toString()
            circleY = d3.select(this).attr("cy");
            const pathData = `M ${30},${circleY} L ${1105},${circleY}`;

            svg.append("path")
                .style("pointer-events", "none")
                .attr("id", function (d, i) { return "path" })
                .attr("d", pathData)
                .attr("stroke", "black")
                // .attr("stroke-dasharray", "4,4")
                .attr("opacity", 0.1)
                .attr("style", "pointer-events: none;").lower()
                .attr("stroke-width", 1);
            svg.append("text")
                .attr("id", function (d, i) { return "one-text-year" })
                .attr("x", 0)
                .attr("y", function (d) {
                    margin = 0
                    year_changed.forEach(year_str => {
                        if ((yScale(new Date(year))) > (yScale(new Date(year_str.year)))) {
                            margin = margin + 100;
                        }
                    })
                    return yScale(new Date(year)) + rectHeight / 2 + margin
                })
                .style('font-size', '12px')
                .attr("text-anchor", "left")
                .text(year);
        })
        .on("mouseout", function (d) {
            d3.selectAll("#path").remove()
            d3.selectAll("#one-text-year").remove()


        })
        .on("click", function (e, d) {

            circleY = d3.select(this).attr("cy");
            const pathData = `M ${30},${circleY} L ${1105},${circleY}`;

            console.log(d3.select(this).attr("data-click-count"))
            if (d3.select(this).attr("data-click-count") == 0) {
                pathfixed = svg.append("path")
                    .style("pointer-events", "none")
                    .attr("id", function () { return "pathfixed" + d.toString() })
                    .attr("class", "pathfixed")
                    .attr("d", pathData)
                    .attr("stroke", "black")
                    // .attr("stroke-dasharray", "4,4")
                    .attr("opacity", 0.1)
                    .attr("style", "pointer-events: none;").lower()
                    .attr("stroke-width", 1);

                svg.append("text")
                    .attr("id", function () { return "one-text-year-fixed" + d.toString() })
                    .attr("x", 0)
                    .attr("y", function (d) {
                        margin = 0
                        year_changed.forEach(year_str => {
                            if ((yScale(new Date(year))) > (yScale(new Date(year_str.year)))) {
                                margin = margin + 100;
                            }
                        })
                        return yScale(new Date(year)) + rectHeight / 2 + margin
                    }).style('font-size', '12px')
                    .attr("text-anchor", "left")
                    .text(d.toString());

                svg.append("text")
                    .attr("id", function () { return "one-text-year-fixed" + d.toString() })
                    .attr("x", 1109)
                    .attr("y", function (d) {
                        margin = 0
                        year_changed.forEach(year_str => {
                            if ((yScale(new Date(year))) > (yScale(new Date(year_str.year)))) {
                                margin = margin + 100;
                            }
                        })
                        return yScale(new Date(year)) + rectHeight / 2 + margin
                    }).style('font-size', '12px')
                    .attr("text-anchor", "right")
                    .text(d.toString());


                d3.select(this).attr("data-click-count", 1)
            } else {
                d3.selectAll("#pathfixed" + d.toString()).remove()
                d3.selectAll("#one-text-year-fixed" + d.toString()).remove()
                d3.select(this).attr("data-click-count", 0)

            }
        })
    svg.selectAll("circle-year")
        .data(d3.range(1650, 1850).filter(function (d) {
            return d % 10 === 0;
        }))
        .enter()
        .append("circle")
        .attr("data-click-count", 0)
        .attr("cx", 35)
        .attr("cy", d => yScale(new Date(d.toString())))
        .attr("r", 2)
        .on("mouseover", function (e, d) {
            circleY = d3.select(this).attr("cy");
            const pathData = `M ${30},${circleY} L ${1105},${circleY}`;

            svg.append("path")
                .style("pointer-events", "none")
                .attr("id", function (d, i) { return "path" })
                .attr("d", pathData)
                .attr("stroke", "black")
                // .attr("stroke-dasharray", "4,4")
                .attr("opacity", 0.2)

                .attr("stroke-width", 2);
        })
        .on("mouseout", function (d) {
            d3.selectAll("#path").remove()
        })
        .on("click", function (e, d) {

            circleY = d3.select(this).attr("cy");
            const pathData = `M ${30},${circleY} L ${1105},${circleY}`;

            console.log(d3.select(this).attr("data-click-count"))
            if (d3.select(this).attr("data-click-count") == 0) {
                pathfixed = svg.append("path")
                    .style("pointer-events", "none")
                    .attr("id", function () { return "pathfixed" + d.toString() })
                    .attr("class", "pathfixed")
                    .attr("d", pathData)
                    .attr("stroke", "black")
                    // .attr("stroke-dasharray", "4,4")
                    .attr("opacity", 0.1)
                    .attr("style", "pointer-events: none;").lower()
                    .attr("stroke-width", 1);

                d3.select(this).attr("data-click-count", 1)
            } else {
                d3.selectAll("#pathfixed" + d.toString()).remove()

                d3.select(this).attr("data-click-count", 0)

            }
        });
    svg.selectAll("text-year")
        .data(d3.range(1650, 1850).filter(function (d) {
            return d % 10 === 0;
        }))
        .enter()
        .append("text")
        .attr("x", 0)
        .attr("y", d => yScale(new Date(d.toString())) + rectHeight / 2)
        .attr("text-anchor", "left")
        .text(d => d.toString());





    svg.selectAll("circle-year")
        .data(d3.range(1650, 1840).filter(function (d) {
            return d % 10 != 0;
        }))
        .enter()
        .append("circle")
        .attr("data-click-count", 0)
        .attr("cx", 1105)
        .attr("cy", d => yScale(new Date(d.toString())))
        .attr("r", 2)
        .attr("opacity", 0.3)
        .on("mouseover", function (e, d) {
            circleY = d3.select(this).attr("cy");
            const pathData = `M ${1105},${circleY} L ${30},${circleY}`;

            svg.append("path")
                .style("pointer-events", "none")
                .attr("id", function (d, i) { return "path" })
                .attr("d", pathData)
                .attr("stroke", "black")
                // .attr("stroke-dasharray", "4,4")
                .attr("opacity", 0.1)

                .attr("stroke-width", 1);

            svg.append("text")
                .attr("id", function () { return "one-text-year" })
                .attr("x", 1109)
                .attr("y", function (d) {
                    margin = 0
                    year_changed.forEach(year_str => {
                        if ((yScale(new Date(year))) > (yScale(new Date(year_str.year)))) {
                            margin = margin + 100;
                        }
                    })
                    return yScale(new Date(year)) + rectHeight / 2 + margin
                }).style('font-size', '12px')
                .attr("text-anchor", "right")
                .text(d.toString());
        })
        .on("mouseout", function (d) {
            d3.selectAll("#path").remove()
            d3.selectAll("#one-text-year").remove()
        }).on("click", function (e, d) {

            circleY = d3.select(this).attr("cy");
            const pathData = `M ${30},${circleY} L ${1105},${circleY}`;

            console.log(d3.select(this).attr("data-click-count"))
            if (d3.select(this).attr("data-click-count") == 0) {
                pathfixed = svg.append("path")
                    .style("pointer-events", "none")
                    .attr("id", function () { return "pathfixed" + d.toString() })
                    .attr("class", "pathfixed")
                    .attr("d", pathData)
                    .attr("stroke", "black")
                    // .attr("stroke-dasharray", "4,4")
                    .attr("opacity", 0.1)
                    .attr("style", "pointer-events: none;").lower()
                    .attr("stroke-width", 1);

                svg.append("text")
                    .attr("id", function () { return "one-text-year-fixed" + d.toString() })
                    .attr("x", 0)
                    .attr("y", function (d) {
                        margin = 0
                        year_changed.forEach(year_str => {
                            if ((yScale(new Date(year))) > (yScale(new Date(year_str.year)))) {
                                margin = margin + 100;
                            }
                        })
                        return yScale(new Date(year)) + rectHeight / 2 + margin
                    }).style('font-size', '12px')
                    .attr("text-anchor", "left")
                    .text(d.toString());

                svg.append("text")
                    .attr("id", function () { return "one-text-year-fixed" + d.toString() })
                    .attr("x", 1109)
                    .attr("y", function (d) {
                        margin = 0
                        year_changed.forEach(year_str => {
                            if ((yScale(new Date(year))) > (yScale(new Date(year_str.year)))) {
                                margin = margin + 100;
                            }
                        })
                        return yScale(new Date(year)) + rectHeight / 2 + margin
                    })
                    .style('font-size', '12px')
                    .attr("text-anchor", "right")
                    .text(d.toString());

                d3.select(this).attr("data-click-count", 1)
            } else {
                d3.selectAll("#pathfixed" + d.toString()).remove()
                d3.selectAll("#one-text-year-fixed" + d.toString()).remove()
                d3.select(this).attr("data-click-count", 0)

            }
        });
    svg.selectAll("circle-year-end")
        .data(d3.range(1650, 1850).filter(function (d) {
            return d % 10 === 0;
        }))
        .enter()
        .append("circle")
        .attr("cx", 1105)
        .attr("data-click-count", 0)
        .attr("cy", d => yScale(new Date(d.toString())))
        .attr("r", 2)
        .on("mouseover", function (e, d) {
            circleY = d3.select(this).attr("cy");
            const pathData = `M ${1105},${circleY} L ${30},${circleY}`;

            svg.append("path")
                .attr("id", function (d, i) { return "path" })
                .attr("d", pathData)
                .attr("stroke", "black")
                // .attr("stroke-dasharray", "4,4")
                .attr("opacity", 0.2)

                .attr("stroke-width", 2);
        })
        .on("mouseout", function (d) {
            d3.selectAll("#path").remove()
        }).on("click", function (e, d) {

            circleY = d3.select(this).attr("cy");
            const pathData = `M ${30},${circleY} L ${1105},${circleY}`;

            console.log(d3.select(this).attr("data-click-count"))
            if (d3.select(this).attr("data-click-count") == 0) {
                pathfixed = svg.append("path")
                    .attr("id", function () { return "pathfixed" + d.toString() })
                    .attr("class", "pathfixed")
                    .attr("d", pathData)
                    .attr("stroke", "black")
                    // .attr("stroke-dasharray", "4,4")
                    .attr("opacity", 0.1)
                    .attr("style", "pointer-events: none;").lower()
                    .attr("stroke-width", 1);

                d3.select(this).attr("data-click-count", 1)
            } else {
                d3.selectAll("#pathfixed" + d.toString()).remove()

                d3.select(this).attr("data-click-count", 0)

            }
        });
    svg.selectAll("text-year")
        .data(d3.range(1650, 1850).filter(function (d) {
            return d % 10 === 0;
        }))
        .enter()
        .append("text")
        .attr("x", 1109)
        .attr("y", d => yScale(new Date(d.toString())) + rectHeight / 2)
        .attr("text-anchor", "right")
        .text(d => d.toString());




    data = d3.json('http://127.0.0.1:8000/get_books_by_year_genre/?genre_id=' + genre.toString() + '&firm_role_id=' + firm.toString() + '&role_id=' + role.toString() + '&gender=' + gender.toString()).then(function (response) {
        data = response.books_by_year;
        draw2(data);
    });

    d3.json('http://127.0.0.1:8000/get_one_type_of_people_with_books/?genre_id=' + genre.toString() + '&job_id=' + role.toString() + '&gender=' + gender.toString()).then(function (response) {
        data = response.people_with_book;
        Unknown = response.Unknown
        console.log(Unknown)
        // var xScale = d3.scaleTime()
        // .domain([ new Date("1700"), new Date("1836")])
        // .range([timelineMargin, width - timelineMargin]);
        var unknown_peopleSel = svg.selectAll(".unknown_people_year")
            .data(Unknown)
            .enter()
            .append("g")
            .attr("class", "unknown-people-year");

        // svg.append("image")
        // .attr("x", +label.attr("x"))
        // .attr("y", +label.attr("y") + 2)
        // .attr("width", 30)
        // .attr("height", 30)
        // .style("cursor", "pointer") // make it appear clickable
        // .attr("xlink:href", "./../static/images/trash.svg")
        // .attr("class", "delete-button")
        // .style("opacity", 0.8);
        var unknown_peopleCircles = unknown_peopleSel.append("rect")
            .attr("x", function (d, i) {
                if (i == 2) {
                    return 52
                }
                if (i == 1) {
                    return 58
                }
                if (i == 0) {
                    return 88;
                }
            })
            .attr("y", function (d) {

                return 80;
            })
            .attr("width", function (d, i) {
                if (i == 2) {
                    return 6
                }
                if (i == 1) {
                    return 30
                }
                if (i == 0) {
                    return 60;
                }
            })
            .attr("height", rectHeight * 2)
            .style("z-index", 50)
            // .append("circle")
            .attr("class", "people")
            .attr("id", function (d) {
                return "people_circle" + d.year
            })
            .attr("data-click-count", 0)
            .style("cursor", "pointer") // make it appear clickable
            .style("fill", function (d, i) {
                if (d.people_name == "[Woman]") {
                    return "url(#diagonal-stripe-2) " + colors[7]
                }
                else if (d.people_name == "[Man]") {
                    return "url(#diagonal-stripe-1)"
                }
                else if (d.people_name == null) {
                    return "url(#crosshatch)"
                }
            })
            .attr("opacity", 0.7)

            .on("mouseover", function (e, d) {
                x = +d3.select(this).attr("x");
                width = +d3.select(this).attr("width")
                working_years = d.working_years
                var counts = countValues(working_years);
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                // firstX = +textBounding.right;
                // firstY = +textBounding.top + scrollTop;
                firstX = x + width / 2
                firstY = 86
                for (var key in counts) {
                    secondY = nullposition - rectHeight / 2
                    if (key != null && key != "" && key != " " && key != "null") {
                        secondY = +d3.select(" #book_year_circle" + key + ".book").attr("y")
                    }
                    // const pathData = `M ${firstX},${firstY} Q ${(first_timeline + second_timeline) / 2},${+firstY + 3} ${second_timeline},${+secondY + 3}`;
                    const pathData = `M ${firstX},${+firstY} 
                        Q ${firstX + (second_timeline - firstX) / 3},${+firstY + 3} ${(firstX + second_timeline) / 2},${((+secondY) + (+firstY)) / 2 + 3} 
                        Q ${second_timeline - (second_timeline - firstX) / 3},${+secondY + 3} ${second_timeline},${+secondY + 3}`;


                    svg.append("path")
                        .style("pointer-events", "none")
                        .attr("id", function (d, i) { return "path" })
                        .attr("d", pathData)
                        .attr("stroke", "url(#stroke-gradient)")
                        // .attr("stroke-dasharray", "4,4")
                        .attr("opacity", 0.7)
                        .attr("fill", "none")
                        .attr("stroke-width", linesizeScale(counts[key]));
                }
            })
            .on("mouseout", function (d) {
                d3.selectAll("#path").remove()
            })
            .on("click", function (e, d) {
                console.log("check", d)
                if (d3.select(this).attr("data-click-count") == 0) {
                    id = d.people_id
                    fullName = d.people_name + " " + d.people_LName
                    position = second_timeline - 100 - people_timeline_open * 20;
                    min_date = d.min_date;
                    if ((min_date == "empty") || (min_date == "")) {
                        pos = nullposition - (rectHeight / 2);
                    }
                    else { pos = yScale(new Date(min_date.substring(0, 4))) - (rectHeight / 2); }

                    if (d3.select(this).style("color") == "rgb(0, 0, 0)") {
                        selectedcolor = colors[0];
                    } else {
                        selectedcolor = d3.select(this).style("color");
                    }
                    circleID = "unknown"
                    onePersonTimeline(id.toString(), position, selectedcolor, pos, fullName, min_date, circleID)
                    People_timeline_open_ids.push(id.toString())
                    people_timeline_open = people_timeline_open + 1;
                    d3.select(this).attr("data-click-count", 1)
                }
                else if (d3.select(this).attr("data-click-count") == 1) {
                    id = d.people_id
                    onePersonTimelineRemove(id.toString(), People_timeline_open_ids)
                    d3.select(this).attr("data-click-count", 0)
                    people_timeline_open = people_timeline_open - 1;
                    People_timeline_open_ids = People_timeline_open_ids.filter(function (openId) {
                        return openId !== id.toString();
                    });
                }
            });




        var year_peopleSel = svg.selectAll(".people_year")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "people-year");
        var sizeScale = d3.scaleLinear()
            .domain([1, 50])
            .range([10, 35])


        var year_peopleCircles = year_peopleSel.append("rect")
            .attr("x", function (d) {

                return 100 - (sizeScale(d.size) / 2)
            })
            .attr("y", function (d) {
                if ((d.year == "empty") || (d.year == "")) {
                    return nullposition - (rectHeight / 2);
                }
                return yScale(new Date(d.year.substring(0, 4))) - (rectHeight / 2);
            })
            .attr("width", function (d) {
                return sizeScale(d.size)
            })
            .attr("height", rectHeight)
            .style("z-index", 50)
            // .append("circle")
            .attr("class", "people")
            .attr("id", function (d) {
                return "people_circle" + d.year
            })
            .attr("data-click-count", 0)
            .style("cursor", "pointer") // make it appear clickable
            .style("fill", colors[7])
            .attr("opacity", 0.7)
            .on("mouseover", function (e, d) {
                main_year = d.year
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                firstY = nullposition - rectHeight / 2
                if (main_year != null && main_year != "" && main_year == "null", main_year.length == 4) {
                    firstY = d3.select(this).attr("y")
                }
                // Set the path's d attribute to the path data
                for (let key in d.value_counts) {
                    // Access each property using its key and log its value to the console
                    secondY = nullposition;
                    if (key != "" && key != null && key != "null" && key.length == 4) {
                        // secondY = yScale(new Date(key))
                        secondY = +d3.select(" #book_year_circle" + key + ".book").attr("y") + 3
                    }

                    // const pathData = `M ${first_timeline},${+firstY + 3} Q ${(first_timeline + second_timeline) / 2},${+firstY + 3} ${second_timeline},${+secondY + 3}`;
                    const pathData = `M ${first_timeline},${+firstY + 3} 
                    Q ${first_timeline + (second_timeline - first_timeline) / 3},${+firstY + 3} ${(first_timeline + second_timeline) / 2},${((+secondY) + (+firstY)) / 2 + 3} 
                    Q ${second_timeline - (second_timeline - first_timeline) / 3},${+secondY + 3} ${second_timeline},${+secondY + 3}`;


                    svg.append("path")
                        .attr("id", function (d, i) { return "path" })
                        .attr("d", pathData)
                        // .attr("stroke", "black")
                        .style("z-index", 40)
                        .attr("stroke", "url(#stroke-gradient)")
                        .attr("fill", "none")
                        // .attr("stroke-dasharray", "4,4")
                        .attr("opacity", 0.7)

                        .attr("stroke-width", linesizeScale(d.value_counts[key]));
                }
            })
            .on("mouseout", function (d) {
                d3.selectAll("#path").remove()
            })
            .on("click", function (e, d) {
                circleY = +d3.select(this).attr("y") + rectHeight / 2
                circleID = d3.select(this).attr("id")
                if (d3.select(this).attr("data-click-count") == 0) {
                    showWriters(d.people, parseFloat(circleY), circleID, d.year);
                    main_year = d.year
                    setTimeout(function () {
                        d3.selectAll("#path").remove()
                        console.log(" code runing")
                        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        firstY = nullposition - rectHeight / 2
                        if (main_year != null && main_year != "" && main_year == "null", main_year.length == 4) {
                            firstY = +circleY;
                        }
                        // Set the path's d attribute to the path data
                        for (let key in d.value_counts) {
                            // Access each property using its key and log its value to the console
                            secondY = nullposition;
                            if (key != "" && key != null && key != "null" && key.length == 4) {
                                // secondY = yScale(new Date(key))
                                secondY = d3.select(" #book_year_circle" + key + ".book").attr("y")
                            }

                            // const pathData = `M ${first_timeline},${+firstY + 3} Q ${(first_timeline + second_timeline) / 2},${+firstY + 3} ${second_timeline},${+secondY + 3}`;
                            const pathData = `M ${first_timeline},${+firstY + 3} 
                            Q ${first_timeline + (second_timeline - first_timeline) / 3},${+firstY + 3} ${(first_timeline + second_timeline) / 2},${((+secondY) + (+firstY)) / 2 + 3} 
                            Q ${second_timeline - (second_timeline - first_timeline) / 3},${+secondY + 3} ${second_timeline},${+secondY + 3}`;

                            console.log(pathData)
                            svg.append("path")
                                .attr("id", function (d, i) { return "path" })
                                .attr("d", pathData)
                                // .attr("stroke", "black")
                                .style("z-index", 40)
                                .attr("stroke", "url(#stroke-gradient)")
                                .attr("fill", "none")
                                // .attr("stroke-dasharray", "4,4")
                                .attr("opacity", 0.7)

                                .attr("stroke-width", linesizeScale(d.value_counts[key]));
                        }
                    }, 400); // Delay of 2000 milliseconds (2 seconds)


                    // year_changed.push(d.year)
                    var yearFound = false;
                    for (var i = 0; i < year_changed.length; i++) {
                        if (year_changed[i].year === d.year) {
                            year_changed[i].count++; // If year already exists, increment the count
                            yearFound = true;
                            break;
                        }
                    }

                    if (!yearFound) {
                        year_changed.push({ year: d.year, count: 1 }); // If year does not exist, add it to the year_changed array
                    }
                    d3.select(this).attr("data-click-count", 1)
                }
                else if (d3.select(this).attr("data-click-count") == 1) {
                    year_changed.forEach(function (yearObj) {
                        if (yearObj.year === d.year) {
                            if (yearObj.count === 1) {
                                hideWindows(d.people, parseFloat(circleY) + 3, circleID);
                                setTimeout(function () {
                                    d3.selectAll("#path").remove()
                                    console.log(" code runing")
                                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                                    firstY = nullposition - rectHeight / 2
                                    if (main_year != null && main_year != "" && main_year == "null", main_year.length == 4) {
                                        firstY = +circleY;
                                    }
                                    // Set the path's d attribute to the path data
                                    for (let key in d.value_counts) {
                                        // Access each property using its key and log its value to the console
                                        secondY = nullposition;
                                        if (key != "" && key != null && key != "null" && key.length == 4) {
                                            // secondY = yScale(new Date(key))
                                            secondY = d3.select(" #book_year_circle" + key + ".book").attr("y")
                                        }

                                        // const pathData = `M ${first_timeline},${+firstY + 3} Q ${(first_timeline + second_timeline) / 2},${+firstY + 3} ${second_timeline},${+secondY + 3}`;
                                        const pathData = `M ${first_timeline},${+firstY + 3} 
                                        Q ${first_timeline + (second_timeline - first_timeline) / 3},${+firstY + 3} ${(first_timeline + second_timeline) / 2},${((+secondY) + (+firstY)) / 2 + 3} 
                                        Q ${second_timeline - (second_timeline - first_timeline) / 3},${+secondY + 3} ${second_timeline},${+secondY + 3}`;

                                        console.log(pathData)
                                        svg.append("path")
                                            .attr("id", function (d, i) { return "path" })
                                            .attr("d", pathData)
                                            // .attr("stroke", "black")
                                            .style("z-index", 40)
                                            .attr("stroke", "url(#stroke-gradient)")
                                            .attr("fill", "none")
                                            // .attr("stroke-dasharray", "4,4")
                                            .attr("opacity", 0.7)

                                            .attr("stroke-width", linesizeScale(d.value_counts[key]));
                                    }
                                }, 400); // Delay of 2000 milliseconds (2 seconds)

                                year_changed = year_changed.filter(function (item) {
                                    return item !== yearObj;
                                });
                            } else {
                                svg.selectAll("foreignObject")
                                    .filter(function () {
                                        return d3.select(this).attr("id") === circleID;
                                    }).remove();
                                yearObj.count--;
                            }
                            return; // Exit the loop
                        }
                    });
                    d3.select(this).attr("data-click-count", 0)
                }
            }

            )
    })

    d3.json('http://127.0.0.1:8000/get-firms_with_detail/?genre_id=' + genre.toString() + '&job_id=' + firm.toString()).then(function (response) {
        data = response.firms_with_book;
        console.log(data, "firm")
        // var xScale = d3.scaleTime()
        // .domain([ new Date("1700"), new Date("1836")])
        // .range([timelineMargin, width - timelineMargin]);
        var year_firmSel = svg.selectAll(".firm_year")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "firm-year");
        var sizeScale = d3.scaleLinear()
            .domain([1, 50])
            .range([10, 35])


        var year_firmCircles = year_firmSel.append("rect")
            .attr("class", "firm")
            .attr("id", function (d) {
                return "firm_circle" + d.year
            })
            .attr("x", function (d) {
                if ((d.year == "empty") || (d.year == "") || (d.year == "1600")) {
                    return third_timeline - (90 / 2)
                }

                return third_timeline - (sizeScale(d.size) / 2)
            })
            .attr("y", function (d) {
                if ((d.year == "empty") || (d.year == "") || (d.year == "1600")) {
                    return nullposition - (rectHeight / 2);
                }
                return yScale(new Date(d.year.substring(0, 4))) - (rectHeight / 2);
            })
            .attr("width", function (d) {
                if ((d.year == "empty") || (d.year == "") || (d.year == "1600")) {
                    return 90
                }
                return sizeScale(d.size)
            })
            .attr("height", rectHeight)
            .style("cursor", "pointer") // make it appear clickable
            .style("fill", colors[3])
            .attr("opacity", 0.7)
            .style("z-index", 1) // set a lower z-index for the paths
            .style("stroke-linecap", "round")
            .attr("data-click-count", 0)
            .on("mouseover", function (e, d) {
                main_year = d.year
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                firstY = nullposition
                if (main_year != null && main_year != "" && main_year == "null", main_year.length == 4) {
                    firstY = d3.select(this).attr("y")
                }
                // Set the path's d attribute to the path data
                for (let key in d.value_counts) {
                    // Access each property using its key and log its value to the console
                    secondY = nullposition;
                    if (key != "" && key != null && key != "null" && key.length == 4) {
                        // secondY = yScale(new Date(key))
                        secondY = d3.select(" #book_year_circle" + key + ".book").attr("y")
                    }

                    const pathData = `M ${third_timeline},${+firstY + 3} 
                    Q ${third_timeline + (second_timeline - third_timeline) / 3},${+firstY + 3} ${(third_timeline + second_timeline) / 2},${((+secondY) + (+firstY)) / 2 + 3} 
                    Q ${second_timeline - (second_timeline - third_timeline) / 3},${+secondY + 3} ${second_timeline},${+secondY + 3}`;

                    svg.append("path")
                        .attr("id", function (d, i) { return "path" })
                        .attr("d", pathData)
                        // .attr("stroke", "black")
                        // .attr("stroke-dasharray", "4,4")
                        .attr("opacity", 0.7)
                        .attr("stroke", "url(#stroke-gradient)")
                        .attr("fill", "none")
                        .style("z-index", 0) // set a lower z-index for the paths
                        .attr("stroke-width", linesizeScale(d.value_counts[key]))
                        .attr("style", "pointer-events: none;").lower()

                }
            })
            .on("mouseout", function (d) {
                d3.selectAll("#path").remove()
            }).on("click", function (e, d) {
                circleY = +d3.select(this).attr("y") + rectHeight / 2
                circleID = d3.select(this).attr("id")
                if (d3.select(this).attr("data-click-count") == 0) {
                    showFirms(d.firms, parseFloat(circleY), circleID, d.year);
                    setTimeout(function () {
                        d3.selectAll("#path").filter(function (d) {
                            var pathData = d3.select(this).attr("d");
                            console.log("d", pathData)
                            return pathData.includes("Q"); // Get the DOM node of the path element

                        }).remove()
                        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                        firstY = nullposition - rectHeight / 2
                        if (main_year != null && main_year != "" && main_year == "null", main_year.length == 4) {
                            firstY = +circleY;
                        }
                        // Set the path's d attribute to the path data
                        for (let key in d.value_counts) {
                            // Access each property using its key and log its value to the console
                            secondY = nullposition;
                            if (key != "" && key != null && key != "null" && key.length == 4) {
                                // secondY = yScale(new Date(key))
                                secondY = +d3.select(" #book_year_circle" + key + ".book").attr("y") + 3
                            }

                            const pathData = `M ${third_timeline},${+firstY} 
                            Q ${third_timeline + (second_timeline - third_timeline) / 3},${+firstY} ${(third_timeline + second_timeline) / 2},${((+secondY) + (+firstY)) / 2 + 3} 
                            Q ${second_timeline - (second_timeline - third_timeline) / 3},${+secondY + 3} ${second_timeline},${+secondY + 3}`;

                            svg.append("path")
                                .attr("id", function (d, i) { return "path" })
                                .attr("d", pathData)
                                // .attr("stroke", "black")
                                // .attr("stroke-dasharray", "4,4")
                                .attr("opacity", 0.7)
                                .attr("stroke", "url(#stroke-gradient)")
                                .attr("fill", "none")
                                .style("z-index", 0) // set a lower z-index for the paths
                                .attr("stroke-width", linesizeScale(d.value_counts[key]))
                                .attr("style", "pointer-events: none;").lower()

                        }
                    }, 400); // Delay of 2000 milliseconds (2 seconds)


                    // year_changed.push(d.year)
                    var yearFound = false;

                    for (var i = 0; i < year_changed.length; i++) {
                        if (year_changed[i].year === d.year) {
                            year_changed[i].count++; // If year already exists, increment the count
                            yearFound = true;
                            break;
                        }
                    }

                    if (!yearFound) {
                        year_changed.push({ year: d.year, count: 1 }); // If year does not exist, add it to the year_changed array
                    }
                    d3.select(this).attr("data-click-count", 1)
                }
                else if (d3.select(this).attr("data-click-count") == 1) {
                    // year_changed = year_changed.filter(function (yearIn) {
                    //     return yearIn !== d.year;
                    // });
                    year_changed.forEach(function (yearObj) {
                        if (yearObj.year === d.year) {
                            if (yearObj.count === 1) {
                                hideWindows(d.firms, parseFloat(circleY) + 3, circleID);
                                setTimeout(function () {
                                    d3.selectAll("#path").remove()
                                    console.log(" code runing")
                                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                                    firstY = nullposition - rectHeight / 2
                                    if (main_year != null && main_year != "" && main_year == "null", main_year.length == 4) {
                                        firstY = +circleY;
                                    }
                                    // Set the path's d attribute to the path data
                                    for (let key in d.value_counts) {
                                        // Access each property using its key and log its value to the console
                                        secondY = nullposition;
                                        if (key != "" && key != null && key != "null" && key.length == 4) {
                                            // secondY = yScale(new Date(key))
                                            secondY = d3.select(" #book_year_circle" + key + ".book").attr("y")
                                        }

                                        const pathData = `M ${third_timeline},${+firstY + 3} 
                                        Q ${third_timeline + (second_timeline - third_timeline) / 3},${+firstY + 3} ${(third_timeline + second_timeline) / 2},${((+secondY) + (+firstY)) / 2 + 3} 
                                        Q ${second_timeline - (second_timeline - third_timeline) / 3},${+secondY + 3} ${second_timeline},${+secondY + 3}`;

                                        svg.append("path")
                                            .attr("id", function (d, i) { return "path" })
                                            .attr("d", pathData)
                                            // .attr("stroke", "black")
                                            // .attr("stroke-dasharray", "4,4")
                                            .attr("opacity", 0.7)
                                            .attr("stroke", "url(#stroke-gradient)")
                                            .attr("fill", "none")
                                            .style("z-index", 0) // set a lower z-index for the paths
                                            .attr("stroke-width", linesizeScale(d.value_counts[key]))
                                            .attr("style", "pointer-events: none;").lower()

                                    }
                                }, 400); // Delay of 2000 milliseconds (2 seconds)

                                year_changed = year_changed.filter(function (item) {
                                    return item !== yearObj;
                                });
                            } else {
                                related_foreignObject = svg.selectAll("foreignObject")
                                    .filter(function () {
                                        return d3.select(this).attr("id") === circleID;
                                    }).remove();
                                yearObj.count--;
                            }
                            return; // Exit the loop
                        }
                    });
                    d3.select(this).attr("data-click-count", 0)
                }
            })

    })





}




cite_update('0', '0', '0', '0');
function book_coloring(years_ids, color) {

}

// Apply the gradient as the background
// TODO: delete this if we dont need search button helper
// d3.select('#search-input')
//         .on('input', function () { console.log("hereeeee") });



//     d3.select('#search-button').on('click', function () {
//         const searchInput = d3.select('#search-input').node().value;
//         d3.json(`http://127.0.0.1:8000/get-people-pub/?first_name_n=${searchInput}`)
//             .then(function (response) {
//                 console.log(response.people_with_book)
//                 response.people_with_book.forEach(element => {
//                     svg.selectAll(".searchresult")
//                         .data(element.books)
//                         .enter()
//                         .append("circle")
//                         .attr("class", "searchresult")
//                         .attr("cx", function (d) {
//                             return xScale(new Date(d[7]));

//                         })
//                         .attr("cy", timeline_hight - 20)
//                         .attr("r", 5)
//                         .attr("opacity", .9)
//                         // .transition()
//                         .style("fill", colors[1])
//                         .style("visibility", "visible")
//                 });



//             })



//     })
// var style = svg.append("style");

// // Set the CSS code
// var cssCode = 'input[type="color"] {' +
//               '  width: 25px;' +
//               '  height: 25px;' +
//               '  padding: 0;' +
//               '  border: none;' +
//               '  border-radius: 50%;' +
//               '  appearance: none;' +
//               '  -webkit-appearance: none;' +
//               '  outline: none;' +
//               '  cursor: pointer;' +
//               '}';

// // Set the text content of the style element to the CSS code
// style.text(cssCode);

//////////////////////
// d3.json('http://127.0.0.1:8000/get-people_with_detail/').then(function (response) {
//     data = response.people_with_book;
//     // var xScale = d3.scaleTime()
//     // .domain([ new Date("1700"), new Date("1836")])
//     // .range([timelineMargin, width - timelineMargin]);
//     var year_peopleSel = svg.selectAll(".people_year")
//         .data(data)
//         .enter()
//         .append("g")
//         .attr("class", "people-year");
//     var sizeScale = d3.scaleLinear()
//         .domain([1, 150])
//         .range([4, 40])


//     var year_peopleCircles = year_peopleSel.append("rect")
//         .attr("x", function (d) {

//             return 100 - (sizeScale(d.size) / 2)
//         })
//         .attr("y", function (d) {
//             if ((d.year == "empty") || (d.year == "")) {
//                 return 60 - (rectHeight / 2);
//             }
//             return yScale(new Date(d.year.substring(0, 4))) - 3;
//         })
//         .attr("width", function (d) {
//             return sizeScale(d.size)
//         })
//         .attr("height", rectHeight)
//         // .append("circle")
//         .attr("class", "people")
//         .attr("id", function (d) {
//             return d.year + "people_circle"
//         })
//         .attr("data-click-count", 0)
//         .style("fill", colors[3])
//         .attr("opacity", 0.3)
//         .on("mouseover", function (e, d) {
//             main_year = d.year
//             const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
//             firstY = 30
//             if (main_year != null && main_year != "" && main_year == "null", main_year.length == 4) {
//                 //  console.log(main_year)
//                 firstY = d3.select(this).attr("y")
//             }
//             // Set the path's d attribute to the path data
//             for (let key in d.value_counts) {
//                 // Access each property using its key and log its value to the console
//                 secondY = 60;
//                 if (key != "" && key != null && key != "null" && key.length == 4) {
//                     // console.log(d3.select(" #book_year_circle" + key + ".book"))
//                     // secondY = yScale(new Date(key))
//                     secondY = d3.select(" #book_year_circle" + key + ".book").attr("y")
//                 }

//                 const pathData = `M ${100},${+firstY + 3} Q ${(100 + 450) / 2},${+firstY + 3} ${450},${+secondY + 3}`;
//                 const lineGenerator = d3.line()
//                     .curve(d3.curveBasis); // Change this to adjust the type of curve

//                 const data = [
//                     [100, +firstY + 3],
//                     [(100 + 450) / 2, +firstY + 3],
//                     [450, +secondY + 3]
//                 ];
//                 svg.append("path")
//                     .attr("id", function (d, i) { return "path" })
//                     .attr("d", pathData)
//                     .attr("stroke", "black")
//                     .attr("stroke", "url(#stroke-gradient)")
//                     .attr("fill", "none")
//                     // .attr("stroke-dasharray", "4,4")
//                     .attr("opacity", 0.1)

//                     .attr("stroke-width", linesizeScale(d.value_counts[key]));
//             }
//         })
//         .on("mouseout", function (d) {
//             d3.selectAll("#path").remove()
//         })
//         .on("click", function (e, d) {
//             circleY = d3.select(this).attr("y") + 6
//             circleID = d3.select(this).attr("id")
//             if (d3.select(this).attr("data-click-count") == 0) {
//                 showWriters(d.people, parseFloat(circleY), circleID);
//                 year_changed.push(d.year)
//                 d3.select(this).attr("data-click-count", 1)
//             }
//             else if (d3.select(this).attr("data-click-count") == 1) {
//                 hideWriters(d.people, parseFloat(circleY), circleID);
//                 year_changed = year_changed.filter(function (yearIn) {
//                     return yearIn !== d.year;
//                 });
//                 d3.select(this).attr("data-click-count", 0)
//             }
//         }

//         )
// })
////////////////////////////////////////////////////////
// function onePersonMatchLine(id) {
//     d3.json('http://127.0.0.1:8000/get_one_person_book/?id_n=' + id).then(function (response) {
//         var sizeScale = d3.scaleLinear()
//             .domain([1, 20])
//             .range([2, 5])
//         data = response.person_books;
//         var onePersonTimelineG = svg.selectAll(".person_timeline")
//             .data(data)
//             .enter()
//             .append("g")
//             .attr("id", id)
//             .attr("class", "person-timeline");
//         var sizeScale = d3.scaleLinear()
//             .domain([1, 150])
//             .range([4, 20])


//         var onePersonTimelineCircles = onePersonTimelineG.append("circle")
//             .attr("class", "person_timeline_circle")
//             .attr("id", function (d) {
//                 return d.year + "people_circle"
//             })
//             .attr("cx", timelineLocation)
//             .attr("cy", function (d) {
//                 margin = 0
//                 year_changed.forEach(year_str => {
//                     if ((yScale(new Date(d.year))) > (yScale(new Date(year_str)))) {
//                         margin = margin + 100;
//                     }
//                 })
//                 return margin + yScale(new Date(d.year))
//             })
//             .attr("r", function (d) {
//                 return sizeScale(d.size)
//             })
//             .style("fill", colors[3])
//             .attr("opacity", 1)



//     })
// }
// function hideWriters(people, circleY, circleID) {
//     related_foreignObject = svg.selectAll("foreignObject")
//         .filter(function () {
//             return d3.select(this).attr("id") === circleID;
//         }).remove();
//     svg.selectAll("text")
//         .filter(function () {
//             return +d3.select(this).attr("y") > circleY;
//         })
//         .attr("y", function () {
//             return (+d3.select(this).attr("y") - 100)
//         });
//     d3.selectAll("[class^='person-timeline-text']")
//         .filter(function () {
//             return +d3.select(this).attr("y") > circleY;
//         }).attr("tranform", function () {
//             var text = d3.select(this);
//             var currentTransform = text.attr("transform");
//             var existingY = parseFloat(currentTransform.split(",")[2].trim());
//             var newY = existingY - 100;
//             newTransform = currentTransform.replace(existingY, newY)
//             text.attr("transform", newTransform);
//         })
//     svg.selectAll("rect").filter(function (d) {
//         return d3.select(this).attr("y") > circleY;
//     })
//         .transition()
//         .duration(500)
//         .attr("y", function () {
//             return (+d3.select(this).attr("y") - 100)
//         });
//     svg.selectAll("circle").filter(function (d) {
//         return +d3.select(this).attr("cy") > circleY;
//     })
//         // .transition()
//         // .duration(500)
//         .attr("cy", function () {
//             return (+d3.select(this).attr("cy") - 100)
//         }).style("fill", colors[3]);

//     svg.selectAll("foreignObject")
//         .filter(function () {
//             return +d3.select(this).attr("y") > circleY;
//         }).transition()
//         .duration(500)
//         .attr("y", function () {
//             return (+d3.select(this).attr("y") - 100)
//         })
// }