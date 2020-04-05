function listPropertiesByPrice(){
    var request = new XMLHttpRequest()

    var maxPrice = document.getElementById('inputPrice').value;
    request.open('GET', 'http://localhost:4000/properties/' + maxPrice, true);

    request.onload = function(){
        var properties = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            var tb = document.getElementById('propertiesTable');

            //make column headers
            var tr = tb.insertRow(0);
            for (var key in properties[0]){
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(key));
                tr.appendChild(td);
            }
            tb.appendChild(tr);

            properties.forEach(property =>{
                var tr = tb.insertRow();
                for (var key in property){
                    var td = tr.insertCell();

                    if (key == 'availabledate'){
                        td.appendChild(document.createTextNode(property[key].substring(0,10)));
                    }else{
                        td.appendChild(document.createTextNode(property[key]));
                    }
                    tr.appendChild(td);
                }   

                tb.appendChild(tr);
            });
        }else {
            console.log('error')
        }
    }
    request.send();
}

function listPropertiesByAvailability(){
    var request = new XMLHttpRequest()

    var date = document.getElementById('start').value;
    request.open('GET', 'http://localhost:4000/properties/' + date, true);

    request.onload = function(){
        var properties = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            var tb = document.getElementById('propertiesTable');

            //make column headers
            var tr = tb.insertRow(0);
            for (var key in properties[0]){
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(key));
                tr.appendChild(td);
            }
            tb.appendChild(tr);

            properties.forEach(property =>{
                var tr = tb.insertRow();
                for (var key in property){
                    var td = tr.insertCell();

                    if (key == 'availabledate'){
                        td.appendChild(document.createTextNode(property[key].substring(0,10)));
                    }else{
                        td.appendChild(document.createTextNode(property[key]));
                    }
                    tr.appendChild(td);
                }   

                tb.appendChild(tr);
            });
        }else {
            console.log('error')
        }
    }
    request.send();
}

function retrieveProperties(){
    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest()

    // Open a new connection, using the GET request on the URL endpoint
    request.open('GET', 'http://localhost:4000/properties', true)

    request.onload = function() {
        var properties = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            var tb = document.getElementById('propertiesTable');

            //make column headers
            var tr = tb.insertRow(0);
            for (var key in properties[0]){
                var td = tr.insertCell();
                td.appendChild(document.createTextNode(key));
                tr.appendChild(td);
            }
            tb.appendChild(tr);

            properties.forEach(property =>{
                var tr = tb.insertRow();
                for (var key in property){
                    var td = tr.insertCell();

                    if (key == 'availabledate'){
                        td.appendChild(document.createTextNode(property[key].substring(0,10)));
                    }else{
                        td.appendChild(document.createTextNode(property[key]));
                    }
                    tr.appendChild(td);
                }   

                tb.appendChild(tr);
            });
        }else {
            console.log('error')
        }
    }

    //Send request
    request.send()
}

function postProperty(){
    var request = new XMLHttpRequest();
    request.open("POST", 'http://localhost:4000/properties', true);

    console.log (document.getElementById('propertyType').value);
    //get parameters
    var params = {
        "propertyType": document.getElementById('propertyType').value,
        "roomType": document.getElementById('roomType').value,
        "houseNumber": document.getElementById('checkoutField1').value,
        "street": document.getElementById('checkoutField2').value,
        "city": document.getElementById('checkoutField3').value,
        "province": document.getElementById('province').value,
        "numBed": document.getElementById('numBed').value,
        "numBath": document.getElementById('numBath').value,
        "maxPpl": document.getElementById('maxPpl').value,
        "bedType": document.getElementById('bedType').value,
        "amenity1": document.getElementById('amenity1').value,
        "amenity2": document.getElementById('amenity2').value,
        "amenity3": document.getElementById('amenity3').value,
        "price": document.getElementById('price').value,
    };

    //Send the proper header information along with the request
    request.setRequestHeader("Content-Type", "application/json");

    request.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            alert(request.responseText);
        }
    }
    //console.log(JSON.stringify(params));
    request.send(JSON.stringify(params));
}