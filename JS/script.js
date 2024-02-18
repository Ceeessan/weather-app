const form = document.querySelector('form');
const divWithInfoOnCity = document.querySelector('#container');
const errorMessageH1 = document.querySelector('#errorMessage');
const inputCity = document.querySelector('#city');
const inputHour = document.querySelector('#hour');
const weatherWithHoursDiv = document.querySelector('#weatherWithHours');
const firstIconToShowImg = document.querySelector('#firstIconToShow');

//Dessa variablar är deklarerade utan värde och ligger utanför funktionerna eftersom jag kommer att använda dem i flera av mina funtioner.
let inputValueForCityName;
let inputValueOfHour;
let lat;
let lon;


form.addEventListener('submit', searchCity);


function searchCity(event) {
    event.preventDefault();

    errorMessageH1.innerText = '';
    divWithInfoOnCity.innerText = '';
    weatherWithHoursDiv.innerText = '';


    inputValueForCityName = inputCity.value;
    inputValueOfHour = inputHour.value;

    if (inputCity.value !== '' && inputValueOfHour !== '') {
        divWithInfoOnCity.style.border = "2px solid rgba(65, 95, 132, 0.8)";
        divWithInfoOnCity.style.borderRadius = "4px";
        divWithInfoOnCity.style.boxShadow = "5px 2px 10px rgba(65, 95, 132, 0.8)";
    }

    const infoOnCityWeatherUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${inputValueForCityName}&appid=6a438382df5439f99640edd7dc723eb6`;


    fetch(infoOnCityWeatherUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw "Something went wrong, please try again.";
            }
        })
        .then(displayWeatherInfoForCity)
        .catch(handleError);

}

//I funktionen ovanför, 'searchCity, så hämtas url:en för stadens namn och här nedanför binder vi samman detta med longitud och latitud så att man ska kunna hitta stadens koordinater, därav kunna hitta rätt stad till rätt plats.
function displayWeatherInfoForCity(whatCityWithLatAndLon) {

    //Om man skriver ett ogiltligt namn så kommer detta att visas med h1-rubrik på sidan.
    if (whatCityWithLatAndLon.length === 0) {
        errorMessageH1.innerText = "This is not a city!"
        firstIconToShowImg.src = '';
    }
    else {
        lat = whatCityWithLatAndLon[0].lat;
        lon = whatCityWithLatAndLon[0].lon;

        const latAndLonUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=6a438382df5439f99640edd7dc723eb6&units=metric`;


        fetch(latAndLonUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw "Something went wrong, please try again.";
                }
            })
            .then(displayWeatherInfo)
            .catch(handleError);



        const cityName = document.createElement('h2');
        const latAndLonPara = document.createElement('p');

        cityName.innerText = whatCityWithLatAndLon[0].name;
        latAndLonPara.innerText = `Lat: ${Math.round(whatCityWithLatAndLon[0].lat)} Lon: ${Math.round(whatCityWithLatAndLon[0].lon)}`;

        divWithInfoOnCity.append(cityName, latAndLonPara);
    }
}


//Med hjälp av lat och lon kan vi nu få fram väder, vind m.m. som lägga på sidan som finns i denna funktion.
function displayWeatherInfo(cityWeatherInfo) {
    const weatherInfo = document.createElement('p');
    const windInfo = document.createElement('p');
    const tempInfo = document.createElement('p');


    const weatherIcon = `https://openweathermap.org/img/wn/${cityWeatherInfo.weather[0].icon}@2x.png`;


    weatherInfo.innerText = cityWeatherInfo.weather[0].description;
    windInfo.innerText = `${cityWeatherInfo.wind.speed} m/s`;
    firstIconToShowImg.src = weatherIcon;
    tempInfo.innerText = ` The degree is: ${Math.round(cityWeatherInfo.main.temp)}C`;

    if (cityWeatherInfo.main.temp >= 20) {

        tempInfo.style.color = 'red';
    }
    else if (cityWeatherInfo.main.temp < 20 && cityWeatherInfo.main.temp >= 12) {
        tempInfo.style.color = 'green';
    }
    else {
        tempInfo.style.color = 'blue';
    }


    divWithInfoOnCity.append(weatherInfo, windInfo, tempInfo);

    // Nummer-inputen ska också ha en funktion för att kunna välja 3h-intervall. Så när du lägger till ett av nummerna som visas, kommer vi att se detta på sidan. 3h visar en ikon och grader, 6h visar 2 ikoner o.s.v.
    const chooseHourUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=6a438382df5439f99640edd7dc723eb6`;



    fetch(chooseHourUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw "Something went wrong, please try again.";
            }
        })
        .then((hoursAndIcons) => {


            for (let i = 0; i < inputValueOfHour; i++) {


                const hoursWeatherIcons = `https://openweathermap.org/img/wn/${hoursAndIcons.list[i].weather[0].icon}@2x.png`;

                const weatherFromHoursP = document.createElement('p');
                const weatherFromHoursIcon = document.createElement('img');


                weatherFromHoursP.innerText = `${hoursAndIcons.list[i].dt_txt} 
                ${Math.round(hoursAndIcons.list[i].main.temp)}C `;
                weatherFromHoursIcon.src = `${hoursWeatherIcons}`;


                weatherWithHoursDiv.append(weatherFromHoursP, weatherFromHoursIcon)

            }

        })
        .catch(handleError);

    form.reset();
}


function handleError(error) {

    errorMessageH1.innerText = "Something went wrong, please try again.", error;

    weatherWithHoursDiv.innerText = '';
    firstIconToShowImg.src = '';

}

