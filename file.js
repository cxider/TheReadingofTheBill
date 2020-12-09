let players = {
  "player0":"#F75C03",
  "player1":"#D90368",
  "player2":"#73EEDC",
  "player3":"#FDE74C",
  "player4":"#66579E",
};

let number_of_players = 1;
let selected = null;

class Card {
  constructor(name,text,img,value,loadImg){
    this.name = name;
    this.text = text;
    this.loadImg = loadImg;
    if(loadImg){
      this.img = loadImage(img);
    }
    this.value = value;
    this.x = 0;
    this.y = 0;
  }

  show(){
    rectMode(CENTER);
    fill(255);
    rect(this.x,this.y,width/7,width/7,20);
    textAlign(CENTER,CENTER);
    stroke(0);
    fill(0);
    textSize(20)
    strokeWeight(1);
    if(this.loadImg){
      image(this.img, this.x - width/20 ,this.y - width/20,width/10,width/10);
    } else {
      text(this.text,this.x,this.y,width/7,width/28);
    }
    text(this.name,this.x,this.y-width/16,width/7,width/28);
    text(this.value,this.x,this.y+width/16,width/7,width/28);
  }
  move(x,y){
    this.x = x;
    this.y = y;
  }

  hover(){
    return this.x - width/14 < mouseX && this.x + width/14 > mouseX && this.y - width/14 < mouseY && this.y + width/14 > mouseY;
  }

};

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

function playerUp(){
  number_of_players++;
  number_of_players = clamp(number_of_players,1,4);
  console.log(number_of_players);
}

function playerDown(){
  number_of_players--;
  number_of_players = clamp(number_of_players,1,4);
  console.log(number_of_players);
}


let deck;

let Deck = [];

let Cards = [];

function preload(){
  deck = loadJSON("cards/cards.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for(p in players){
    document.getElementById(p).style.setProperty("--color", players[p]);
  }
  for( card of deck.cards){
    Deck.push(new Card(card.name,card.text,"cards/" + card.image,card.value,card.loadImage))
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}

function showCards(){
  let step = width / 5;
  for(let i=0; i<Cards.length; i++){
    stroke(255);
    fill(255);
    strokeWeight(6);
    let x = width/2 + step * (i - floor(Cards.length/2));
    if( selected !== null && i == selected){
      Cards[i].move(mouseX,mouseY);
    } else {
      Cards[i].move(x,height/3);
    }
    Cards[i].show();
  }
}

function drawCard(){
  if(Cards.length < 5 && Deck.length > 0){
    let index = floor(Math.random() * Deck.length)
    Cards.push(Deck[index]);
    console.log("draw");
    Deck.splice(index,1);
  }
}

function addCard(element,card){
  console.log(card.name,selected);
  element.innerHTML += card.name + " " +  card.value + "<br>";
}

function mousePressed(){
  for(let i=0; i<Cards.length; i++){
    if(Cards[i].hover()){
      selected = i;
    }
  }
}

function mouseReleased(){
  for(let i=0; i<=number_of_players && selected !== null; i++){
    let id = "player" + i;
    if(document.getElementById(id).matches(":hover")){
      addCard(document.getElementById(id),Cards[selected]);
      Cards.splice(selected,1);
      selected = null;
    }
  }
  selected = null;
}

function mouseDragged(){
  for(let i=0; i<Cards.length; i++){
    if(Cards[i].hover()){
      Cards[i].move(mouseX,mouseY);
    }
  }
}

function draw() {
  background(20);
  strokeWeight(5);
  let count = 0;
  for(p in players){
    if(count > number_of_players){
      document.getElementById(p).style.display = "none";
    } else {
      document.getElementById(p).style.display = "inline-grid";
    }
    count++;
  }
  showCards();
}
