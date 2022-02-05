'use strict'
/* global SC */
/* eslint object-curly-spacing: 0 */

window.onload = () => {
  const iframe = document.querySelector('iframe')
  const start = document.querySelector('#start')
  const restart = document.querySelector('.restart')
  const progressBar = document.querySelector('.e-c-progress')
  const pointer = document.getElementById('e-pointer')
  const input = document.querySelector('input')
  const h1 = document.querySelector('h1')
  const body = document.body
  const synth = window.speechSynthesis
  const length = Math.PI * 2 * 100

  let totalSecondsLeft = 0
  let exerciseType
  let exerciseName
  let widget
  let totalMinutes = 20
  let intervalTimer
  let timeLeft
  let secondsToExercise
  let exercise
  let isPaused
  let isStarted = false
  let isDone = false
  let isRest = false


  // The name of the exercise followed by the minimum/maximum amount of time you want to do it
  const exercises = [
    [
      //Legs Aerobic
      {'forward lunges': [30, 61]},
      {'side lunges': [30, 61]},
      {'high knees': [30, 46]},
      {'squats': [30, 46]},
      {'jump squats': [20, 31]},
      {'glute bridges': [30, 61]},
      {'jumping jacks': [30, 46]},
      {'butt kicks': [30, 46]}
    ],
    // Biceps and Ticeps
    [
      {'hammer curl': [40, 61]},
      {'bicep curl': [40, 61]},
      {'Standing Dumbbell Curl': [40, 61]},
      {'Bent Over Tricep Kickbacks': [40, 61]},
      {'Skull Crushers': [50, 71]},
      {'Dumbbell Tricep Extensions': [40, 61]}
    ],
    // Abs
    [
      {'crunches': [30, 61]},
      {'flutter kicks': [30, 46]},
      {'russian twist': [30, 46]},
      {'superman': [30, 40]},
      {'leg raises': [20, 40]}
    ],
    // Back and sholder
    [
      {'bent over rows': [40, 91]},
      {'dumbell scaption': [40, 91]},
      {'Dumbbell Upright Row': [40, 91]},
      {'Reverse flye': [40,90] },
      {'Arnold press': [40, 80]}
    ],
    // More abs?
    [
      {'climbers': [30, 61]},
      {'push ups': [20, 31]},
      {'plank rotations': [30, 46]},
      {'elbow plank': [30, 61]},
      {'shoulder taps': [30, 46]}
    ]
  ]

  const say = (phrase) => {
    synth.speak(phrase)
    try {
      widget.setVolume(20)
      phrase.onend = () => {
        widget.setVolume(100)
      }
    } catch (e) {}
  }

  const sayExercise = (seconds, exercise) => {
    const phrase = new window.SpeechSynthesisUtterance(`${exercise}, ${seconds} seconds`)
    phrase.volume = 1
    say(phrase)
  }

  const sayCountdown = (number) => {
    const phrase = new window.SpeechSynthesisUtterance(`${number}`)
    phrase.volume = 1
    phrase.pitch = 1.5
    say(phrase)
  }

  // Picks an integer at random from a range, excluding max
  function randRange (max, min) {
    min = min || 0
    const rand = Math.floor(Math.random() * (max - min))
    return min + rand
  }
  // Picks an item at random from an array
  function uniform (array) {
    return array[randRange(array.length)]
  }

  const setBackground = (exercise) => {
    const url =
      `https://raw.githubusercontent.com/Jaland/random-training/main/img/${exercise.replace(/ /g, '')}.gif`
    body.style.backgroundImage = `url("${url}")`
  }

  const done = () => {
    if (isDone) {
      return
    }
    h1.innerText = 'How about a snack?\n'
    document.querySelector('.circle').style.display = 'none'
    document.querySelector('.controlls').style.display = 'none'
    document.querySelector('#remaining').style.display = 'none'
    restart.style.display = 'none'

    // delete sc widget
    iframe.src = ''
    iframe.style.display = 'none'

  
  }

  const update = (value, timePercent) => {
    const offset = -length - length * value / (timePercent)
    progressBar.style.strokeDashoffset = offset
    pointer.style.transform = `rotate(${360 * value / (timePercent)}deg)`
  }

  const initTimer = () => {
    const pauseBtn = document.getElementById('pause')
    isPaused = false

    // circle start
    progressBar.style.strokeDasharray = length
    // circle ends
    const displayOutput = document.querySelector('.display-remain-time')

    if (isRest) {
      exerciseName = 'Rest'
      secondsToExercise = randRange(18, 14)
    } else {
      //Get our "type" of exercise
      let currentExerciseType = exercises[exerciseType]
      // Select a random exercise of that type
      let exercise = currentExerciseType[Math.floor(Math.random() * currentExerciseType.length)]
      // Get exercise name
      exerciseName = Object.keys(exercise)[0]
      let exerciseTiming = exercise[exerciseName]
      // Figure out a time range based on parameters
      secondsToExercise = randRange(exerciseTiming[1], exerciseTiming[0])
      exerciseType = (exerciseType + 1) % 3
    }
    isRest = !isRest

    try {
      setBackground(exerciseName)
    } catch (e) {
      console.log('could not set background', e)
    }

    if (secondsToExercise > totalSecondsLeft) {
      secondsToExercise = totalSecondsLeft
    }
    sayExercise(secondsToExercise, exerciseName)
    timeLeft = secondsToExercise

    h1.innerText = exerciseName

    update(secondsToExercise, secondsToExercise) // refreshes progress bar

    // Hmm.... this is not the the most accurate timer but it is fine I guess, will revisit at some point
    function timer () {
      if (intervalTimer) {
        clearInterval(intervalTimer)
      }
      displayTimeLeft()
      intervalTimer = setInterval(function () {
        timeLeft = timeLeft - 1
        if (timeLeft < 0 && totalSecondsLeft > 0) {
          //This is called with a specific exercise is complete
          initTimer()
        } else {
          displayTimeLeft()
          if (timeLeft < 0) {
            //This is called when the entire workout is complete
            sayCountdown('Congrats you did it you fat bastard?')
            clearInterval(intervalTimer)
          } else if (timeLeft < 4) {
            // This is called when you have 3 or less seconds left
            sayCountdown(timeLeft)
          }
        }
      }, 1000)
    }
    function pauseTimer (restart) {
      if (isStarted === false) {
        timer()
        isStarted = true
        pauseBtn.classList.remove('play')
        pauseBtn.classList.add('pause')
        isPaused = false
      } else if (isPaused || restart) {
        pauseBtn.classList.remove('play')
        pauseBtn.classList.add('pause')
        timer()
        isPaused = false
        try {
          widget.play()
        } catch (e) {}
      } else {
        pauseBtn.classList.remove('pause')
        pauseBtn.classList.add('play')
        clearInterval(intervalTimer)
        isPaused = true
        try {
          widget.pause()
        } catch (e) {}
      }
    }
    pauseBtn.onclick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      pauseTimer()
    }

    function displayTimeLeft () {
      const totalMinutesLeft = Math.floor(totalSecondsLeft / 60)
      let remainderSeconds = String(totalSecondsLeft % 60)
      if (remainderSeconds.length < 2) {
        remainderSeconds = '0' + remainderSeconds
      }
      document.querySelector('#timeRemaining').innerText =
        `${totalMinutesLeft}:${remainderSeconds}`
      if (totalSecondsLeft > 0) {
        totalSecondsLeft = totalSecondsLeft - 1
      } else {
        done()
        return
      }
      let minutes = Math.floor(timeLeft / 60)
      let seconds = timeLeft % 60
      let displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
      displayOutput.textContent = displayString
      update(timeLeft, secondsToExercise)
    }

    body.onkeydown = (e) => {
      if (e.code === "Space") {
        // spacebar was hit
        e.preventDefault()
        e.stopPropagation()
        pauseTimer()
      } 
      else if (e.key === 'Enter') {
        initTimer()
      }
    }
    pauseTimer(true)
  }

  function onRestart () {
    exerciseType = randRange(3)
    totalSecondsLeft = Math.ceil(60 * totalMinutes)
    isRest = false
    initTimer()
  }

  start.addEventListener('click', () => {
    totalMinutes = parseFloat(input.value) || totalMinutes
    document.querySelector('#circleTimer').style.display = 'block'
    document.querySelector('#head').style.display = 'none'
    onRestart()
  })

  input.focus()
  input.select()
  input.onkeydown = (e) => {
    if (e.key === 'Enter') {
      start.click()
    }
  }
}
