
// randomizing the doors: -------------------------------
// FIRST OPERATION (1):
{
    let sb;
    

    let chosenInd = Math.floor(Math.random() * 3);
    let prizedInd = Math.floor(Math.random() * 3);


    for (let i = 1; i < 5; i++){ //adds the stuff to showboards (1 - 4)
        sb = $("#showboard"+i).children();
        if (i != 4){ //uuuuh, i first set this as 'i =! 4' and it completely broke everything making me waste like half an hour pinning down the issue (wtf)
            $(sb[chosenInd]).addClass("picked");
        }
        $(sb[prizedInd]).addClass("prized"); 
    }
    


// SECOND OPERATION (2):

    let openedInd;
    while(true){
        
        openedInd = Math.floor(Math.random() * 3);
        window.console.log("o="+openedInd+" p= "+prizedInd+" c ="+chosenInd);
        if (!(openedInd == chosenInd || openedInd == prizedInd)){//guarantees that opened door is neither the prized nor the chosen
            break;
        }
    }
    for (let i = 2; i < 5; i++){ //adds the stuff to showboards (2 - 4)
        sb = $("#showboard"+i).children();
        $(sb[openedInd]).removeClass("closed door");
        $(sb[openedInd]).addClass("door-perma"); //'door-perma' is a class targeted identically to 'door' by css, but ignored by this js stuff 
    }


// THIRD OPERATION (3):
    let switchInd;
    for (let i = 0; i<3; i++){
        if (!(i == chosenInd || i == openedInd)){ //gets ind of door that wasn't chosen nor opened
            switchInd = i;
            break;
        }
    }
    
    sb = $("#showboard4").children();

    $(sb[chosenInd]).removeClass("closed door");
    $(sb[chosenInd]).addClass("door-perma");     

    $(sb[switchInd]).removeClass("closed door");
    $(sb[switchInd]).addClass("door-perma picked"); 


    //adding the percentages on showboard3:
    sb = $("#showboard3").children();

    $(sb[chosenInd]).append("<div>1/3</div>");
    $(sb[switchInd]).append("<div>2/3</div>");

}

// OK HERE'S THE PLAN: on hover: play a gif of loading -> sleep for some time -> show contents of door
{ // (scope for variables) DOOR REVEAL STUFF: ----------------------
let lastClicked;
let timeoutId;

$(".door").hover(function(){ // on Hover 
    clearTimeout(timeoutId);

    $(this).removeClass("open");
    $(this).addClass("loading closed");
    thisOne = this;
    timeoutId = setTimeout(function(){
        $(thisOne).addClass("open");
        $(thisOne).removeClass("loading closed");
    },700); 

});

$(".door").click(function(){  // on Click
    $(lastClicked).removeClass("open"); //resets previously clicked one
    $(lastClicked).addClass("closed");

    clearTimeout(timeoutId)
    $(this).removeClass("loading closed");
    $(this).addClass("open"); 
    thisOne = this;
    lastClicked = this;
    timeoutId = setTimeout(function(){ //this is for touch screens, since with those we can't count on mouseout
        $(thisOne).removeClass("open loading"); 
        $(thisOne).addClass("closed");
    },1500);

});


$(".door").mouseout(function(){ //on Mouse Out
    clearTimeout(timeoutId);
    $(this).removeClass("loading loaded");
    $(this).addClass("closed");

      
});
}   //End of Door Reveal Stuff -----------------------------------------




$("#run-button").click(function(){
    $("#results").empty(); //empties results
    
    $("#logs").empty(); //empties logs
    $("<p>(e)Escolhido - (p)Premiado - (r)Removido<br><br><p>").appendTo("#logs");//resets original log message

    $("#text-results").empty(); //empties text results
    $("<p>Resultados:</p>").appendTo("#text-results");

    const switchDoors = $("#switch-doors").is(":checked"); //turns the checkbox into this boolean constant
    let numOfTrials = $("#number-of-trials").val(); //stores input number of trials in this variable
    
    let numOfWins = 0;
    


    for (let i = 0; i < numOfTrials; i++){
        let message;
        let doors = [false, false, false];
        doors[Math.floor(Math.random()*3)] = true; //picks a random index from 0 to 2 and sets it to true;
        let chosenDoorInd = Math.floor(Math.random()*3); //picks random index for chosen door

        message = (i+1) + ":";

        function visualize(){ //this makes the '[][][]' and fills accordingly
            for (let i_temp = 0; i_temp<3; i_temp++){
                message = message + " ["
                if (doors[i_temp]){
                    message = message + "p"; //adds the prized thingy if its prized
                }
                if (i_temp == chosenDoorInd){
                    message = message + "e";
                }
                if (doors[i_temp] == null){
                    message = message + "r";
                }
                message = message + "] "//finalizer
            }
        }
        //-------------------------------------------
        visualize();

        while(true){
            let temp = Math.floor(Math.random()*3);
            if (!(doors[temp] || (temp == chosenDoorInd))){ //this ensures that the removed door is neither the picked nor the prized one
                doors[temp] = null;//removes door
                break;
            }
        }
        
        message = message + "→"
        visualize();
        //-----------------------------------------
        if (switchDoors){
            let temp;

            for (let i_temp = 0; i_temp<3; i_temp++){
                if (!(doors[i_temp] == null || i_temp == chosenDoorInd)){
                    temp = i_temp; //collects the index of the remaining door
                }
            }
            //switching the doors:
            chosenDoorInd = temp;

            message = message + "→ troca →";
        } else {
            message = message + "→ mantém →";
        }
        //-------------------------------------------
        visualize();

        let myDiv = document.createElement('div');// creates div (OH BOY, I SURE HOPE THIS WORKS ON SAFARI!!!) 

        if (doors[chosenDoorInd]){
            message = message + "→ <span style='font-size:1.35em;'>ganha</span>";
            numOfWins = numOfWins + 1;
            myDiv.classList.add('win'); //adds class win to myDiv
        } else {
            message = message + "→ <span style='font-size:1.35em;'>perde</span>";
            myDiv.classList.add('loss'); //adds class loss to myDiv
        }
        //-----------------------------------------
        myDiv.setAttribute('title',("trial " + (i+1)));
        let resultBoard = document.getElementById("results");
        resultBoard.appendChild(myDiv); //adds created div to resultBoard
        
        $("<p>" + message +"<p>").appendTo("#logs");//appends new 'p' to the logs
    } 
    var textResult = document.getElementById("text-results");

    winRate = Math.floor(numOfWins / numOfTrials * 100);
    textResult.textContent += " " + winRate + "% taxa de vitória (Vitórias=" + numOfWins + ", Derrotas=" + (numOfTrials-numOfWins) + ")."; //gets 'gext-results' elements and adds text to it

})