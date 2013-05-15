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
 *   The sudoku board is made of 81 coordinate points. 
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
        
        /*
         * Initialize boards
         * puzzleBoard [2D Array 9x9] - The actual sudoku game board.
         * markerBoard [3D Array 9x9x9] - Stores marker list for each coordinate point.
         *      The marker list represents all the possible numbers that can be place in that coordinate.
         * quadrantBoard [2D Array 9x9] - used to determine the quadrant for a coordinate
         */
        var puzzleBoard = new Array(SUDOKU_BOARD_LENGTH); 
        var markerBoard = new Array(SUDOKU_BOARD_LENGTH); 
        var quadrantBoard = new Array(SUDOKU_BOARD_LENGTH);
        for(i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            //add columns to boards
            puzzleBoard[i] = new Array(SUDOKU_BOARD_LENGTH);    
            markerBoard[i] = new Array(SUDOKU_BOARD_LENGTH);
            quadrantBoard[i] = new Array(SUDOKU_BOARD_LENGTH);
            
            //create marker list for each coordinate
            for(j =0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                markerBoard[i][j] = [1,2,3,4,5,6,7,8,9]; 
            }    
        }
        //console.log(markerBoard);

        //Populate puzzle board with given values
        for(i = 0; i < SUDOKU_BOARD_LENGTH; i++)//Iterate each row
        {
            var str = givenValues[i];

            //iterate each char in row
            for(j=0; j< SUDOKU_BOARD_LENGTH; j++)
            {
                puzzleBoard[j][i] = Number(str.charAt(j)); //add number into puzzle board
                x = (j % 3) + (3 * (i % 3)); 
                y = Math.floor(j / 3) + (3 * Math.floor(i / 3));
                quadrantBoard[x][y] = i; //populate quadrant board
            }
        }
        //console.log(quadrantBoard);
        //console.log(puzzleBoard);
        //console.log($.validateSudokuConstraint(puzzleBoard)); //check if current board is valid
        
        var continuousLoop = true;
        while(continuousLoop)
        {
            //Iterate entire puzzle board
            for(i = 0; i < SUDOKU_BOARD_LENGTH; i++)
            {
                for(j = 0; j < SUDOKU_BOARD_LENGTH; j++)
                {
                    var coordinateValue = puzzleBoard[i][j];
                    var coordinateQuadrant = quadrantBoard[i][j]; 
                   
                    if(coordinateValue != 0)
                    {
                        for(k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                        {
                            markerBoard[k][j][coordinateValue - 1] = 0; //remove markers from row
                            markerBoard[i][k][coordinateValue - 1] = 0; //remove markers from column
                            x = (k % 3) + (3 * (coordinateQuadrant % 3)); 
                            y = Math.floor(k / 3) + (3 * Math.floor(coordinateQuadrant / 3));
                            markerBoard[x][y][coordinateValue - 1] = 0; //remove markers from quadrant
                            //console.log(k + ", " + j);
                            //console.log(i + ", " + k);
                            //console.log(x + ", " + y);
                        }
                    }
                }
            }
            
            break;
        }
       
        //console.log(markerBoard);
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
        
        for(var i = 0 ; i < SUDOKU_BOARD_LENGTH; i++)
        {
             //Validate rows
            $.calculateRowCounters(puzzleBoard, arrayNumberCounter, i); //calculate row counters       
            if(!$.uniquenessConstraint(arrayNumberCounter)){return false;} //validate number uniqueness constraint
            $.resetCounterArray(arrayNumberCounter); //reset number counter array   
            
            //Validate columns
            $.calculateColumnCounters(puzzleBoard, arrayNumberCounter, i); //calculate column counters       
            if(!$.uniquenessConstraint(arrayNumberCounter)){return false;} //validate number uniqueness constraint
            $.resetCounterArray(arrayNumberCounter); //reset number counter array
            
            //Validate quadrants
            $.calculateQuadrantCounters(puzzleBoard, arrayNumberCounter, i); //calulate quadrant counters
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
