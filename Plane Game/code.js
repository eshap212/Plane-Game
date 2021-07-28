var startTime; 
var gunLoaded = true;
var gameStarted = false;
var invadersMovingLeft = false; 
var elapsedTime; 
var invadersRemaining = 4; 

onEvent("screen_planegame", "keydown", function(event) {
  var firearmY = getYPosition("image_firearm");
  var firearmX = getXPosition("image_firearm");

  var distance = 12;
  
  if(event.key == "Down")
  {
    firearmY = firearmY + distance;  
  }
 
  if(event.key == "Enter")
   {
     fire(); 
   }
   
  if(event.key == "Up")
  {
    firearmY= firearmY - distance;
  }
  
  setPosition("image_firearm", firearmX, firearmY);
  verticalWrapAround("image_firearm");
});

function verticalWrapAround(object)
{
  var objectY = getYPosition(object);
  var objectX = getXPosition(object);

  var objectHeight = getProperty(object, "height");
  
  if(objectY < 1 - (objectHeight / 2))
  {
    objectY = 462 - (objectHeight / 2); 
  }
  
  else if (objectY > 462 - (objectHeight / 2))
  {
   objectY = 1 - (objectHeight / 2); 
  }
    
    setPosition(object, objectX, objectY); 
}

function fire()
{
  if (gunLoaded) //
  {
    gunLoaded = false;  
    var firearmY = getYPosition("image_firearm"); 
    var firearmX = getXPosition("image_firearm");
    var firearmHeight = getProperty("image_firearm", "height"); 
    var fireballHeight = getProperty("image_fireball","height");
    var firearmWidth = getProperty("image_firearm", "width");
    
    var fireballY = firearmY + (firearmHeight / 3) - (fireballHeight / 3); 
    var fireballX = firearmX + firearmWidth;
   
   setPosition("image_fireball", fireballX, fireballY); 
  }
}

onEvent("button_start", "click", function(event) {
  if(!gameStarted)
  {
   gameStarted = true;
   setPosition("button_start",105, 490);
   setPosition("image_fireball", 450, 100);
   startTime = getTime(); 
   
  timedLoop(47, function() {
    
    collisionDetection("image_invader_one");
    collisionDetection("image_invader_two");
    collisionDetection("image_invader_three");
    collisionDetection("image_invader_four");
    
   movefireball();
    updateTime();
    
    moveInvader("image_invader_one"); 
    moveInvader("image_invader_two");
    moveInvader("image_invader_three");
    moveInvader("image_invader_four");
    });
  }
});

function moveInvader(name)
{
  var invaderX = getXPosition(name); 
  var invaderY = getYPosition(name);
  
  var maxX = 274; 
  var minX = 103;
  var distanceFromMax = maxX - invaderX; 
  
  var verticalSpeed = (distanceFromMax / 8) + 21;
  var horizontalSpeed = 16;
  
  invaderY = invaderY + verticalSpeed; 
  
  if(invaderX > maxX)
    invadersMovingLeft = true; 
    
  if (invaderX < minX)
    invadersMovingLeft = false; 
    
  if(invadersMovingLeft)
  invaderX = invaderX - horizontalSpeed; 
  
  else
    invaderX = invaderX + horizontalSpeed; 
    
  setPosition(name, invaderX, invaderY); 
  
  verticalWrapAround(name); 
}

function updateTime()
{
  var currentTime = getTime(); 
  elapsedTime = currentTime - startTime;
  elapsedTime = (elapsedTime / 1000).toFixed(1); 
  setNumber("known_time", elapsedTime); 
}

function movefireball()
{
  var fireballX = getXPosition("image_fireball");
  var fireballY = getYPosition("image_fireball");
  var fireballSpeed = fireballX / 9; 
 
  fireballX = fireballX + fireballSpeed;
  
  setPosition("image_fireball", fireballX, fireballY);
  
  if(fireballX > 900)
    gunLoaded = true;
    
}
function collisionDetection(object)
{
  var fire_ballX = getXPosition("image_fireball");
  var fire_ballY = getYPosition("image_fireball");
  var objectX = getXPosition(object); 
  var objectY = getYPosition(object); 

  var fire_ball_height = getProperty("image_fireball", "height");
  var objectHeight = getProperty(object, "height");
  var fire_ball_width = getProperty("image_fireball", "width"); 
  var objectWidth = getProperty(object, "width");

  if(fire_ballX + fire_ball_width >= objectX && fire_ballX <= objectX + objectWidth)
  {
    if(fire_ballY + fire_ball_height >= objectY && fire_ballY <= objectY + objectHeight)
    {
      if(!getProperty(object,"hidden"))
      {
        hideElement(object);
        invadersRemaining--; 
      
      if(invadersRemaining <= 0)
      {  
        stopTimedLoop();
        hideElement("image_fireball");
      } 
    }
  }
}
}