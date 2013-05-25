Sudoku Solver
============ 
This program attempts to solve a 9x9 Sudoku Board puzzle using human-logic.  
Demo: http://rayedchan.github.io/SudokuSolver/

Background
============
Sudoku Coordinate System 9x9 Board  
  
      A B C  D E F   G H I     
    A      |       |    
    B  I   |  II   |  III    
    C      |       |    
     ------|-------|-------    
    D      |       |    
    E  IV  |   V   |  VI    
    F      |       |    
     ------|-------|-------    
    G      |       |    
    H  VII | VIII  |  IX    
    I      |       |        
      
    [Left - Right] = x coordinate  rows     
    [Up - Down] = y coordinate columns    
The Sudoku board is made of 81 coordinate points (squares). 
The board is divided into nine quadrants.
Each quadrant contains 9 coordinate points (3 x 3).  
 
Sudoku Game Conditions (Sudoku Uniqueness Constraints)
* Each quadrant must have [1-9] numbers. No duplicates.
* Each row must have [1-9] numbers. No duplicates.
* Each column musr have [1-9] numbers. No duplicates.
   
Implementation
============ 
**Algorithm:**  
Backtracking with recursion. Several constraints are applied to reduce the depth of recursion.  
  
**Data Structures:**  
* 2D Array to represent the Sudoku board.  
* 3D Array to represent the marker board. The marker board contains all the possible values of each square can take. This marker plays an important role in solving the puzzle.
  
**Sudoku Strategies:**  
For marker elimination:  
* Sudoku Uniqueness Constraints 
* Pointing Pair
* Pointing Triple 
