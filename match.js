function initializeGame(passedData="") {
    console.log(`Initializing ...`);
    let score = 100;
     console.log("passed data:"+passedData);
    
    let params;
   if(passedData.length>0)
   {params=new URLSearchParams(passedData);}
  else{params=new URLSearchParams(window.location.search);}
  console.log(params);
    // const params = new URLSearchParams('an apple=something you can eat&a candle=something that lights up&a car=something that can move you around&a bath tub=something you get in to get washed');
    
    const hint = document.getElementById('hintDiv');
    const swiperWrapper = document.getElementById('swiperWrapper');
    let selectedCard;
    let randomParamKey;
    let randomValue;
    let valueList = Array.from(params.values()); 
      console.log("valuelist length "+valueList.length);
  // Create a list of values
    const plusPoint=100/valueList.length;
    console.log(plusPoint);
    const minusPoint = plusPoint/2;
  
    // let Unity;
  
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function pickValue() {
        if (valueList.length > 0) {
            randomValue = valueList.pop(); // Pop a value from the list
            console.log("Picked random value:", randomValue);
          
            var saythis=randomValue;
          
            var pElement = document.querySelector('#hintDiv p');
            pElement.textContent = randomValue;
            
            hint.style.display = 'flex';
            hint.classList.add('slideIn-animation');

            window.location.href = "uniwebview://speak?text="+saythis+"&voice=5";
            
        } else {
            console.log("No more values left.");
            randomValue = null;
          
            // hint.style.display = 'none';
            hint.classList.add('slideOut-animation');
            //set game over !
            showCongratulationsOverlay();
        }
    }

    function createSlide(word, secretValue) {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');
        
        // Set the id attribute to the secretValue
        slide.setAttribute('secret', secretValue);
    
        const slideCard = document.createElement('div');
        slideCard.classList.add('slide-card', 'text-center');
    
        const heading = document.createElement('h5');
        heading.innerText = word;
    
        slideCard.appendChild(heading);
      
        slide.appendChild(slideCard);
    
        swiperWrapper.appendChild(slide);
    }

    function resetGame() {

      // Force a page reload
    window.location.reload();

    }
  
    function startGame() {

      //hide layer
      const instruction = document.getElementById('instruction');
      instruction.style.display = 'none';
      instruction.style.zIndex = '0';
      //pcik word... this makes it say the word
      pickValue();

    }


    function onSecretFound() {
        swiper.removeSlide(swiper.realIndex);
        swiper.update();
        // hint.style.display = 'none';
        hint.classList.add('slideOut-animation');

        getCurrentCard();
      
        console.log(score);

        randomValue = null;
    
        if (randomParamKey !== null) {
            pickValue();
            console.log(`Randomly chosen value: ${randomValue}`);
        } else {
            console.log("No more parameters left.");
        }
        // if (valueList.length === 0) {
        //     showCongratulationsOverlay();
        // }
    }

    function getCurrentCard(){
        const activeIndex = swiper.realIndex;
        selectedCard = swiper.slides[activeIndex];
        if (selectedCard) {
            const secretValue = selectedCard.getAttribute('secret');
            
            console.log("Selected Card:", secretValue);
        }
    }
    
    let cardInUpwardMotion = false;  
  
    function swipeUp(event) {
        if (selectedCard) {
            const secretValue = selectedCard.getAttribute('secret');
            console.log("Secret Value:", secretValue);
            console.log("Random Value:", randomValue);
    
            if (secretValue === randomValue) {
               
                allowSlideNavigation(false);
                console.log("Match !");
                selectedCard.style.transition = 'transform 0.4s';
                selectedCard.style.transform = 'translateY(-250px)';
                setTimeout(() => {
                    selectedCard.style.transition = '';
                    window.playGood();
                    setTimeout(() => {
                      window.smallConfetti(1);
                    }, 100);
                    onSecretFound();
                    // score+=plusPoint;
                    
                    allowSlideNavigation(true);
                }, 500);
            } else {
               
                allowSlideNavigation(false);
                selectedCard.style.transition = 'transform 0.4s';
                selectedCard.style.transform = 'translateY(-400px)';
                
                setTimeout(() => {
                    selectedCard.style.transition = 'transform 0.2s';
                    selectedCard.style.transform = 'translateY(0)';
                    window.playBad();
                    //minus point
                    score-=minusPoint;
                    setTimeout(() => {
                        selectedCard.style.transition = '';
                    }, 500);
                  
                  allowSlideNavigation(true);
                }, 500);
            }
        }
    }

    document.getElementById('redoButton').addEventListener('click', resetGame);
  
    // document.getElementById('startButton').addEventListener('click', startGame);

    const swiperElement = document.querySelector('.swiper');
    
    const swiper = new Swiper('.swiper', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        slidesPerView: 1,
        loop: false,
        centeredSlides: true,
        spaceBetween: 10,
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            640: {
                slidesPerView: 3,
                spaceBetween: 40
            }
        }
    });
  
    const nextButton = document.querySelector('.swiper-button-next');
    const prevButton = document.querySelector('.swiper-button-prev');

    function allowSlideNavigation(allow) {
        if (allow) {
            cardInUpwardMotion=false;
            nextButton.style.pointerEvents = 'auto';
            prevButton.style.pointerEvents = 'auto';
        } else {
            cardInUpwardMotion=true;
            nextButton.style.pointerEvents = 'none';
            prevButton.style.pointerEvents = 'none';
        }
    }

    swiper.on('slideChange', function() {
      window.playSlide();
        getCurrentCard();
    });
  
    swiper.on('touchStart', function (swiper, e) {
      if (cardInUpwardMotion) {
          swiper.allowSlidePrev = false;
          swiper.allowSlideNext = false;
          console.log("prevented");
      }
      else
      {
        console.log("allowed");
      }
    });

    swiper.on('touchEnd', function (swiper) {
        swiper.allowSlidePrev = true;
        swiper.allowSlideNext = true;
    });
  
    

    function showCongratulationsOverlay() {
        
        var saythis="Nice work! Press the button 'redo' if you want to do it again.";
        
        window.location.href = "uniwebview://speak?text="+saythis;
      
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'flex';
        overlay.style.zIndex = '2';
        // Get the <p> element by its tag name
        var pElement = document.querySelector('.overlay-content p');

        // Update the content
        pElement.textContent = "score:"+score;
      
        window.playTada();
        setTimeout(() => {
          window.startConfetti(1);
        }, 100);
      
        var sendscores="score="+score+"&transcript=thistranscript";
        
        setTimeout(() => {

          window.location.href = "uniwebview://task-done?"+sendscores;
                    }, 100);
        
    }

    // Initialize Hammer.js on the swiper element
    const mc = new Hammer(swiperElement);
    mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

    mc.on('swipeup', function(event) {
        swipeUp(event);
        window.playUp();
    });

    shuffle(valueList);
  
    pickValue(); //--> moved to startGame

    params.forEach((value, key) => {
        createSlide(key, value);
    });
    
    swiper.update(); // <--- Add this line
  
    getCurrentCard();
  
    
  
    //read instructions:
    // window.MSGunity("Hello! Let's play a game of matching cards.");// Listen to the definition and swipe left or right to move to another card. Swipe up to select the card that matches. Press the button 'Start' when you are ready !
    // myConfetti();
  
  //wait half a second before anounncing the hidden word
//   setTimeout(function() {
  
//       var saythis=randomValue;
//       window.location.href = "uniwebview://speak?text="+saythis;
    
//     }, 500);
}

// document.addEventListener('DOMContentLoaded', initializeGame);

// document.addEventListener('DOMContentLoaded', function() {
//     setTimeout(function() {
       
//       initializeGame();
//     }, 100);
//   });
