class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Load assets for start screen
        this.load.image('playButton', 'assets/play_button.png');
        this.load.image('bee', 'assets/bee.png'); // Reuse your bee asset
    }

    create() {
        // Create the same honeycomb background as in Play scene
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xffd700, 0xf0a800, 0xffd700, 0xf0a800, 1);
        bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Draw hexagonal pattern in background (same as Play scene)
        const hexSize = 100;
        const hexWidth = hexSize * Math.sqrt(3);
        const hexHeight = hexSize * 2;
        
        for (let y = -hexSize; y < this.cameras.main.height + hexSize; y += hexHeight * 0.75) {
            for (let x = -hexWidth; x < this.cameras.main.width + hexWidth; x += hexWidth) {
                const offset = (Math.floor(y / (hexHeight * 0.75))) % 2 === 0 ? hexWidth / 2 : 0;
                this.drawHexagon(bg, x + offset, y, hexSize, 0xf0a800, 0.1, 0x8B4513, 1);
            }
        }

        // Add title with honeycomb style
        const title = this.add.text(this.cameras.main.centerX, 150, 'Honeycomb Math', {
            fontSize: '64px',
            fill: '#8B4513', // Brown color
            fontFamily: 'Arial',
            fontWeight: 'bold',
            stroke: '#FFD700', // Gold stroke
            strokeThickness: 8,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000',
                blur: 0,
                stroke: true
            }
        }).setOrigin(0.5);

        // Add bee character
        const bee = this.add.image(
            this.cameras.main.centerX - 200,
            this.cameras.main.centerY - 50,
            'bee'
        ).setScale(0.4);

        // Add speech bubble
        const bubble = this.add.graphics();
        bubble.fillStyle(0xFFFFFF, 0.9);
        bubble.fillRoundedRect(
            this.cameras.main.centerX - 180,
            this.cameras.main.centerY - 100,
            360, 200, 20
        );
        bubble.lineStyle(3, 0x8B4513, 1);
        bubble.strokeRoundedRect(
            this.cameras.main.centerX - 180,
            this.cameras.main.centerY - 100,
            360, 200, 20
        );

        // Add story text in speech bubble
        const storyText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 20,
          
            `Find all the NON-PRIME numbers\n` +
            `in the honeycomb to collect honey!\n\n` +
            `Prime numbers are tricky - they can\n` +
            `only be divided by 1 and themselves!`,
            {
                fontSize: '20px',
                fill: '#5D4037',
                fontFamily: 'Arial',
                align: 'center',
                lineSpacing: 8,
               
            }
        ).setOrigin(0.5);

        // Add play button (honeycomb styled)
        const playButton = this.add.graphics();
        playButton.fillStyle(0xF39C12, 1); // Orange honey color
        playButton.fillRoundedRect(
            this.cameras.main.centerX - 100,
            this.cameras.main.height - 180,
            200, 80, 15
        );
        playButton.lineStyle(4, 0x8B4513, 1);
        playButton.strokeRoundedRect(
            this.cameras.main.centerX - 100,
            this.cameras.main.height - 180,
            200, 80, 15
        );

        const playText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height - 140,
            'PLAY',
            {
                fontSize: '36px',
                fill: '#FFFFFF',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                stroke: '#8B4513',
                strokeThickness: 3
            }
        ).setOrigin(0.5);

        // Make button interactive
        const buttonArea = new Phaser.Geom.Rectangle(
            this.cameras.main.centerX - 100,
            this.cameras.main.height - 180,
            200, 80
        );
        
        playButton.setInteractive(buttonArea, Phaser.Geom.Rectangle.Contains);
        
        // Button hover effects
        playButton.on('pointerover', () => {
            playButton.clear();
            playButton.fillStyle(0xFFD700, 1); // Brighter gold when hovered
            playButton.fillRoundedRect(
                this.cameras.main.centerX - 100,
                this.cameras.main.height - 180,
                200, 80, 15
            );
            playButton.lineStyle(4, 0x8B4513, 1);
            playButton.strokeRoundedRect(
                this.cameras.main.centerX - 100,
                this.cameras.main.height - 180,
                200, 80, 15
            );
            this.tweens.add({
                targets: [playText],
                scale: 1.1,
                duration: 100
            });
        });

        playButton.on('pointerout', () => {
            playButton.clear();
            playButton.fillStyle(0xF39C12, 1);
            playButton.fillRoundedRect(
                this.cameras.main.centerX - 100,
                this.cameras.main.height - 180,
                200, 80, 15
            );
            playButton.lineStyle(4, 0x8B4513, 1);
            playButton.strokeRoundedRect(
                this.cameras.main.centerX - 100,
                this.cameras.main.height - 180,
                200, 80, 15
            );
            this.tweens.add({
                targets: [playText],
                scale: 1,
                duration: 100
            });
        });

        // Start game on click with loading screen
        playButton.on('pointerdown', () => {
            // Create loading screen (semi-transparent overlay)
            const loadingBg = this.add.graphics();
            loadingBg.fillStyle(0x000000, 0.7);
            loadingBg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
            
            // Add loading text
            const loadingText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY,
                'BUZZING TO THE HIVE...',
                {
                    fontSize: '32px',
                    fill: '#FFD700',
                    fontFamily: 'Arial',
                    fontWeight: 'bold',
                    stroke: '#8B4513',
                    strokeThickness: 4
                }
            ).setOrigin(0.5);
            
            // Add animated bee loading icon
            const loadingBee = this.add.image(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 80,
                'bee'
            ).setScale(0.3);
            
            // Animate bee loading icon
            this.tweens.add({
                targets: loadingBee,
                angle: 360,
                duration: 1500,
                repeat: -1
            });

            // Start game after delay
            this.time.delayedCall(2000, () => {
                this.scene.start('Play');
            });
        });
    }

          // Reuse your drawHexagon method
        drawHexagon = (graphics, x, y, size, fillColor, fillAlpha, lineColor = null, lineAlpha = null, lineWidth = 2) => {
            graphics.fillStyle(fillColor, fillAlpha);
            graphics.beginPath();
            const adjustedSize = size * 1.02;
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI / 3) - Math.PI / 6;
                const pointX = x + adjustedSize * Math.cos(angle);
                const pointY = y + adjustedSize * Math.sin(angle);
                if (i === 0) graphics.moveTo(pointX, pointY);
                else graphics.lineTo(pointX, pointY);
            }
            graphics.closePath();
            graphics.fillPath();
            if (lineColor) {
                graphics.lineStyle(lineWidth, lineColor, lineAlpha);
                graphics.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI / 3) - Math.PI / 6;
                    const pointX = x + adjustedSize * Math.cos(angle);
                    const pointY = y + adjustedSize * Math.sin(angle);
                    if (i === 0) graphics.moveTo(pointX, pointY);
                    else graphics.lineTo(pointX, pointY);
                }
                graphics.closePath();
                graphics.strokePath();
            }
        };
}
class Play extends Phaser.Scene {
    constructor() {
        super({ key: 'Play' });
        this.bgMusic = null;
        this.isMuted = false;
        this.selectSound = null;
        this.deselectSound = null;
        this.correctSound = null;
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
        this.gameOver = false;
        this.bee = null;
    }

    create() {

        // Initialize audio
        this.bgMusic = this.sound.add('bgMusic', { loop: true, volume: 0.5 });
        this.selectSound = this.sound.add('select');
        this.deselectSound = this.sound.add('deselect');
        this.correctSound = this.sound.add('correct');

        // Start music
        this.bgMusic.play();

        // Create speaker icon
        this.createSpeakerIcon();
        // Calculate prime and composite numbers
        this.primeNumbers = this.allNumbers.filter(num => this.isPrime(num) && num !== 1);
        this.compositeNumbers = this.allNumbers.filter(num =>
            (num === 1 || (num % 2 === 0 || num % 3 === 0 || num % 5 === 0 || num % 7 === 0)) &&
            ![2, 3, 5, 7].includes(num)
        );

        // Create honeycomb background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xffd700, 0xf0a800, 0xffd700, 0xf0a800, 1);
        bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Draw hexagonal pattern in background
        const hexSize = 30;
        const hexWidth = hexSize * Math.sqrt(3);
        const hexHeight = hexSize * 2;

        for (let y = -hexSize; y < this.cameras.main.height + hexSize; y += hexHeight * 0.75) {
            for (let x = -hexWidth; x < this.cameras.main.width + hexWidth; x += hexWidth) {
                const offset = (Math.floor(y / (hexHeight * 0.75))) % 2 === 0 ? hexWidth / 2 : 0;
                this.drawHexagon(bg, x + offset, y, hexSize, 0xf0a800, 0.1, 0x8B4513, 1);
            }
        }

        // Create bee at center (will be positioned properly in flipTilesIn)
        this.bee = this.add.image(0, 0, 'bee')
            .setScale(0.3)
            .setVisible(false)
            .setDepth(10);

        this.startLevelCountdown();
    }

    preload() {
        // Load bee image
        this.load.image('bee', 'assets/bee.png');
        this.load.image('speaker','assets/unmute.png')
        this.load.image('speakerMute','assets/mute.png')
        // Load audio files
        this.load.audio('bgMusic', 'assets/sounds/background.mp3');
        this.load.audio('select', 'assets/sounds/select.mp3');
        this.load.audio('deselect', 'assets/sounds/deselect.mp3');
        this.load.audio('correct', 'assets/sounds/correct.mp3')

    }

    createSpeakerIcon() {
        // Create speaker icon
        this.speakerIcon = this.add.image(this.cameras.main.width - 140, 30, 'speaker')
            .setScale(0.1)
            .setInteractive()
            .setScrollFactor(0)
            .setDepth(100)
            .setVisible(false);
            

        // Set initial texture based on mute state
        this.updateSpeakerIcon();

        // Toggle mute on click
        this.speakerIcon.on('pointerdown', () => {
            this.isMuted = !this.isMuted;
            this.updateSpeakerIcon();
            this.bgMusic.setVolume(this.isMuted ? 0 : 1);
        });
    }

    updateSpeakerIcon() {
        this.speakerIcon.setTexture(this.isMuted ? 'speakerMute' : 'speaker');
    }


    drawHexagon(graphics, x, y, size, fillColor, fillAlpha, lineColor = null, lineAlpha = null, lineWidth = 2) {
        graphics.fillStyle(fillColor, fillAlpha);
        graphics.beginPath();

        // Remove gaps by making hexagons slightly overlap
        const adjustedSize = size * 1.02;

        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI / 3) - Math.PI / 6;
            const pointX = x + adjustedSize * Math.cos(angle);
            const pointY = y + adjustedSize * Math.sin(angle);

            if (i === 0) {
                graphics.moveTo(pointX, pointY);
            } else {
                graphics.lineTo(pointX, pointY);
            }
        }
        graphics.closePath();
        graphics.fillPath();

        if (lineColor) {
            graphics.lineStyle(lineWidth, lineColor, lineAlpha);
            graphics.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i * Math.PI / 3) - Math.PI / 6;
                const pointX = x + adjustedSize * Math.cos(angle);
                const pointY = y + adjustedSize * Math.sin(angle);
                if (i === 0) {
                    graphics.moveTo(pointX, pointY);
                } else {
                    graphics.lineTo(pointX, pointY);
                }
            }
            graphics.closePath();
            graphics.strokePath();
        }
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
        this.speakerIcon.setVisible(false)

        this.clearUI();

        // Bee-themed countdown
        this.countdownText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            '3',
            {
                fontSize: '120px',
                fill: '#000000',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                stroke: '#ffffff',
                strokeThickness: 8,
                shadow: {
                    offsetX: 3,
                    offsetY: 3,
                    color: '#8B4513',
                    blur: 0,
                    stroke: true
                }
            }
        ).setOrigin(0.5);

        // Buzzing animation
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
            this.countdownText.setText('BUZZ!');
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
                if (tile.hexagon) tile.hexagon.destroy();
                if (tile.text) tile.text.destroy();
            });
            this.tiles = [];
        }
        if (this.bee) this.bee.setVisible(false);
    }

    setupLevel() {
        this.speakerIcon.setVisible(true);
        const gridSize = this.startingGridSize + this.currentLevel - 1;
        const totalTiles = 3 * gridSize * (gridSize - 1) + 1;

        this.currentNumbers = [];
        const primeCount = Math.floor(totalTiles * 0.7);
        const compositeCount = totalTiles - primeCount;

        const shuffledPrimes = Phaser.Utils.Array.Shuffle([...this.primeNumbers]).slice(0, primeCount);
        const shuffledComposites = Phaser.Utils.Array.Shuffle([...this.compositeNumbers]).slice(0, compositeCount);

        this.currentNumbers = Phaser.Utils.Array.Shuffle([...shuffledPrimes, ...shuffledComposites]);

        while (this.currentNumbers.length < totalTiles) {
            this.currentNumbers.push(Phaser.Math.RND.pick([...this.primeNumbers, ...this.compositeNumbers]));
        }

        this.createHexagonalGrid(gridSize);
        this.createUI();
        this.flipTilesIn();
    }

    createHexagonalGrid(size) {
        if (this.tiles) {
            this.tiles.forEach(tile => {
                if (tile.hexagon) tile.hexagon.destroy();
                if (tile.text) tile.text.destroy();
            });
        }
        this.tiles = [];

        const hexSize = Math.min(40, 500 / (size * 2));
        const hexWidth = hexSize * Math.sqrt(3);
        const hexHeight = hexSize * 2;

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY + 50;

        let tileIndex = 0;

        for (let q = -size + 1; q < size; q++) {
            for (let r = -size + 1; r < size; r++) {
                const s = -q - r;
                if (Math.abs(q) <= size - 1 && Math.abs(r) <= size - 1 && Math.abs(s) <= size - 1) {
                    const x = centerX + hexWidth * (q + r / 2);
                    const y = centerY + hexHeight * 0.75 * r;

                    const hexagon = this.add.graphics();
                    this.drawHexagon(hexagon, x, y, hexSize, 0x8B4513, 1, 0x5D4037, 1, 2);

                    const polygon = new Phaser.Geom.Polygon();
                    for (let i = 0; i < 6; i++) {
                        const angle = (i * Math.PI / 3) - Math.PI / 6;
                        polygon.points.push(new Phaser.Geom.Point(
                            x + hexSize * Math.cos(angle),
                            y + hexSize * Math.sin(angle)
                        ));
                    }

                    hexagon.setInteractive(polygon, Phaser.Geom.Polygon.Contains);

                    const tile = {
                        x: x,
                        y: y,
                        hexSize: hexSize,
                        number: this.currentNumbers[tileIndex],
                        isSelected: false,
                        hexagon: hexagon,
                        text: this.add.text(x, y, this.currentNumbers[tileIndex], {
                            fontSize: Math.max(16, hexSize * 0.6) + 'px',
                            fill: '#ffffff',
                            fontFamily: 'Arial',
                            fontWeight: 'bold',
                            stroke: '#000000',
                            strokeThickness: 2
                        }).setOrigin(0.5).setVisible(false)
                    };

                    tile.hexagon.on('pointerdown', () => {
                        if (!this.levelComplete && this.tileFlipped) this.toggleTile(tile);
                    });

                    this.tiles.push(tile);
                    tileIndex++;
                }
            }
        }
    }

    flipTilesIn() {
        if (!this.tiles || this.tiles.length === 0) return;

        // Hide all tiles initially
        this.tiles.forEach(tile => {
            tile.text.setVisible(false);
            tile.hexagon.clear();
            this.drawHexagon(tile.hexagon, tile.x, tile.y, tile.hexSize, 0x8B4513, 1, 0x5D4037, 1, 2);
            tile.hexagon.setScale(0);
        });

        // Start bee animation sequence
        this.animateBeeToTiles(0);
    }

    animateBeeToTiles(index) {
        if (index >= this.tiles.length) {
            this.tileFlipped = true;
            return;
        }

        const tile = this.tiles[index];

        // Show and position bee
        this.bee.setVisible(true)
            .setPosition(-100, tile.y)
            .setScale(0.3)
            .setDepth(1);

        // Fly bee to tile
        this.tweens.add({
            targets: this.bee,
            x: tile.x,
            y: tile.y,
            duration: 100,
            ease: 'Power2',
            onComplete: () => {
                // Hide bee after reaching tile
                this.bee.setVisible(false);

                // Scale up the hexagon
                this.tweens.add({
                    targets: tile.hexagon,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100,
                    ease: 'Back.out',
                    onComplete: () => {
                        // Show the number
                        tile.text.setVisible(true);
                        this.animateBeeToTiles(index + 1);
                        // // Move to next tile
                        // this.time.delayedCall(50, () => {
                        //     this.animateBeeToTiles(index + 1);
                        // });
                    }
                });
            }
        });
    }

    createUI() {
        // Create honeycomb header
        const header = this.add.graphics();
        header.fillStyle(0x5D4037, 0.9);
        header.fillRect(0, 0, this.cameras.main.width, 60);

        // Add bee stripes to header
        for (let x = 0; x < this.cameras.main.width; x += 40) {
            header.fillStyle(0x000000, 0.3);
            header.fillRect(x, 0, 20, 60);
        }

        // Level info with bee icon
        this.levelText = this.add.text(
            this.cameras.main.centerX,
            30,
            `🍯 LEVEL ${this.currentLevel} 🐝`,
            {
                fontSize: '28px',
                fill: '#FFD700',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                stroke: '#000000',
                strokeThickness: 2,
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#000000',
                    blur: 0,
                    stroke: true
                }
            }
        ).setOrigin(0.5);

        // Score display with honey pot
        this.scoreText = this.add.text(
            20,
            20,
            `🍯 ${this.score}`,
            {
                fontSize: '24px',
                fill: '#FFD700',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                stroke: '#000000',
                strokeThickness: 2
            }
        );

        // Timer with bee icon
        this.timeRemaining = 60;
        this.timerText = this.add.text(
            this.cameras.main.width - 20,
            20,
            `🐝 ${this.timeRemaining}`,
            {
                fontSize: '24px',
                fill: '#FFD700',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                stroke: '#000000',
                strokeThickness: 2
            }
        ).setOrigin(1, 0);

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.levelComplete && this.tileFlipped) {
                    this.timeRemaining--;
                    this.timerText.setText(`🐝 ${this.timeRemaining}`);

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

        // Change hexagon color when selected (orange for selected, brown for unselected)
        tile.hexagon.clear();
        this.drawHexagon(
            tile.hexagon,
            tile.x,
            tile.y,
            tile.hexSize,
            tile.isSelected ? 0xF39C12 : 0x8B4513,
            1,
            0x5D4037,
            1,
            2
        );

        // Add buzzing animation
        this.tweens.add({
            targets: tile.hexagon,
            scale: 0.95,
            duration: 100,
            yoyo: true
        });

        if (tile.isSelected) {
            this.selectSound.play();
            this.selectedNumbers.push(tile.number);
        } else {
            this.deselectSound.play()
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
            this.levelComplete = true; // Explicitly set this first
            this.animatePrimeTilesBeforeModal();
        }
    }

    animatePrimeTilesBeforeModal() {


        this.correctSound.play();
       
        // First mark all primes with gold color
        this.tiles.forEach(tile => {
            if (this.primeNumbers.includes(tile.number)) {
                tile.hexagon.clear();
                this.drawHexagon(tile.hexagon, tile.x, tile.y, tile.hexSize, 0xFFD700, 1, 0x5D4037, 1, 2);
            }
        });

        // Get all prime tiles
        const primeTiles = this.tiles.filter(tile =>
            this.primeNumbers.includes(tile.number)
        );

        // Create animations for primes
        primeTiles.forEach((tile, index) => {
            this.time.delayedCall(index * 80 + this.tiles.length, () => {
                this.tweens.add({
                    targets: tile.hexagon,
                    scale: 1.2,
                    duration: 50,
                    yoyo: true,
                    ease: 'Sine.inOut'
                });
            });
        });

        // // Show modal after animations complete
        this.time.delayedCall(primeTiles.length * 100 + 1000, () => {
            this.correctSound.stop()
            this.endLevel(true);
        });

  
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

            tile.hexagon.clear();

            if (this.compositeNumbers.includes(tile.number)) {
                // Composites are green (correct) or red (incorrect)
                this.drawHexagon(
                    tile.hexagon,
                    tile.x,
                    tile.y,
                    tile.hexSize,
                    this.selectedNumbers.includes(tile.number) ? 0x2ECC71 : 0xE74C3C,
                    1,
                    0x5D4037,
                    1,
                    2
                );
            } else if (this.primeNumbers.includes(tile.number)) {
                // Primes turn gold when level is complete
                this.drawHexagon(
                    tile.hexagon,
                    tile.x,
                    tile.y,
                    tile.hexSize,
                    success ? 0xFFD700 : 0x8B4513,
                    1,
                    0x5D4037,
                    1,
                    2
                );
            }
        });
    }

    showModal(success) {
        if (this.currentLevel >= 4 && success) {
            this.showGameOver();
            return;
        }

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

        // Modal content - honeycomb style
        const modalContent = this.add.graphics();
        modalContent.fillStyle(0x5D4037, 0.95);
        modalContent.fillRoundedRect(-250, -180, 500, 360, 20);
        modalContent.lineStyle(3, 0xFFD700, 0.8);
        modalContent.strokeRoundedRect(-250, -180, 500, 360, 20);

        // Add honeycomb pattern to modal
        for (let y = -160; y < 160; y += 30) {
            for (let x = -230; x < 230; x += 35) {
                const offset = (Math.floor((y + 160) / 30)) % 2 === 0 ? 17.5 : 0;
                this.drawHexagon(modalContent, x + offset, y, 15, 0xF0A800, 0.2);
            }
        }

        // Title with bee emoji
        const title = this.add.text(
            0, -150,
            success ? '🐝 LEVEL COMPLETE! 🍯' : '🐝 TRY AGAIN 🐝',
            {
                fontSize: '32px',
                fill: success ? '#FFD700' : '#E74C3C',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                stroke: '#000000',
                strokeThickness: 2,
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#000000',
                    blur: 0,
                    stroke: true
                }
            }
        ).setOrigin(0.5);

        // Message
        const message = this.add.text(
            0, -90,
            success ? 'Sweet! You found all the honey cells!' : 'Buzz! Some honey cells were missed!',
            {
                fontSize: '22px',
                fill: '#FFFFFF',
                fontFamily: 'Arial',
                align: 'center',
                wordWrap: { width: 450 },
                stroke: '#000000',
                strokeThickness: 1
            }
        ).setOrigin(0.5);

        // Score info
        const scoreInfo = this.add.text(
            0, -30,
            `Honey Collected: ${correct}/${currentComposites.length}\nTime Bonus: +${timeBonus}\nTotal Honey: ${this.score}`,
            {
                fontSize: '24px',
                fill: '#FFD700',
                fontFamily: 'Arial',
                align: 'center',
                lineSpacing: 10,
                stroke: '#000000',
                strokeThickness: 1
            }
        ).setOrigin(0.5);

        // Next level button
        const button = this.add.graphics();
        button.fillStyle(success ? 0x2ECC71 : 0xE74C3C, 1);
        button.fillRoundedRect(-100, 80, 200, 60, 15);
        button.lineStyle(3, 0x000000, 0.8);
        button.strokeRoundedRect(-100, 80, 200, 60, 15);
        button.setInteractive(
            new Phaser.Geom.Rectangle(-100, 80, 200, 60),
            Phaser.Geom.Rectangle.Contains
        );

        const buttonText = this.add.text(
            0, 110,
            success ? 'MORE HONEY!' : 'TRY AGAIN',
            {
                fontSize: '24px',
                fill: '#000000',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);

        // Button interaction with buzz effect
        button.on('pointerdown', () => {
            this.tweens.add({
                targets: modal,
                x: this.cameras.main.centerX + Phaser.Math.Between(-5, 5),
                y: this.cameras.main.centerY + Phaser.Math.Between(-5, 5),
                duration: 50,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    modalBg.destroy();
                    modal.destroy();
                    this.clearUI();
                    if (success) this.currentLevel++;
                    this.startLevelCountdown();
                }
            });
        });

        // Add all elements to modal
        modal.add([modalContent, title, message, scoreInfo, button, buttonText]);

        // Store reference
        this.modal = modal;
    }

    showGameOver() {
        this.gameOver = true;

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

        // Modal content - golden honeycomb
        const modalContent = this.add.graphics();
        modalContent.fillStyle(0xFFD700, 0.95);
        modalContent.fillRoundedRect(-250, -180, 500, 360, 20);
        modalContent.lineStyle(3, 0x5D4037, 0.8);
        modalContent.strokeRoundedRect(-250, -180, 500, 360, 20);

        // Add darker hex pattern
        for (let y = -160; y < 160; y += 30) {
            for (let x = -230; x < 230; x += 35) {
                const offset = (Math.floor((y + 160) / 30)) % 2 === 0 ? 17.5 : 0;
                this.drawHexagon(modalContent, x + offset, y, 15, 0xF0A800, 0.3);
            }
        }

        // Title
        const title = this.add.text(
            0, -150,
            '🍯 HIVE COMPLETE! 🐝',
            {
                fontSize: '32px',
                fill: '#5D4037',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                stroke: '#000000',
                strokeThickness: 2,
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#FFFFFF',
                    blur: 0,
                    stroke: true
                }
            }
        ).setOrigin(0.5);

        // Message
        const message = this.add.text(
            0, -90,
            'The hive is full of delicious honey!',
            {
                fontSize: '22px',
                fill: '#5D4037',
                fontFamily: 'Arial',
                align: 'center',
                wordWrap: { width: 450 },
                stroke: '#000000',
                strokeThickness: 1
            }
        ).setOrigin(0.5);

        // Score info
        const scoreInfo = this.add.text(
            0, -30,
            `Total Honey Collected: ${this.score}`,
            {
                fontSize: '24px',
                fill: '#5D4037',
                fontFamily: 'Arial',
                align: 'center',
                lineSpacing: 10,
                stroke: '#000000',
                strokeThickness: 1
            }
        ).setOrigin(0.5);

        // Play again button
        const button = this.add.graphics();
        button.fillStyle(0x5D4037, 1);
        button.fillRoundedRect(-100, 80, 200, 60, 15);
        button.lineStyle(3, 0xFFD700, 0.8);
        button.strokeRoundedRect(-100, 80, 200, 60, 15);
        button.setInteractive(
            new Phaser.Geom.Rectangle(-100, 80, 200, 60),
            Phaser.Geom.Rectangle.Contains
        );

        const buttonText = this.add.text(
            0, 110,
            'NEW HIVE',
            {
                fontSize: '24px',
                fill: '#FFD700',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);

        // Button interaction
        button.on('pointerdown', () => {
            modalBg.destroy();
            modal.destroy();
            this.resetGame();
            this.startLevelCountdown();
        });

        // Add all elements to modal
        modal.add([modalContent, title, message, scoreInfo, button, buttonText]);

        // Store reference
        this.modal = modal;
    }

    resetGame() {
        this.currentLevel = 1;
        this.score = 0;
        this.gameOver = false;
        this.clearUI();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 800,
    backgroundColor: '#FFF9C4',
    parent: 'game-container',
    scene: [StartScene,Play],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);