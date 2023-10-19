document.addEventListener('DOMContentLoaded', ()=>{
  init()

  function init(){
    fetchwWeather()
  }
})

// click event to change data
const btnChangeCity = document.querySelector('.btn-change-city')

btnChangeCity.addEventListener('click', ()=>{
  fetchwWeather()
})


function fetchwWeather(){
  let inputCity = document.getElementById('inputCity').value
    
  fetch('https://api.openweathermap.org/data/2.5/weather?q='+inputCity+'&appid=c9883ac1e6d5058ed137ef784889cf83',
  {
    method: 'get',
  })
  .then((response) => response.json())
  .then((data) =>{
    displayWeather(data)
    fetchForecast(data.id)
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
    console.log(data)
  })
  .catch(error => {
    alert(error)
  })
}

function displayWeather(data) {
  // getting elements
  const city = document.getElementById('city')
  const country = document.getElementById('country')
  const main = document.getElementById('main')
  const icon = document.getElementById('icon')
  const date = document.getElementById('date')
  const bg = document.getElementById('background')

  // getting data
  let dataName = data.name
  let dataCountry = data.sys.country
  let dataMain = data.weather[0].main
  let dataIcon = data.weather[0].icon
  let dataDesc = data.weather[0].description

  // setting values
  city.innerHTML = dataName
  country.innerHTML = dataCountry
  main.innerHTML = dataMain
  icon.innerHTML = `<img class="inline-block" src="https://openweathermap.org/img/wn/${dataIcon}@2x.png" alt="${dataDesc}"/>`
  date.innerHTML = createNewDate(data)

  // changing background
  if(dataIcon.indexOf('n') === 2){
    bg.classList.remove('day')
    bg.classList.add('night')
  }else if(dataIcon.indexOf('d') === 2){
    bg.classList.remove('night')
    bg.classList.add('day')
  }

  // temperature data
  const temp = document.getElementById('temp')
  const tempMin = document.getElementById('tempMin')
  const tempMax = document.getElementById('tempMax')
  const btnTempC = document.getElementById('btnTempC')
  const btnTempF = document.getElementById('btnTempF')
  
  let dataTemp = Math.round(data.main.temp - 273.15)
  let dataMinTemp = Math.round(data.main.temp_min - 273.15)
  let dataMaxTemp = Math.round(data.main.temp_max - 273.15)

  temp.innerHTML = dataTemp 
  tempMin.innerHTML = `L : ${dataMinTemp}°C`
  tempMax.innerHTML = `H : ${dataMaxTemp}°C`

  btnTempC.classList.remove('op-5')
  btnTempF.classList.add('op-5')

  // change temperature data
  btnTempC.addEventListener('click', ()=>{
    btnTempC.classList.remove('op-5')
    btnTempF.classList.add('op-5')
    // Celsius
    temp.innerHTML = dataTemp
    tempMin.innerHTML = `L : ${dataMinTemp}°C`
    tempMax.innerHTML = `H : ${dataMaxTemp}°C`
  })
  btnTempF.addEventListener('click', ()=>{
    btnTempF.classList.remove('op-5')
    btnTempC.classList.add('op-5')
    //Fahrenheit
    temp.innerHTML = Math.round((dataTemp * 9/5) + 32)
    tempMin.innerHTML = `L : ${Math.round((dataMinTemp * 9/5) + 32)}°F`
    tempMax.innerHTML = `H : ${Math.round((dataMaxTemp * 9/5) + 32)}°F`
  })

  // clothes per weather
  const clothes = document.getElementById('cloths')

  if(dataTemp >= 28){
    clothes.innerHTML = `Sleeveless, short sleeves, shorts`
  }else if(dataTemp < 28 && dataTemp >= 23){
    clothes.innerHTML = `Short sleeves, thin shirt, shorts, cotton pants`
  }else if(dataTemp < 23 && dataTemp >= 20){
    clothes.innerHTML = `Short sleeves, thin cardigan, cotton pants, jeans`
  }else if(dataTemp < 20 && dataTemp >= 17){
    clothes.innerHTML = `Thin knit, thin jacket, cardigan, sweatshirt, cotton pants, jeans`
  }else if(dataTemp < 17 && dataTemp >= 12){
    clothes.innerHTML = `Thin jacket, cardigan, sweatshirt, knit, stockings`
  }else if(dataTemp < 12 && dataTemp >= 10){
    clothes.innerHTML = `Jacket, trench coat, knit, cotton pants, jeans, stockings`
  }else if(dataTemp < 10 && dataTemp >= 6){
    clothes.innerHTML = `Coat, leather jacket, knit, scarf, thick pants`
  }else if(dataTemp < 6){
    clothes.innerHTML = `Padding, thick coats, scarves, brushed products`
  }
}

function displayForecast(data) {
  let newDate = createNewDate(data.city)
  console.log(newDate)
}

// calculating local time
function createNewDate(data){
  const weekList = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const monthList = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  let newDate = new Date()
  let localTime = newDate.getTime()
  let localOffset = newDate.getTimezoneOffset() * 60000
  let utc = localTime + localOffset
  let atlanta = utc + (1000 * data.timezone)
  let cityDate = new Date(atlanta)
  let getHours = cityDate.getHours() < 13 ? `${cityDate.getHours()}` : `${cityDate.getHours() - 12}`
  let ampm = cityDate.getHours() < 12 ? 'am' : 'pm'
  let today = weekList[cityDate.getDay()]+', '+monthList[cityDate.getMonth()]+' '+cityDate.getDate()+' '+getHours+':'+cityDate.getMinutes()+ampm
  return today
}

