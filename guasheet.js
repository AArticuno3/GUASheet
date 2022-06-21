let root = document.documentElement
const itemForms = [...document.querySelectorAll("[item-form]")]
const expandForms = [...document.querySelectorAll("[expand-form]")]

// Creating real time HP updating

function logHealth() {
  let currentHealth = [...document.querySelectorAll("[data-HP]")][0].value
  let maximumHealth = [...document.querySelectorAll("[data-HP-MAX]")][0].value

  let hpRatio = (100*(currentHealth/maximumHealth))
  if (hpRatio < 100) {
    root.style.setProperty('--hp-percent', parseInt(hpRatio) + "%" );
  } else {
    root.style.setProperty('--hp-percent', "100%" );
  }
  console.log("Current HP is " + currentHealth)
  console.log("Max HP is " + maximumHealth)
  console.log("Current HP is " + hpRatio + "%")
}

// Creating real time Stats updating

function logStats() {
  let currentCore = [...document.querySelectorAll("[data-Core]")][0].value
  if (currentCore == "") {
    currentCore = 0
  }
  let currentStr = [...document.querySelectorAll("[data-Str]")][0].value
  if (currentStr == "") {
    currentStr = 0
  }
  let currentDex = [...document.querySelectorAll("[data-Dex]")][0].value
  if (currentDex == "") {
    currentDex = 0
  }
  let currentSprint = [...document.querySelectorAll("[data-Sprint]")][0].value
  if (currentSprint == "") {
    currentSprint = 0
  }
  let currentSpring = [...document.querySelectorAll("[data-Spring]")][0].value
  if (currentSpring == "") {
    currentSpring = 0
  }
  let currentStamina = [...document.querySelectorAll("[data-Stamina]")][0].value
  if (currentStamina == "") {
    currentStamina = 0
  }

  let jumpHeight  = 0.5*currentCore + 1*currentSpring + "ft"
  let fallHeight  = 2*currentCore + 5*currentStr + 2*currentSpring + "ft"
  let moveSpeed   = 2*currentCore + 5*currentDex + 2*currentSprint + "ft/AP"
  let carryWeight = 25*currentCore + 25*currentStr + 25*currentStamina + "Lb"

  document.querySelectorAll("[data-jumpHeight]")[0].innerHTML = jumpHeight
  document.querySelectorAll("[data-fallHeight]")[0].innerHTML = fallHeight
  document.querySelectorAll("[data-moveSpeed]")[0].innerHTML = moveSpeed
  document.querySelectorAll("[data-carryWeight]")[0].innerHTML = carryWeight
}

// Creating the Unfoldable Skills Tabs

document.addEventListener("click", e => {
  const clickTarget = e.target
  
  if (clickTarget.matches("[data-expand]")) {
    const currentItem = clickTarget.parentElement.parentElement
    const currentForm = currentItem.parentElement
    const expandFormList = [...currentForm.parentElement.children]
 
    expandFormList.forEach(form => {
      if (form !== currentForm) {
        form.classList.remove("open")
      }
    })
    
    if (currentForm.classList.contains("open")) {
      currentForm.classList.remove("open")
    } else {
      currentForm.classList.add("open")
    }
    
  }

  // Creating Unfoldable magic petals

  const unfoldForm = [...document.querySelectorAll("[unfold-form]")][0]
  
  if(clickTarget.matches("[data-unfold]") || clickTarget.matches("[unfold-form]")) {
    unfoldForm.classList.add("open")
  } else {
    unfoldForm.classList.remove("open")
  }

  // Magic To Roll press => Roll in Sheet and send Roll to Discord

  if (clickTarget.parentElement.classList.contains("magicPoints") || clickTarget.parentElement.classList.contains("magicDesc")) {

    const displayRoll = [...document.getElementsByClassName("rollerDisplay")][0]

    const displayMessage = [...document.getElementsByClassName("extraInfoDisplay")][0]
    displayMessage.classList.add("show")

    let generatedMessage = ""

    let coreDice = document.getElementById("coreBonus").value

    if (coreDice == "") {
      coreDice = 0
    }

    let magicDice = document.getElementById("magicCoreBonus").value

    if (magicDice == "") {
      magicDice = 0
    }

    let currentMagicDice = 0

    if (clickTarget.parentElement.classList.contains("magicCorePoints") || clickTarget.parentElement.parentElement.classList.contains("magicCorePoints") || clickTarget.parentElement.parentElement.parentElement.classList.contains("magicCorePoints")) {
      currentMagicDice = 0
      generatedMessage = "Magic Roll: "
    } else {
      currentMagicDice = clickTarget.parentElement.parentElement.getElementsByClassName("magicBonus")[0].children[0].value
      generatedMessage = clickTarget.parentElement.parentElement.getElementsByClassName("magicBonus")[0].children[0].id.slice(0,-5).replace(/^\w/, (c) => c.toUpperCase()) + " Magic Roll: "
    }

    if (currentMagicDice == "") {
      currentMagicDice = 0
    }

    let magicDifficulty = clickTarget.parentElement.parentElement.parentElement.parentElement.parentElement.classList[1]

    displayMessage.children[0].innerHTML = generatedMessage

    const diceRoll = rollDice(coreDice, magicDice, currentMagicDice, 0)
    displayRoll.children[0].innerHTML = diceRoll

    const webhookMessage = { "content": generatedMessage + "[" + diceRoll + "||/" + magicDifficulty.slice(5) + "||]" }
    fetch(webhookMessageURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)
    webhookMessage.username = " - "


  }

  // Attribute Name press => Roll in Sheet and send Roll to Discord

  if (clickTarget.classList.contains("attrName") || clickTarget.parentElement.classList.contains("attrName")) {

    const displayRoll = [...document.getElementsByClassName("rollerDisplay")][0]

    const displayMessage = [...document.getElementsByClassName("extraInfoDisplay")][0]
    displayMessage.classList.add("show")

    let generatedMessage = ""

    let coreDice = document.getElementById("coreBonus").value

    if (coreDice == "") {
      coreDice = 0
    }

    let attrDice = [...clickTarget.parentElement.getElementsByClassName("attrBonus")][0].children[0].value

    if (attrDice == "") {
      attrDice = 0
    }

    if (clickTarget.classList.contains("attrName")) {
      generatedMessage = clickTarget.children[0].innerHTML + " Roll: "
    } else {
      generatedMessage = clickTarget.innerHTML + " Roll: "
    }

    displayMessage.children[0].innerHTML = generatedMessage

    const diceRoll = rollDice(coreDice, attrDice, 0, 0)
    displayRoll.children[0].innerHTML = diceRoll

    const webhookMessage = { "content": generatedMessage + "[" + diceRoll + "]" }
    fetch(webhookMessageURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)
    webhookMessage.username = " - "

  }

  // Skill Name press => Roll in Sheet and send Roll to Discord
  
  if (clickTarget.classList.contains("skillName") || clickTarget.parentElement.classList.contains("skillName")) {

    const displayRoll = [...document.getElementsByClassName("rollerDisplay")][0]

    const displayMessage = [...document.getElementsByClassName("extraInfoDisplay")][0]
    displayMessage.classList.add("show")

    let generatedMessage = ""

    let coreDice = document.getElementById("coreBonus").value

    if (coreDice == "") {
      coreDice = 0
    }

    let attrDice = clickTarget.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("attrBonus")[0].children[0].value

    if (attrDice == "") {
      attrDice = 0
    } 

    let skillDice = clickTarget.parentElement.parentElement.parentElement.getElementsByClassName("skillBonus")[0].children[0].value

    if (skillDice == "") {
      skillDice = 0
    } 

    let skillMastery = clickTarget.parentElement.parentElement.parentElement.getElementsByClassName("skillMastery")[0].children[0].value.slice(1)

    if (skillMastery == "") {
      skillMastery = 0
    } 

    let skillFlat = clickTarget.parentElement.parentElement.parentElement.getElementsByClassName("skillFlat")[0].children[0].value.slice(1)

    if (skillFlat == "") {
      skillFlat = 0
    } 

    let skillBonus = parseInt(skillFlat) + parseInt(skillMastery)

    if (clickTarget.classList.contains("skillName")) {
      generatedMessage = clickTarget.children[0].innerHTML + " Roll: "
    } else {
      generatedMessage = clickTarget.innerHTML + " Roll: "
    }

    displayMessage.children[0].innerHTML = generatedMessage

    const diceRoll = rollDice(coreDice, attrDice, skillDice, skillBonus)
    displayRoll.children[0].innerHTML = diceRoll   

    const webhookMessage = { "content": generatedMessage + "[" + diceRoll + "]" }
    fetch(webhookMessageURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)
    webhookMessage.username = " - " 

  }


})

// Creating a button to send link directly to Discord

const webhookMessageURL = "https://discord.com/api/webhooks/760935288306139148/65rOm6Yns8SKFaFo7zHVTcJEV5mtmWSkAXl7UoLJ9eS8s1jaT79VFpY65HEGqMkZmqD_"
const webhookLogURL = "https://discord.com/api/webhooks/988323569924706334/LyH9QJ0BMjtl5zeguIDJiZR9i8XcdLi0bmc5H5IEiqJZPXojxvu2AV5n-HXn8XDvnsZx"

function sendMessage() {
  let currentMessage = [...document.querySelectorAll("[data-message]")][0]
  console.log(currentMessage.value)
  const webhookMessage = { "content": currentMessage.value }
  webhookMessage.username = " - "
  
  fetch(webhookMessageURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)

  currentMessage.value = ""
}

// Creating a rolling function

function rollDice(num1,num2,num3,bonus) {
  let firstDiceRoll = 0
  let secondDiceRoll = 0
  let thirdDiceRoll = 0  
  let diceRollTotal = 0

  for (let i = 0; i < num1; i++) {
    if (parseInt(Math.random()*(7)) > 3) {
        firstDiceRoll++
    }
  }

  for (let i = 0; i < num2; i++) {
    if (parseInt(Math.random()*(7)) > 3) {
        secondDiceRoll++
    }
  }

  for (let i = 0; i < num3; i++) {
    if (parseInt(Math.random()*(7)) > 3) {
        thirdDiceRoll++
    }
  }

  diceRollTotal = firstDiceRoll + secondDiceRoll + thirdDiceRoll + parseInt(bonus)
  
  const webhookMessage = { "content": num1 + "d6 rolls: [" + firstDiceRoll + "]; " + num2 + "d6 rolls: [" + secondDiceRoll + "]; " + num3+ "d6 rolls: [" + thirdDiceRoll + "]; Bonus was: [" + bonus + "]; Total: [" + diceRollTotal + "]" }
  fetch(webhookLogURL + "?wait=true", {"method":"POST", "headers": {"content-type": "application/json"}, "body": JSON.stringify(webhookMessage)}) .then(a=>a.json()).then(console.log)

  return diceRollTotal
}

function resetMessage() {
  const displayMessage = [...document.getElementsByClassName("extraInfoDisplay")][0]
  console.log(displayMessage.children[0])
  displayMessage.children[0].innerHTML = "   "
  displayMessage.classList.remove("show")
}