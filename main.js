class Play extends Phaser.Scene {
    constructor() {
        super({ key: 'Play' });
        this.currentLevel = 1;
        this.startingGridSize = 2;
        this.allNumbers = Phaser.Utils.Array.NumberArray(1, 100);
        this.currentNumbers = [];
        this.selectedNumbers = [];
        this.primeNumbers = [];
        this.compositeNumbers = [];
        this.score = 0;
        this.levelComplete = false;
        this.tileFlipped = false;
        this.particles = null;
        this.timerEvent = null;
    }

    create() {
        // Calculate prime and composite numbers
        this.primeNumbers = this.allNumbers.filter(num => this.isPrime(num) && num !== 1);
        this.compositeNumbers = this.allNumbers.filter(num =>
            (num === 1 || (num % 2 === 0 || num % 3 === 0 || num % 5 === 0 || num % 7 === 0)) &&
            ![2, 3, 5, 7].includes(num)
        );

        // Create stylish background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x0d1b2a, 0x1a2a3a, 0x0d1b2a, 0x1a2a3a, 1);
        bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        
        this.startLevelCountdown();
    }

    isPrime(num) {
        for (let i = 2, s = Math.sqrt(num); i <= s; i++)
            if (num % i === 0) return false;
        return num > 1;
    }

    startLevelCountdown() {
        // Clear previous elements
        if (this.particles) this.particles.destroy();
        if (this.timerEvent) this.timerEvent.destroy();

        this.levelComplete = false;
        this.selectedNumbers = [];
        this.tileFlipped = false;

        this.clearUI();

        // Enhanced countdown styling
        this.countdownText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            '3',
            {
                fontSize: '120px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                stroke: '#3498db',
                strokeThickness: 8
            }
        ).setOrigin(0.5);

        // Original countdown logic with enhanced animation
        this.tweens.add({
            targets: this.countdownText,
            scale: 1.5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.time.delayedCall(1000, () => {
            this.countdownText.setText('2');
            this.tweens.add({
                targets: this.countdownText,
                scale: 1.5,
                duration: 500,
                yoyo: true
            });
        });
        this.time.delayedCall(2000, () => {
            this.countdownText.setText('1');
            this.tweens.add({
                targets: this.countdownText,
                scale: 1.5,
                duration: 500,
                yoyo: true
            });
        });
        this.time.delayedCall(3000, () => {
            this.countdownText.setText('GO!');
            this.tweens.add({
                targets: this.countdownText,
                scale: 1.5,
                duration: 500,
                yoyo: true,
                onComplete: () => {
                    this.countdownText.destroy();
                    this.setupLevel();
                }
            });
        });
    }

    clearUI() {
        if (this.countdownText) this.countdownText.destroy();
        if (this.modal) this.modal.destroy();
        if (this.levelText) this.levelText.destroy();
        if (this.scoreText) this.scoreText.destroy();
        if (this.timerText) this.timerText.destroy();
        if (this.tiles) {
            this.tiles.forEach(tile => {
                if (tile.rectangle) tile.rectangle.destroy();
                if (tile.text) tile.text.destroy();
            });
            this.tiles = [];
        }
    }

    setupLevel() {
        const gridSize = this.startingGridSize + this.currentLevel - 1;
        const totalTiles = gridSize * gridSize;
        this.currentNumbers = Phaser.Utils.Array.Shuffle([...this.allNumbers]).slice(0, totalTiles);
        this.createNumberGrid(gridSize);
        this.createUI();
        this.flipTilesIn();
    }

    createNumberGrid(gridSize) {
        if (this.tiles) {
            this.tiles.forEach(tile => {
                if (tile.rectangle) tile.rectangle.destroy();
                if (tile.text) tile.text.destroy();
            });
        }
        this.tiles = [];

        // Calculate tile size to fit screen properly
        const maxTileSize = 100;
        const minTileSize = 60;
        const availableWidth = this.cameras.main.width - 60;
        let tileSize = Math.min(maxTileSize, availableWidth / gridSize);
        tileSize = Math.max(minTileSize, tileSize);

        const padding = 10;
        const gridWidth = (tileSize + padding) * gridSize - padding;
        const startX = this.cameras.main.centerX - gridWidth / 2;
        const startY = 120; // Below header

        for (let i = 0; i < this.currentNumbers.length; i++) {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const x = startX + col * (tileSize + padding);
            const y = startY + row * (tileSize + padding);

            // Create tile object
            const tile = {
                x: x,
                y: y,
                tileSize: tileSize,
                number: this.currentNumbers[i],
                isSelected: false,
                rectangle: this.add.rectangle(x, y, tileSize, tileSize, 0x3498db)
                    .setStrokeStyle(2, 0xffffff)
                    .setInteractive(),
                text: this.add.text(x, y, this.currentNumbers[i], {
                    fontSize: tileSize * 0.3 + 'px',
                    fill: '#ffffff',
                    fontFamily: 'Arial',
                    fontWeight: 'bold'
                }).setOrigin(0.5).setVisible(false)
            };

            // Set up interactions
            tile.rectangle.on('pointerdown', () => {
                if (!this.levelComplete && this.tileFlipped) this.toggleTile(tile);
            });

            this.tiles.push(tile);
        }
    }

    flipTilesIn() {
        if (!this.tiles) return;

        this.tiles.forEach((tile, index) => {
            tile.text.setVisible(false);
            tile.rectangle.setFillStyle(0x2c3e50);

            this.time.delayedCall(index * 50, () => {
                this.tweens.add({
                    targets: tile.rectangle,
                    scaleX: 0,
                    duration: 200,
                    onComplete: () => {
                        tile.text.setVisible(true);
                        this.tweens.add({
                            targets: tile.rectangle,
                            scaleX: 1,
                            duration: 200
                        });
                    }
                });
            });
        });

        this.tileFlipped = true;
    }

    createUI() {
        // Create stylish header
        const header = this.add.graphics();
        header.fillStyle(0x1a2a3a, 0.8);
        header.fillRect(0, 0, this.cameras.main.width, 60);
        header.lineStyle(2, 0x3498db);
        header.lineBetween(0, 60, this.cameras.main.width, 60);

        // Level info
        this.levelText = this.add.text(
            this.cameras.main.centerX,
            30,
            `LEVEL ${this.currentLevel}`,
            {
                fontSize: '28px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);

        // Score display
        this.scoreText = this.add.text(
            20,
            20,
            `SCORE: ${this.score}`,
            {
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }
        );

        // Timer
        this.timeRemaining = 60;
        this.timerText = this.add.text(
            this.cameras.main.width - 20,
            20,
            `TIME: ${this.timeRemaining}`,
            {
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }
        ).setOrigin(1, 0);

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.levelComplete && this.tileFlipped) {
                    this.timeRemaining--;
                    this.timerText.setText(`TIME: ${this.timeRemaining}`);

                    if (this.timeRemaining <= 0) {
                        this.endLevel(false);
                    }
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    toggleTile(tile) {
        if (!tile || this.levelComplete || !this.tileFlipped) return;

        tile.isSelected = !tile.isSelected;
        tile.rectangle.setFillStyle(tile.isSelected ? 0x2ecc71 : 0x3498db);

        // Add click animation
        this.tweens.add({
            targets: tile.rectangle,
            scale: 0.95,
            duration: 100,
            yoyo: true
        });

        if (tile.isSelected) {
            this.selectedNumbers.push(tile.number);
        } else {
            this.selectedNumbers = this.selectedNumbers.filter(n => n !== tile.number);
        }

        this.checkLevelCompletion();
    }

    checkLevelCompletion() {
        const currentComposites = this.compositeNumbers.filter(num =>
            this.currentNumbers.includes(num)
        );

        const allCorrect = currentComposites.every(num =>
            this.selectedNumbers.includes(num)
        ) && this.selectedNumbers.every(num =>
            currentComposites.includes(num)
        );

        if (allCorrect && currentComposites.length > 0) {
            this.endLevel(true);
        }
    }

    endLevel(success) {
        this.levelComplete = true;

        const currentComposites = this.compositeNumbers.filter(num =>
            this.currentNumbers.includes(num)
        );

        const correct = this.selectedNumbers.filter(num =>
            currentComposites.includes(num)
        ).length;

        const timeBonus = Math.floor(this.timeRemaining * 0.5);

        if (success) {
            this.score += (correct * 10) + timeBonus;
        } else {
            this.score = Math.max(0, this.score - 5);
        }

        this.revealResults(success);
        this.showModal(success);
    }

    revealResults(success) {
        if (!this.tiles) return;

        this.tiles.forEach(tile => {
            if (!tile || !tile.number) return;

            if (this.compositeNumbers.includes(tile.number)) {
                tile.rectangle.setFillStyle(
                    this.selectedNumbers.includes(tile.number) ? 0x2ecc71 : 0xf1c40f
                );
            } else if (this.primeNumbers.includes(tile.number)) {
                tile.rectangle.setFillStyle(success ? 0xe74c3c : 0x9b59b6);
            }
        });
    }

    showModal(success) {
        const currentComposites = this.compositeNumbers.filter(num =>
            this.currentNumbers.includes(num)
        );
        const correct = this.selectedNumbers.filter(num =>
            currentComposites.includes(num)
        ).length;
        const timeBonus = Math.floor(this.timeRemaining * 0.5);

        // Create modal background
        const modalBg = this.add.graphics();
        modalBg.fillStyle(0x000000, 0.7);
        modalBg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        modalBg.setInteractive();

        // Create modal container
        const modal = this.add.container(
            this.cameras.main.centerX,
            this.cameras.main.centerY
        );

        // Modal content
        const modalContent = this.add.graphics();
        modalContent.fillStyle(0x1a2a3a, 0.95);
        modalContent.fillRoundedRect(-250, -180, 500, 360, 20);
        modalContent.lineStyle(3, 0x3498db, 0.8);
        modalContent.strokeRoundedRect(-250, -180, 500, 360, 20);

        // Title
        const title = this.add.text(
            0, -150,
            success ? 'LEVEL COMPLETE!' : 'TRY AGAIN',
            {
                fontSize: '32px',
                fill: success ? '#2ecc71' : '#e74c3c',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);

        // Message
        const message = this.add.text(
            0, -90,
            success ? 'Perfect! You revealed all prime numbers!' : 'Almost! Try again to reveal all primes!',
            {
                fontSize: '22px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
                wordWrap: { width: 450 }
            }
        ).setOrigin(0.5);

        // Score info
        const scoreInfo = this.add.text(
            0, -30,
            `Correct: ${correct}/${currentComposites.length}\nTime Bonus: +${timeBonus}\nTotal Score: ${this.score}`,
            {
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center',
                lineSpacing: 10
            }
        ).setOrigin(0.5);

        // Next level button
        const button = this.add.graphics();
        button.fillStyle(success ? 0x2ecc71 : 0xe74c3c, 1);
        button.fillRoundedRect(-100, 80, 200, 60, 15);
        button.lineStyle(3, 0xffffff, 0.8);
        button.strokeRoundedRect(-100, 80, 200, 60, 15);
        button.setInteractive(
            new Phaser.Geom.Rectangle(-100, 80, 200, 60),
            Phaser.Geom.Rectangle.Contains
        );

        const buttonText = this.add.text(
            0, 110,
            success ? 'NEXT LEVEL' : 'TRY AGAIN',
            {
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);

        // Button interaction
        button.on('pointerdown', () => {
            modalBg.destroy();
            modal.destroy();
            this.clearUI();
            if (success) this.currentLevel++;
            this.startLevelCountdown();
        });

        // Add all elements to modal
        modal.add([modalContent, title, message, scoreInfo, button, buttonText]);

        // Store reference
        this.modal = modal;
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 800,
    backgroundColor: '#f0f9ff',
    parent: 'game-container',
    scene: [Play],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);