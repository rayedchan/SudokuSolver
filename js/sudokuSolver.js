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
            var madeProgress = false; //Placement of tile or removal of markers is considered making progress
            
            //Iterate entire puzzle board
            for(i = 0; i < SUDOKU_BOARD_LENGTH; i++)
            {
                for(j = 0; j < SUDOKU_BOARD_LENGTH; j++)
                {
                    var coordinateValue = puzzleBoard[i][j];
                    var coordinateQuadrant = quadrantBoard[i][j]; 
                   
                    if(coordinateValue != 0 && $.doesCoordinateHaveMarkers(markerBoard[i][j]))
                    {
                        madeProgress = true;
                        for(k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                        {
                            markerBoard[i][j][k] = 0; //remove markers from self 
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
            madeProgress = $.horizontalMarkerSlice = (markerBoard); //Inspect each quadrant for horizontal markers and eliminate markers from other quadrant that on this horizontal line
            madeProgress = $.verticalMarkerSlice = (markerBoard); //Inspect each quadrant for vertical markers and eliminate markers from other quadrant that on this vertical line
            madeProgress = $.oneMarkerLeftPlacement(puzzleBoard, markerBoard);//Place number for coordinates with one marker left
            madeProgress = $.lastNumberMarkerInQuadrantPlacement(puzzleBoard, markerBoard); //Place number if and only if there is one marker number left in quadrant             
            
            if(!madeProgress)
                break;
        }

        $.printMarkerBoardByQuadrant(markerBoard);
        $.printPuzzleBoard(puzzleBoard);
        
    });
});

(function($)
{
    /* Definition Vertical Marker - In a quadrant, there exist only one column 
     * that contains the marker number(s). Inspect each quadrant for vertical
     * markers. If a number with vertical is found, eliminate markers from 
     * vertical line excluding the markers in the inspected quadrant.
     * @param - markerBoard [3D Array] contains marker list for each coordinate
     * @return - true if any markers are eliminated; false otherwise.
     * Note: There is a redundancy for isolated markers elimination. 
     */
    $.verticalMarkerSlice = function(markerBoard)
    {
        var madeProgress = false;
            
        //Iterate each quadrant
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {            
            //iterate each number to check if there exist a single vertical marker 
            for(var number = 1; number < 10; number++)
            {
                var colOneVertical = false;
                var colTwoVertical = false;
                var colThreeVertical = false;
                var colMarkerEliminator = -1; //fixed row constant to eliminate markers from
                
                //Iterate each coordinate in quadrant
                for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
                {
                    var x = Math.floor(j / 3) + 3 * (i % 3);
                    var y = j % 3 + 3 * Math.floor(i / 3);
                    var col = Math.floor(j / 3);

                    //iterate marker list for a coordinate column by column
                    for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                    {
                        var markerValue = markerBoard[x][y][k];
                        
                        //Column One inspection
                        if(col == 0)
                        {
                            if(markerValue == number)
                            {
                                colOneVertical = true;
                                colMarkerEliminator = x;
                            }
                        }

                        //Column Two Inspection
                        else if(col == 1)
                        {
                            if(markerValue == number)
                            {
                                colTwoVertical = true;
                                colMarkerEliminator = x;
                            }
                        }

                        //Column Three Inspection
                        else
                        {
                            if(markerValue == number)
                            {
                                colThreeVertical = true;
                                colMarkerEliminator = x;
                            }

                        }  

                    }
                }//end for loop [j]

                //Determine if there exist a single row with vertical markers
                if((colOneVertical? 1 : 0) + (colTwoVertical? 1 : 0) + (colThreeVertical? 1 : 0) == 1)
                {
                    madeProgress = true;
                    var quadrantAdjustment = 3 * Math.floor(i / 3);
                    var skipYCoordinateOne = 0 + quadrantAdjustment;
                    var skipYCoordinateTwo = 1 + quadrantAdjustment;
                    var skipYCoordinateThree = 2 + quadrantAdjustment;
                    
                    //eliminate markers for inspected number in column except for the markers in quadrant that is currently being inspected
                    for(var z = 0; z < SUDOKU_BOARD_LENGTH; z++)
                    {
                        //skip markers in quadrant that is currently being inspected
                         if(z == skipYCoordinateOne || z == skipYCoordinateTwo || z == skipYCoordinateThree)
                             continue;
                        
                         markerBoard[colMarkerEliminator][z][number - 1] = 0;      
                    }
                }
            }//end for loop [number]
        }//end for loop [i]
        
        return madeProgress;
    }
    
    /* Definition Horizontal Marker - In a quadrant, there exist only one row 
     * that contains the marker number(s). Inspect each quadrant for horizontal
     * markers. If a number with horizontal is found, eliminate markers from 
     * horizontal line excluding the markers in the inspected quadrant.
     * @param - markerBoard [3D Array] contains marker list for each coordinate
     * @return - true if any markers are eliminated; false otherwise.
     * Note: There is a redundancy for isolated markers elimination. 
     */
    $.horizontalMarkerSlice = function(markerBoard)
    {
        var madeProgress = false;
            
        //Iterate each quadrant
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {            
            //iterate each number to check if there exist a single horizontal marker 
            for(var number = 1; number < 10; number++)
            {
                var rowOneHorizontal = false;
                var rowTwoHorizontal = false;
                var rowThreeHorizontal = false;
                var rowMarkerEliminator = -1; //fixed row constant to eliminate markers from
                
                //Iterate each coordinate in quadrant row by row
                for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
                {
                    var x = (j % 3) + (3 * (i % 3)); 
                    var y = Math.floor(j / 3) + (3 * Math.floor(i / 3));
                    var row = Math.floor(j / 3);

                    //iterate marker list for a coordinate
                    for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                    {
                        var markerValue = markerBoard[x][y][k];
                        
                        //Row One inspection
                        if(row == 0)
                        {
                            if(markerValue == number)
                            {
                                rowOneHorizontal = true;
                                rowMarkerEliminator = y;
                            }
                        }

                        //Row Two Inspection
                        else if(row == 1)
                        {
                            if(markerValue == number)
                            {
                                rowTwoHorizontal = true;
                                rowMarkerEliminator = y;
                            }
                        }

                        //Row Three Inspection
                        else
                        {
                            if(markerValue == number)
                            {
                                rowThreeHorizontal = true;
                                rowMarkerEliminator = y;
                            }

                        }  

                    }
                }//end for loop [j]

                //Determine if there exist a single row with horizontal markers
                if((rowOneHorizontal? 1 : 0) + (rowTwoHorizontal? 1 : 0) + (rowThreeHorizontal? 1 : 0) == 1)
                {
                    madeProgress = true;
                    var quadrantAdjustment = 3 * (i % 3);
                    var skipXCoordinateOne = 0 + quadrantAdjustment;
                    var skipXCoordinateTwo = 1 + quadrantAdjustment;
                    var skipXCoordinateThree = 2 + quadrantAdjustment;
                    
                    //eliminate markers for inspected number in row except for the markers in quadrant that is currently being inspected
                    for(var z = 0; z < SUDOKU_BOARD_LENGTH; z++)
                    {
                        //skip markers in quadrant that is currently being inspected
                         if(z == skipXCoordinateOne || z == skipXCoordinateTwo || z == skipXCoordinateThree)
                             continue;
                        
                         markerBoard[z][rowMarkerEliminator][number - 1] = 0;      
                    }
                }
            }//end for loop [number]
        }//end for loop [i]
        
        return madeProgress;
    }
    
    /* Inspect each quadrant for isolated markers and place number on board.
     * @param - puzzleBoard [2D Array] - placement of numbers may happen
     * @param - markerBoard [3D Array] - contains marker list for each coordinate
     * @return true if a number has been placed; otherwise false 
     */
    $.lastNumberMarkerInQuadrantPlacement= function (puzzleBoard, markerBoard)
    {
        var madeProgress = false;
        var markerCounter = [0,0,0,0,0,0,0,0,0,0];
        var markerCoordinateTracker = [{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0}];
        var markerCounterLength = markerCounter.length;
        
        //Iterate each quadrant
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            //iterate each coordinate in quadrant
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                var x = (j % 3) + (3 * (i % 3)); 
                var y = Math.floor(j / 3) + (3 * Math.floor(i / 3));
               
                //iterate marker list for coordinate
                for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                {
                     var markerValue = markerBoard[x][y][k];
                     markerCounter[markerValue]++; //increment counter for corresponding marker 
                     //keep track of the latest coordinate which incremented the corresponding counter
                     markerCoordinateTracker[markerValue].x = x;
                     markerCoordinateTracker[markerValue].y = y;
                   
                }
            }
            
            for(var z = 0; z < markerCounterLength; z++)
            {
                //find the isolated marker in quadrant; then place number
                if(markerCounter[z] == 1)
                {
                    var coordX = markerCoordinateTracker[z].x;
                    var coordY = markerCoordinateTracker[z].y;
                    puzzleBoard[coordX][coordY] = z; //place number
                    console.log("(" + coordX + ", " + coordY + ") = " + z);
                    madeProgress = true;
                }
                
                //reset coordinate tracker and marker counter
                markerCounter[z] = 0;
                markerCoordinateTracker[z].x = 0;
                markerCoordinateTracker[z].y = 0;       
            }  
        }
        
        return madeProgress; 
    }
    
    /*
     * Place tiles on the puzzle for coordinates that have only one marker left.
     * @param - puzzleBoard [2D Array] - placement of number may happen 
     * @param - markerBoard [3D Array] - contains markerList for each coordinate
     * @return - true if a number has been placed; otherwise false
     */
    $.oneMarkerLeftPlacement = function(puzzleBoard, markerBoard)
    {
        var madeProgress = false;
        
        //Iterate entire puzzle board
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                var isLastNumber = false;
                var markNumber = 0;
                
                //iterate marker list for coordinate
                for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                {
                    var number = markerBoard[i][j][k];
                    
                    if(number != 0)
                    {
                        if(markNumber == 0)
                        {
                            markNumber = number;
                            isLastNumber = true;
                        }
                        else
                        {
                            isLastNumber = false;
                            break;
                        }
                    }
                    
                }//end for loop [k]
                
                if(isLastNumber)
                {
                    console.log("(" + i + ", " + j + ") = " + markNumber);
                    puzzleBoard[i][j] = markNumber;
                    madeProgress = true;
                }
                
            }//end for loop [j]
        }//end for loop [i]
        
        return madeProgress;
    }
    
    /*
     * Determines if a coordinate has any markers left.
     * @param - markerList [Array] marker list for a coordinate
     * @return - true if any markers are left; otherwise false (all zeroes)  
     */
    $.doesCoordinateHaveMarkers = function(markerList)
    {
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            if(markerList[i] != 0)
                return true;
        } 
        return false;
    }
    
    /*
     * Print marker list of each coordinate by column
     * @param - markerBoard [3D Array]
     */
    $.printMarkerBoardByColumn = function(markerBoard)
    {
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                var str = "";
                for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                {
                    str = str + " " + markerBoard[i][j][k];   
                }
                console.log(str);
            }
            console.log("\n");
        }  
    }
    
    /*
     * Print marker list of each coordinate by quadrant
     * @param - markerBoard [3D Array]
     */
    $.printMarkerBoardByQuadrant = function(markerBoard)
    {
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                var x = (j % 3) + (3 * (i % 3)); 
                var y = Math.floor(j / 3) + (3 * Math.floor(i / 3));
                var str = "(" + x  + "," + y + ")";
                
                for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                {
                    str = str + " " + markerBoard[x][y][k];   
                }
                console.log(str);
            }
            console.log("\n");
        }  
    }
    
    /*
     * Print puzzle board.
     * @param - puzzleBoard [2D Array] 
     */
    $.printPuzzleBoard = function(puzzleBoard)
    {
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            var str = "";
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                str = str + " " + puzzleBoard[j][i];   
            }
            console.log(str + "\n");
        }  
    }
    
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
