window.addEventListener("DOMContentLoaded", () => {

    let pokeApiUrl = "http://localhost:3000/pokemon" //localhost:3000/pokemon-json
                                                        //localhost:3000/pokemon-json/1

    // Show starters Charmander, Bulbasaur, Squirtle//

    function showStarters() {
        // console.log(pokeApiUrl + "/4")
        let charmanderUrl = pokeApiUrl + "/4"
        let bulbasaurUrl = pokeApiUrl + "/1"
        let squirtleUrl  = pokeApiUrl + "/7"

        appendPokemonToList(charmanderUrl)
        appendPokemonToList(bulbasaurUrl)
        appendPokemonToList(squirtleUrl)
        
    }
    
    function capitalize(string){
        return string[0].toUpperCase() + string.slice(1)
    }

    function appendPokemonToList(pokemonUrl) { //pokeapi.com/9
        
        fetch(pokemonUrl)
        .then(res => res.json() )
        .then(json => {
            // console.log(json)    
            let newCard = document.createElement("div")
            newCard.id = `pokemon-card-${json.id}`
            newCard.classList.add("pokemon-card-class")

            let nameHeader = document.createElement("h3")
            nameHeader.id = `name-header-id-${json.id}`
            nameHeader.innerText = capitalize(json.name) //capitalizes name "Charmander"
            

            let idNumber = document.createElement("p")
            idNumber.innerText = "ID Number: " + json.id // "4"

            let type = document.createElement("p")
            type.innerText = "Type: " + capitalize(json.type)
             //[ {slot:1} {slot:2}] --> Find obj whose .slot == 1, then go into obj type key (val is obj) and get .name

            let profileImage = document.createElement("img")
            profileImage.src = json.image
            
            let br = document.createElement("br")

            newCard.appendChild(nameHeader)
            newCard.appendChild(idNumber)
            newCard.appendChild(type)
            newCard.appendChild(profileImage)
            newCard.appendChild(br)
            
            addEditButton(pokemonUrl, newCard)
            addDeleteButton(pokemonUrl, newCard)
            
            document.querySelector("#pokemon-list").appendChild(newCard)
            }
        )
    }
        
        let newPokemonNameInput= document.querySelector("#new-pokemon-form")
        newPokemonNameInput.addEventListener("submit", createNewPokemon)

        function createNewPokemon(e) {
            e.preventDefault();
            // console.log(document.querySelector("#pokemon-type-selector").value)
            let newPokemonName= document.querySelector("#new-pokemon-name").value 
            let newPokemonType = document.querySelector("#pokemon-type-selector").value 
            let newPokemonImageUrl = document.querySelector("#new-pokemon-image-url").value
            // debugger 

            fetch(pokeApiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", //sending over this to backend
                    "Accept": "application/json" //should get this back for frontend usage
                },
                body: JSON.stringify({
                    name: newPokemonName,  //sending JSON {name : `${newName}` }
                    type:  newPokemonType,
                    image: newPokemonImageUrl
                })
            }).then(res => res.json())
            .then(json => appendPokemonToList(pokeApiUrl + "/" + json.id))
        }
        

        function addEditButton(pokemonUrl, newCard) {
            console.log(pokemonUrl)
            let editButton = document.createElement("button")
            editButton.innerText = "Edit Name"
            editButton.id = `edit-button-${pokemonUrl.split("/")[4]}`
            editButton.addEventListener("click", editPokemonName)
            newCard.appendChild(editButton)
        }

        function editPokemonName(e) {
            let newName = prompt("Please enter the new name you want to call this Pokemon")
            let idOfPokemonToEdit = parseInt(e.target.id.slice(12))
            console.log(idOfPokemonToEdit)
            fetch(pokeApiUrl + "/" + idOfPokemonToEdit, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json", //sending over this to backend
                    "Accept": "application/json" //should get this back for frontend usage
                },
                body: JSON.stringify({
                    name: newName,  //sending JSON {name : `${newName}` }
                })
            })
            .then(res => res.json())
            .then(json => document.querySelector(`#name-header-id-${e.target.id.slice(12)}`).innerText = newName)
        }
        
        
        function addDeleteButton(pokemonUrl, newCard) {
            // console.log(pokemonUrl)
            let deleteButton = document.createElement("button")
            deleteButton.innerText = "Delete from list"
            // console.log(pokemonUrl.split("/"))
            deleteButton.id = `delete-button-${pokemonUrl.split("/")[6]}`
            deleteButton.addEventListener("click", function() {deletePokemon(pokemonURL)})
            newCard.appendChild(deleteButton)
        }
        
        function deletePokemon(pokemonURL) {
            alert("Delete button click is working")
        }

        document.querySelector("#search-form").addEventListener("submit", returnAllPokemonThatBeginWithFirstLetter)

        function returnAllPokemonThatBeginWithFirstLetter(e){
            e.preventDefault();
            let letterToSearch = document.querySelector("#letter-to-search").value[0]
            // console.log(letterToSearch)
            fetch(pokeApiUrl)
            .then(res => res.json())
            .then(json => json.filter( pokeObj => {
                return pokeObj.name[0].toUpperCase() === letterToSearch.toUpperCase()
                })
            )
            .then(filteredArr => {
                document.querySelector("#pokemon-list").innerHTML = `Pokemon that begin with the letter "${letterToSearch.toUpperCase()}":<br>`
                filteredArr.forEach( pokemonBeginningWithLetter => {appendPokemonToList(pokeApiUrl + "/" + pokemonBeginningWithLetter.id)}) 
            })
        }

        document.querySelector("#show-all-pokemon").addEventListener("click", showAllPokemon)

        function showAllPokemon() {
            fetch(pokeApiUrl)
            .then(res =>res.json())
            .then(json => {
                document.querySelector("#pokemon-list").innerHTML =  "<div>All Pokemon in JSON:</div>"
                json.forEach( pokeObj => {
                    appendPokemonToList(pokeApiUrl + "/" + pokeObj.id)
                })
            })
        }
//// FUNCTIONS TO RUN ///////

showStarters()







}) //end of window/DOMContentLoaded