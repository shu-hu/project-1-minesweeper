## Project Name
**Minesweeper**

#### Created by [Shu](https://www.linkedin.com/in/shunuanhu/)

## Description
Minesweeper is a classic Microsoft game, which released in 1990. The goal of Minesweeper is to uncover all the squares on a board that do not contain mines. The reason I chose this game as the unit one project is because that was the first computer game I played, and I'm quite familiar with the rules.

## Getting Started
[You can play game here!](https://shu-minesweeper-game.netlify.app/)
You also can find instructions by clicking the **how to play** button in the game main page.

## Pseudocode
1) Use js to create a 5 * 5 grid board, and define number of bombs for the games.

2) Define a boolean variable to check the state of game

3) Create a function to randomize the location of bombs on the board.

4) Declare a function to count the number of bombs in the surrounding area of each square, and display numbers to those safe squares.

5) Upon loading, the app should:
	5.1) Call a function to create board
	5.2) Render those values to the page
	5.3) Wait for the user to start the game by clicking a square
    5.4) once the game starts, define a variable to count the time until game over

6) Create a function to let the user be able to add Flag with right click

7) Declare a function to check the neighboring squares once square is clicked

8) Declare a function to check for winning condition

9) Handle the user clicking a square to decide whether it has bomb or is a safe square

10) Handle the user clicking the restart button

11)  when user click a button, the game switch to hard level, which increases the number of bombs.
    Also, handle a button click function to switch light-dark mode.

## Game Images
| Light Mode - Ocean Theme | Dark Mode - Space Theme |
| ------------------------ | ----------------------- |
| ![alt text](https://i.imgur.com/R1MVsKQ.png) |  ![alt text](https://i.imgur.com/6Eo8xWD.png) |
| ![alt text](https://i.imgur.com/KWAbPrq.png) | ![alt text](https://i.imgur.com/AgGtreS.png) |


## Technologies Used
- JavaScript
- HTML
- CSS
- Bootstrap
- Font-Awesome
- Google-Fonts
- Animate.css

## Next Steps
- add more animations
- add a custom board feature
- create database to keep records of the fastest won