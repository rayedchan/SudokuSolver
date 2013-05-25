/* @author: rayedchan
 * This program logically solves the sudoku puzzle. A marker board records
 * all the possible value a coordinate (square) may contain.
 * Here are the sudoku strategies implemented:
 * Marker Elimination techniques
 *  -Sudoku Uniqueness Constraints
 *  -Naked Pairs
 *  -Pointing Pairs/Triples
 *  -Hidden Pairs/Triples
 *  -Bow line Reduction
 *  -Bowman Bingo
 *  
 * Number Placement techniques
 *  -Last Marker Number 
 *  -Last Marker Number in Region Placement (Quadrant, Row, Column)
 *  
 * Sudoku Coordinate System 9x9 Board
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
 *   The sudoku board is made of 81 coordinate points (squares).
 *   The board is divided into nine quadrants. Each quadrant contains
 *   9 coordinate points (3 x 3).
 *   
 *   Sudoku Game Conditions (Sudoku Uniqueness Constraints)
 *   1. Each quadrant must have [1-9] numbers. No duplicates.
 *   2. Each row must have [1-9] numbers. No duplicates.
 *   3. Each column musr have [1-9] numbers. No duplicates.
 *   
 */

var SUDOKU_BOARD_LENGTH = 9; //Length of puzzle board
var puzzleBoard; //[2D Array 9x9] the actual sudoku puzzle board to solve
var markerBoard; //[3D Array 9x9x9] contain the possible values for each square; Utilize this to solve puzzle.  
var quadrantBoard; //[2D Array 9x9] contain the quadrant number of each coordinate 

//Load DOM and ready to be manipulated.
$(document).ready(function()
{
    //Process form whenever submit button is clicked
    $('#submit').click(function()
    {
        $.initializeBoards(); //initialize the boards and populates the puzzle board
        
        //Attempt solving puzzle if and only if puzzle is valid
        if($.validateUserInput(puzzleBoard))
        {
            $.solve(); //solves the puzzle board 
            $.displayResults(); //display the puzzle board on the webpage 
        }
    });
    
    //Clear board; triggers whenever the clear button is clicked
    $('#clear').click(function()
    {
        for(var i = 1; i <= 81; i++)
        {
            var coordinate = $('#'+ i);
            coordinate.val(''); //reset value
            coordinate.removeAttr('readonly');
            coordinate.removeClass('elementAdded');
            coordinate.removeClass('invalidData');
            coordinate.removeClass('invalidRow');
            coordinate.removeClass('invalidColumn');
            coordinate.removeClass('invalidQuadrant');
        }
    });
    
    //Front-end validation; Event is triggers whenever user enters something in the input boxes
    $('.coordinate').keyup(function()
    {
         $.quadrantValidationFrontEnd();
         $.rowValidationFrontEnd();
         $.columnValidationFrontEnd();
    });
});

(function($)
{
    /*
     * Front-end quadrant validation.
     * Red-line border invalid row and red-text for numbers that are in violation
     */
    $.quadrantValidationFrontEnd = function()
    {
        var numberCounter = [0,0,0,0,0,0,0,0,0,0];
        var coordinateId = 0;
        var isDataValidBool = true;
        
        for(var i = 0; i < 9; i++)
        {
            for(var j = 0; j < 9; j++)
            {
                 coordinateId = Math.floor(j / 3) * 9 + (3 * i) + (Math.floor(i / 3)) * 18 + (j % 3) + 1;
                 var coordinate = $('#'+coordinateId);
                 var inputValue = coordinate.val();
                 
                 if(inputValue == ' ' || inputValue == '' || inputValue == '0' || inputValue == 0)
                    continue; 
                    
                 //Validate the data input; Numbers [0-9] only.
                 var isDataValid = $.validateData(inputValue);
                 if(!isDataValid)
                 {
                    coordinate.addClass('invalidData');
                    continue;
                 }
                 
                 numberCounter[inputValue]++;
                 if(numberCounter[inputValue] > 1)
                 {
                    isDataValidBool = false; 
                    //Red-line border invalid row and red-text for numbers that are in violation
                    for(var k = 0; k < 9; k++)
                    {
                        var invalidQuadrantNum =  Math.floor(k / 3) * 9 + (3 * i) + (Math.floor(i / 3)) * 18 + (k % 3) + 1;
                        var currentCoordinate = $('#'+invalidQuadrantNum);
                        var currentCoordinateValue = currentCoordinate.val();
                        //currentCoordinate.addClass('violateQuadrantConstraint');
                       
                        //indicate to user which numbers are in violation
                        if(currentCoordinateValue == inputValue)
                           currentCoordinate.addClass('invalidQuadrant');
                    }
                 }
            }
            $.resetCounterArray(numberCounter);
        }
        
        if(isDataValidBool)
        {
            for(var z = 1; z <= 81; z++)
            {
                var currentValidCoordinate = $('#'+z);
                //currentValidCoordinate.removeClass('violateQuadrantConstraint');
                currentValidCoordinate.removeClass('invalidQuadrant');
            }
        }
        
        return isDataValidBool;
    }
    
    /*
     * Front-end row validation.
     * Red-line border invalid row and red-text for numbers that are in violation
     */
    $.rowValidationFrontEnd = function()
    {
        var numberCounter = [0,0,0,0,0,0,0,0,0,0];
        var coordinateId = 0;
        var isDataValidBool = true;
        
        for(var i = 0; i < 9; i++)
        {
            for(var j = 0; j < 9; j++)
            {
                 coordinateId++;
                 var coordinate = $('#'+coordinateId);
                 var inputValue = coordinate.val();
                 
                 if(inputValue == ' ' || inputValue == '' || inputValue == '0' || inputValue == 0)
                    continue; 
                    
                 //Validate the data input; Numbers [0-9] only.
                 var isDataValid = $.validateData(inputValue);
                 if(!isDataValid)
                 {
                    coordinate.addClass('invalidData');
                    continue;
                 }
                 
                 numberCounter[inputValue]++;
                 if(numberCounter[inputValue] > 1)
                 {
                    isDataValidBool = false; 
                    //Red-line border invalid row and red-text for numbers that are in violation
                    for(var k = 1; k < 10; k++)
                    {
                        //var invalidCoordinateNum = 9*k + i + 1;
                        var invalidRowNum = 9*i + k;
                        var currentCoordinate = $('#'+invalidRowNum);
                        var currentCoordinateValue = currentCoordinate.val();
                       // currentCoordinate.addClass('violateRowConstraint');
                       
                        //indicate to user which numbers are in violation
                        if(currentCoordinateValue == inputValue)
                           currentCoordinate.addClass('invalidRow');
                    }
                 } 
            }
            $.resetCounterArray(numberCounter);
        }
        
        if(isDataValidBool)
        {
            for(var z = 1; z <= 81; z++)
            {
                var currentValidCoordinate = $('#'+z);
                //currentValidCoordinate.removeClass('violateRowConstraint');
                currentValidCoordinate.removeClass('invalidRow');
            }
        }
    }
    
    /*
     * Front-end column validation.
     * Red-line border invalid row and red-text for numbers that are in violation
     */
    $.columnValidationFrontEnd = function()
    {
        var numberCounter = [0,0,0,0,0,0,0,0,0,0];
        var coordinateId = 0;
        var isDataValidBool = true;
        
        for(var i = 0; i < 9; i++)
        {
            for(var j = 0; j < 9; j++)
            {
                 coordinateId = 9*j + (i + 1);
                 var coordinate = $('#'+coordinateId);
                 var inputValue = coordinate.val();
                 
                 if(inputValue == ' ' || inputValue == '' || inputValue == '0' || inputValue == 0)
                    continue; 
                    
                 //Validate the data input; Numbers [0-9] only.
                 var isDataValid = $.validateData(inputValue);
                 if(!isDataValid)
                 {
                    coordinate.addClass('invalidData');
                    continue;
                 }
                 
                 numberCounter[inputValue]++;
                 if(numberCounter[inputValue] > 1)
                 {
                    isDataValidBool = false; 
                    //Red-line border invalid row and red-text for numbers that are in violation
                    for(var k = 0; k < 9; k++)
                    {
                        var invalidColumnNum = 9*k + i + 1;
                        var currentCoordinate = $('#'+invalidColumnNum);
                        var currentCoordinateValue = currentCoordinate.val();
                        //currentCoordinate.addClass('violateColumnConstraint');
                       
                        //indicate to user which numbers are in violation
                        if(currentCoordinateValue == inputValue)
                           currentCoordinate.addClass('invalidColumn');
                    }
                 } 
            }
            $.resetCounterArray(numberCounter);
        }
        
        if(isDataValidBool)
        {
            for(var z = 1; z <= 81; z++)
            {
                var currentValidCoordinate = $('#'+z);
                //currentValidCoordinate.removeClass('violateColumnConstraint');
                currentValidCoordinate.removeClass('invalidColumn');
            }
        }
    }
    
    /*
     * Validates user input.
     * @param puzzleBoard [2D Array] the sudoku game board
     */
    $.validateUserInput = function(puzzleBoard)
    {
        //Validate user input
        for(var i = 1; i <= 81; i++)
        {
            var coordinate = $('#'+ i);//get DOM coordinate element
            var inputValue = coordinate.val();
            
            //Program will treat these values as zeroes
            if(inputValue == ' ' || inputValue == '')
               continue; 
            
            //Validate the data input; Numbers [0-9] only.
            var isDataValid = $.validateData(inputValue);
            if(!isDataValid)
            {
                alert('Input must be a number, space, or null.');
                return false;
            }
            
            if(!$.validateSudokuConstraint(puzzleBoard))
            {
                alert('Please provide a valid Sudoku puzzle.');
                return false;
            }
        }
        
        return true;
    }

    /*
     * Initialize, construct, and populate the boards.
     * puzzleBoard [2D Array 9x9] - The actual sudoku game board.
     * markerBoard [3D Array 9x9x9] - Stores marker list for each coordinate point.
     *      The marker list represents all the possible numbers that can be place in that coordinate.
     * quadrantBoard [2D Array 9x9] - used to determine the quadrant for a coordinate
     */
    $.initializeBoards = function()
    {
        //Construct the boards; Start off with an array
        puzzleBoard = new Array(SUDOKU_BOARD_LENGTH); 
        markerBoard = new Array(SUDOKU_BOARD_LENGTH); 
        quadrantBoard = new Array(SUDOKU_BOARD_LENGTH);
        
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            //Add columns to boards; At each index of the array add an Array object.
            puzzleBoard[i] = new Array(SUDOKU_BOARD_LENGTH);    
            markerBoard[i] = new Array(SUDOKU_BOARD_LENGTH);
            quadrantBoard[i] = new Array(SUDOKU_BOARD_LENGTH);
            
            //create marker list for each coordinate
            for(var j =0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                //Put all the possible values for each coordinate
                markerBoard[i][j] = [1,2,3,4,5,6,7,8,9]; 
            }    
        }
        
        var coordinateCount = 0;
        //Populate puzzle board with given values
        for(i = 0; i < SUDOKU_BOARD_LENGTH; i++)//Iterate each row
        {
            //iterate each char in row
            for(j=0; j< SUDOKU_BOARD_LENGTH; j++)
            {
                coordinateCount++;
                puzzleBoard[j][i] = Number($('#'+coordinateCount).val().charAt(0)); //Use user input to populate puzzle board. This is setting up the initial board.
                x = (j % 3) + (3 * (i % 3)); //calculate x-coordinate 
                y = Math.floor(j / 3) + (3 * Math.floor(i / 3)); //calculate y-coordinate
                quadrantBoard[x][y] = i; //populate quadrant board
            }
        } 
    }
    
    /*
     * Solves the sudoku puzzle logically.
     * Algorithm (Backtracking, recusion)
     * 1. Eliminate as many markers as possible using the following techniques:
     *      -Sudoku Uniqueness Constraints 
     *      -Pointing Pairs
     *      -Pointing Triples 
     *      -Line Box Reduction
     *      -Naked Pairs
     *      -Hidden Naked Triples
     *      -Hidden Naked Pairs
     * Then place number in coordinate if one marker exists or if there is only
     * one marker number left in a specific region (quadrant, row, or column). 
     * Repeat this step if any markers have been eliminated or a number has
     * been place on a coordinate.
     * 
     * 2. Check if the puzzle is solved at this point. This step is necessary for
     * recursion as one of the base cases.
     * 
     * 3. Check if the puzzle is invalid. Invalid Case: There is an coordinate in
     * the puzzle board that has no value and there is no more possible choices
     * (corresponding coordinate on marker board has no more possible values ) 
     * for this coordinate. This step is necessary for recursion as one of the base cases.
     * Also, this is necessary for backtracking since Bowman Bingo,
     * which is bascially a trail and error technique, is used.
     * 
     * 4. Loop until there are no markers left on the marker board (to reiterate the marker board
     * conatins all the possible values each coordinate for the current state of the puzzle board)
     *      If a marker exist, use Bowman Bingo. Guess on the coordinate with the least number of markers; 
     *      this will lessen the amount of backtracking as compare with selecting a coordinate
     *      with many possible choices. Plus, there is a higher probablity of guessing the number
     *      correctly when there are less markers.
     *      Eliminate the guess number from the marker board. We can make this assumption because 
     *      the number can be correct or incorrect. Make a copy of the current puzzle
     *      board and marker board. This is necessary because if our guess is wrong we need to 
     *      backtrack to the previous state when the puzzle board is still validate. Recurse by calling 
     *      the function itself. Restore puzzle board and marker board.   
     */
    $.solve = function()
    {
        var madeProgress = false; //Placement of tile or removal of markers is considered making progress  
        
        //Apply sudoku techniques here; exit loop when no progress is made 
        do 
        {
            madeProgress = $.sudokuConditionsMarkerEliminator(); //Eliminate markers by sudoku game rules
            madeProgress = $.horizontalMarkerSlice(); //Inspect each quadrant for horizontal markers and eliminate markers from other quadrant that on this horizontal line
            madeProgress = $.verticalMarkerSlice(); //Inspect each quadrant for vertical markers and eliminate markers from other quadrant that on this vertical line
            madeProgress = $.quadrantMarkerReductionByIsolatedVerticalLine(); //Inspect each row to find vertical markers isolated in a single quadrant in a region of three vertical, and eliminate marker numbers in current quadrant except the vertical markers  
            madeProgress = $.quadrantMarkerReductionByIsolatedHorizontalLine(); //Inspect each row to find horizontal markers isolated in a single quadrant in a region of three quadrant, and eliminate marker numbers in current quadrant except the horizontal markers 
            madeProgress = $.pairMarkerSweeperQuadrant();//Find pair of coordinates with two remaining markers which are identical in quadrant
            madeProgress = $.pairMarkerSweeperColumn();//Find pair of coordinates with two remaining markers which are identical in column
            madeProgress = $.pairMarkerSweeperRow();//Find pair coordinates with two remaining markers which are identical in row
            madeProgress = $.hiddenCloneMarkerCleanerQuadrant(); //Inspect each quadrant for pair of coordinate with exact markers 
            madeProgress = $.hiddenCloneMarkerCleanerColumn(); //Inspect each column for pair of coordinates with exact markers
            madeProgress = $.hiddenCloneMarkerCleanerRow(); //Inspect each row for pair coordinates with exact markers 
            madeProgress = $.hiddenTripleMarkerCleanerQuadrant(); //Inspect each quadrant for triple coordinates with exact markers
            madeProgress = $.hiddenTripleMarkerCleanerColumn(); //Inspect each column for triple coordinates with exact markers 
            madeProgress = $.hiddenTripleMarkerCleanerRow(); //Inspect each row for triple coordinates with exact markers 
            madeProgress = $.oneMarkerLeftPlacement();//Place number for coordinates with one marker left
            madeProgress = $.lastNumberMarkerInQuadrantPlacement(); //Place number if and only if there is one marker number left in quadrant             
            madeProgress = $.lastNumberMarkerInColumnPlacement(); //Place number if and only if there is one marker number left in column
            madeProgress = $.lastNumberMarkerInRowPlacement(); //Place number if and only if there is one marker number left in row        
        }while(madeProgress);
        
        //Check if the puzzle board is solved
        if($.isPuzzleBoardFilled() && $.validateSudokuConstraint(puzzleBoard))
            return true;
      
        //Check if there are empty spaces on puzzle board with no possible values left => unsolvable case
        if($.checkCoordinateWithNoPossibleValues())
            return false;
        
        //Iterate if there are coordinates with possible values left to choose from
        while($.moreMarkersLeft())
        {
            //Find coordinate with the least number of choices
            var coordinate = $.findCoordinateWithLeastPossibleChoices();
            var coordX = coordinate.x;
            var coordY = coordinate.y;
            
            if(coordX == -1 && coordY == -1)
                return false; //unsolvable case
            
            //get guess number from markerBoard and eliminate from marker board
            var guessNumber = $.getGuessNumber(coordinate);
            
            //deep copy of boards; object references in list object are differnt from original including the list object itself 
            var puzzleBoardDeepCopy = jQuery.extend(true, [], puzzleBoard);
            var markerBoardDeepCopy = jQuery.extend(true, [], markerBoard);
            
            //Fill the guessNumber onto the puzzle board
            puzzleBoard[coordX][coordY] = guessNumber;
            
            //recursively call the this function 
            if($.solve())
                return true;
            
            //GuessNumber is incorrect at this point; Backtrack to previous state of the boards
            puzzleBoard = puzzleBoardDeepCopy;
            markerBoard = markerBoardDeepCopy;  
        }
        
        return false;
    }
    
    /*
     * Get the first non-zero number from markerboard at the given coordinate.
     * Eliminate the chosen number from marker board.
     * @param - coordinate [Object with x and y properties] position of the coordinate
     * @return - number from marker board
     */
    $.getGuessNumber = function(coordinate)
    {
        for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
        {
            var guessNumber = markerBoard[coordinate.x][coordinate.y][k];
            if(guessNumber != 0)
            {
                markerBoard[coordinate.x][coordinate.y][k] = 0;
                return guessNumber;
            }
        }
        
        console.log("Error: Should not reach here.");
        return 0;
    }
    
    /*
     * Finds the coordinate with the least possible choices
     * @return - coordinate object {'x': <value>, 'y': <value>}; otherwise {'x':-1, 'y': -1} for invalid case
     */
    $.findCoordinateWithLeastPossibleChoices = function()
    {
        var coordinate = {'x': -1, 'y': -1};
        var leastMarkerCount = 100;
    
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                var coordinateValue = puzzleBoard[i][j];
                
                //Check only coordinates that do not have a value
                if(coordinateValue == 0)
                {
                    var markerCount = 0;
                    for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                    {
                        var markerValue = markerBoard[i][j][k];
                        if(markerValue != 0)
                             markerCount++; //increment non-zero markers    
                    }
                    
                    if(markerCount != 0 && markerCount < leastMarkerCount)
                    {
                         leastMarkerCount = markerCount; //new lowest value
                         //keep track of coordinate position
                         coordinate.x = i; 
                         coordinate.y = j;
                    }
                }
            }
        }
        
        return coordinate;
    }
    
    /*
     * Determines if there are any more markers left.
     * @return - true if there are markers left; otherwise false
     */
    $.moreMarkersLeft = function()
    {
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                {
                    var markerValue = markerBoard[i][j][k];
                    if(markerValue != 0)
                        return true;
                }  
            }
        }
        
        return false;
    }
    
    /*
     * Determines if there are any coordinates that is empty and has no possible value left.
     * If yes, this determines that the puzzle is unsolvable.
     * @return - true if puzzle is still solvable; false otherwise 
     */
    $.checkCoordinateWithNoPossibleValues = function()
    {
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                var coordinateValue = puzzleBoard[i][j];
                
                //Check only coordinates that do not have a value
                if(coordinateValue == 0)
                {
                    var hasPossibleValuesLeft = false;
                    
                    for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                    {
                        var markerValue = markerBoard[i][j][k];
                        if(markerValue != 0)
                        {
                             hasPossibleValuesLeft = true;
                             break;
                        }
                    }
                    
                    //Found a coordinate that is empty and has no possible values left
                    if(!hasPossibleValuesLeft)
                        return true;
                }
            }
        }
       
        return false;
    }
    
    /*
     * Determines if the puzzle board is completed.
     * @return - true if puzzle is completed; false otherwise.
     */
    $.isPuzzleBoardFilled = function()
    {
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                if(puzzleBoard[i][j] == 0)
                    return false;
            }
        }
        return true;
    }
    
    /*
     * Looks at the current board and eliminates the markers
     * by applying sudoku row, column, and quadrant number 
     * uniqueness conditions.
     * @return - true if any marker has been eliminated; false otherwise
     */
    $.sudokuConditionsMarkerEliminator = function()
    {
        var madeProgress = false; //Placement of tile or removal of markers is considered making progress
            
        //Iterate entire puzzle board
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                var coordinateValue = puzzleBoard[i][j];
                var coordinateQuadrant = quadrantBoard[i][j]; 

                if(coordinateValue != 0)
                {
                    for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                    {
                        if(markerBoard[i][j][k] != 0)
                        {
                            markerBoard[i][j][k] = 0; //remove markers from self
                            madeProgress = true;
                        }
                        
                        if(markerBoard[k][j][coordinateValue - 1] != 0)
                        {
                            markerBoard[k][j][coordinateValue - 1] = 0; //remove markers from row
                            madeProgress = true;
                        }
                        
                        if(markerBoard[i][k][coordinateValue - 1] != 0)
                        {
                            markerBoard[i][k][coordinateValue - 1] = 0; //remove markers from column
                            madeProgress = true;
                        }
                        
                        var x = (k % 3) + (3 * (coordinateQuadrant % 3)); 
                        var y = Math.floor(k / 3) + (3 * Math.floor(coordinateQuadrant / 3));
                        
                        if(markerBoard[x][y][coordinateValue - 1] != 0)
                        {
                            markerBoard[x][y][coordinateValue - 1] = 0; //remove markers from quadrant
                            madeProgress = true;
                        }
                    }
                }
            }
        }
        
        return madeProgress;
    }
    
    /*
     * Inspect each column for horizontal line markers isolated in a single quadrant
     * in a given region. The three regions are made of the following quadrant: 
     * region 1 (I, II, III)
     * region 2 (IV, V, VI)
     * region 3 (VII, VIII, IX)
     * Eliminate horizontal marker number from quadrant except for the coordinates 
     * that form the horizonatal line if a isolated horizontal markers line is found.
     * return - true if any markers are eliminated; false otherwise
     */
    $.quadrantMarkerReductionByIsolatedHorizontalLine = function()
    {   
        var madeProgress = false;
        
        //Iterate each row
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            //Iterate each sudoku number
            for(var num = 1; num < 10; num++)
            {
                var areHorizontalMarkersInSingleQuadrant = false;
                var quadrantTracker = -1;
                
                //Iterate each coordinate in row
                for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
                {
                    var currentQuadrant = quadrantBoard[j][i];
                    //console.log(currentQuadrant);
                    
                    //Iterate coordinate's marker's list
                    for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                    {
                        var markerValue = markerBoard[j][i][k];

                        //Compare current marker value with current number
                        if(markerValue == num)
                        {
                            //First Element 
                            if(quadrantTracker == -1)
                            {
                                quadrantTracker = currentQuadrant;
                                continue;
                            }
                            
                            //Non-first elements
                            else if(quadrantTracker != currentQuadrant)
                            {
                                areHorizontalMarkersInSingleQuadrant = false;
                                break;
                            }
                            
                            areHorizontalMarkersInSingleQuadrant = true;
                        }
                    }//end for loop [k]
                }//end for loop [j]
                
                if(areHorizontalMarkersInSingleQuadrant)
                {
                    //Iterate coordinate specific quadrant 
                    for(var quadIt = 0; quadIt < SUDOKU_BOARD_LENGTH; quadIt++)
                    {
                         var x = (quadIt % 3) + (3 * (quadrantTracker % 3)); 
                         var y = Math.floor(quadIt / 3) + (3 * Math.floor(quadrantTracker / 3));
                         //console.log("(" + x + ", " + y + ")");
                         
                         //skip horizontal markers (current row)
                         if(y == i)
                             continue;
                         
                         //Eliminate horizontal marker number from the other coordinates
                         if(markerBoard[x][y][num - 1] != 0)
                         {
                              markerBoard[x][y][num - 1] = 0;
                              madeProgress = true;
                         }
                    }//end for loop [quadIt] 
                } 
            }//end for loop [num]
        }
        return madeProgress;
    }
    
    /*
     * Inspect each column for vertical line markers isolated in a single quadrant
     * in a given region. The three regions are made of the following quadrant: 
     * region 1 (I, IV, VII)
     * region 2 (II, V, VIII)
     * region 3 (III, VI, IX)
     * Eliminate vertical marker number from quadrant except for the coordinates 
     * that form the vertical line if a isolated vertical markers line is found.
     * return - true if any markers are eliminated; false otherwise
     */
    $.quadrantMarkerReductionByIsolatedVerticalLine = function()
    {   
        var madeProgress = false;
        
        //Iterate each column
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            //Iterate each sudoku number
            for(var num = 1; num < 10; num++)
            {
                var areVerticalMarkersInSingleQuadrant = false;
                var quadrantTracker = -1;
                
                //Iterate each coordinate in column
                for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
                {
                    var currentQuadrant = quadrantBoard[i][j];
                    
                    //Iterate coordinate's marker's list
                    for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                    {
                        var markerValue = markerBoard[i][j][k];

                        
                        //Compare current marker value with current number
                        if(markerValue == num)
                        {
                            //First Element 
                            if(quadrantTracker == -1)
                            {
                                quadrantTracker = currentQuadrant;
                                continue;
                            }
                            
                            //Non-first elements
                            else if(quadrantTracker != currentQuadrant)
                            {
                                areVerticalMarkersInSingleQuadrant = false;
                                break;
                            }
                            
                            areVerticalMarkersInSingleQuadrant = true;
                        }
                    }//end for loop [k]
                }//end for loop [j]
                
                if(areVerticalMarkersInSingleQuadrant)
                {
                    //Iterate coordinate specific quadrant 
                    for(var quadIt = 0; quadIt < SUDOKU_BOARD_LENGTH; quadIt++)
                    {
                         var x = (quadIt % 3) + (3 * (quadrantTracker % 3)); 
                         var y = Math.floor(quadIt / 3) + (3 * Math.floor(quadrantTracker / 3));
                         
                         //skip vertical markers (current column)
                         if(x == i)
                             continue;
                         
                         //Eliminate vertical marker number from the other coordinates
                         if(markerBoard[x][y][num - 1] != 0)
                         {
                              markerBoard[x][y][num - 1] = 0;
                              madeProgress = true;
                         }
                    }//end for loop [quadIt] 
                } 
            }//end for loop [num]
        }
        
        return madeProgress;
    }
    
    /*
     * Display results on the front-end side.
     */
    $.displayResults = function()
    {
        var coordinateCount = 0;
        
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                coordinateCount++;
                var coordinateCellObj = $('#'+coordinateCount);
                var frontEndCoordinateValue = coordinateCellObj.val().trim();
                    
                if(frontEndCoordinateValue == 0 || frontEndCoordinateValue == "")
                    coordinateCellObj.addClass("elementAdded");//indicates which coordinate has been added
                
                coordinateCellObj.val(puzzleBoard[j][i]); //set value on front-end
                coordinateCellObj.attr("readonly", "readonly"); //make the input box read-only  
            }  
        }
    }
    
     /* Find pair of coordinates with only two remaining markers, which are identical.
     * E.g.
     * 1 0 0 0 0 0 0 0 9
     * 1 0 0 0 0 0 0 0 9
     * Eliminate 1 and 9 markers from the other coordinates in row. 
     * @return - true if any markers are eliminated; false otherwise
     */
    $.pairMarkerSweeperRow = function()
    {
        var madeProgress = false;
        
        //Iterate each row
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            //Iterate two coordinates in row at a time
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                //Iterate subset; comparing current coordinate to subset coordinate 
                for(var j2 = j + 1; j2 < SUDOKU_BOARD_LENGTH; j2++)
                {
                    var matchCounter = 0;
                    var otherCounter = 0;
                    var pairNumber1 = -1;
                    var pairNumber2 = -1;
                    
                    //skip iteration if markers list does not have exactly two markers
                    if(!$.hasTwoMarkersLeft(markerBoard[j][i]) || !$.hasTwoMarkersLeft(markerBoard[j2][i]))
                        continue;
                        
                    //Iterate pair coordinates' marker list
                    for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                    {
                        var markerVal = markerBoard[j][i][k];
                        var markerVal2 = markerBoard[j2][i][k];
                        
                        if(markerVal != 0 && markerVal2 != 0 && markerVal == markerVal2)
                        {
                            matchCounter++;
                            if(pairNumber1 == -1)
                               pairNumber1 = markerVal;

                            else if(pairNumber2 == -1)
                                pairNumber2 = markerVal2;
                        }
                    }
                    
                    //Pair coordinates is found; Eliminate pair number markers from the other coordinates
                    if(matchCounter == 2 && otherCounter == 0)
                    {
                        for(var jA = 0; jA < SUDOKU_BOARD_LENGTH; jA++)
                        {
                            //ignore pair coordinates
                            if(jA == j || jA == j2)
                                continue;

                            for(var kA = 0; kA < SUDOKU_BOARD_LENGTH; kA++)
                            {
                                //eliminate pair numbers from the other coordinates
                                var markerValue = markerBoard[jA][i][kA];
                                if(markerValue == pairNumber1 || markerValue == pairNumber2)
                                {
                                     markerBoard[jA][i][kA] = 0;
                                     madeProgress = true;   
                                }   
                            }
                        }
                    }
                }//end for loop [j2]
            }//end for loop [j]
        }//end for loop [i]  
        return madeProgress;
    }

    /* Find pair of coordinates with only two remaining markers, which are identical.
     * E.g.
     * 1 0 0 0 0 0 0 0 9
     * 1 0 0 0 0 0 0 0 9
     * Eliminate 1 and 9 markers from the other coordinates in column. 
     * @return - true if any markers are eliminated; false otherwise
     */
    $.pairMarkerSweeperColumn = function()
    {
        var madeProgress = false;
        
        //Iterate each column
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            //Iterate two coordinates in column at a time
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                //Iterate subset; comparing current coordinate to subset coordinate 
                for(var j2 = j + 1; j2 < SUDOKU_BOARD_LENGTH; j2++)
                {
                    var matchCounter = 0;
                    var otherCounter = 0;
                    var pairNumber1 = -1;
                    var pairNumber2 = -1;
                    
                    //skip iteration if markers list does not have exactly two markers
                    if(!$.hasTwoMarkersLeft(markerBoard[i][j]) || !$.hasTwoMarkersLeft(markerBoard[i][j2]))
                        continue;
                        
                    //Iterate pair coordinates' marker list
                    for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                    {
                        var markerVal = markerBoard[i][j][k];
                        var markerVal2 = markerBoard[i][j2][k];
                        
                        if(markerVal != 0 && markerVal2 != 0 && markerVal == markerVal2)
                        {
                            matchCounter++;
                            if(pairNumber1 == -1)
                               pairNumber1 = markerVal;

                            else if(pairNumber2 == -1)
                                pairNumber2 = markerVal2;
                        }
                    }
                    
                    //Pair coordinates is found; Eliminate pair number markers from the other coordinates
                    if(matchCounter == 2 && otherCounter == 0)
                    {
                        for(var jA = 0; jA < SUDOKU_BOARD_LENGTH; jA++)
                        {
                            //ignore pair coordinates
                            if(jA == j || jA == j2)
                                continue;

                            for(var kA = 0; kA < SUDOKU_BOARD_LENGTH; kA++)
                            {
                                //eliminate pair numbers from the other coordinates
                                var markerValue = markerBoard[i][jA][kA];
                                if(markerValue == pairNumber1 || markerValue == pairNumber2)
                                {
                                     markerBoard[i][jA][kA] = 0;
                                     madeProgress = true;   
                                }   
                            }
                        }
                    }
                }//end for loop [j2]
            }//end for loop [j]
        }//end for loop [i]  
        return madeProgress;
    }
    
    /* Find pair of coordinates with only two remaining markers, which are identical.
     * E.g.
     * 1 0 0 0 0 0 0 0 9
     * 1 0 0 0 0 0 0 0 9
     * Eliminate 1 and 9 markers from the other coordinates in quadrant. 
     * @return - true if any markers are eliminated; false otherwise
     */
    $.pairMarkerSweeperQuadrant = function()
    {
        var madeProgress = false;
        
        //Iterate each quadrant
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            //Iterate two coordinates in quadrant at a time
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                var x = (j % 3) + (3 * (i % 3)); 
                var y = Math.floor(j / 3) + (3 * Math.floor(i / 3));
                
                //Iterate subset; comparing current coordinate to subset coordinate 
                for(var j2 = j + 1; j2 < SUDOKU_BOARD_LENGTH; j2++)
                {
                    var x2 = (j2 % 3) + (3 * (i % 3)); 
                    var y2 = Math.floor(j2 / 3) + (3 * Math.floor(i / 3));
                    var matchCounter = 0;
                    var otherCounter = 0;
                    var pairNumber1 = -1;
                    var pairNumber2 = -1;
                    
                    //skip iteration if markers list does not have exactly two markers
                    if(!$.hasTwoMarkersLeft(markerBoard[x][y]) || !$.hasTwoMarkersLeft(markerBoard[x2][y2]))
                        continue;
                        
                    //Iterate pair coordinates' marker list
                    for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                    {
                        var markerVal = markerBoard[x][y][k];
                        var markerVal2 = markerBoard[x2][y2][k];
                        
                        if(markerVal != 0 && markerVal2 != 0 && markerVal == markerVal2)
                        {
                            matchCounter++;
                            if(pairNumber1 == -1)
                               pairNumber1 = markerVal;

                            else if(pairNumber2 == -1)
                                pairNumber2 = markerVal2;
                        }
                    }
                    
                    //Pair coordinates is found; Eliminate pair number markers from the other coordinates
                    if(matchCounter == 2 && otherCounter == 0)
                    {
                        for(var jA = 0; jA < SUDOKU_BOARD_LENGTH; jA++)
                        {
                            var xA = (jA % 3) + (3 * (i % 3)); 
                            var yA = Math.floor(jA / 3) + (3 * Math.floor(i / 3));

                            //ignore pair coordinates
                            if((xA == x && yA == y) || (xA == x2 && yA == y2))
                                continue;

                            for(var kA = 0; kA < SUDOKU_BOARD_LENGTH; kA++)
                            {
                                //eliminate pair numbers from the other coordinates
                                var markerValue = markerBoard[xA][yA][kA];
                                if(markerValue == pairNumber1 || markerValue == pairNumber2)
                                {
                                     markerBoard[xA][yA][kA] = 0;
                                     madeProgress = true;   
                                }   
                            }
                        }
                    }
                }//end for loop [j2]
            }//end for loop [j]
        }//end for loop [i]  
        return madeProgress;
    }
    
    /*
     * Inspect each row for a triplet of coordinates with exact markers.
     * Only numbers with exactly two markers left will be examined.
     * E.g. 5 can be removed since 2,8,9 must occupy these spots.
     * 0 2 0 0 5 0 0 8 9 
     * 0 2 0 0 0 0 0 8 9 
     * 0 2 0 0 0 0 0 8 9 
     * @return - true if any markers are eliminated; false otherwise  
     */
    $.hiddenTripleMarkerCleanerRow = function()
    {
        var madeProgress = false;
        var markerCounter = [0,0,0,0,0,0,0,0,0,0];
        var markerCoordinateTracker = [{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1}];
        var markerCoordinateTracker2 = [{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1}];
        var markerCoordinateTracker3 = [{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1}];
        var markerCounterLength = markerCounter.length;
        
        //Iterate each row
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            var numbersToInspect = new Array(); //list may contain possible clones
                    
            //iterate each coordinate in row
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                //iterate marker list for coordinate
                for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                {
                     var markerValue = markerBoard[j][i][k];
                     markerCounter[markerValue]++; //increment counter for corresponding marker 
                     
                     if(markerValue != 0)
                     {
                        //keep track of the coordinate position
                        if(markerCoordinateTracker[markerValue].x == -1 && markerCoordinateTracker[markerValue].y == -1 )
                        {
                           markerCoordinateTracker[markerValue].x = j;
                           markerCoordinateTracker[markerValue].y = i;
                        }

                        //1st coordinate has been tracked; keep track of second coordinate
                        else if(markerCoordinateTracker2[markerValue].x == -1 && markerCoordinateTracker2[markerValue].y == -1) 
                        {
                           markerCoordinateTracker2[markerValue].x = j;
                           markerCoordinateTracker2[markerValue].y = i;
                        }
                        
                        //Keep track of third coordinate position
                        else if(markerCoordinateTracker3[markerValue].x == -1 && markerCoordinateTracker3[markerValue].y == -1) 
                        {
                           markerCoordinateTracker3[markerValue].x = j;
                           markerCoordinateTracker3[markerValue].y = i;
                        }
                     }
                }
            }
            
            //Inspect marker counter and add possible triples to list
            for(var z = 0; z < markerCounterLength; z++)
            {
                //add numbers that have exaclty three markers left
                if(markerCounter[z] == 3)
                    numbersToInspect.push(z); //add possible triples
            }  
            
            var numbersToInspectLength = numbersToInspect.length;
            
            //Only look at list if it has more than two item
            if(numbersToInspectLength > 2)
            {
                //iterate entire list
                for(var n1 = 0; n1 < numbersToInspectLength; n1++)
                {
                    var mainItem = numbersToInspect[n1];
                    
                    //iterate subset of list
                    for(var n2 = n1 + 1; n2 < numbersToInspectLength; n2++)
                    {
                        var subsetItem = numbersToInspect[n2];
                        
                        //iterate subset of a subset
                        for(var n3 = n2 + 1; n3 < numbersToInspectLength; n3++)
                        {
                            var thirdItem = numbersToInspect[n3];
                            var xm1 = markerCoordinateTracker[mainItem].x;
                            var xm2 = markerCoordinateTracker2[mainItem].x;
                            var xm3 = markerCoordinateTracker3[mainItem].x;
                            var ym1 = markerCoordinateTracker[mainItem].y;
                            var ym2 = markerCoordinateTracker2[mainItem].y;
                            var ym3 = markerCoordinateTracker3[mainItem].y;
                           
                            var xs1 = markerCoordinateTracker[subsetItem].x;
                            var xs2 = markerCoordinateTracker2[subsetItem].x;
                            var xs3 = markerCoordinateTracker3[subsetItem].x; 
                            var ys1 = markerCoordinateTracker[subsetItem].y;
                            var ys2 = markerCoordinateTracker2[subsetItem].y;
                            var ys3 = markerCoordinateTracker3[subsetItem].y;
                           
                            var xss1 = markerCoordinateTracker[thirdItem].x;
                            var xss2 = markerCoordinateTracker2[thirdItem].x;
                            var xss3 = markerCoordinateTracker3[thirdItem].x;
                            var yss1 = markerCoordinateTracker[thirdItem].y;
                            var yss2 = markerCoordinateTracker2[thirdItem].y;
                            var yss3 = markerCoordinateTracker3[thirdItem].y;
                            
                            //compare coordinates of markers; a triple is found if conditions are satisfied 
                            if((xm1 == xs1 && xs1 == xss1) && (xm2 == xs2 && xs2 == xss2) && (xm3 == xs3 && xs3 == xss3)
                               &&(ym1 == ys1 && ys1 == yss1) && (ym2 == ys2 && ys2 == yss2) && (ym3 == ys3 && ys3 == yss3))
                            {
                                //eliminate non-triple markers from coordinates
                                for(var it = 0; it < SUDOKU_BOARD_LENGTH; it++)
                                { 
                                    var markerNumCompare = markerBoard[xm1][ym1][it];
                                    var markerNumCompare2 = markerBoard[xm2][ym2][it];
                                    var markerNumCompare3 = markerBoard[xm3][ym3][it];
                                        
                                    if(markerNumCompare != mainItem && markerNumCompare != subsetItem && markerNumCompare != thirdItem)
                                    {
                                        if( markerBoard[xm1][ym1][it] != 0)
                                        {
                                            markerBoard[xm1][ym1][it]= 0;
                                            madeProgress = true;
                                        }
                                    }

                                    if(markerNumCompare2 != mainItem && markerNumCompare2 != subsetItem && markerNumCompare2 != thirdItem)
                                    {
                                        if(markerBoard[xm2][ym2][it] != 0)
                                        {
                                            markerBoard[xm2][ym2][it]= 0;
                                            madeProgress = true;
                                        }
                                    }
                                    
                                    if(markerNumCompare3 != mainItem && markerNumCompare3 != subsetItem && markerNumCompare3 != thirdItem)
                                    {
                                        if(markerBoard[xm3][ym3][it] != 0)
                                        {
                                            markerBoard[xm3][ym3][it]= 0;
                                            madeProgress = true;
                                        }
                                    }
                                } //end for loop [it]
                            }
                        }//end for loop[n3]    
                    }//end for loop [n2]
                }//end for loop [n1]
            }
            
            //reset coordinate tracker and marker counter
            for(var r = 0; r < markerCounterLength; r++)
            {
                markerCounter[r] = 0;
                markerCoordinateTracker[r].x = -1;
                markerCoordinateTracker[r].y = -1;
                markerCoordinateTracker2[r].x = -1;
                markerCoordinateTracker2[r].y = -1; 
                markerCoordinateTracker3[r].x = -1;
                markerCoordinateTracker3[r].y = -1;  
            }
        }
        
        return madeProgress; 
    }
    
    /*
     * Inspect each column for a triplet of coordinates with hidden exact markers.
     * E.g. 5 can be removed since 2,8,9 must occupy these spots.
     * 0 2 0 0 5 0 0 8 9 
     * 0 2 0 0 0 0 0 8 9 
     * 0 2 0 0 0 0 0 8 9 
     * @return - true if any markers are eliminated; false otherwise  
     */
    $.hiddenTripleMarkerCleanerColumn = function()
    {
        var madeProgress = false;
        var markerCounter = [0,0,0,0,0,0,0,0,0,0];
        var markerCoordinateTracker = [{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1}];
        var markerCoordinateTracker2 = [{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1}];
        var markerCoordinateTracker3 = [{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1}];
        var markerCounterLength = markerCounter.length;
        
        //Iterate each column
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            var numbersToInspect = new Array(); //list may contain possible clones
                    
            //iterate each coordinate in column
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                //iterate marker list for coordinate
                for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                {
                     var markerValue = markerBoard[i][j][k];
                     markerCounter[markerValue]++; //increment counter for corresponding marker 
                     
                     if(markerValue != 0)
                     {
                        //keep track of the coordinate position
                        if(markerCoordinateTracker[markerValue].x == -1 && markerCoordinateTracker[markerValue].y == -1 )
                        {
                           markerCoordinateTracker[markerValue].x = i;
                           markerCoordinateTracker[markerValue].y = j;
                        }

                        //1st coordinate has been tracked; keep track of second coordinate
                        else if(markerCoordinateTracker2[markerValue].x == -1 && markerCoordinateTracker2[markerValue].y == -1) 
                        {
                           markerCoordinateTracker2[markerValue].x = i;
                           markerCoordinateTracker2[markerValue].y = j;
                        }
                        
                        //Keep track of third coordinate position
                        else if(markerCoordinateTracker3[markerValue].x == -1 && markerCoordinateTracker3[markerValue].y == -1) 
                        {
                           markerCoordinateTracker3[markerValue].x = i;
                           markerCoordinateTracker3[markerValue].y = j;
                        }
                     }
                }
            }
            
            //Inspect marker counter and add possible triples to list
            for(var z = 0; z < markerCounterLength; z++)
            {
                //add numbers that have exaclty three markers left
                if(markerCounter[z] == 3)
                    numbersToInspect.push(z); //add possible triples
            }  
            
            var numbersToInspectLength = numbersToInspect.length;
            
            //Only look at list if it has more than two item
            if(numbersToInspectLength > 2)
            {
                //iterate entire list
                for(var n1 = 0; n1 < numbersToInspectLength; n1++)
                {
                    var mainItem = numbersToInspect[n1];
                    
                    //iterate subset of list
                    for(var n2 = n1 + 1; n2 < numbersToInspectLength; n2++)
                    {
                        var subsetItem = numbersToInspect[n2];
                        
                        //iterate subset of a subset
                        for(var n3 = n2 + 1; n3 < numbersToInspectLength; n3++)
                        {
                            var thirdItem = numbersToInspect[n3];
                            var xm1 = markerCoordinateTracker[mainItem].x;
                            var xm2 = markerCoordinateTracker2[mainItem].x;
                            var xm3 = markerCoordinateTracker3[mainItem].x;
                            var ym1 = markerCoordinateTracker[mainItem].y;
                            var ym2 = markerCoordinateTracker2[mainItem].y;
                            var ym3 = markerCoordinateTracker3[mainItem].y;
                           
                            var xs1 = markerCoordinateTracker[subsetItem].x;
                            var xs2 = markerCoordinateTracker2[subsetItem].x;
                            var xs3 = markerCoordinateTracker3[subsetItem].x; 
                            var ys1 = markerCoordinateTracker[subsetItem].y;
                            var ys2 = markerCoordinateTracker2[subsetItem].y;
                            var ys3 = markerCoordinateTracker3[subsetItem].y;
                           
                            var xss1 = markerCoordinateTracker[thirdItem].x;
                            var xss2 = markerCoordinateTracker2[thirdItem].x;
                            var xss3 = markerCoordinateTracker3[thirdItem].x;
                            var yss1 = markerCoordinateTracker[thirdItem].y;
                            var yss2 = markerCoordinateTracker2[thirdItem].y;
                            var yss3 = markerCoordinateTracker3[thirdItem].y;
                            
                            //compare coordinates of markers; a triple is found if conditions are satisfied 
                            if((xm1 == xs1 && xs1 == xss1) && (xm2 == xs2 && xs2 == xss2) && (xm3 == xs3 && xs3 == xss3)
                               &&(ym1 == ys1 && ys1 == yss1) && (ym2 == ys2 && ys2 == yss2) && (ym3 == ys3 && ys3 == yss3))
                            {
                                //eliminate non-triple markers from coordinates
                                for(var it = 0; it < SUDOKU_BOARD_LENGTH; it++)
                                { 
                                    var markerNumCompare = markerBoard[xm1][ym1][it];
                                    var markerNumCompare2 = markerBoard[xm2][ym2][it];
                                    var markerNumCompare3 = markerBoard[xm3][ym3][it];
                                        
                                    if(markerNumCompare != mainItem && markerNumCompare != subsetItem && markerNumCompare != thirdItem)
                                    {
                                        if( markerBoard[xm1][ym1][it] != 0)
                                        {
                                            markerBoard[xm1][ym1][it]= 0;
                                            madeProgress = true;
                                        }
                                    }

                                    if(markerNumCompare2 != mainItem && markerNumCompare2 != subsetItem && markerNumCompare2 != thirdItem)
                                    {
                                        if(markerBoard[xm2][ym2][it] != 0)
                                        {
                                            markerBoard[xm2][ym2][it]= 0;
                                            madeProgress = true;
                                        }
                                    }
                                    
                                    if(markerNumCompare3 != mainItem && markerNumCompare3 != subsetItem && markerNumCompare3 != thirdItem)
                                    {
                                        if(markerBoard[xm3][ym3][it] != 0)
                                        {
                                            markerBoard[xm3][ym3][it]= 0;
                                            madeProgress = true;
                                        }
                                    }
                                } //end for loop [it]
                            }
                        }//end for loop[n3]    
                    }//end for loop [n2]
                }//end for loop [n1]
            }
            
            //reset coordinate tracker and marker counter
            for(var r = 0; r < markerCounterLength; r++)
            {
                markerCounter[r] = 0;
                markerCoordinateTracker[r].x = -1;
                markerCoordinateTracker[r].y = -1;
                markerCoordinateTracker2[r].x = -1;
                markerCoordinateTracker2[r].y = -1; 
                markerCoordinateTracker3[r].x = -1;
                markerCoordinateTracker3[r].y = -1;  
            }
        }
        
        return madeProgress; 
    }
    
     /*
     * Inspect each quadrant for a triplet of coordinates with hidden exact markers.
     * E.g. 5 can be removed since 2,8,9 must occupy these spots.
     * 0 2 0 0 5 0 0 8 9 
     * 0 2 0 0 0 0 0 8 9 
     * 0 2 0 0 0 0 0 8 9 
     * @return - true if any markers are eliminated; false otherwise  
     */
    $.hiddenTripleMarkerCleanerQuadrant = function()
    {
        var madeProgress = false;
        var markerCounter = [0,0,0,0,0,0,0,0,0,0];
        var markerCoordinateTracker = [{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1}];
        var markerCoordinateTracker2 = [{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1}];
        var markerCoordinateTracker3 = [{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1}];
        var markerCounterLength = markerCounter.length;
        
        //Iterate each quadrant
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            var numbersToInspect = new Array(); //list may contain possible clones
                    
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
                     
                     if(markerValue != 0)
                     {
                        //keep track of the coordinate position
                        if(markerCoordinateTracker[markerValue].x == -1 && markerCoordinateTracker[markerValue].y == -1 )
                        {
                           markerCoordinateTracker[markerValue].x = x;
                           markerCoordinateTracker[markerValue].y = y;
                        }

                        //1st coordinate has been tracked; keep track of second coordinate
                        else if(markerCoordinateTracker2[markerValue].x == -1 && markerCoordinateTracker2[markerValue].y == -1) 
                        {
                           markerCoordinateTracker2[markerValue].x = x;
                           markerCoordinateTracker2[markerValue].y = y;
                        }
                        
                        //Keep track of third coordinate position
                        else if(markerCoordinateTracker3[markerValue].x == -1 && markerCoordinateTracker3[markerValue].y == -1) 
                        {
                           markerCoordinateTracker3[markerValue].x = x;
                           markerCoordinateTracker3[markerValue].y = y;
                        }
                     }
                }
            }
            
            //Inspect marker counter and add possible triples to list
            for(var z = 0; z < markerCounterLength; z++)
            {
                //add numbers that have exaclty three markers left
                if(markerCounter[z] == 3)
                    numbersToInspect.push(z); //add possible triples
            }  
            
            var numbersToInspectLength = numbersToInspect.length;
            
            //Only look at list if it has more than two item
            if(numbersToInspectLength > 2)
            {
                //iterate entire list
                for(var n1 = 0; n1 < numbersToInspectLength; n1++)
                {
                    var mainItem = numbersToInspect[n1];
                    
                    //iterate subset of list
                    for(var n2 = n1 + 1; n2 < numbersToInspectLength; n2++)
                    {
                        var subsetItem = numbersToInspect[n2];
                        
                        //iterate subset of a subset
                        for(var n3 = n2 + 1; n3 < numbersToInspectLength; n3++)
                        {
                            var thirdItem = numbersToInspect[n3];
                            var xm1 = markerCoordinateTracker[mainItem].x;
                            var xm2 = markerCoordinateTracker2[mainItem].x;
                            var xm3 = markerCoordinateTracker3[mainItem].x;
                            var ym1 = markerCoordinateTracker[mainItem].y;
                            var ym2 = markerCoordinateTracker2[mainItem].y;
                            var ym3 = markerCoordinateTracker3[mainItem].y;
                           
                            var xs1 = markerCoordinateTracker[subsetItem].x;
                            var xs2 = markerCoordinateTracker2[subsetItem].x;
                            var xs3 = markerCoordinateTracker3[subsetItem].x; 
                            var ys1 = markerCoordinateTracker[subsetItem].y;
                            var ys2 = markerCoordinateTracker2[subsetItem].y;
                            var ys3 = markerCoordinateTracker3[subsetItem].y;
                           
                            var xss1 = markerCoordinateTracker[thirdItem].x;
                            var xss2 = markerCoordinateTracker2[thirdItem].x;
                            var xss3 = markerCoordinateTracker3[thirdItem].x;
                            var yss1 = markerCoordinateTracker[thirdItem].y;
                            var yss2 = markerCoordinateTracker2[thirdItem].y;
                            var yss3 = markerCoordinateTracker3[thirdItem].y;
                            
                            //compare coordinates of markers; a triple is found if conditions are satisfied 
                            if((xm1 == xs1 && xs1 == xss1) && (xm2 == xs2 && xs2 == xss2) && (xm3 == xs3 && xs3 == xss3)
                               &&(ym1 == ys1 && ys1 == yss1) && (ym2 == ys2 && ys2 == yss2) && (ym3 == ys3 && ys3 == yss3))
                            {
                                //eliminate non-triple markers from coordinates
                                for(var it = 0; it < SUDOKU_BOARD_LENGTH; it++)
                                { 
                                    var markerNumCompare = markerBoard[xm1][ym1][it];
                                    var markerNumCompare2 = markerBoard[xm2][ym2][it];
                                    var markerNumCompare3 = markerBoard[xm3][ym3][it];
                                        
                                    if(markerNumCompare != mainItem && markerNumCompare != subsetItem && markerNumCompare != thirdItem)
                                    {
                                        if( markerBoard[xm1][ym1][it] != 0)
                                        {
                                            markerBoard[xm1][ym1][it]= 0;
                                            madeProgress = true;
                                        }
                                    }

                                    if(markerNumCompare2 != mainItem && markerNumCompare2 != subsetItem && markerNumCompare2 != thirdItem)
                                    {
                                        if(markerBoard[xm2][ym2][it] != 0)
                                        {
                                            markerBoard[xm2][ym2][it]= 0;
                                            madeProgress = true;
                                        }
                                    }
                                    
                                    if(markerNumCompare3 != mainItem && markerNumCompare3 != subsetItem && markerNumCompare3 != thirdItem)
                                    {
                                        if(markerBoard[xm3][ym3][it] != 0)
                                        {
                                            markerBoard[xm3][ym3][it]= 0;
                                            madeProgress = true;
                                        }
                                    }
                                } //end for loop [it]
                            }
                        }//end for loop[n3]    
                    }//end for loop [n2]
                }//end for loop [n1]
            }
            
            //reset coordinate tracker and marker counter
            for(var r = 0; r < markerCounterLength; r++)
            {
                markerCounter[r] = 0;
                markerCoordinateTracker[r].x = -1;
                markerCoordinateTracker[r].y = -1;
                markerCoordinateTracker2[r].x = -1;
                markerCoordinateTracker2[r].y = -1; 
                markerCoordinateTracker3[r].x = -1;
                markerCoordinateTracker3[r].y = -1;  
            }
        }
        
        return madeProgress; 
    }

    /*
     * Inspect each row for pair of coordinates with exact markers.
     * E.g. If 1 and 9 are only found in these coordinates, the other
     * markers can be eliminated.
     * 1 2 3 0 0 0 0 0 9 [hidden clone] 2 and 3 can be removed
     * 1 0 0 0 0 0 0 0 9
     * @return - true if any markers are eliminated; false otherwise  
     */
    $.hiddenCloneMarkerCleanerRow = function()
    {
        var madeProgress = false;
        var markerCounter = [0,0,0,0,0,0,0,0,0,0];
        var markerCoordinateTracker = [{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1}];
        var markerCoordinateTracker2 = [{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1}];
        var markerCounterLength = markerCounter.length;
        
        //Iterate each row
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            var numbersToInspect = new Array(); //list may contain possible clones
                    
            //iterate each coordinate in row
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                //iterate marker list for coordinate
                for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                {
                     var markerValue = markerBoard[j][i][k];
                     markerCounter[markerValue]++; //increment counter for corresponding marker 
                     
                     if(markerValue != 0)
                     {
                        //keep track of the coordinate position
                        if(markerCoordinateTracker[markerValue].x == -1 && markerCoordinateTracker[markerValue].y == -1 )
                        {
                           markerCoordinateTracker[markerValue].x = j;
                           markerCoordinateTracker[markerValue].y = i;
                        }

                        //1st coordinate has been tracked; keep track of second coordinate
                        else if(markerCoordinateTracker2[markerValue].x == -1 && markerCoordinateTracker2[markerValue].y == -1) 
                        {
                           markerCoordinateTracker2[markerValue].x = j;
                           markerCoordinateTracker2[markerValue].y = i;
                        }
                     }
                }
            }
            
            //Inspect marker counter and add possible clones to list
            for(var z = 0; z < markerCounterLength; z++)
            {
                //add numbers that have exaclty two markers left
                if(markerCounter[z] == 2)
                    numbersToInspect.push(z); //add possible clones
            }  
            
            var numbersToInspectLength = numbersToInspect.length;
            
            //Only look at list if it has more than one item
            if(numbersToInspectLength > 1)
            {
                //iterate entire list
                for(var n1 = 0; n1 < numbersToInspectLength; n1++)
                {
                    var mainItem = numbersToInspect[n1];
                    
                    //iterate subset of list
                    for(var n2 = n1 + 1; n2 < numbersToInspectLength; n2++)
                    {
                        var subsetItem = numbersToInspect[n2];
                        var xm1 = markerCoordinateTracker[mainItem].x;
                        var xs1 = markerCoordinateTracker[subsetItem].x;
                        var ym1 = markerCoordinateTracker[mainItem].y;
                        var ys1 = markerCoordinateTracker[subsetItem].y ;
                        var xm2 = markerCoordinateTracker2[mainItem].x;
                        var xs2 = markerCoordinateTracker2[subsetItem].x;
                        var ym2 = markerCoordinateTracker2[mainItem].y;
                        var ys2 = markerCoordinateTracker2[subsetItem].y;
                        
                        //compare coordinates of markers; a clone is found if conditions are satisfied 
                        if(xm1 == xs1 && ym1 == ys1 && xm2 == xs2 && ym2 == ys2)
                        {
                            //eliminate non-clone markers from coordinates
                            for(var it = 0; it < SUDOKU_BOARD_LENGTH; it++)
                            { 
                                var markerNumCompare = markerBoard[xm1][ym1][it];
                                var markerNumCompare2 = markerBoard[xm2][ym2][it];
                                
                                if(markerNumCompare != mainItem && markerNumCompare != subsetItem)
                                {
                                    if( markerBoard[xm1][ym1][it] != 0)
                                    {
                                        markerBoard[xm1][ym1][it]= 0;
                                        madeProgress = true;
                                    }  
                                }
                                   
                                if(markerNumCompare2 != mainItem && markerNumCompare2 != subsetItem)
                                {
                                    if(markerBoard[xm2][ym2][it] != 0)
                                    {
                                        markerBoard[xm2][ym2][it]= 0;
                                        madeProgress = true;
                                    }
                                }
                            } //end for loop [it]
                        }    
                    }//end for loop [n2]
                }//end for loop [n1]
            }
            
            //reset coordinate tracker and marker counter
            for(var r = 0; r < markerCounterLength; r++)
            {
                markerCounter[r] = 0;
                markerCoordinateTracker[r].x = -1;
                markerCoordinateTracker[r].y = -1;
                markerCoordinateTracker2[r].x = -1;
                markerCoordinateTracker2[r].y = -1;  
            }
        }
        
        return madeProgress; 
    }
    
     /*
     * Inspect each column for pair of coordinates with hidden exact markers.
     * E.g. If 1 and 9 are only found in these coordinates, the other
     * markers can be eliminated.
     * 1 2 3 0 0 0 0 0 9 [hidden clone] 2 and 3 can be removed.
     * 1 0 0 0 0 0 0 0 9
     * @return - true if any markers are eliminated; false otherwise  
     */
    $.hiddenCloneMarkerCleanerColumn = function()
    {
        var madeProgress = false;
        var markerCounter = [0,0,0,0,0,0,0,0,0,0];
        var markerCoordinateTracker = [{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1}];
        var markerCoordinateTracker2 = [{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1}];
        var markerCounterLength = markerCounter.length;
        
        //Iterate each column
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            var numbersToInspect = new Array(); //list may contain possible clones
                    
            //iterate each coordinate in column
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                //iterate marker list for coordinate
                for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                {
                     var markerValue = markerBoard[i][j][k];
                     markerCounter[markerValue]++; //increment counter for corresponding marker 
                     
                     if(markerValue != 0)
                     {
                        //keep track of the coordinate position
                        if(markerCoordinateTracker[markerValue].x == -1 && markerCoordinateTracker[markerValue].y == -1 )
                        {
                           markerCoordinateTracker[markerValue].x = i;
                           markerCoordinateTracker[markerValue].y = j;
                        }

                        //1st coordinate has been tracked; keep track of second coordinate
                        else if(markerCoordinateTracker2[markerValue].x == -1 && markerCoordinateTracker2[markerValue].y == -1) 
                        {
                           markerCoordinateTracker2[markerValue].x = i;
                           markerCoordinateTracker2[markerValue].y = j;
                        }
                     }
                }
            }
            
            //Inspect marker counter and add possible clones to list
            for(var z = 0; z < markerCounterLength; z++)
            {
                //add numbers that have exaclty two markers left
                if(markerCounter[z] == 2)
                    numbersToInspect.push(z); //add possible clones
            }  
            
            var numbersToInspectLength = numbersToInspect.length;
            
            //Only look at list if it has more than one item
            if(numbersToInspectLength > 1)
            {
                //iterate entire list
                for(var n1 = 0; n1 < numbersToInspectLength; n1++)
                {
                    var mainItem = numbersToInspect[n1];
                    
                    //iterate subset of list
                    for(var n2 = n1 + 1; n2 < numbersToInspectLength; n2++)
                    {
                        var subsetItem = numbersToInspect[n2];
                        var xm1 = markerCoordinateTracker[mainItem].x;
                        var xs1 = markerCoordinateTracker[subsetItem].x;
                        var ym1 = markerCoordinateTracker[mainItem].y;
                        var ys1 = markerCoordinateTracker[subsetItem].y ;
                        var xm2 = markerCoordinateTracker2[mainItem].x;
                        var xs2 = markerCoordinateTracker2[subsetItem].x;
                        var ym2 = markerCoordinateTracker2[mainItem].y;
                        var ys2 = markerCoordinateTracker2[subsetItem].y ;
                        
                        //compare coordinates of markers; a clone is found if conditions are satisfied 
                        if(xm1 == xs1 && ym1 == ys1 && xm2 == xs2 && ym2 == ys2)
                        {
                            //eliminate non-clone markers from coordinates
                            for(var it = 0; it < SUDOKU_BOARD_LENGTH; it++)
                            { 
                                var markerNumCompare = markerBoard[xm1][ym1][it];
                                var markerNumCompare2 = markerBoard[xm2][ym2][it];
                                
                                if(markerNumCompare != mainItem && markerNumCompare != subsetItem)
                                {
                                    if( markerBoard[xm1][ym1][it] != 0)
                                    {
                                        markerBoard[xm1][ym1][it]= 0;
                                        madeProgress = true;
                                    }
                                        
                                }
                                   
                                if(markerNumCompare2 != mainItem && markerNumCompare2 != subsetItem)
                                {
                                    if(markerBoard[xm2][ym2][it] != 0)
                                    {
                                        markerBoard[xm2][ym2][it]= 0;
                                        madeProgress = true;
                                    }
                                }
                            } //end for loop [it]
                        }    
                    }//end for loop [n2]
                }//end for loop [n1]
            }
            
            //reset coordinate tracker and marker counter
            for(var r = 0; r < markerCounterLength; r++)
            {
                markerCounter[r] = 0;
                markerCoordinateTracker[r].x = -1;
                markerCoordinateTracker[r].y = -1;
                markerCoordinateTracker2[r].x = -1;
                markerCoordinateTracker2[r].y = -1;  
            }
        }
        
        return madeProgress; 
    }
    
    /*
     * Inspect each quadrant for pair of coordinates with hidden exact markers.
     * E.g. If 1 and 9 are only found in these coordinates, the other
     * markers can be eliminated.
     * 1 2 3 0 0 0 0 0 9 [hidden clone] 2 and 3 can be removed.
     * 1 0 0 0 0 0 0 0 9
     * @return - true if any markers are eliminated; false otherwise  
     */
    $.hiddenCloneMarkerCleanerQuadrant = function()
    {
        var madeProgress = false;
        var markerCounter = [0,0,0,0,0,0,0,0,0,0];
        var markerCoordinateTracker = [{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1}];
        var markerCoordinateTracker2 = [{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1},{'x':-1, 'y':-1}];
        var markerCounterLength = markerCounter.length;
        
        //Iterate each quadrant
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            var numbersToInspect = new Array(); //list may contain possible clones
                    
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
                     
                     if(markerValue != 0)
                     {
                        //keep track of the coordinate position
                        if(markerCoordinateTracker[markerValue].x == -1 && markerCoordinateTracker[markerValue].y == -1 )
                        {
                           markerCoordinateTracker[markerValue].x = x;
                           markerCoordinateTracker[markerValue].y = y;
                        }

                        //1st coordinate has been tracked; keep track of second coordinate
                        else if(markerCoordinateTracker2[markerValue].x == -1 && markerCoordinateTracker2[markerValue].y == -1) 
                        {
                           markerCoordinateTracker2[markerValue].x = x;
                           markerCoordinateTracker2[markerValue].y = y;
                        }
                     }
                }
            }
            
            //Inspect marker counter and add possible clones to list
            for(var z = 0; z < markerCounterLength; z++)
            {
                //add numbers that have exaclty two markers left
                if(markerCounter[z] == 2)
                    numbersToInspect.push(z); //add possible clones
            }  
            
            var numbersToInspectLength = numbersToInspect.length;
            
            //Only look at list if it has more than one item
            if(numbersToInspectLength > 1)
            {
                //iterate entire list
                for(var n1 = 0; n1 < numbersToInspectLength; n1++)
                {
                    var mainItem = numbersToInspect[n1];
                    
                    //iterate subset of list
                    for(var n2 = n1 + 1; n2 < numbersToInspectLength; n2++)
                    {
                        var subsetItem = numbersToInspect[n2];
                        var xm1 = markerCoordinateTracker[mainItem].x;
                        var xs1 = markerCoordinateTracker[subsetItem].x;
                        var ym1 = markerCoordinateTracker[mainItem].y;
                        var ys1 = markerCoordinateTracker[subsetItem].y ;
                        var xm2 = markerCoordinateTracker2[mainItem].x;
                        var xs2 = markerCoordinateTracker2[subsetItem].x;
                        var ym2 = markerCoordinateTracker2[mainItem].y;
                        var ys2 = markerCoordinateTracker2[subsetItem].y ;
                        
                        //compare coordinates of markers; a clone is found if conditions are satisfied 
                        if(xm1 == xs1 && ym1 == ys1 && xm2 == xs2 && ym2 == ys2)
                        {
                            //eliminate non-clone markers from coordinates
                            for(var it = 0; it < SUDOKU_BOARD_LENGTH; it++)
                            { 
                                var markerNumCompare = markerBoard[xm1][ym1][it];
                                var markerNumCompare2 = markerBoard[xm2][ym2][it];
                                
                                if(markerNumCompare != mainItem && markerNumCompare != subsetItem)
                                {
                                    if( markerBoard[xm1][ym1][it] != 0)
                                    {
                                        markerBoard[xm1][ym1][it]= 0;
                                        madeProgress = true;
                                    }     
                                }
                                
                                if(markerNumCompare2 != mainItem && markerNumCompare2 != subsetItem)
                                {
                                    if(markerBoard[xm2][ym2][it] != 0)
                                    {
                                        markerBoard[xm2][ym2][it]= 0;
                                        madeProgress = true;
                                    }
                                }
                            } //end for loop [it]
                        }    
                    }//end for loop [n2]
                }//end for loop [n1]
            }
            
            //reset coordinate tracker and marker counter
            for(var r = 0; r < markerCounterLength; r++)
            {
                markerCounter[r] = 0;
                markerCoordinateTracker[r].x = -1;
                markerCoordinateTracker[r].y = -1;
                markerCoordinateTracker2[r].x = -1;
                markerCoordinateTracker2[r].y = -1;  
            }
        }
        
        return madeProgress; 
    }
    
    
    /* Definition Vertical Marker - In a quadrant, there exist only one column 
     * that contains the marker number(s). Inspect each quadrant for vertical
     * markers. If a number with vertical is found, eliminate markers from 
     * vertical line excluding the markers in the inspected quadrant.
     * @return - true if any markers are eliminated; false otherwise.
     * Note: There is a redundancy for isolated markers elimination. 
     */
    $.verticalMarkerSlice = function()
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
     * @return - true if any markers are eliminated; false otherwise.
     * Note: There is a redundancy for isolated markers elimination. 
     */
    $.horizontalMarkerSlice = function()
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
    
    /* Inspect each row for isolated markers and place number on board.
     * @return true if a number has been placed; otherwise false 
     */
    $.lastNumberMarkerInRowPlacement = function()
    {
        var madeProgress = false;
        var markerCounter = [0,0,0,0,0,0,0,0,0,0];
        var markerCoordinateTracker = [{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0}];
        var markerCounterLength = markerCounter.length;
        
        //Iterate each row
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            //iterate each coordinate in row
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                //iterate marker list for coordinate
                for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                {
                     var markerValue = markerBoard[j][i][k];
                     markerCounter[markerValue]++; //increment counter for corresponding marker 
                     //keep track of the latest coordinate which incremented the corresponding counter
                     markerCoordinateTracker[markerValue].x = j;
                     markerCoordinateTracker[markerValue].y = i;
                   
                }
            }
            
            for(var z = 0; z < markerCounterLength; z++)
            {
                //Exclude zero value
                if(z == 0)
                {
                     markerCounter[z] = 0;
                     continue;
                }
                
                //find the isolated marker in row; then place number
                if(markerCounter[z] == 1)
                {
                    var coordX = markerCoordinateTracker[z].x;
                    var coordY = markerCoordinateTracker[z].y;
                    puzzleBoard[coordX][coordY] = z; //place number
                    //console.log("(" + coordX + ", " + coordY + ") = " + z);
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
    
    /* Inspect each column for isolated markers and place number on board.
     * @return true if a number has been placed; otherwise false 
     */
    $.lastNumberMarkerInColumnPlacement = function()
    {
        var madeProgress = false;
        var markerCounter = [0,0,0,0,0,0,0,0,0,0];
        var markerCoordinateTracker = [{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0},{'x':0, 'y':0}];
        var markerCounterLength = markerCounter.length;
        
        //Iterate each column
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            //iterate each coordinate in column
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                //iterate marker list for coordinate
                for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                {
                     var markerValue = markerBoard[i][j][k];
                     markerCounter[markerValue]++; //increment counter for corresponding marker 
                     //keep track of the latest coordinate which incremented the corresponding counter
                     markerCoordinateTracker[markerValue].x = i;
                     markerCoordinateTracker[markerValue].y = j;
                   
                }
            }
            
            for(var z = 0; z < markerCounterLength; z++)
            {
                //Exclude zero value
                if(z == 0)
                {
                     markerCounter[z] = 0;
                     continue;
                }
                
                //find the isolated marker in column; then place number
                if(markerCounter[z] == 1)
                {
                    var coordX = markerCoordinateTracker[z].x;
                    var coordY = markerCoordinateTracker[z].y;
                    puzzleBoard[coordX][coordY] = z; //place number
                    //console.log("(" + coordX + ", " + coordY + ") = " + z);
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
    
    /* Inspect each quadrant for isolated markers and place number on board.
     * @return true if a number has been placed; otherwise false 
     */
    $.lastNumberMarkerInQuadrantPlacement = function()
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
                //Exclude zero value
                if(z == 0)
                {
                     markerCounter[z] = 0;
                     continue;
                }
                
                //find the isolated marker in quadrant; then place number
                if(markerCounter[z] == 1)
                {
                    var coordX = markerCoordinateTracker[z].x;
                    var coordY = markerCoordinateTracker[z].y;
                    puzzleBoard[coordX][coordY] = z; //place number
                    //console.log("(" + coordX + ", " + coordY + ") = " + z);
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
     * @return - true if a number has been placed; otherwise false
     */
    $.oneMarkerLeftPlacement = function()
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
                    //console.log("(" + i + ", " + j + ") = " + markNumber);
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
    * Print marker list of each coordinate by row
    */
    $.printMarkerBoardByRow = function()
    {
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                var str = "(" + j  + "," + i + ")";
                for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
                {
                    str = str + " " + markerBoard[j][i][k];   
                }
                console.log(str);
            }
            console.log("\n");
        }  
    }
    
    /*
     * Print marker list of each coordinate by column
     */
    $.printMarkerBoardByColumn = function()
    {
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
            for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
            {
                var str = "(" + i + "," + j + ")";
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
     */
    $.printMarkerBoardByQuadrant = function()
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
     */
    $.printPuzzleBoard = function()
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
     * Validate the data of user for a single coordinate.
     * Only accept numbers. 
     * @param - number 
     * @return - true if validation passes; false otherwise
     */
    $.validateData = function(number)
    {
        var digitRegex = new RegExp(/^[0-9]{1}$/);
        return (number.match(digitRegex) == null)? false : true;    
    }
    
    /*
     * Validate if the sudoku constraints are satisfied
     * Zero represents a blank.
     * 1) Each row must not contain duplicate numbers [1 -9].
     * 2) Each column must not contain duplicate numbers [1-9].
     * 3) Each quadrant must not contain duplicate numbers.
     * @param - puzzleBoard
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
     * @param - puzzleBoard
     * @param - rowCounterArray [Array] increment value for corresponding index (use tile value)
     * @param - selectedRow [int] the selected row to look at (A = 0, B =1, ... , I = 8 )
     */
    $.calculateRowCounters = function(puzzleBoard,rowCounterArray, selectedRow)
    {
        for(var i = 0; i < SUDOKU_BOARD_LENGTH; i++)
        {
              rowCounterArray[puzzleBoard[i][selectedRow]]++;
        }
    }
    
    /*
     * Calculate counter array for a column.
     * @param - puzzleBoard
     * @param - columnCounterArray [Array] increment value for corresponding index (use tile value)
     * @param - selectedColumn [int] the selected column to look at (A = 0, B =1, ... , I = 8 )
     */
    $.calculateColumnCounters = function(puzzleBoard,columnCounterArray, selectedColumn)
    {
        for(var j = 0; j < SUDOKU_BOARD_LENGTH; j++)
        {
              columnCounterArray[puzzleBoard[selectedColumn][j]]++;
        }
    }
    
    /*
     * Calculate counter array for a quadrant.
     * @param - puzzleBoard
     * @param - quadrantCounterArray [Array] increment value for corresponding index (use tile value)
     * @param - selectedQuadrant [int] the selected quadrant to look coordinate system (I = 0, II = 1, ..., XI = 8)
     */
    $.calculateQuadrantCounters = function(puzzleBoard,quadrantCounterArray, selectedQuadrant)
    {
        var x = 0;
        var y = 0;
        
        for(var k = 0; k < SUDOKU_BOARD_LENGTH; k++)
        {
            x = (k % 3) + (3 * (selectedQuadrant % 3)); 
            y = Math.floor(k / 3) + (3 * Math.floor(selectedQuadrant / 3));
            quadrantCounterArray[puzzleBoard[x][y]]++;
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
    
    /*
     * Determine if a coordinate has two remaining markers.
     * @param - markerList [Array] marker list of a coordinate
     * @return - true if there is exactly two markers remaining; false otherwise 
     */
    $.hasTwoMarkersLeft = function(markerList)
    {
        var markerListLength = markerList.length;
        var counter = 0;

        for(var i = 0; i < markerListLength; i++)
        {
            if(markerList[i] != 0)
               counter++;
        }
        
        return (counter == 2) ? true : false;
    }
    
})(jQuery);