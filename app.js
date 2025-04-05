document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const width = 8;
  const squares = [];
  let score = 0;
  const scoreDisplay = document.getElementById("score");

  const candyColors = [
    "url(img/1.webp)",
    "url(img/2.webp)",
    "url(img/3.png)",
    "url(img/4.png)",
    "url(img/5.png)",
    "url(img/6.png)",
    "url(img/7.png)",

  ];

  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("draggable", true);
      square.setAttribute("id", i);
      let randomColor = Math.floor(Math.random() * candyColors.length);
      square.style.backgroundImage = candyColors[randomColor];
      grid.appendChild(square);
      squares.push(square);
    }
  }
  createBoard();

  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

  squares.forEach((square) => square.addEventListener("dragstart", dragStart));
  squares.forEach((square) => square.addEventListener("dragend", dragEnd));
  squares.forEach((square) => square.addEventListener("dragover", dragOver));
  squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
  squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
  squares.forEach((square) => square.addEventListener("drop", dragDrop));

  function dragStart() {
    colorBeingDragged = this.style.backgroundImage;
    squareIdBeingDragged = parseInt(this.id);
  }

  function dragEnd() {
    if (squareIdBeingReplaced != null) {
      let validMoves = [
        squareIdBeingDragged - 1,
        squareIdBeingDragged - width,
        squareIdBeingDragged + 1,
        squareIdBeingDragged + width,
      ];
      let validMove = validMoves.includes(squareIdBeingReplaced);

      if (
        squareIdBeingDragged % width === 0 &&
        squareIdBeingReplaced === squareIdBeingDragged - 1
      ) {
        validMove = false;
      }
      if (
        squareIdBeingDragged % width === width - 1 &&
        squareIdBeingReplaced === squareIdBeingDragged + 1
      ) {
        validMove = false;
      }

      if (!validMove) {
        squares[squareIdBeingReplaced].style.backgroundImage =
          colorBeingReplaced;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
      }
    }

    squareIdBeingReplaced = null;
    squareIdBeingDragged = null;
    colorBeingDragged = null;
    colorBeingReplaced = null;
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragLeave() {}

  function dragDrop() {
    if (parseInt(this.id) !== squareIdBeingDragged) {
      colorBeingReplaced = this.style.backgroundImage;
      squareIdBeingReplaced = parseInt(this.id);
      this.style.backgroundImage = colorBeingDragged;
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    } else {
      squareIdBeingReplaced = null;
    }
  }

  function moveDown() {
    for (let i = 0; i < width * (width - 1); i++) {
      if (squares[i + width].style.backgroundImage === "") {
        squares[i + width].style.backgroundImage =
          squares[i].style.backgroundImage;
        squares[i].style.backgroundImage = "";
      }
    }
    refillTopRow();
  }

  function refillTopRow() {
    for (let i = 0; i < width; i++) {
      if (squares[i].style.backgroundImage === "") {
        let randomColor = Math.floor(Math.random() * candyColors.length);
        squares[i].style.backgroundImage = candyColors[randomColor];
      }
    }
  }

  function checkRowForThree() {
    for (let i = 0; i < width * width - 2; i++) {
      if (i % width >= width - 2) continue;

      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = squares[i].style.backgroundImage;
      const isBlank = decidedColor === "";

      if (isBlank) continue;

      if (
        rowOfThree.every(
          (index) => squares[index].style.backgroundImage === decidedColor
        )
      ) {
        score += 3;
        if (scoreDisplay) scoreDisplay.textContent = score;
        rowOfThree.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }

  function checkColumForThree() {
    for (let i = 0; i < width * width - 2 * width; i++) {
      const columOfThree = [i, i + width, i + width * 2];
      const decidedColor = squares[i].style.backgroundImage;
      const isBlank = decidedColor === "";

      if (isBlank) continue;

      if (
        columOfThree.every(
          (index) => squares[index].style.backgroundImage === decidedColor
        )
      ) {
        score += 3;
        if (scoreDisplay) scoreDisplay.textContent = score;
        columOfThree.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }

  function checkRowForFour() {
    for (let i = 0; i < width * width - 3; i++) {
      if (i % width >= width - 3) continue;

      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = squares[i].style.backgroundImage;
      const isBlank = decidedColor === "";

      if (isBlank) continue;

      if (
        rowOfFour.every(
          (index) => squares[index].style.backgroundImage === decidedColor
        )
      ) {
        score += 4;
        if (scoreDisplay) scoreDisplay.textContent = score;
        rowOfFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }

  function checkColumForFour() {
    for (let i = 0; i < width * width - 3 * width; i++) {
      const columOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = squares[i].style.backgroundImage;
      const isBlank = decidedColor === "";

      if (isBlank) continue;

      if (
        columOfFour.every(
          (index) => squares[index].style.backgroundImage === decidedColor
        )
      ) {
        score += 4;
        if (scoreDisplay) scoreDisplay.textContent = score;
        columOfFour.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }

  checkRowForFour();
  checkColumForFour();
  checkRowForThree();
  checkColumForThree();
  if (scoreDisplay) scoreDisplay.textContent = score;

  window.setInterval(function () {
    moveDown();
    checkRowForFour();
    checkColumForFour();
    checkRowForThree();
    checkColumForThree();
  }, 100);
});
