class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('playButton', 'assets/play_button.png');
        this.load.image('bee', 'assets/bee.png');
    }

    create() {
        // Background and title setup
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xffd700, 0xf0a800, 0xffd700, 0xf0a800, 1);
        bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

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
            fill: '#8B4513',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            stroke: '#FFD700',
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
            playButton.fillStyle(0xFFD700, 1);
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
            // Create loading screen
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

    drawHexagon(graphics, x, y, size, fillColor, fillAlpha, lineColor = null, lineAlpha = null, lineWidth = 2) {
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
    }
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
        this.levelTimes = [180, 150, 120, 90];
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

    preload() {
        this.load.image('bee', 'assets/bee.png');
        this.load.image('speaker', 'assets/unmute.png');
        this.load.image('speakerMute', 'assets/mute.png');
        this.load.audio('bgMusic', 'assets/sounds/background.mp3');
        this.load.audio('select', 'assets/sounds/select.mp3');
        this.load.audio('deselect', 'assets/sounds/deselect.mp3');
        this.load.audio('correct', 'assets/sounds/correct.mp3');
        this.load.audio('countDown','assets/sounds/countdown.mp3')
    }

    create() {
        this.bgMusic = this.sound.add('bgMusic', { loop: true, volume: 0.5 });
        this.selectSound = this.sound.add('select');
        this.deselectSound = this.sound.add('deselect');
        this.correctSound = this.sound.add('correct');
        this.countdownSound=this.sound.add('countDown');
        
        this.createSpeakerIcon();

        // Background setup
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xffd700, 0xf0a800, 0xffd700, 0xf0a800, 1);
        bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);


        this.bee = this.add.image(0, 0, 'bee')
            .setScale(0.3)
            .setVisible(false)
            .setDepth(10);

        this.startLevelCountdown();

    }

    createSpeakerIcon() {
        this.speakerIcon = this.add.image(this.cameras.main.width - 140, 30, 'speaker')
            .setScale(0.1)
            .setInteractive()
            .setScrollFactor(0)
            .setDepth(100)
            .setVisible(false);
        this.updateSpeakerIcon();
        this.speakerIcon.on('pointerdown', () => {
            this.isMuted = !this.isMuted;
            this.updateSpeakerIcon();
             if(!this.isMuted){
                this.bgMusic.play()
             }
             else{
                this.bgMusic.stop()
             }
        });
    }

    updateSpeakerIcon() {
        this.speakerIcon.setTexture(this.isMuted ? 'speakerMute' : 'speaker');
    }

    isPrime(num) {
        if (num <= 1) return false;
        for (let i = 2, s = Math.sqrt(num); i <= s; i++)
            if (num % i === 0) return false;
        return true;
    }

    startLevelCountdown() {
        this.bgMusic.stop()
        this.countdownSound.play()        
        if (this.particles) this.particles.destroy();
        if (this.timerEvent) this.timerEvent.destroy();

        this.levelComplete = false;
        this.selectedNumbers = [];
        this.tileFlipped = false;
        this.speakerIcon.setVisible(false);
        this.clearUI();

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
                    if(!this.isMuted){
                        this.bgMusic.play();
                    }   
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
        this.timeRemaining = this.levelTimes[this.currentLevel - 1] || 60;
        
        // Set current numbers to 1-100
        this.currentNumbers = Phaser.Utils.Array.NumberArray(1, 100);
        
        // Recalculate primes and composites
        this.primeNumbers = this.currentNumbers.filter(num => this.isPrime(num));
        this.compositeNumbers = this.currentNumbers.filter(num => !this.isPrime(num) || num === 1);

        this.createHexagonalGrid();
        this.createUI();
        this.flipTilesIn();
    }
createHexagonalGrid() {
    if (this.tiles) {
        this.tiles.forEach(tile => {
            if (tile.hexagon) tile.hexagon.destroy();
            if (tile.text) tile.text.destroy();
        });
    }
    this.tiles = [];

    const hexSize = 30;
    const hexWidth = hexSize * Math.sqrt(3);
    const hexHeight = hexSize * 2;
    const centerX = this.cameras.main.centerX - hexWidth * 4.5;
    const centerY = this.cameras.main.centerY - hexHeight * 2.5;

    // Create proper honeycomb structure
    const rows = 10;
    const cols = 10;
    let number = 1;

    for (let row = 0; row < rows && number <= 100; row++) {
        // Offset every other row
        const rowOffset = (row % 2) * (hexWidth / 2);
        
        for (let col = 0; col < cols && number <= 100; col++) {
            const x = centerX + col * hexWidth + rowOffset;
            const y = centerY + row * (hexHeight * 0.75);
            
            this.addHexTile(x, y, number++, hexSize);
        }
    }
}

// Simplified addHexTile
addHexTile(x, y, number, hexSize) {
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
        number: number,
        isSelected: false,
        hexagon: hexagon,
        text: this.add.text(x, y, number, {
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
}

// // Update the level completion check
// checkLevelCompletion() {
//     // Get all composite numbers in current level (1-100)
//     const currentComposites = this.compositeNumbers.filter(num => 
//         num <= 100 // Only consider numbers up to 100
//     );
    
//     // Check if all composites are selected
//     const allCompositesSelected = currentComposites.every(num => 
//         this.selectedNumbers.includes(num)
//     );
    
//     // Check if any primes are selected (should be none)
//     const anyPrimesSelected = this.selectedNumbers.some(num =>
//         this.primeNumbers.includes(num)
//     );

//     if (allCompositesSelected && !anyPrimesSelected) {
//         this.levelComplete = true;
//         this.animatePrimeTilesBeforeModal();
//     }
// }

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

flipTilesIn() {
    if (!this.tiles || this.tiles.length === 0) return;

    // Hide all tiles initially
    this.tiles.forEach(tile => {
        tile.text.setVisible(false);
        tile.hexagon.clear();
        this.drawHexagon(tile.hexagon, tile.x, tile.y, tile.hexSize, 0x8B4513, 1, 0x5D4037, 1, 2);
        tile.hexagon.setScale(0);
    });

    // Position bee off-screen left
    this.bee.setVisible(true)
        .setPosition(-100, this.cameras.main.centerY)
        .setScale(0.3)
        .setDepth(10);

    // Fly bee to center
    this.tweens.add({
        targets: this.bee,
        x: this.cameras.main.centerX,
        y: this.cameras.main.centerY,
        duration: 800,
        ease: 'Power2',
        onComplete: () => {
            // Bee does a little wiggle at center
            this.tweens.add({
                targets: this.bee,
                angle: Phaser.Math.Between(-15, 15),
                duration: 200,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    this.bee.setVisible(false);
                    
                    // Create magic particles at bee position
                    this.particles = this.add.particles('bee');
                    const emitter = this.particles.createEmitter({
                        x: this.cameras.main.centerX,
                        y: this.cameras.main.centerY,
                        scale: { start: 0.2, end: 0 },
                        alpha: { start: 1, end: 0 },
                        speed: 100,
                        blendMode: 'ADD',
                        quantity: 5,
                        lifespan: 500
                    });
                    
                    // Make all hexagons appear with a wave effect
                    const centerX = this.cameras.main.centerX;
                    const centerY = this.cameras.main.centerY;
                    
                    this.tiles.forEach((tile, index) => {
                        // Calculate distance from center
                        const dx = tile.x - centerX;
                        const dy = tile.y - centerY;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        // Scale delay based on distance from center
                        const delay = distance * 2;
                        
                        this.time.delayedCall(delay, () => {
                            this.tweens.add({
                                targets: tile.hexagon,
                                scaleX: 1,
                                scaleY: 1,
                                duration: 200,
                                ease: 'Back.out',
                                onComplete: () => {
                                    tile.text.setVisible(true);
                                    if (index === this.tiles.length - 1) {
                                        this.tileFlipped = true;
                                        this.particles.destroy();
                                    }
                                }
                            });
                        });
                    });
                }
            });
        }
    });
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
        this.timeRemaining = this.levelTimes[this.currentLevel - 1] || 60;
        this.timerText = this.add.text(
            this.cameras.main.width - 20,
            20,
            `🐝 ${this.formatTime(this.timeRemaining)}`,
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
                    this.timerText.setText(`🐝 ${this.formatTime(this.timeRemaining)}`);

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
            this.deselectSound.play();
            this.selectedNumbers = this.selectedNumbers.filter(n => n !== tile.number);
        }

        this.checkLevelCompletion();
    }

    checkLevelCompletion() {
        const currentComposites = this.compositeNumbers.filter(num => 
            this.currentNumbers.includes(num)
        );

        console.log("All composites: "+this.compositeNumbers)
        console.log("All selected numbers: "+this.selectedNumbers)
        
        const allCompositesSelected = currentComposites.every(num => 
            this.selectedNumbers.includes(num)
        );

        console.log("All Composites Selected: ",allCompositesSelected)
        
        const noPrimesSelected = this.selectedNumbers.every(num =>
            currentComposites.includes(num)
        );

        console.log("No primes Selected: ",noPrimesSelected )

        if (allCompositesSelected && noPrimesSelected) {
            console.log("Hello! The level is completed!")
            this.levelComplete = true;
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
            this.time.delayedCall(index * 80, () => {
                this.tweens.add({
                    targets: tile.hexagon,
                    scale: 1.2,
                    duration: 50,
                    yoyo: true,
                    ease: 'Sine.inOut'
                });
            });
        });

        // Show modal after animations complete
        this.time.delayedCall(primeTiles.length * 100 + 1000, () => {
            this.correctSound.stop();
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
       
        if ((this.currentLevel >= this.levelTimes.length) && success) {
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
        modalContent.fillRoundedRect(-250, -180, 500, 340, 20);
        modalContent.lineStyle(3, 0xFFD700, 0.8);
        modalContent.strokeRoundedRect(-250, -180, 500, 340, 20);

        // Add honeycomb pattern to modal
        for (let y = -160; y < 160; y += 30) {
            for (let x = -220; x < 230; x += 35) {
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

        // Message - show next level time if successful
        let messageText = success ? 
            `Sweet! You found all the honey cells!\nNext level time: ${this.formatTime(this.levelTimes[this.currentLevel] || 60)}` : 
            'Buzz! Some honey cells were missed!';
        
        const message = this.add.text(
            0, -90,
            messageText,
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
            `\nHoney Collected: ${correct}/${currentComposites.length}\nTime Bonus: +${timeBonus}\nTotal Honey: ${this.score}`,
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
            success ? 'NEXT LEVEL' : 'TRY AGAIN',
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

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
    scene: [StartScene, Play],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);