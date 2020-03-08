/*var location1 = Math.floor(Math.random() * 5); // возвращает от 0 до 4
var location2 = location1 + 1;
var location3 = location2 + 1;

alert(location1);

var guess;
var hits = 0;
var guesses = 0;

var isSunk = false;

while(isSunk == false){
    guess = prompt("Ты готов выстрелить? (введи цифру 0-6):");
    if (guess < 0 || guess  > 6){
        alert("Я же просил от 0 до 6 ввести!");
    }else{
        guesses = guesses + 1;
        if (guess == location1 || guess == location2 || guess  == location3){
            hits = hits + 1;
            if (hits == 3){
                isSunk = true;
                alert("Ты победил в игре!");
            }

        }else{
            alert("Мимо )))");
        }
    }
}
var status = "Вы выстрелили " + guesses + " раз, для того чтобы  попасть по кораблю!" +
 "Это показывает уровень вашей точности как: " + (3/guesses);
 document.write(status);*/
 

 /*var i = 0;

 while(i < 4){
     output = i;
     console.log(output);
     i = i + 1;
 }*/

 

 /*var lada = {
     make: "lada",
     model: "granta",
     year: 2010,
     color: "white",
     passenger: 5,
     mileage: 5000,
     started: false,
     light: function(){       // функция внутри обьекта - это метод
         console.log('Включен ближний свет');
     },
     start: function(){
         this.started = true;
     },
     stop: function(){
         this.started = false;
     },
     drive: function(){
         if(this.started){
             alert("Едем!");
         }else{
             alert("надо завести двигатель!");
         }
     }

 };

 lada.drive();
 lada.start();
 lada.drive();
 lada.stop();
 lada.start();
 console.log(lada);*/

 /*var niva = {
     make: "chevrole",
     model: "gt",
     year: 1999,
     color: "red",
     passenger: 4,
     mileage: 1565
 };*/

 /*function check (car){
     if(car.mileage > 1000){
         return false;
     } else if(car.year > 1990){
         return false;
     }
     car.bay = true;
 }

 var car = check(lada);

 lada.light();*/




        // Представление игры


 var view = {
     displayMessage: function(msg){
         var messageArea = document.querySelector('#messageArea');
         messageArea.innerHTML = msg;
     },

     displayHit: function(location){
         var cell = document.getElementById(location);
         cell.setAttribute("class", "hit");
     },

     displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
 };



        // Модель  поведения  игры 

 var model = {
     boardSize: 7,     // размер игрового поля
     numShips: 3,      // количество кораблей  в игре
     shipLength: 3,    // длина корабля в клетках
     shipsSunk: 0,     // количество  потопленных кораблей 

     ships: [
          { locations: [0, 0, 0], hits: ["", "", ""] },
          { locations: [0, 0, 0], hits: ["", "", ""] },
          { locations: [0, 0, 0], hits: ["", "", ""] }
    ],

    fire: function(guess){
        for(var i = 0; i < this.numShips; i++){
            var ship = this.ships[i];

            var index = ship.locations.indexOf(guess);
            
            
             if(ship.hits[index] === "hit"){
                view.displayMessage("HIT!!!");
                return true;
             }else if(index >= 0){
                ship.hits[index] = "Попадание!";
                view.displayHit(guess);
                view.displayMessage("Еще одно попадание)))");

                if(this.isSunk(ship)){
                    view.displayMessage("Вы потопили вражеский  корабль!)))")
                    this.shipsSunk++;
                }
                return true;
            }
                
        }
        
        view.displayMiss(guess);
        view.displayMessage("Ты промазал!(");
        return false;
    },

    isSunk: function(ship){
        for(var i = 0; i < this.shipLength; i++){
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },

        // Генерация кораблей на игровом поле

        generateShipLocations: function(){   // создает корабли
            var locations;
            for(var i = 0; i < this.numShips; i++){  // цикл работает до нужного числа кораблей
                do{
                    locations = this.generateShip();
                }while(this.collision(locations));
                this.ships[i].locations = locations;
            }
            console.log("Ships array: ");
            console.log(this.ships);

        },

        generateShip: function(){           // создает один корабль, произвольно размещает на поле
                var direction = Math.floor(Math.random() * 2);
                var row, col;

                if(direction === 1){
                      // генерация  начальной позиции  для  горизонтального корабля
                row = Math.floor(Math.random() * this.boardSize);
                col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
                }else{
                      // генерация начальной позиции  для вертикального корабля
                      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
                      col = Math.floor(Math.random() * this.boardSize);
                }

                var newShipLocations = [];

                for(var i = 0; i < this.shipLength; i++){
                    if(direction === 1){
                        //  добавить в массив для горизонтального  корабля
                        newShipLocations.push(row + "" + (col + i));                    
                    }else{
                        //  добавить в  массив для  вертикального корабля
                        newShipLocations.push((row + i) + "" + col);
                }
            }
            return newShipLocations;   

        },

        collision: function(locations){              // следит за перекрытием кораблей один другим
            for(var i = 0; i < this.numShips; i++){
                var ship = this.ships[i];
                for(var j = 0; j < locations.length; j++){
                    if(ship.locations.indexOf(locations[j]) >= 0){
                        return true;
                    }
                }
            }
            return false;
        }

 };

        // Контроллер игры

 var controller = {
     guesses: 0,
     processGuess: function(guess){
         var location = parceGuess(guess);
         if(location){
            this.guesses++;
            var hit = model.fire(location);
            if(hit && model.shipsSunk === model.numShips){
                view.displayMessage("Вы потопили" + this.numShips + "шт. за:" + this.guesses + "выстрелов!");
            } 
         }
     }
 }

 function parceGuess(guess){
     var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

     if(guess === null || guess.length !== 2){
         alert("Вы ввели неверные координаты!");
     }else{
         firstChar = guess.charAt(0);     // извлекаем первый символ
         var row = alphabet.indexOf(firstChar);
         var column = guess.charAt(1);

         if(isNaN(row) || isNaN(column)){
             alert("Вы ввели  неверные координаты!");
         }else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize){
             alert("Вы ввели  неверные координаты!");
         }else{
             return row + column;
         }
     }
     return null;
 }

 function init(){
     // событие по нажатию на правую  клавишу  мыши 
     var fireButton = document.getElementById('fireButton');
     fireButton.onclick = handleFireButton;

     // событие по нажатию на клавишу
     var guessInput = document.getElementById('guessInput');
     guessInput.onkeypress = handleKeyPress;

     model.generateShipLocations();
 }

 function handleFireButton(){
     var guessInput = document.getElementById('guessInput');
     var guess = guessInput.value;
     controller.processGuess(guess);
     guessInput.value = "";
 }

 function handleKeyPress(e){
     var fireButton = document.getElementById("fireButton");
     if(e.keyCode === 13){
         fireButton.click();
         return false;
     }
 }

 window.onload = init;

 /*console.log(parceGuess("A0"));
 console.log(parceGuess("B6"));
 console.log(parceGuess("G3"));
 console.log(parceGuess("H0"));
 console.log(parceGuess("A7"));*/

 







 /*view.displayMessage('some message ...');
 view.displayHit("35");
 view.displayMiss("22");*/


 // Асинхронное программирование

 function pageloader(){
     alert("Страница загружена полностью ");
 }

 window.onload = pageloader;