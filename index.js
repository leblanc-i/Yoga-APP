const main = document.querySelector("main");
let arrayExercise = [
    {pic: 0, min: 1},
    {pic: 1, min: 1},
    {pic: 2, min: 1},
    {pic: 3, min: 1},
    {pic: 4, min: 1},
    {pic: 5, min: 1},
    {pic: 6, min: 1},
    {pic: 7, min: 1},
    {pic: 8, min: 1},
    {pic: 9, min: 1},
]

class Exercise {

}

const utils = {
    pageContent: function(titre, content, btn) {
        document.querySelector("h1").innerHTML = titre;
        main.innerHTML = content;
        document.querySelector(".btn-container").innerHTML = btn;
    }
}

const page = {
    lobby: function() {
        utils.pageContent(
            `Paramétrage <i id="reboot" class="fas fa-undo"></i>`,
            `Exercices`,
            `<button id="start">Commencer <i class="far fa-play-circle"></i></button>`
        )

    },

    routine: function() {
        utils.pageContent(
            `Routine`,
            `Exercice avec chrono`,
            null
        )
    },

    finish: function() {
        utils.pageContent(
            `C'est terminer`,
            `<button id="start">Recommencer</button>`,
            `<button id="reboot" class="btn-reboot">Réinitialiser <i class="fas fa-times-circle"></i></button>`
        )
    }
}
page.finish();