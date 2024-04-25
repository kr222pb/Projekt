function init() {
    fetchSMAPI()
}

window.addEventListener("load", init)

async function fetchSMAPI() {
    //URLer
    let aktivitet = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=activity&method=getall&descriptions=Temapark,Nöjespark,Älgpark,Djurpark,Simhall,Gokart,Zipline,Nöjescenter,Klippklättring,Paintballcenter, Hälsocenter,Golfbana,Bowlinghall,Nattklubb"

    let mat = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=food&method=getall&descriptions=Restaurang,Pizzeria,Gatukök,Bistro,Cafe"

    let attraction = "https://smapi.lnu.se/api/?api_key=61fTJHBb&controller=attraction&method=getall&descriptions=Museum,Slott,Konstgalleri,Ateljé,Glasbruk,Konsthall,Sevärdhet,Fornlämning,Hembygdspark,Naturreservat"
    // Hämta data från SMAPI
    let response = await fetch(attraction)

    // Kontrollera om begäran var framgångsrik
    if (response.ok) {
        console.log("Banan")
        // Konvertera den hämtade JSON-datamängden till ett JavaScript-objekt
        let data = await response.json()
        // Skicka den konverterade datan till funktionen readSMAPI
        readSMAPI(data)
    }
    else {
        // Hantera fel om begäran inte var framgångsrik
        console.log("Fel vid hämtning:", response.status)
    }

}

function readSMAPI(data) {
    let HTMLCode = ""
    // Iterera över datan och logga namnet på varje objekt
    for (let x = 0; x < data.payload.length; x++) {
        let obj = data.payload[x]
        console.log(obj.description)

        HTMLCode = "<h2>"+obj.name+"</h2>"
       // HTMLCode += "<h2>"+obj.description+"</h2>"
          let h2 = document.querySelector(".container h2")
    h2.innerHTML = HTMLCode
    }
  
}
