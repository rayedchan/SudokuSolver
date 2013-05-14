/* Sudoku Coordinate System 9x9 Board 
 *  
 *     A B C  D E F   G H I       
 *   A      |       |
 *   B  I   |  II   |  III
 *   C      |       |
 *    ------|-------|-------
 *   D      |       |
 *   E  IV  |   V   |  VI
 *   F      |       |
 *    ------|-------|-------
 *   G      |       |
 *   H  VII | VIII  |  IX
 *   I      |       |
 *
 *   [Left - Right] = x coordinate  rows 
 *   [Up - Down] = y coordinate columns
 */


var SUDOKU_BOARD_LENGTH = 9;

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
            
        //console.log(markerBoard);
        
        //create puzzle board 9 x 9
        var puzzleBoard = new Array(SUDOKU_BOARD_LENGTH); //create an array allocated with 9 spots
        for(i = 0; i < SUDOKU_BOARD_LENGTH; i++) //iterate array and add an array object
        {
             puzzleBoard[i] = new Array(SUDOKU_BOARD_LENGTH); //add column to puzzle board    
        }
        
        //Populate puzzle board with given values
        for(i = 0; i < SUDOKU_BOARD_LENGTH; i++)//Iterate each row
        {
            var str = givenValues[i];

            //iterate each char in row
            for(j=0; j< SUDOKU_BOARD_LENGTH; j++)
            {
                puzzleBoard[j][i] = Number(str.charAt(j)); //add number into puzzle board 
            }
        }
        console.log(puzzleBoard);
        console.log($.validateSudokuConstraint(puzzleBoard)); //check if current board is valid
    });
});

(function($)
{
    /*
     * Validate the data of user input for a row.
     * Length of row must be nine. Only accept numbers. 
     * @param - rowArray [String] An array of characters 
     * @return - true if validation passes; false otherwise
     */
    $.validateData = function(rowArray)
    {
        var digitRegex = new RegExp(/^[0-9]{9}$/);
        return (rowArray.match(digitRegex) == null)? false : true;    
    }
    
    /*
     * Validate if the sudoku constraints are satisfied
     * Zero represents a blank.
     * 1) Each row must not contain duplicate numbers [1 -9].
     * 2) Each column must not contain duplicate numbers [1-9].
     * 3) Each quadrant must not contain duplicate numbers.
     * @param - puzzleBoard [2D Array] the current state of the sudoku board
     * @return - true if validation passes; false otherwise
     */
    $.validateSudokuConstraint = function(puzzleBoard)
    {
        var arrayNumberCounter = [0,0,0,0,0,0,0,0,0,0]; //counts the numbers used per row, column, and quadrant
        
        //Validate rows
        for(var i = 0 ; i < SUDOKU_BOARD_LENGTH; i++)
        {
            $.calculateRowCounters(puzzleBoard, arrayNumberCounter, i); //calculate counters       
            if(!$.uniquenessConstraint(arrayNumberCounter)){return false;} //validate number uniqueness constraint
            $.resetCounterArray(arrayNumberCounter); //reset number counter array    
        }

        //Validate columns
        for(var j = 0 ; j < SUDOKU_BOARD_LENGTH; j++)
        {
            $.calculateColumnCounters(puzzleBoard, arrayNumberCounter, j); //calculate counters       
            if(!$.uniquenessConstraint(arrayNumberCounter)){return false;} //validate number uniqueness constraint
            $.resetCounterArray(arrayNumberCounter); //reset number counter array
        }     
        
        //Validate quadrants
        for(var k = 0 ; k < SUDOKU_BOARD_LENGTH; k++)
        {
            $.calculateQuadrantCounters(puzzleBoard, arrayNumberCounter, k);
            if(!$.uniquenessConstraint(arrayNumberCounter)){return false;} //validate number uniqueness constraint
            $.resetCounterArray(arrayNumberCounter); //reset number counter array
        }

        return true; //at this point all validation pass 
    }
    
    /*
     * Calculate counter array for a row.
     * @param - puzzleBoard [2D Array] current state of sudoku puzzle board
     * @param - rowCounterArray [Array] increment value for corresponding index (use tile value)
     * @param - selectedRow [int] the selected row to look at (A = 0, B =1, ... , I = 8 )
     */
    $.calculateRowCounters = function(puzzleBoard, rowCounterArray, selectedRow)
    {
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
              rowCounterArray[puzzleBoard[i][selectedRow]]++;
              //console.log("(" + i + "," + selectedRow + ")");
        }
    }
    
    /*
     * Calculate counter array for a column.
     * @param - puzzleBoard [2D Array] current state of sudoku puzzle board
     * @param - columnCounterArray [Array] increment value for corresponding index (use tile value)
     * @param - selectedColumn [int] the selected column to look at (A = 0, B =1, ... , I = 8 )
     */
    $.calculateColumnCounters = function(puzzleBoard, columnCounterArray, selectedColumn)
    {
        for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
        {
              columnCounterArray[puzzleBoard[selectedColumn][j]]++;
              //console.log("(" + selectedColumn  + "," + j + ")");
        }
    }
    
    /*
     * Calculate counter array for a quadrant.
     * @param - puzzleBoard [2D Array] current state of sudoku puzzle board
     * @param - quadrantCounterArray [Array] increment value for corresponding index (use tile value)
     * @param - selectedQuadrant [int] the selected quadrant to look coordinate system (I = 0, II = 1, ..., XI = 8)
     */
    $.calculateQuadrantCounters = function(puzzleBoard, quadrantCounterArray, selectedQuadrant)
    {
        var x = 0;
        var y = 0;
        
        for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
        {
            x = (k % 3) + (3 * (selectedQuadrant % 3)); 
            y = Math.floor(k / 3) + (3 * Math.floor(selectedQuadrant / 3));
            quadrantCounterArray[puzzleBoard[x][y]]++;
            //console.log("(" + x + "," + y + ")");
        }
    }
    
    /*
     * Validates sudoku uniqueness constraint.
     * @param - arrayCounter [Array] containing number counters for a row, column, or quadrant
     * @return - true if constraint passes; false otherwise
     */
    $.uniquenessConstraint = function(arrayCounter)
    {
        var arrayLength = arrayCounter.length;
        for(var i = 1; i < arrayLength; i++ ) //start at 1 to skip 0 counter (blanks)
        {
            if(arrayCounter[i] > 1)
                return false;
        }
        return true;
    }
    
    /*
     * Reset array counter to zeroes.
     * @param - arrayCounter
     */
    $.resetCounterArray = function(arrayCounter)
    {
        var arrayLength = arrayCounter.length;
        for(var i = 0; i < arrayLength ; i++)
        {
            arrayCounter[i] = 0;    
        }
    }
    
})(jQuery);
