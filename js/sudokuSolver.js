//Load DOM and ready to be manipulated.
$(document).ready(function()
{
    //Process form whenever submit button is clicked
    $('#submit').click(function()
    {
        //Get the values from input fields
        var rowA = $('#rowA').val();
        var rowB = $('#rowB').val();
        var rowC = $('#rowC').val();
        var rowD = $('#rowD').val();
        var rowE = $('#rowE').val();
        var rowF = $('#rowF').val();
        var rowG = $('#rowG').val();
        var rowH = $('#rowH').val();
        var rowI = $('#rowI').val();
        var givenValues = new Array(rowA,rowB,rowC,rowD,rowE,rowF,rowG,rowH,rowI);
        //console.log(givenValues);
               
        //Validate user input data
        $.validateData(rowA);
        $.validateData(rowB);
        $.validateData(rowC);
        $.validateData(rowD);
        $.validateData(rowE);
        $.validateData(rowF);
        $.validateData(rowG);
        $.validateData(rowH);
        $.validateData(rowI);
        
        //Build marker board. The sudoku board is made of 81 coordinate points. 
        //Each coordinate point has it own corresponding marker list.
        //The marker list represents all the possible numbers that can be place in that coordinate.
        var markerBoard = 
            {
                "AA": [1,2,3,4,5,6,7,8,9],
                "AB": [1,2,3,4,5,6,7,8,9],
                "AC": [1,2,3,4,5,6,7,8,9],
                "AD": [1,2,3,4,5,6,7,8,9],
                "AE": [1,2,3,4,5,6,7,8,9],
                "AF": [1,2,3,4,5,6,7,8,9],
                "AG": [1,2,3,4,5,6,7,8,9],
                "AH": [1,2,3,4,5,6,7,8,9],
                "AI": [1,2,3,4,5,6,7,8,9],
                "BA": [1,2,3,4,5,6,7,8,9],
                "BB": [1,2,3,4,5,6,7,8,9],
                "BC": [1,2,3,4,5,6,7,8,9],
                "BD": [1,2,3,4,5,6,7,8,9],
                "BE": [1,2,3,4,5,6,7,8,9],
                "BF": [1,2,3,4,5,6,7,8,9],
                "BG": [1,2,3,4,5,6,7,8,9],
                "BH": [1,2,3,4,5,6,7,8,9],
                "BI": [1,2,3,4,5,6,7,8,9],
                "CA": [1,2,3,4,5,6,7,8,9],
                "CB": [1,2,3,4,5,6,7,8,9],
                "CC": [1,2,3,4,5,6,7,8,9],
                "CD": [1,2,3,4,5,6,7,8,9],
                "CE": [1,2,3,4,5,6,7,8,9],
                "CF": [1,2,3,4,5,6,7,8,9],
                "CG": [1,2,3,4,5,6,7,8,9],
                "CH": [1,2,3,4,5,6,7,8,9],
                "CI": [1,2,3,4,5,6,7,8,9],
                "DA": [1,2,3,4,5,6,7,8,9],
                "DB": [1,2,3,4,5,6,7,8,9],
                "DC": [1,2,3,4,5,6,7,8,9],
                "DD": [1,2,3,4,5,6,7,8,9],
                "DE": [1,2,3,4,5,6,7,8,9],
                "DF": [1,2,3,4,5,6,7,8,9],
                "DG": [1,2,3,4,5,6,7,8,9],
                "DH": [1,2,3,4,5,6,7,8,9],
                "DI": [1,2,3,4,5,6,7,8,9],
                "EA": [1,2,3,4,5,6,7,8,9],
                "EB": [1,2,3,4,5,6,7,8,9],
                "EC": [1,2,3,4,5,6,7,8,9],
                "ED": [1,2,3,4,5,6,7,8,9],
                "EE": [1,2,3,4,5,6,7,8,9],
                "EF": [1,2,3,4,5,6,7,8,9],
                "EG": [1,2,3,4,5,6,7,8,9],
                "EH": [1,2,3,4,5,6,7,8,9],
                "EI": [1,2,3,4,5,6,7,8,9],
                "FA": [1,2,3,4,5,6,7,8,9],
                "FB": [1,2,3,4,5,6,7,8,9],
                "FC": [1,2,3,4,5,6,7,8,9],
                "FD": [1,2,3,4,5,6,7,8,9],
                "FE": [1,2,3,4,5,6,7,8,9],
                "FF": [1,2,3,4,5,6,7,8,9],
                "FG": [1,2,3,4,5,6,7,8,9],
                "FH": [1,2,3,4,5,6,7,8,9],
                "FI": [1,2,3,4,5,6,7,8,9],
                "GA": [1,2,3,4,5,6,7,8,9],
                "GB": [1,2,3,4,5,6,7,8,9],
                "GC": [1,2,3,4,5,6,7,8,9],
                "GD": [1,2,3,4,5,6,7,8,9],
                "GE": [1,2,3,4,5,6,7,8,9],
                "GF": [1,2,3,4,5,6,7,8,9],
                "GG": [1,2,3,4,5,6,7,8,9],
                "GH": [1,2,3,4,5,6,7,8,9],
                "GI": [1,2,3,4,5,6,7,8,9],
                "HA": [1,2,3,4,5,6,7,8,9],
                "HB": [1,2,3,4,5,6,7,8,9],
                "HC": [1,2,3,4,5,6,7,8,9],
                "HD": [1,2,3,4,5,6,7,8,9],
                "HE": [1,2,3,4,5,6,7,8,9],
                "HF": [1,2,3,4,5,6,7,8,9],
                "HG": [1,2,3,4,5,6,7,8,9],
                "HH": [1,2,3,4,5,6,7,8,9],
                "HI": [1,2,3,4,5,6,7,8,9],
                "IA": [1,2,3,4,5,6,7,8,9],
                "IB": [1,2,3,4,5,6,7,8,9],
                "IC": [1,2,3,4,5,6,7,8,9],
                "ID": [1,2,3,4,5,6,7,8,9],
                "IE": [1,2,3,4,5,6,7,8,9],
                "IF": [1,2,3,4,5,6,7,8,9],
                "IG": [1,2,3,4,5,6,7,8,9],
                "IH": [1,2,3,4,5,6,7,8,9],
                "II": [1,2,3,4,5,6,7,8,9]
            };
            
        console.log(markerBoard);
        
        //create puzzle board 9 x 9
        var puzzleBoard = new Array(9); //create an array allocated with 9 spots
        for(i = 0; i < puzzleBoard.length; i++) //iterate array and add an array object
        {
             puzzleBoard[i] = new Array(9); //add column to puzzle board    
        }
        
        //Populate puzzle board with given values
        for(i = 0; i < givenValues.length; i++)//Iterate each row
        {
            var str = givenValues[i];
            
            //iterate each char in row
            for(j=0; j< str.length; j++)
            {
                puzzleBoard[j][i] = Number(str.charAt(j)); //add number into puzzle board 
            }
        }
        
        console.log(puzzleBoard);
       
    });
});

(function($)
{
    /*
     * Validate the data of user input for a row.
     * Length of row must be nine. Only accept numbers. 
     * @param - rowArray An array of characters [String]
     * @return - true if validation passes; false otherwise
     */
    $.validateData = function(rowArray)
    {
        var digitRegex = new RegExp(/^[0-9]{9}$/);
        return (rowArray.match(digitRegex) == null)? false : true;    
    }
    
    
})(jQuery);
