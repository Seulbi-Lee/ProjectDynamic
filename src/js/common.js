document.addEventListener('DOMContentLoaded', ()=>{
  init()

  function init(){
    fetchwWeather()
  }
})

// click event to change data
const btnChangeCity = document.getElementById('btnChangeCity')
const inpChangeCity = document.getElementById('inputCity')

btnChangeCity.addEventListener('click', ()=>{
  fetchwWeather()
})

inpChangeCity.addEventListener('keypress', (e)=>{
  if(e.key === 'Enter'){
    e.preventDefault()
    fetchwWeather()
  }
})

// fetch API
function fetchwWeather(){
  let inputCity = inpChangeCity.value 

  fetch('https://api.openweathermap.org/data/2.5/weather?q='+inputCity+'&appid=c9883ac1e6d5058ed137ef784889cf83',
  {
    method: 'get',
  })
  .then((response) => response.json())
  .then((data) =>{
    displayWeather(data)
    fetchForecast(data.id)
    inpChangeCity.value = ''
  })
  .catch((error) => {
    alert(error)
  })
}

function fetchForecast(cityId){
  fetch('https://api.openweathermap.org/data/2.5/forecast?id='+cityId+'&appid=c9883ac1e6d5058ed137ef784889cf83',
  {
    method: 'get',
  })
  .then((response) => response.json())
  .then((data) =>{
    displayForecast(data)
  })
  .catch(error => {
    alert(error)
  })
}


// calculating local time
const createNewDate = function(data, i){
  const weekList = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const monthList = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  
  let newDate = new Date()
  let localTime = newDate.getTime()
  let localOffset = newDate.getTimezoneOffset() * 60000
  let utc = localTime + localOffset
  let atlanta = utc + (1000 * data.timezone)
  let setDate = new Date(atlanta)
  let cityDate = new Date(setDate.setDate(setDate.getDate() + i))   // get date, today : + 0 
  let getHours = cityDate.getHours() < 13 ? `${cityDate.getHours()}` : `${cityDate.getHours() - 12}`
  let ampm = cityDate.getHours() < 12 ? 'am' : 'pm'
  let today = weekList[cityDate.getDay()]+', '+monthList[cityDate.getMonth()]+' '+cityDate.getDate()+' '+getHours+':'+cityDate.getMinutes()+ampm

  return today
}


// weather
const displayWeather = function(data) {
  // ganeral
  const weatherMain = document.getElementById('weatherMain')

  let dataName = data.name
  let dataCountry = data.sys.country
  let dataMain = data.weather[0].main
  let dataIcon = data.weather[0].icon
  let dataDesc = data.weather[0].description

  weatherMain.innerHTML = `
  <div class="location text-xl">
    <span class="city" id="city">${dataName}</span>
    <span class="country" id="country">${dataCountry}</span>
  </div>
  <div class="mt-1" id="date">${createNewDate(data, 0)}</div>
  <div class="mt-3" id="icon"><img class="inline-block" src="https://openweathermap.org/img/wn/${dataIcon}@2x.png" alt="${dataDesc}"/></div>
  <div class="main" id="main">${dataMain}</div>
  `

  // changing background
  const bg = document.getElementById('background')

  if(dataIcon.indexOf('n') === 2){
    bg.classList.remove('day')
    bg.classList.add('night')
    bg.innerHTML=`
    <span class="sr-only">night</span>
    `
  }else if(dataIcon.indexOf('d') === 2){
    bg.classList.remove('night')
    bg.classList.add('day')
    bg.innerHTML=`
    <span class="sr-only">day</span>
    `
  }

  // temperature data
  const weatherTemp = document.getElementById('weatherTemp')
  
  let dataTemp = Math.round(data.main.temp - 273.15)
  let dataMinTemp = Math.round(data.main.temp_min - 273.15)
  let dataMaxTemp = Math.round(data.main.temp_max - 273.15)

  weatherTemp.innerHTML = `
  <div class="flex justify-center mt-7">
    <span class="text-7xl" id="temp">${dataTemp}°C</span>
  </div>
  <div class="temp-sub mt-2">
    <span id="tempMin" class="text-lg color-blue">${dataMinTemp}</span>
    <span id="tempMax" class="text-lg color-red slash">${dataMaxTemp}</span>
  </div>
  `

  // change temperature mode C/F
  const btnChgTemp = document.querySelector('.btn-change-temp')
  const btnTempC = document.getElementById('btnTempC')
  const btnTempF = document.getElementById('btnTempF')

  const elTemp = document.getElementById('temp')
  const elTempMin = document.getElementById('tempMin')
  const elTempMax = document.getElementById('tempMax')

  let btnDaysTempC = document.getElementById('btnDaysTempC')
  let btnDaysTempF = document.getElementById('btnDaysTempF')

  btnTempF.classList.remove('active')
  btnTempC.classList.add('active')
  btnChgTemp.classList.remove('right')

  btnTempC.addEventListener('click', function(){
    btnDaysTempC.click()
    // Celsius
    btnTempF.classList.remove('active')
    btnTempC.classList.add('active')
    btnChgTemp.classList.remove('right')

    elTemp.innerHTML = `${dataTemp}°C`
    elTempMin.innerHTML = dataMinTemp
    elTempMax.innerHTML = dataMaxTemp
  })
  btnTempF.addEventListener('click', function(){
    btnDaysTempF.click()
    // Fahrenheit
    btnTempC.classList.remove('active')
    btnTempF.classList.add('active')
    btnChgTemp.classList.add('right')

    elTemp.innerHTML = `${Math.round((dataTemp * 9/5) + 32)}°F`
    elTempMin.innerHTML = Math.round((dataMinTemp * 9/5) + 32)
    elTempMax.innerHTML = Math.round((dataMaxTemp * 9/5) + 32)
  })

  // clothes per weather
  const clothes = document.getElementById('clothes')

  if(dataTemp >= 28){
    clothes.innerHTML = `
    <p class="text-sm img-clothes temp-28">Sleeveless, short sleeves, shorts</p>
    `
  }else if(dataTemp < 28 && dataTemp >= 23){
    clothes.innerHTML = `
    <p class="text-sm img-clothes temp-23">Short sleeves, thin shirt, shorts, cotton pants</p>
    `
  }else if(dataTemp < 23 && dataTemp >= 20){
    clothes.innerHTML = `
    <p class="text-sm img-clothes temp-20">Short sleeves, thin cardigan, cotton pants, jeans</p>
    `
  }else if(dataTemp < 20 && dataTemp >= 17){
    clothes.innerHTML = `
    <p class="text-sm img-clothes temp-17">Thin knit, thin jacket, cardigan, sweatshirt, cotton pants, jeans</p>
    `
  }else if(dataTemp < 17 && dataTemp >= 12){
    clothes.innerHTML = `
    <p class="text-sm img-clothes temp-12">Thin jacket, cardigan, sweatshirt, knit, stockings</p>
    `
  }else if(dataTemp < 12 && dataTemp >= 10){
    clothes.innerHTML = `
    <p class="text-sm img-clothes temp-10">Jacket, trench coat, knit, cotton pants, jeans, stockings</p>
    `
  }else if(dataTemp < 10 && dataTemp >= 6){
    clothes.innerHTML = `
    <p class="text-sm img-clothes temp-6">Coat, leather jacket, knit, scarf, thick pants</p>
    `
  }else if(dataTemp < 6){
    clothes.innerHTML = `
    <p class="text-sm img-clothes temp-low">Padding, thick coats, scarves, brushed products</p>
    `
  }
}


// forecast
const displayForecast = function(data) {
  const forecastList = document.getElementById('forecastList')
  forecastList.innerHTML =''   // reset data
  let count = 0                // for creating date

  // calculating total length of graph
  let graphStart = Math.floor(data.list[0].main.temp - 273.15)
  let graphEnd = Math.ceil(data.list[0].main.temp - 273.15)

  for(let i = 0; i < data.list.length; i++){
    graphStart = Math.min(graphStart, Math.floor(data.list[i].main.temp - 273.15))
    graphEnd = Math.max(graphEnd, Math.ceil(data.list[i].main.temp - 273.15))
  }
  let graphLength = graphEnd - graphStart
 
  // getting date data
  for(let i = 0; i < data.list.length; i++){

    if(i % 8 === 0){
      count++  
      // create array per days temperature
      let temps = []
      let daysTemp = 0;

      for(let j = 0; j < 8; j++){
        let dataTemp = Math.round(data.list[i+j].main.temp - 273.15)
        // calculate average temperature
        let addTemp = daysTemp + dataTemp
        daysTemp = addTemp
        temps.push(dataTemp)
      }
    
      // icon
      let dataIcon = data.list[i+4].weather[0].icon.substring(0,2)  // icon settings are always daytimne
      let dataDesc = data.list[i+4].weather[0].description
      
      // temperature
      let daysAveTemp = Math.round(daysTemp/8)
      let daysMinTemp = Math.min(...temps)
      let daysMaxTemp = Math.max(...temps)
      let graphLeft = ((daysMinTemp - Math.abs(graphStart)) / graphLength * 100)
      let graphWidth = ((daysMaxTemp - Math.abs(graphStart)) / graphLength * 100)
      // minus degree
      if(graphStart < 0){
        graphLeft = ((daysMinTemp + Math.abs(graphStart)) / graphLength * 100)
        graphWidth = ((daysMaxTemp + Math.abs(graphStart)) / graphLength * 100)
      }

      // setting graph color
      let startColor = '#05ebff'
      let endColor = '#05ebff'

      if(daysMinTemp < -5){
        startColor = '#00baff'
      }else if(daysMinTemp < 8){
        startColor = '#05ebff'
      }else if(daysMinTemp < 18){
        startColor = '#b3ef6f'
      }else if(daysMinTemp < 28){
        startColor = '#f1ce44'
      }else if(daysMinTemp < 38){
        startColor = '#eb7923'
      }else if(daysMinTemp >= 38){
        startColor = '#db4500'
      }

      if(daysMaxTemp < 8){
        endColor = '#05ebff'
      }else if(daysMaxTemp < 18){
        endColor = '#b3ef6f'
      }else if(daysMaxTemp < 28){
        endColor = '#f1ce44'
      }else if(daysMaxTemp < 38){
        endColor = '#eb7923'
      }else if(daysMaxTemp >= 38){
        endColor = '#db4500'
      }

      // date
      let newDates = createNewDate(data.city, count)
      let newDay = newDates.substring(0,3)
      let newDate = newDates.substring(5,11)
  
      // create elements
      let forecastItem = document.createElement('li') 
      forecastList.appendChild(forecastItem)

      appendItems(daysAveTemp, daysMinTemp, daysMaxTemp)

      function appendItems (temp, minTemp, maxTemp){
        forecastItem.innerHTML = `
        <div class="forecast-item flex items-center">
          <div class="days-forcast">
            <p class="text-center text-lg">${newDay}</p>
            <p class="text-center text-sm">${newDate}</p>
          </div>
          <div class="days-icon">
            <img src="https://openweathermap.org/img/wn/${dataIcon}d@2x.png" alt="${dataDesc}"/>
          </div>
          <div class="days-temp">${temp}</div>
          <div class="days-graph">
            <span class="graph-bg" style="left:${graphLeft}%; width:${graphWidth-graphLeft}%; background-image: linear-gradient(to right, ${startColor}, ${endColor})"></span>
            <span class="days-temp-min color-blue text-xs" style="left:${graphLeft}%;">${minTemp}</span>
            <span class="days-temp-max color-red text-xs" style="left:${graphWidth}%;">${maxTemp}</span>
          </div>
        </div>
        `
      }

      // change temperature mode
      let btnDaysTempC = document.getElementById('btnDaysTempC')
      let btnDaysTempF = document.getElementById('btnDaysTempF')

      btnDaysTempC.addEventListener('click', function(){
        appendItems(daysAveTemp, daysMinTemp, daysMaxTemp)
      })
      btnDaysTempF.addEventListener('click', function(){
        let daysAveTempF = Math.round((daysAveTemp * 9/5) + 32)
        let daysMinTempF = Math.round((daysMinTemp * 9/5) + 32)
        let daysMaxTempF = Math.round((daysMaxTemp * 9/5) + 32)
        appendItems(daysAveTempF, daysMinTempF, daysMaxTempF)
      })
      
    }
  }
}
