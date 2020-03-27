



d3.csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv", function(error,data){

    let ausData = data.filter(function(row) {return (row["Country/Region"] ==="Australia" )});
    let italyData = data.filter(function(row) {return (row["Country/Region"] ==="Italy" )});
    let nzData = data.filter(function(row) {return (row["Country/Region"] ==="New Zealand" )});

    let usData = data.filter(function(row) {return (row["Country/Region"] ==="US" )});
    
    let deData =  data.filter(function(row) {return (row["Country/Region"] ==="Germany" )});

    let skData =  data.filter(function(row) {return (row["Country/Region"] ==="Korea, South" )});

    let qldData = ausData.filter(function(row){return(row["Province/State"] === "Queensland")});
    let nswData = ausData.filter(function(row){return(row["Province/State"] === "New South Wales")});
    let saData = ausData.filter(function(row){return(row["Province/State"] === "South Australia")});
    let vicData = ausData.filter(function(row){return(row["Province/State"] === "Victoria")});
    let actData = ausData.filter(function(row){return(row["Province/State"] === "Australian Capital Territory")});
    let tasData = ausData.filter(function(row){return(row["Province/State"] === "Tasmania")});
    let ntData = ausData.filter(function(row){return(row["Province/State"] === "Northern Territory")});
    let waData = ausData.filter(function(row){return(row["Province/State"] === "Western Australia")});

    //predicted qld infections
    drawPredictionTile(qldData, "queensland");
    
    drawPredictionTile(nswData, "nsw");
    //predicted qld infections
    drawPredictionTile(vicData, "Vic");

    drawPredictionTile(nzData, "new zealand");

    drawPredictionTile(italyData, "italy");

    drawPredictionTile(usData, "usa");

    drawPredictionTile(skData, "south korea");
    //drawPredictionTile(deData, "germany");



});



function drawPredictionTile(dataSet, title){
    
    var dayBeforeThatString = getCsvReadyDate("dayBeforeThat");
    var dayBeforeString = getCsvReadyDate("dayBefore");
    var yesterdayString = getCsvReadyDate("yesterday");
    var todayString = getCsvReadyDate("today");
    
    

    var dayBeforeThatConfirmed = dataSet[0][dayBeforeThatString];
    var dayBeforeConfirmed = dataSet[0][dayBeforeString];
    var yesterdayConfirmed = dataSet[0][yesterdayString];
    var todayConfirmed = dataSet[0][todayString];
    
    var differenceToday = todayConfirmed-yesterdayConfirmed;
    var differenceYeserday = yesterdayConfirmed - dayBeforeConfirmed;


    var todaysMultiplier= (todayConfirmed/yesterdayConfirmed);
    var todaysMultiplierString = todaysMultiplier.toFixed(2);
    var yesterdaysMultiplier=(yesterdayConfirmed/dayBeforeConfirmed);    
    var yesterdaysMultiplierString = yesterdaysMultiplier.toFixed(2);

    var tomorrowsPrediction = calculateRollingPredictionMultiplier(dataSet, "today")* todayConfirmed;
    var predictionMultiplierString = calculateRollingPredictionMultiplier(dataSet, "today").toFixed(2);
    var predictionMultiplier = calculateRollingPredictionMultiplier(dataSet, "today");    
    var todaysPrediction = calculateRollingPredictionMultiplier(dataSet, "yesterday") * yesterdayConfirmed;
    var fillColourPredicted = "red";
    if(todaysPrediction >todayConfirmed){
        fillColourPredicted = "cyan"
    }
    var fillColourDaily = "red";
    if(yesterdaysMultiplier >todaysMultiplier){
        fillColourDaily = "cyan"
    }
    



        // Set the dimensions of the canvas / graph
    var margin = {top: 50, right: 40, bottom: 50, left:150},
        width = 230 - margin.left - margin.right,
        height = 640 - margin.top - margin.bottom;

    
    var fontSizeNumber = "28pt";
    var smallerFont = "10pt";
    var incrementSection = 0;
    var opacityMedium = 0.5;
    var numberFont = "Major Mono Display"

    var svg = d3.select("#vis")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")").attr("id","number")
        .style("text-anchor", "middle")
        .style("font-size", "12pt")
        .style("opacity",opacityMedium)
        .text(title)
        .style("font-size", "18pt");

        incrementSection=incrementSection+50;
        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "12pt")
        .style("opacity",opacityMedium)
        .text("Total")
        .transition()
        .duration(1000)
        .style("font-size", "14pt");

        incrementSection=incrementSection+40;
        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")").attr("id","number")
        .style("text-anchor", "middle")
        .style("opacity",1)
        .text(todayConfirmed)
        .transition()
        .duration(1000)
        .style("font-size", fontSizeNumber);

        incrementSection=incrementSection+20;
        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")")
        .style("text-anchor", "middle")
        .style("opacity",opacityMedium)
        .style("border", "1px black")
        .text(todaysMultiplierString + "x yesterday's total")
        .style("fill", fillColourDaily)
        .style("font-size", smallerFont);
        incrementSection=incrementSection+20;
        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "12pt")
        .style("font-style", "italics")
        .style("opacity",opacityMedium)
        .style("border", "1px black")
        .text("Predicted: " + ~~todaysPrediction)
        .style("fill",fillColourPredicted)
        .transition()
        .duration(1000)
        .style("font-size", smallerFont);

        incrementSection=incrementSection+40;
        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "12pt")
        .style("opacity",opacityMedium)
        .text("Yesterday")
        .transition()
        .duration(1000)
        .style("font-size", "14pt");

        incrementSection=incrementSection+40;
        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")").attr("id","number")
        .style("text-anchor", "middle")
        .style("opacity",1)
        .text(yesterdayConfirmed)
        .style("fontFamily", numberFont)
        .style("font-size", fontSizeNumber);

        incrementSection=incrementSection+20;
        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "12pt")
        .style("font-style", "italics")
        .style("opacity",opacityMedium)
        .text(yesterdaysMultiplierString + "x previous day's total")
        .style("font-size", smallerFont);


        incrementSection=incrementSection+50;
        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "12pt")
        .style("opacity",opacityMedium)
        .text("Tomorrow's Estimate")
        .style("font-size", "14pt");

        incrementSection=incrementSection+40;
        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")").attr("id","number")
        .style("text-anchor", "middle")
        .style("opacity",1)
        .style("border", "1px black")
        .text(~~tomorrowsPrediction)
        .style("fontFamily", numberFont)
        .style("font-size", fontSizeNumber);

        incrementSection=incrementSection+20;
        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")")
        .style("text-anchor", "middle")
        .style("font-style", "italics")
        .style("opacity",opacityMedium)
        .style("border", "1px black")
        .text(predictionMultiplierString + "x today's total")
        .style("font-size", smallerFont);

        incrementSection=incrementSection+50;
        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "12pt")
        .style("opacity",opacityMedium)
        .text("New Cases Today")
        .style("font-size", "14pt");

        
        incrementSection=incrementSection+40;
        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")").attr("id","number")
        .style("text-anchor", "middle")
        .style("font-size", "12pt")
        .style("opacity",1)
        .text(differenceToday)
        .style("font-size", fontSizeNumber);

        incrementSection=incrementSection+50;
        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "12pt")
        .style("opacity",opacityMedium)
        .text("New Cases Yesterday")
        .style("font-size", "14pt");

        incrementSection=incrementSection+40;
        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")").attr("id","number")
        .style("text-anchor", "middle")
        .style("opacity",1)
        .style("border", "1px black")
        .text(differenceYeserday)
        .style("fontFamily", numberFont)
        .style("font-size", fontSizeNumber);

        var date = new Date();
        var formattedDate = date.getUTCFullYear()+"-"+(date.getMonth()+1)+'-'+(date.getUTCDate()-1);
        
        incrementSection=incrementSection+40;
        svg.append("text")             
        .attr("transform",
            "translate(" + ((width+margin.left+margin.right)/2 -150)+ " ," + (incrementSection) + ")").attr("id","number")
        .style("text-anchor", "middle")
        .style("opacity",opacityMedium)
        .style("border", "1px black")
        .text("As of "+formattedDate)
        .style("font-size", smallerFont);


}

function getCsvReadyDate(todayOrYesterday){
    //req format 1/22/20
    var date = new Date();
    if (todayOrYesterday === "yesterday"){
        date.setDate(date.getUTCDate() - 2);
    }
    if (todayOrYesterday === "dayBefore"){
        date.setDate(date.getUTCDate() - 3);
    }
    if (todayOrYesterday === "dayBeforeThat"){
        date.setDate(date.getUTCDate() - 4);
    }
    
    return formattedDate = (date.getMonth()+1)+'/'+(date.getUTCDate()-1)+'/20';

}

function calculateRollingPredictionMultiplier(dataSet, yesterdayOrToday){  
    
    var day = 0;
    var twoWeekMultiplierCumulative =0;
    var twoWeekMultiplierAverage =0;
   
    
    if( yesterdayOrToday === "yesterday") {
        day =1;
    }
    if( yesterdayOrToday === "twoWeeksAgo") {
        day =14;
    }

    var date = new Date();
        date.setDate(date.getUTCDate()-(1+day));
        
        var yesterday = new Date();
        yesterday.setDate(yesterday.getUTCDate()-(2+day));
        
        
    for ( i =1;i<=14;i++){
        

        var formattedDateOnThisDay = (date.getMonth()+1)+'/'+(date.getUTCDate()-(i+day))+'/20';
        var formattedDateOnPreviousDay = (yesterday.getMonth()+1)+'/'+(yesterday.getUTCDate()-(i+day))+'/20';

        
        var confirmedCasesOnThisDay = dataSet[0][formattedDateOnThisDay];
        var confirmedCasesOnPreviousDay = dataSet[0][formattedDateOnPreviousDay];
        var changeMultiplierToday = confirmedCasesOnThisDay/confirmedCasesOnPreviousDay;
  
        twoWeekMultiplierCumulative = twoWeekMultiplierCumulative + changeMultiplierToday;
        
        
    }

    twoWeekMultiplierAverage = twoWeekMultiplierCumulative/14;
    twoWeekChangeInMultiplierAverage = twoWeekMultiplierCumulative/14;
    console.log(twoWeekMultiplierAverage);
    console.log(twoWeekChangeInMultiplierAverage);
    return twoWeekMultiplierAverage;
}


