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
* Naked Pair
* Hidden Naked Pair
* Hidden Naked Triple
* Box Line Reduction
* Bowman's Bingo
  
For number placement:  
* Last marker number
* Last marker number in region (Quadrant, Row, Column)  
  
License
============
The MIT License (MIT)

Copyright (c) 2013 rayedchan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

