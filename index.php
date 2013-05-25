<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script type="text/javascript" src="js/jquery-1.9.1.min.js"></script>
        <script type="text/javascript" src="js/sudokuSolver.js"></script>
        <script type="text/javascript">
            $(document).ready(function()
            {
                /*Auto-focus to the next input box if maxlength attribute has been satisfied*/
                $("input").keyup(function()
                {    
                    var currentId = $(this).attr('id');
                    var nextId = Number(currentId) + 1;
                    
                    if($(this).val().length == $(this).attr("maxlength"))
                       $("#"+nextId).focus();
                });
            });
        </script>
        <style>
            .coordinate
            {
                background:#fff;
                background:-moz-linear-gradient(top, #fff, #eee);
                background:-webkit-gradient(linear,0 0, 0 100%, from(#fff), to(#eee));
                box-shadow:inset 0 0 0 1px #fff;
                -moz-box-shadow:inset 0 0 0 1px #fff;
                -webkit-box-shadow:inset 0 0 0 1px #fff;
                height:40px;
                text-align:center;
                vertical-align:middle;
                width:40px;
                font-size: 18px;
            }
            
            .elementAdded
            {
                color:blue;
            }
            
            /*.violateRowConstraint
            {
                border-top: 2px solid red;
                border-bottom: 2px solid red;
            }
            
            .violateColumnConstraint
            {
                border-left: 2px solid red;
                border-right: 2px solid red;
            }
            
            .violateQuadrantConstraint
            {
                border: 2px solid red;
            }*/
            
            .invalidData, .invalidRow, .invalidColumn, .invalidQuadrant
            {
                color:red;
            }
            
            table
            {
                border-collapse:collapse;
                border-spacing: 0;
                padding: 0px;
                margin: 0px;
            }
            
        </style>
        <title>Sudoku Solver</title>
    </head>
    
    <body>
        <!--Sudoku 9x9 board -->
        <table style="border: 2px solid black;" cellspacing="0" cellpadding="0">
            <tr>
                <td><table style="border-right: 2px solid black;" cellspacing="0" cellpadding="0">
                    <tr>
                        <td> <input class="coordinate" style="border-top: 0px; border-left: 0px" type="text" id="1" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="2" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="3" size="1" maxlength="1" /></td>
                    </tr>
                    <tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="10" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="11" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="12" size="1" maxlength="1" /></td>
                    </tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="19" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="20" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="21" size="1" maxlength="1" /></td>
                    <tr>
                </table></td>
                
                <td><table style="border-right: 2px solid black;" cellspacing="0" cellpadding="0">
                    <tr>
                        <td> <input class="coordinate" style="border-top: 0px; border-left: 0px" type="text" id="4" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="5" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="6" size="1" maxlength="1" /></td>
                    </tr>
                    <tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="13" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="14" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="15" size="1" maxlength="1" /></td>
                    </tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="22" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="23" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="24" size="1" maxlength="1" /></td>
                    <tr>
                </table></td>
                <td><table cellspacing="0" cellpadding="0">
                    <tr>
                        <td> <input class="coordinate" style="border-top: 0px; border-left: 0px" type="text" id="7" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="8" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="9" size="1" maxlength="1" /></td>
                    </tr>
                    <tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="16" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="17" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="18" size="1" maxlength="1" /></td>
                    </tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="25" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="26" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="27" size="1" maxlength="1" /></td>
                    <tr>
                </table></td>
            </tr>
            
            <tr>
                <td><table style="border-right: 2px solid black; border-top: 2px solid black;" cellspacing="0" cellpadding="0">
                    <tr>
                        <td> <input class="coordinate" style="border-top: 0px; border-left: 0px" type="text" id="28" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="29" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="30" size="1" maxlength="1" /></td>
                    </tr>
                    <tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="37" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="38" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="39" size="1" maxlength="1" /></td>
                    </tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="46" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="47" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="48" size="1" maxlength="1" /></td>
                    <tr>
                </table></td>
                
                <td><table style="border-right: 2px solid black; border-top: 2px solid black;" cellspacing="0" cellpadding="0">
                    <tr>
                        <td> <input class="coordinate" style="border-top: 0px; border-left: 0px" type="text" id="31" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="32" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="33" size="1" maxlength="1" /></td>
                    </tr>
                    <tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="40" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="41" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="42" size="1" maxlength="1" /></td>
                    </tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="49" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="50" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="51" size="1" maxlength="1" /></td>
                    <tr>
                </table></td>
                
                <td><table style="border-top: 2px solid black;" cellspacing="0" cellpadding="0">
                    <tr>
                        <td> <input class="coordinate" style="border-top: 0px; border-left: 0px" type="text" id="34" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="35" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="36" size="1" maxlength="1" /></td>
                    </tr>
                    <tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="43" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="44" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="45" size="1" maxlength="1" /></td>
                    </tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="52" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="53" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="54" size="1" maxlength="1" /></td>
                    <tr>
                </table></td>
            </tr>
            
             <tr>
                <td><table style="border-right: 2px solid black; border-top: 2px solid black;" cellspacing="0" cellpadding="0">
                    <tr>
                        <td> <input class="coordinate" style="border-top: 0px; border-left: 0px" type="text" id="55" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="56" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="57" size="1" maxlength="1" /></td>
                    </tr>
                    <tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="64" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="65" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="66" size="1" maxlength="1" /></td>
                    </tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="73" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="74" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="75" size="1" maxlength="1" /></td>
                    <tr>
                </table></td>
                
                <td><table style="border-right: 2px solid black; border-top: 2px solid black;" cellspacing="0" cellpadding="0">
                    <tr>
                        <td> <input class="coordinate" style="border-top: 0px; border-left: 0px" type="text" id="58" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="59" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="60" size="1" maxlength="1" /></td>
                    </tr>
                    <tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="67" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="68" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="69" size="1" maxlength="1" /></td>
                    </tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="76" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="77" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="78" size="1" maxlength="1" /></td>
                    <tr>
                </table></td>
                
                <td><table style="border-top: 2px solid black;" cellspacing="0" cellpadding="0">
                    <tr>
                        <td> <input class="coordinate" style="border-top: 0px; border-left: 0px" type="text" id="61" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="62" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" style="border-top: 0px;" type="text" id="63" size="1" maxlength="1" /></td>
                    </tr>
                    <tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="70" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="71" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="72" size="1" maxlength="1" /></td>
                    </tr>
                        <td> <input class="coordinate" style="border-left: 0px;" type="text" id="79" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="80" size="1" maxlength="1" /></td>
                        <td> <input class="coordinate" type="text" id="81" size="1" maxlength="1" /></td>
                    <tr>
                </table></td>
            </tr>
        </table> 

        <form id="puzzleForm">
            <table>
                <tr>
                    <td><input type="button" id="submit" value="Solve"></td>
                    <td><input type="button" id="clear" value="Clear"></td>
                </tr>
            </table>
        </form>
        
    </body>
</html>
