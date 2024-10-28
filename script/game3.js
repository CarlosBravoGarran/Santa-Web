
document.addEventListener('DOMContentLoaded', function() {
    const game3Button = document.getElementById('game3_button');
    const gameImage = document.getElementById('game_image');
    const game1Container = document.querySelector('.game-container');
    const game2Container = document.querySelector('.game2__container');
    const game3Image = document.querySelector('.game3_img');

    game3Button.addEventListener('click', function() {
        gameImage.style.display = 'none';
        game1Container.style.display = 'none';
        game2Container.style.display = 'none';
        game3Image.style.display = 'block';
        alert('Game 3 is coming soon!');
    })
})