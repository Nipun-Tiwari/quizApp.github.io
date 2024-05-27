// Timer
let progressInterval
function clock(){
    let circularProgress = document.querySelector(".circular-progress");
    let progressValue = document.querySelector(".progress-value");
    
    let progressStartValue = 30,    
    progressEndValue = 0,    
    speed = 1000;
    
    progressInterval = setInterval(() => {
    progressStartValue--;
    
    progressValue.textContent = `${progressStartValue}`
    circularProgress.style.background = `conic-gradient(#531e98 ${progressStartValue * 6}deg, #ededed 0deg)`
    
    if(progressStartValue == progressEndValue){
        clearInterval(progressInterval);
        document.querySelector('.progress-value').innerHTML='<i class="fa-solid fa-stopwatch" style="color: #ff0000; font-size: 2rem"></i>';
        ansFreeze();
    }    
    }, speed);
}

let i=0;
let answer;
let totalq;
let marks=0;
const questionTag=document.querySelector('.question p')
function update(i){
    fetch('question.json')
        .then(response => response.json())
        .then(data => {
            // Now 'data' contains your JSON data.
            // You can access it like this:
            clock()
            const questions = data.questions;
            const totalQuestion=questions.length;
            totalq=totalQuestion;
            answer=questions[i].correct
            const options=document.querySelector('.options');
            const clickHandler=(event)=>{
                const selectedOption=event.target;
                if(selectedOption.tagName==='BUTTON'){
                    if(selectedOption.id===answer){
                        marks++;
                        showCorrectAns(answer);
                        const right=document.getElementById('correct');
                        right.volume=0.5;
                        right.play();
                    }
                
                    else{
                        showCorrectAns(answer);
                        // console.log(selectedOption);
                        markWrongAns(selectedOption);
                    }
                    ansFreeze();
                    clearInterval(progressInterval);
                    options.removeEventListener('click',clickHandler);
                }
            }
            options.addEventListener('click',clickHandler);
           

            // if(totalQuestion<2){
            //     document.querySelector('#next-button').style.display='none';
            // }
            if(i==totalQuestion-1){
                document.querySelector('#next-button').style.display='none';
            }
            else if(i>0 && i<totalQuestion-1){
                document.querySelector('#sub-button').style.display='inline-block'
            }
            
            const progress=(i+1)/totalQuestion;
            const progressText=`${i+1}/${totalQuestion}`;
            const progressPercentage=progress*100;
            // const correctAns=questions[i].correct;
            
            document.querySelector('.progress-bar').style.width=`${progressPercentage}%`;
            document.querySelector('.progress').innerHTML=progressText;
            questionTag.innerHTML=questions[i].question;
            const option=Object.entries(questions[i].options);
            option.forEach(([key,value] )=> {
                document.querySelector(`#${key}`).innerHTML=value;
            });
            
        })
        .catch(error => console.error('Error fetching data:', error));
}

function ansFreeze(){
    const buttons=document.querySelectorAll('.btn');
    buttons.forEach(button=>{
        button.classList.add('freezeBtn')
        button.classList.remove('btn')
        button.disabled=true;
        
    })   
}
function showCorrectAns(ans){
    clearIcons('check');
    document.querySelector(`#${ans}`).style.border='3px solid #7AE582'
    const optionBtn=document.getElementById(`${ans}`)
    const iconElement = document.createElement('i');
    iconElement.className = 'fa-solid fa-circle-check';
    iconElement.id = 'check'
    iconElement.style.color = '#00ff00';
    optionBtn.appendChild(iconElement);
}

function markWrongAns(option){
    clearIcons('wrong');
    const wrongAudio=document.getElementById('wrongAudio')
    wrongAudio.volume=0.5;
    wrongAudio.play();
    document.querySelector(`#${option.id}`).style.border='3px solid red';
    const optionBtn=document.getElementById(`${option.id}`)
    const iconElement = document.createElement('i');
    iconElement.className = 'fa-solid fa-circle-xmark';
    iconElement.id = 'wrong'
    iconElement.style.color = '#ff0000';
    optionBtn.appendChild(iconElement);
}
function clearIcons(sign) {
    const icons = document.querySelectorAll(`i[id="${sign}"]`);
    icons.forEach((icon) => {
        icon.remove();
    });
}
update(i)
const nextButton=document.querySelector('#next-button');
const subButton=document.querySelector('#sub-button');

// Next Button

nextButton.addEventListener('click', () => {
    clearInterval(progressInterval);
    clearAnswerIndicators();
    enableAnswerSelection();
    i++;
    update(i);
});

function clearAnswerIndicators() {
    const checkIcons = document.querySelectorAll('.fa-circle-check');
    checkIcons.forEach(icon => icon.remove());
    const wrongIcons = document.querySelectorAll('.fa-circle-xmark');
    wrongIcons.forEach(icon => icon.remove());

    const optionButtons = document.querySelectorAll('.options button');
    optionButtons.forEach(button => {
        button.style.border = '';
    });
}

function enableAnswerSelection() {
    // Remove the freezeBtn class from all option buttons and enable them
    const optionButtons = document.querySelectorAll('.options button');
    optionButtons.forEach(button => {
        button.classList.remove('freezeBtn');
        button.classList.add('btn');
        button.disabled = false;
    });
}
let barRatio;
function scoreboard(){
        barRatio=(marks/totalq)*360;
        console.log(barRatio);
        let circularProgress = document.querySelector(".circular-progress2");
        let progressValue = document.querySelector(".progress-value2");
        
        let progressStartValue = 0,   
        progressEndValue = marks,    
        speed = 100;
        console.log('progressEndValue='+progressEndValue);
        
        let progressInterval2 = setInterval(() => {
        progressStartValue++;
        if(marks==0){
            progressValue.textContent = `0/${totalq}`
        }
        else{
            progressValue.textContent = `${progressStartValue}/${totalq}`

        }
        if(marks!=0){
            circularProgress.style.background = `conic-gradient(#70f403 ${progressStartValue*36}deg, #ededed 0deg)`;
        }
        else{
            circularProgress.style.background=`conic-gradient(#ededed ${progressStartValue*36}deg, #ededed 0deg)`;
        }
        if(barRatio<90){
            document.querySelector('.remarks').innerHTML='Get Better';
        }
        else if(barRatio>=90 && barRatio<270){
            document.querySelector('.remarks').innerHTML='Better Luck Next Time';
        }
        else if(barRatio!=360){
            document.querySelector('.remarks').innerHTML='Well Done';  
        }
        else{
            document.querySelector('.remarks').innerHTML='Perfect';
        }
        console.log(progressStartValue);
        if(progressStartValue == progressEndValue){
            clearInterval(progressInterval2);
        }    
        }, speed);
}
// Submit Button
subButton.addEventListener('click',()=>{
    document.querySelector('.main').style.display='none';
    document.querySelector('.result').style.display='flex';
    scoreboard();
    if(barRatio>=270){
        const start = () => {
            setTimeout(function() {
                confetti.start()
            }, 1000); 
        };
        const stop = () => {
            setTimeout(function() {
                confetti.stop()
            }, 5000);
        };
        start();
        stop();
        const clapAudio=document.getElementById('clap');
        clapAudio.volume=0.5;
        clapAudio.play();
    }
    else if(barRatio<=144){
        const bloopAudio=document.getElementById('bloop')
        bloopAudio.volume=0.5;
        bloopAudio.play()
    }
})
