document.addEventListener('DOMContentLoaded', () => {
    const btnOpenModal = document.getElementById('btnOpenModal');
    const modalBlock = document.getElementById('modalBlock');
    const closeModal = document.getElementById('closeModal');
    const questionTitle = document.getElementById('question');
    const formAnswers = document.getElementById('formAnswers');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const sendBtn = document.getElementById('send');

    let numberQuestion = 0;
    let quizDataLength = 0;
    let dbQuestions = [];
    const finalAnswers = {};

    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
        getData();
    });

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
    });

    modalBlock.addEventListener('click', (event) => {
        if (event.target === modalBlock) {
            modalBlock.classList.remove('d-block');
        }
    });

    const getData = () => {
        formAnswers.innerHTML = '<h3 class="text-center w-100">Завантаження...</h3>';
        
        setTimeout(() => {
            fetch('./db.json')
                .then(res => res.json())
                .then(data => {
                    dbQuestions = data.questions;
                    quizDataLength = dbQuestions.length;
                    playTest(0);
                })
                .catch(err => {
                    console.error("Помилка завантаження:", err);
                    formAnswers.innerHTML = '<h3 class="text-center w-100 text-danger">Помилка завантаження даних!</h3>';
                });
        }, 1000);
    };

    const playTest = (number) => {
        const currentQuestion = dbQuestions[number];
        questionTitle.textContent = currentQuestion.question;
        formAnswers.innerHTML = '';

        currentQuestion.answers.forEach((item, index) => {
            const answerCard = `
                <div class="answers-item d-flex flex-column align-items-center m-2">
                    <input type="${currentQuestion.type}" id="answerItem${index}" name="answer" value="${item.title}" class="d-none">
                    <label for="answerItem${index}" class="d-flex flex-column justify-content-between align-items-center" style="cursor: pointer;">
                        <img class="answerImg" src="${item.url}" alt="${item.title}" style="width: 100px; height: 100px; object-fit: contain;">
                        <span class="mt-2 font-weight-bold">${item.title}</span>
                    </label>
                </div>
            `;
            formAnswers.insertAdjacentHTML('beforeend', answerCard);
        });

        if (numberQuestion === 0) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
        }

        if (numberQuestion === dbQuestions.length - 1) {
            nextBtn.style.display = 'none';
            sendBtn.classList.remove('d-none');
        } else {
            nextBtn.style.display = 'block';
            sendBtn.classList.add('d-none');
        }
    };

    nextBtn.addEventListener('click', () => {
        saveAnswers();
        if (numberQuestion < quizDataLength - 1) {
            numberQuestion++;
            playTest(numberQuestion);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (numberQuestion > 0) {
            numberQuestion--;
            playTest(numberQuestion);
        }
    });

    const saveAnswers = () => {
        const inputs = [...formAnswers.elements].filter(elem => elem.checked);
        const answerValues = inputs.map(elem => elem.value).join(', ');
        finalAnswers[`${numberQuestion}_${dbQuestions[numberQuestion].question}`] = answerValues;
    };

    sendBtn.addEventListener('click', () => {
        saveAnswers();
        console.log("Фінальні відповіді користувача:", finalAnswers);
        formAnswers.innerHTML = '<h3 class="text-center w-100 text-success">Дякуємо! Ваші відповіді збережено.</h3>';
        setTimeout(() => {
            modalBlock.classList.remove('d-block');
            numberQuestion = 0;
        }, 2000);
    });
});