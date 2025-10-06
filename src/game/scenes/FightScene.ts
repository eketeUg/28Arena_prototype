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

  create(): void {
    // Ground
    const ground = this.add.rectangle(400, 430, 800, 40, 0x222222);
    this.physics.add.existing(ground, true);

    // Player 1
    this.player1 = this.add.rectangle(150, 350, 40, 80, 0x00ff00) as any;
    this.physics.add.existing(this.player1);
    this.player1.body.setCollideWorldBounds(true);

    // Player 2
    this.player2 = this.add.rectangle(650, 350, 40, 80, 0xff0000) as any;
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

    // Swords
    this.sword1 = this.add.line(0, 0, 0, 0, 40, 0, 0x00ff00).setLineWidth(5);
    this.sword2 = this.add.line(0, 0, 0, 0, -40, 0, 0xff0000).setLineWidth(5);

    // Health text
    this.hpText = this.add.text(10, 10, "", {
      font: "16px monospace",
      color: "#ffffff",
    });
  }

  update(): void {
    this.hpText.setText(`P1: ${this.p1HP}    P2: ${this.p2HP}`);

    const p1 = this.player1.body;
    const p2 = this.player2.body;

    // --- Player 1 movement (A/D/W)
    if (this.keys.A.isDown) p1.setVelocityX(-160);
    else if (this.keys.D.isDown) p1.setVelocityX(160);
    else p1.setVelocityX(0);

    if (this.keys.W.isDown && p1.onFloor()) p1.setVelocityY(-400);

    // --- Player 2 movement (Arrow keys)
    if (this.cursors.left?.isDown) p2.setVelocityX(-160);
    else if (this.cursors.right?.isDown) p2.setVelocityX(160);
    else p2.setVelocityX(0);

    if (this.cursors.up?.isDown && p2.onFloor()) p2.setVelocityY(-400);

    // --- Sword positions
    this.sword1.setPosition(this.player1.x + 20, this.player1.y);
    this.sword2.setPosition(this.player2.x - 20, this.player2.y);

    // --- Player 1 attack
    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE) && !this.p1Attacking) {
      this.attack("p1");
    }

    // --- Player 2 attack
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.down!) &&
      !this.p2Attacking
    ) {
      this.attack("p2");
    }

    // --- Hit detection
    if (this.p1Attacking && this.intersects(this.sword1, this.player2)) {
      this.p2HP = Math.max(this.p2HP - 1, 0);
    }

    if (this.p2Attacking && this.intersects(this.sword2, this.player1)) {
      this.p1HP = Math.max(this.p1HP - 1, 0);
    }

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

  private attack(player: "p1" | "p2"): void {
    if (player === "p1") {
      this.p1Attacking = true;
      this.tweens.add({
        targets: this.sword1,
        rotation: { from: -0.5, to: 0.5 },
        duration: this.attackDuration,
        yoyo: true,
        onComplete: () => (this.p1Attacking = false),
      });
    } else {
      this.p2Attacking = true;
      this.tweens.add({
        targets: this.sword2,
        rotation: { from: 0.5, to: -0.5 },
        duration: this.attackDuration,
        yoyo: true,
        onComplete: () => (this.p2Attacking = false),
      });
    }
  }

  private intersects(
    line: Phaser.GameObjects.Line,
    rect: Phaser.GameObjects.Rectangle
  ): boolean {
    const lx1 = line.geom.x1 + line.x;
    const ly1 = line.geom.y1 + line.y;
    const lx2 = line.geom.x2 + line.x;
    const ly2 = line.geom.y2 + line.y;

    const rx = rect.x - rect.width / 2;
    const ry = rect.y - rect.height / 2;

    return Phaser.Geom.Intersects.LineToRectangle(
      new Phaser.Geom.Line(lx1, ly1, lx2, ly2),
      new Phaser.Geom.Rectangle(rx, ry, rect.width, rect.height)
    );
  }
}
