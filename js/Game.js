class Game {
  constructor() {
    this.reset=createButton("RESET")
    this.leader1=createElement("h2")
    this.leader2=createElement("h2")
    this.moving=false
    this.left=false
  }

  getState() {
    database.ref("gameState").on("value", function(data) {
      gameState = data.val();
    });
  }
  updateState(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage(car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage(car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];
    fuelg=new Group()
    coing=new Group()
    obg=new Group()
    this.objects(fuelg,10,fuelImg,0.02)
    this.objects(coing,10,coinImg,0.09)
    this.objects(obg,10,obImg,0.04)
  }

  objects(group,num,img,scale){
    for(var i=0;i<num;i++){
      var  object=createSprite(random(width/2-150,width/2+150),random(-height*4.5,height-400))
      object.addImage(img)
      object.scale=scale
      group.add(object)
    }
  }


  play() {
    form.hide();
    Player.getPlayersInfo();
    player.getCarsatend()
    this.reset.position(width-300,50)
    this.reset.mousePressed(()=>{
      database.ref("/").set({
        playerCount:0,
        gameState:0,
        players:{},
        carAtEnd:0
      })
      location.reload()
    })
    if (players !== undefined) {
      background("lightblue")
      image(track, 0, -height * 5, width, height * 6);
      this.leaders()
      this.showfuel()
      this.showlife()
      var index = 0;
      for (var i in players) {
        index = index + 1;
        var x = players[i].positionX;
        var y = height - players[i].positionY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          camera.position.y = cars[index - 1].position.y;
          cars[index-1].overlap(fuelg,function(a,b){
            player.fuel=200
            b.remove()
          })
          cars[index-1].overlap(coing,function(a,b){
            player.score=player.score+100
            b.remove()
            player.updateDistance()
          })
        if(player.fuel>0&&this.moving){
          player.fuel=player.fuel-0.2
        }
        if(player.fuel<=0){
          gameState=2
          swal({
            title:"boohoo"
          })
        }
        if(cars[index-1].collide(obg)){
          if(this.left){
            player.positionX=player.positionX+50
          }else{
            player.positionX=player.positionX-50
          }
          if(player.life>0){
            player.life=player.life-25
          }
          player.updateDistance()
        }
        if(index===1){
          if(cars[index-1].collide(cars[1])){
            if(this.left){
              player.positionX=player.positionX+50
            }else{
              player.positionX=player.positionX-50
            }
            if(player.life>0){
              player.life=player.life-25
            }
            player.updateDistance()
          }
        }
        if(index===2){
          if(cars[index-1].collide(cars[0])){
            if(this.left){
              player.positionX=player.positionX+50
            }else{
              player.positionX=player.positionX-50
            }
            if(player.life>0){
              player.life=player.life-25
            }
            player.updateDistance()
          }
        }
        if(player.life<=0){
          gameState=2
          swal({
            title:"waa waa"
          })
        }
        }
        }

       if(player.positionY>height*6-100){
         gameState=2
         player.rank=player.rank+1
         Player.updateCarsatend(player.rank)
         player.updateDistance()
        swal({
          title:player.rank,
          text:"congrats"
        })
       }

      if (keyIsDown(UP_ARROW)) {
        // a= a + 5  a+=5
        this.moving=true
        player.positionY += 10;
        player.updateDistance();
      }
      if (keyIsDown(LEFT_ARROW)&& player.positionX>width/3-50) {
        player.positionX -= 5;
        player.updateDistance();
        this.left=true
      }
      if (keyIsDown(RIGHT_ARROW)&& player.positionX<width/2+240) {
        player.positionX += 5;
        player.updateDistance();
        this.left=false
      }
      drawSprites();
    }
  }
  showfuel(){
    fill("white")
    rect(width/2-100,height-player.positionY-150,200,20)
    fill("red")
    rect(width/2-100,height-player.positionY-150,player.fuel,20)
  }
  showlife(){
    fill("white")
    rect(width/2-100,height-player.positionY-200,200,20)
    fill("blue")
    rect(width/2-100,height-player.positionY-200,player.life,20)
  }
  leaders(){
    var player=Object.values(players)
   var leader1=player[0].rank+"   "+player[0].name+"   "+player[0].score
   var leader2=player[1].rank+"   "+player[1].name+"   "+player[1].score
   this.leader1.position(width/3-50,40)
   this.leader2.position(width/3-50,90)
   this.leader1.html(leader1)
   this.leader2.html(leader2)
  }
}
