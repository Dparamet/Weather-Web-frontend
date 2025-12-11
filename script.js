const backgrounds = [
    '/img/background_img.png',  
    '/img/background_img1.png',             
    '/img/background_img2.png',                         
];
let currentBgIndex = 0; 

function changeBackground() {
    
    currentBgIndex++;
    
    
    if (currentBgIndex >= backgrounds.length) {
        currentBgIndex = 0;
    }

    
    document.body.style.backgroundImage = `url('${backgrounds[currentBgIndex]}')`;
}

setInterval(changeBackground, 5000);

async function fetchWeather() {
    const apiKey = "384bb1576e887f69badc9d2ff88100d0";
    
    // 1. ดึง "ข้อความ" (.value) จาก ID "cityInput" (ให้ตรงกับ HTML)
    const searchInput = document.getElementById("cityInput");
    const search = searchInput.value; 
    
    const weatherDataSection = document.getElementById("weather-Show"); // ตรวจดูว่าใน HTML ID นี้ตัว S ใหญ่หรือเล็กนะครับ

    // 2. ย้ายการเช็คค่าว่าง มาไว้บนสุด! (ก่อนจะไปเรียก API)
    if (search == "") {
        weatherDataSection.style.display = "block";
        weatherDataSection.innerHTML = `<div><h3>Empty Input!</h3><p>Please Type a City Name!</p></div>`;
        return; // จบการทำงานทันที
    }

    // 3. เริ่มเรียก API
    const geocodeData = await getLonAndLat();

    // 4. เช็คก่อนว่าได้พิกัดมาจริงไหม (ถ้าหาไม่เจอ geocodeData จะเป็น undefined)
    if (geocodeData) {
        getWeatherData(geocodeData.lon, geocodeData.lat);
    }

    // --- ฟังก์ชันย่อย ---

    async function getLonAndLat() {
        
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${search.replace(" ", "%20")}&limit=1&appid=${apiKey}`;
        
        const response = await fetch(geocodeURL);
        
        if (!response.ok) {
            console.log("Bad response!! ", response.status);
            return;
        }
        
        const data = await response.json();
        
        if (data.length == 0) {
            console.log("Something went wrong here!");
            weatherDataSection.style.display = "block";
            // 5. แก้ innerHtml เป็น innerHTML (L ตัวใหญ่)
            weatherDataSection.innerHTML = `<div><h3>Invalid Input</h3><p>Could not find "${search}". Please Try Again!</p></div>`;
            return;
        } else {
            return data[0];
        }
    }

    async function getWeatherData(lon, lat) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(weatherURL);
        
        if (!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }
        
        const data = await response.json();
        
        weatherDataSection.style.display = "block";
        weatherDataSection.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}" width="100" />
            <div>
                <h2>${data.name}</h2>
                <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
                <p><strong>Weather:</strong> ${data.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
            </div>
        `;
    }
}