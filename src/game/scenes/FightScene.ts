/* eslint-disable @typescript-eslint/no-explicit-any */
import Phaser from "phaser";

export default class FightScene extends Phaser.Scene {
  private player1!: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  private player2!: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  private sword1!: Phaser.GameObjects.Line;
  private sword2!: Phaser.GameObjects.Line;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;

  private p1Attacking = false;
  private p2Attacking = false;
  private attackDuration = 200;

  private p1HP = 100;
  private p2HP = 100;
  private hpText!: Phaser.GameObjects.Text;

  constructor() {
    super("FightScene");
  }

  preload() {
    // Hit sounds
    // this.load.audio(
    //   "hit1",
    //   "/src/assets/sfx/mixkit-strong-punches-to-the-body-2198.wav"
    // );
    this.load.audio("hit2", "/sfx/mixkit-impact-of-a-strong-punch-2155.mp3");
  }

  create() {
    // Ground
    const ground = this.add.rectangle(400, 580, 800, 40, 0x222222);
    this.physics.add.existing(ground, true);

    // Players
    this.player1 = this.add.rectangle(200, 450, 40, 80, 0x00ff00) as any;
    this.physics.add.existing(this.player1);
    this.player1.body.setCollideWorldBounds(true);

    this.player2 = this.add.rectangle(600, 450, 40, 80, 0xff0000) as any;
    this.physics.add.existing(this.player2);
    this.player2.body.setCollideWorldBounds(true);

    // Colliders
    this.physics.add.collider(this.player1, ground);
    this.physics.add.collider(this.player2, ground);

    // Controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys({
      A: Phaser.Input.Keyboard.KeyCodes.A,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      W: Phaser.Input.Keyboard.KeyCodes.W,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
    }) as Record<string, Phaser.Input.Keyboard.Key>;

    // Swords (lines)
    this.sword1 = this.add.line(0, 0, 0, 0, 40, 0, 0x00ff00).setLineWidth(5);
    this.sword2 = this.add.line(0, 0, 0, 0, -40, 0, 0xff0000).setLineWidth(5);

    // HP text
    this.hpText = this.add.text(10, 10, `P1: ${this.p1HP}  P2: ${this.p2HP}`, {
      font: "18px monospace",
      color: "#ffffff",
    });
  }

  update() {
    // --- Player 1 movement
    if (this.keys.A.isDown) this.player1.body.setVelocityX(-160);
    else if (this.keys.D.isDown) this.player1.body.setVelocityX(160);
    else this.player1.body.setVelocityX(0);

    if (this.keys.W.isDown && this.player1.body.onFloor())
      this.player1.body.setVelocityY(-400);

    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE) && !this.p1Attacking)
      this.attack("p1");

    // --- Player 2 movement
    if (this.cursors.left?.isDown) this.player2.body.setVelocityX(-160);
    else if (this.cursors.right?.isDown) this.player2.body.setVelocityX(160);
    else this.player2.body.setVelocityX(0);

    if (this.cursors.up?.isDown && this.player2.body.onFloor())
      this.player2.body.setVelocityY(-400);

    if (Phaser.Input.Keyboard.JustDown(this.cursors.down!) && !this.p2Attacking)
      this.attack("p2");

    // Update sword positions
    this.sword1.setPosition(this.player1.x + 20, this.player1.y);
    this.sword2.setPosition(this.player2.x - 20, this.player2.y);

    // Update HP text
    this.hpText.setText(`P1: ${this.p1HP}  P2: ${this.p2HP}`);

    // --- End game
    if (this.p1HP <= 0 || this.p2HP <= 0) {
      this.add
        .text(300, 200, `${this.p1HP <= 0 ? "Player 2" : "Player 1"} Wins!`, {
          font: "24px monospace",
          color: "#ffff00",
        })
        .setDepth(5);
      this.scene.pause();
    }
  }

  private attack(player: "p1" | "p2") {
    const attacker = player === "p1" ? this.player1 : this.player2;
    const target = player === "p1" ? this.player2 : this.player1;
    const sword = player === "p1" ? this.sword1 : this.sword2;

    // Flag attacker
    const attackingFlag = player === "p1" ? "p1Attacking" : "p2Attacking";
    this[attackingFlag] = true;

    // Sword swing tween
    const from = player === "p1" ? -0.5 : 0.5;
    const to = player === "p1" ? 0.5 : -0.5;

    this.tweens.add({
      targets: sword,
      rotation: { from, to },
      duration: this.attackDuration,
      yoyo: true,
      onComplete: () => (this[attackingFlag] = false),
    });

    // Temporary attack hitbox
    const attackOffset = player === "p1" ? 40 : -40;
    const attackBox = this.add.rectangle(
      attacker.x + attackOffset,
      attacker.y,
      30,
      10,
      0xffffff,
      0
    );
    this.physics.add.existing(attackBox);
    (attackBox.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

    // Hit detection
    if (this.physics.overlap(attackBox, target)) {
      // Reduce HP
      if (player === "p1") this.p2HP = Math.max(this.p2HP - 5, 0);
      else this.p1HP = Math.max(this.p1HP - 5, 0);

      // Hit effects
      const hitSound = Phaser.Math.RND.pick(["hit2"]);
      this.sound.play(hitSound);
      this.cameras.main.shake(100, 0.01);
    }

    // Destroy attackBox after short duration
    this.time.delayedCall(100, () => attackBox.destroy());
  }
}
