// var orderArray = new Array();
//var orderArray = new Object();

$(document).ready(function(){

    $('#searchRestaurant').on('click', function(){
        const city = $('#cityOptions').find(':selected').text();
        const searchValue = $('#searchInput').val();
        (searchValue==undefined || searchValue =='')? 
            alert("Restaurant Search input is empty. Please input a search value"):
            window.location.href="restaurants.html";
    });

    $('#paymentOption').on('click', function(){
        var payment = $('#paymentOption').find(":selected").text();
        (payment =="Credit" || payment == "Debit")? $('#cardNumber').css({"display":"block"}) : $('#cardNumber').css({"display":"none"});
    });
});

//Added to order message prompt, disappears after 3 seconds
//Array format: key(clickId): [price, number]
function addToCheckout(clickedId){
    //init the orderArray
    if (localStorage.getItem("orderArray")===null){
        var orderArray = new Object(); //for order item saving
        localStorage.setItem("orderArray", JSON.stringify(orderArray));
    }

    var buttonId = clickedId;
    //alert("#"+buttonId+"Load")
    $('#'+clickedId).html("Added To Order!");
    setTimeout(function(){$('#'+clickedId).html("Add to Order")}, 1000);

    orderArray = JSON.parse(localStorage.getItem("orderArray"));
    if (buttonId in orderArray){
        var num;
        orderArray = JSON.parse(localStorage.getItem("orderArray"));
        num = orderArray[buttonId][0];
        orderArray[clickedId][0] = num + 1;
        localStorage.setItem("orderArray", JSON.stringify(orderArray));
    }
    else{
        //orderArray[buttonId] =  [document.getElementById(buttonId+"Price").innerHTML, 1];
        //localStorage.setItem("orderArray", JSON.stringify(orderArray));

        let menuItem = [1, document.getElementById(buttonId+"Name").innerHTML,
            document.getElementById(buttonId+"Price").innerHTML, document.getElementById(buttonId+"Image").src, clickedId];
        orderArray[buttonId]=menuItem;
        localStorage.setItem("orderArray", JSON.stringify(orderArray));
    }
    updateTotal();
    location.reload();
/*
    for (order in orderArray){

        const num = orderArray[order][0];
        const name = orderArray[order][1];
        const price = orderArray[order][2];
        const image = orderArray[order][3];

        document.getElementById("eggrollName").innerHTML += `${num}x ${name} : ${price+"ea"}<br />`;
        document.getElementById("eggrollName").innerHTML += '<div id=orderPic><img src='+image+'></div>';
    }
    */
}

function loadOrder(){
    var orderArray = JSON.parse(localStorage.getItem("orderArray"));

    //Default image if no order items
    if (Object.size(orderArray) == 0){
        const image = "./img/menu/panda.jpg";
        document.getElementById("orderDiv").innerHTML += '<img src='+image+'> <h1> You got no orders here! </h1> <h3>I am a hungry panda! </h3>';
    }

    for (order in orderArray){

        const num = orderArray[order][0];
        const name = orderArray[order][1];
        const price = orderArray[order][2];
        const image = orderArray[order][3];
        const id = orderArray[order][4];

        document.getElementById("orderDiv").innerHTML += '<div class="box"> <img src='+image+'> <h3>' + `${num}x ${name}` + '</h3> <h3>$' + price + ' ea </h3> ' 
            + ' <button id='+id+' onclick="removeFromCheckout(id)" class="btn_small" type = "removeCart">Remove</button> </div>';
        //path += `${num}x ${name} : ${price+"ea"}<br />`;
        //path += '<div id=orderPic ><img src='+image+'></div>';
        //path += '<button id='+id+' onclick="removeFromCheckout('+id+')" class="btn_small" type = "removeCart">Remove</button><br />'
    }
}

function removeFromCheckout(buttonId){
    let orderArray = JSON.parse(localStorage.getItem("orderArray"));

    currentItem = orderArray[buttonId];
    let num = currentItem[0];
    if (num > 1){
        num = num - 1;
        currentItem[0] = num;
        orderArray[buttonId] = currentItem;
        localStorage.setItem("orderArray", JSON.stringify(orderArray));
        location.reload();
    }
    else{
        delete orderArray[buttonId];
        localStorage.setItem("orderArray", JSON.stringify(orderArray));
        location.reload();
        //I AM A FUCKING GOD
    }
}

function updateTotal(){
    let orderArray = JSON.parse(localStorage.getItem("orderArray"));
    let total = 0.0;

    for (order in orderArray){
        const num = orderArray[order][0];
        const price = orderArray[order][2];
        total = total + num*parseFloat(price);
    }

    //write to all pages using total price
    setTimeout(function(){document.getElementById("totalPrice").innerHTML +='<span class="highlight">$'+total.toFixed(2);+'</span>';},300);
}

//helper method to get object size
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/*
function buildLanguages() {
    var langDiv = document.getElementById("langDiv");
    var html = "<form>";
    var order = JSON.parse(sessionStorage[orderArray]);
    // console.log(order);
    for (var item in order){
        html+='<h1>'+orderArray[item][0]+'</span></h1>'
        html+='<div id=orderPic><img src='+orderArray[item][2]+'></div>';
        html+='<p><span class="highlight">'+orderArray[item][1]+'</span></p>'
        html+='<button class="btn_small" type = "removeCart">Remove</button>'
    }
    html+='</form>'
    langDiv.innerHTML = html;
}
buildLanguages();*/
//<div onload="buildLanguages()" data-role="fieldcontain" class="ui-hide-label" id="langDiv"></div>

ray={
    ajax:function(st){
        var clickedID = document.getElementById("eggrollPrice").innerHTML;
        $("#load").show();
        setTimeout(function(){$("#load").hide();},3000);
    },
    show:function(el){
        this.getID(el).style.display='';
    },
    getID:function(el){
        return document.getElementById(el);
    }
}

function confirmCheckout(){
    if(validateCheckout()){
        $('#checkoutInfo').html('<h1>Request Confirmed</h1><button class="button_menu">Return Home</button>');
        $('.button_menu').on('click',function(){
            window.location.href="index.html"
        });
        let orderArray={};
        localStorage.setItem("orderArray", JSON.stringify(orderArray));
    }
}   

function validateCheckout(){
    if ($("#checkoutField1").val()==''||$("#checkoutField2").val()==''||$("#checkoutField3").val()==''||$("#checkoutField4").val()==''){
        alert("Please fill in all fields");
    }else{
        return true;
    }
}

function confirmList(){
    $('#checkoutInfo').html('<h1>Listing...</h1><button class="button_menu">Return Home</button>');
    $('.button_menu').on('click',function(){
        window.location.href="listProperty.html"
    });
    let orderArray={};
    localStorage.setItem("orderArray", JSON.stringify(orderArray));
}

function listPropertiesByPrice(){
    var request = new XMLHttpRequest()

    var maxPrice = document.getElementById('inputPrice').value;
    request.open('GET', 'http://localhost:4000/properties/' + maxPrice, true);

    request.onload = function(){
        var properties = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            var tb = document.getElementById('propertiesTable');

            //make headers
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

            //make headers
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

            //make headers
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