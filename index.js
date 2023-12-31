const main = document.querySelector("main");

// Notre tableau de base
const basicArray = [
    { pic: 0, min: 1 },
    { pic: 1, min: 1 },
    { pic: 2, min: 1 },
    { pic: 3, min: 1 },
    { pic: 4, min: 1 },
    { pic: 5, min: 1 },
    { pic: 6, min: 1 },
    { pic: 7, min: 1 },
    { pic: 8, min: 1 },
    { pic: 9, min: 1 },
]
let arrayExercise = [];
// On test au lancement de l'application est-ce-qu'on a quelque chose qui est stocker si y'a rien de stocker on passe à arrayExercise notre tableau de base et si y'a quelque chose de stocker on passe à arrayExercise ce qui est stocker dans le localSorage

// Fonction qui se lance toute seule au demarrage elle se lance une fois et elle se lance plus
(() => {
    if (localStorage.exercises) {
        arrayExercise = JSON.parse(localStorage.exercises);
    } else {
        arrayExercise = basicArray;
    }
})();

// Cette classe est le generateur des exercices
class Exercise {
  constructor() {
    this.index = 0;
    this.minutes = arrayExercise[this.index].min;
    this.seconds = 0;
  }

  // Fonction comptedown
  updateCountdown() {
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;
    // compte à rebours et passer d'un exo à un autre
    setTimeout(() => {
      if (this.minutes === 0 && this.seconds === "00") {
        this.index ++;
        this.ring();
        if (this.index < arrayExercise.length) {
          this.minutes = arrayExercise[this.index].min;
          this.seconds = 0;
          this.updateCountdown();
        } else {
          return page.finish();
        }
      } else if (this.seconds === "00") {
        this.minutes --;
        this.seconds = 59;
        this.updateCountdown();
      } else {
        this.seconds --;
        this.updateCountdown();
      }
    }, 1000)

    return (main.innerHTML = `
      <div class="exercice-container">
        <p>${this.minutes}:${this.seconds}</p>
        <img src="./img/${arrayExercise[this.index].pic}.png" />
        <div>${this.index + 1} / ${arrayExercise.length}</div>
      </div>
    `)
  }

  // Fonction de la sonnette
  ring() {
    const audio = new Audio();
    audio.src = "ring.mp3";
    audio.play();
  }
}

// C'est là ou se trouve toutes nos fonctions utiles au projet
const utils = {
  // Fonction qui gere le contenu de chaque page
  pageContent: function (titre, content, btn) {
    document.querySelector("h1").innerHTML = titre;
    main.innerHTML = content;
    document.querySelector(".btn-container").innerHTML = btn;
  },
  // La fonction qui gere le nombre de minutes
  handleEventMinutes: function () {
    document.querySelectorAll(`input[type="number"]`).forEach((input) => {
      input.addEventListener("input", (e) => {
        // On utilise le map pour trouver l'element qui a ete pointé
        arrayExercise.map((exo) => {
          if (exo.pic == e.target.id) {
            // Passer un nombre de minute à l'exo
            // Et convertir le string en number
            exo.min = parseInt(e.target.value);
            this.store();
          }
        });
      });
    });
  },
  // La fonction qui permet d'intervertir les element
  handleEventArrow: function () {
    document.querySelectorAll(".arrow").forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        // Creation d'une variable qui stock la position de l'element
        let position = 0;
        // On utilise le map pour trouver l'id de l'element qui a ete pointé
        arrayExercise.map((exo) => {
          if (exo.pic == e.target.dataset.pic && position !== 0) {
            // Methode qui nous permet d'intervertir les position
            [arrayExercise[position], arrayExercise[position - 1]] = [arrayExercise[position - 1], arrayExercise[position]];

            // Affiche quand tu as intervertis
            page.lobby();
            this.store();
          } 
          else {
            position++;
          }
        });
      });
    });
  },
  // La fonction qui supprime un element
  deleteItem: function () {
    document.querySelectorAll(".deleteBtn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            // On cree un nouveau tableau
            let newArray = [];
            // Ensuite on parcours le tableau des elements
            arrayExercise.map((exo) => {
                // Et on renvoit tout les elements dans un nouveau tableau exepté celui sur lequel on avait cliquez
                if (exo.pic != e.target.dataset.pic) {
                    newArray.push(exo);
                }
            });
            // On remplace le contenu de notre tableau par celui du nouveau tableau
            arrayExercise = newArray;
            // Et on affiche le contenu
            page.lobby();
            this.store();
        })
    })
  },

  // Fonction qui ramene le tableau au complet
  reboot: function() {
    arrayExercise = basicArray;
    page.lobby();
    this.store();
  },
  
  // Fonction qui nous permet de stocker nos elements
  store: function () {
    localStorage.exercises = JSON.stringify(arrayExercise);
  }
};

// Contiens toutes les pages du projet
const page = {
  // La premiere page(Parametrage)
  lobby: function () {
    let mapResult = arrayExercise.map((exo) => {
      // On a utiliser data-pic pour obtenir l'id de la photo
      // Parce-que l'id à deja une fois ete uliser au niveau de l'input
      return `
                <li>
                    <div class="card-header">
                        <input type="number" id=${exo.pic} min="1" max="10" value="${exo.min}">
                        <span>min</span>
                    </div>
                    <img src="./img/${exo.pic}.png"/>
                    <i class="fas fa-arrow-alt-circle-left arrow" data-pic=${exo.pic}></i>
                    <i class="fas fa-times-circle deleteBtn" data-pic=${exo.pic}></i>
                </li>
            `;
    });

    utils.pageContent(
      `Paramétrage <i id="reboot" class="fas fa-undo"></i>`,
      "<ul>" + mapResult + "</ul>",
      `<button id="start">Commencer <i class="far fa-play-circle"></i></button>`
    );
    // Fonction qui va nous gerer le nombre de minutes
    utils.handleEventMinutes();
    // Fonction qui gere l'evenement sur la fleche
    utils.handleEventArrow();
    // Fonctions qui gere l'evenement pour supprimer un exo de la liste
    utils.deleteItem();
    // Evenement sur le bouton reboot pour ramener tous les elements
    reboot.addEventListener("click", () => utils.reboot());
    // Evenement sur le boutton start pour commencer le compte à rebours
    start.addEventListener("click", () => {
      this.routine();
    })
  },

  // La deuxieme page(routine)
  routine: function () {
    const exercice = new Exercise();

    utils.pageContent(`Routine`, exercice.updateCountdown(), null);
  },

  // La troisieme page(finish)
  finish: function () {
    utils.pageContent(
      `C'est terminer`,
      `<button id="start">Recommencer</button>`,
      `<button id="reboot" class="btn-reboot">Réinitialiser <i class="fas fa-times-circle"></i></button>`
    );
    // Bouton pour recommencer les exos
    start.addEventListener("click", () => {
      this.routine();

    })

    // Bouton pour reinitialiser les exos et refaire les choix
    reboot.addEventListener("click", () => {
      utils.reboot();
    })
  },
};
page.lobby();
