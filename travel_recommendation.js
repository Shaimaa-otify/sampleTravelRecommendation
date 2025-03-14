const resultDiv = document.getElementById('result');
document.getElementById("searchbtn").addEventListener("click", getData);
document.getElementById("clearbtn").addEventListener("click", clear);


const countryToTimeZone = {
    "USA": "America/New_York",
    "UK": "Europe/London",
    "India": "Asia/Kolkata",
    "France": "Europe/Paris",
    "Egypt": "Africa/Cairo",
    "Australia": "Australia/Sydney", 
    "Japan": "Asia/Tokyo",
    "Brazil": "America/Sao_Paulo",  
    "French Polynesia": "Pacific/Tahiti",
    "Cambodia": "Asia/Phnom_Penh"
};



function getData(){
    clear();
    fetch("travel_recommendation_api.json")
        .then(response => {
            if(!response.ok){ //manual error handling
                throw new Error(`http error status: ${response.status}`)
            }
            return response.json() //Must manually parse json
        })
        .then(data => {
            let results=[]
            const input = document.getElementById('searchbar').value.toLowerCase();
            const inputRegex = new RegExp(`\\b${input.replace(/es$/, '').replace(/s$/, '')}\\w*\\b`, "i");
            // Check if the search term directly matches a key
            if (inputRegex.test("temples")) {
                results.push(...data.temples); // If "temple" is searched, include all temples
            }
            if (inputRegex.test("beaches")) {
                results.push(...data.beaches); // If "beach" is searched, include all beaches
            }
            if (inputRegex.test("countries")) {
                results.push(...data.countries.flatMap(country => country.cities)); // Include all cities
            }
            
            let countryResults = data.countries.flatMap(country => 
                country.cities.filter(city => 
                    inputRegex.test(city.name) || 
                    inputRegex.test(city.description)
                )
            );
            //console.log("countryResults", countryResults)
            
            // Search in temples
            let templeResults = data.temples.filter(temple =>
                inputRegex.test(temple.name) || 
                inputRegex.test(temple.description) 
                
            );
            //console.log("templeResults", templeResults)
            // Search in beaches
            let beachResults = data.beaches.filter(beach => 
                inputRegex.test(beach.name) || 
                inputRegex.test(beach.description)
                
            );
            //console.log("beachResults", beachResults)
            //console.log("results", results)          
            results = [...results, ...countryResults, ...templeResults, ...beachResults];
            const finalResults = [...new Set(results)];      
            //console.log(finalResults.length)   
           
           
            if(finalResults.length>0){
                for(let i=0; i<finalResults.length; i++){
                    resultDiv.style.backgroundColor= "white";
                    resultDiv.innerHTML += `<img src="${finalResults[i].imageUrl}" alt="hjh">`;
                    resultDiv.innerHTML += `<h4> ${finalResults[i].name}</h4>`;
                    resultDiv.innerHTML += `<p> ${finalResults[i].description}</p>`;
                                        
                    let index = finalResults[i].name.indexOf(",");
                    if (index !== -1) {
                        let country= finalResults[i].name.substring(index+1).trim();
                        let timeZone = countryToTimeZone[country]; // Get the valid time zone

                        if (timeZone) {
                            let options = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
                            let countryTime = new Date().toLocaleTimeString('en-US', options);
                            resultDiv.innerHTML += `<p><strong>Current Time in ${country} is: </strong>${countryTime}</p>`;
                        }         
                  
                     
                    } 
            
                } 
            }   else {
                resultDiv.innerHTML = 'Condition not found.';
            }
        
            
        })
            
        
        .catch(error => console.log(`there was an ${error}`))

}

    

function clear(){
    resultDiv.innerHTML="";
    resultDiv.style.backgroundColor = "";
}    
    

