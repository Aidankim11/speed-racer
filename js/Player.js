class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.score=0
    this.rank=0
    this.fuel=200
    this.life=200
  }

  addPlayer() {
    if (this.index === 1) {
      this.positionX = width / 2 - 100;
    } else {
      this.positionX = width / 2 + 100;
    }

    database.ref("players/player" + this.index).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      score:this.score,
      rank:this.rank,
      life:this.life
    });
  }

  getDistance() {
    database.ref("players/player" + this.index).on("value", data => {
      var data = data.val();
      this.positionX = data.positionX;
      this.positionY = data.positionY;
    });
  }
  
  updateDistance() {
    database.ref("players/player" + this.index).update({
        positionX: this.positionX,
        positionY: this.positionY,
        score:this.score,
        rank:this.rank,
        life:this.life
      });
    }

  getCount() {
    database.ref("playerCount").on("value", data => {
      playerCount = data.val();
    });
  }

  updateCount(count) {
    database.ref("/").update({
      playerCount: count
    });
  }

  getCarsatend() {
    database.ref("carsAtEnd").on("value", data => {
      this.rank = data.val();
    });
  }

  static updateCarsatend(count) {
    database.ref("/").update({
      carsAtEnd: count
    });
  }

  static getPlayersInfo() {
    database.ref("players").on("value", data => {
      players = data.val();
    });
  }
}
