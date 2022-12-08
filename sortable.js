// Load table after skeleton is loaded.
document.addEventListener("DOMContentLoaded", async function () {
    // // Get the table body
    // table = document.querySelector('#heroInfo tbody');

    // Get response
    let resp = await fetch(
        "https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json"
    );
    // var dt = new Date();
    // document.getElementById('date-time').innerHTML = dt;
    heroesData = await resp.json();
    displayTable();

    // Event listener sorting by column.
    document.querySelectorAll("#heroInfo thead tr th").forEach((col_item) => {
        col_item.addEventListener("click", sort);
    });

    document.querySelector("#nextButton").addEventListener("click", nextPage);
    document
        .querySelector("#prevButton")
        .addEventListener("click", previousPage);
});

// Declare heroes data element to fill out with getdata() function.
let heroesData = [];
// Declare api url.
let apiUrl =
    "https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json";

// Declare default size.
let size = 20;

var dropdown = document.getElementById("size");   // Page size selection by user
dropdown.addEventListener("change", function () {
    localStorage.setItem("size", dropdown.value);
    window.location.reload();
});

// Declaring page size and current page. Will change when clicking next and previous.
let pageSize = size;
let currentPage = 1;

async function displayTable(page = 1) {
    // await getData()

    // Visibility of next and previous button
    if (page == 1) {
        prevButton.style.visibility = "hidden";
    } else {
        prevButton.style.visibility = "visible";
    }

    if (page == numPages()) {
        nextButton.style.visibility = "hidden";
    } else {
        nextButton.style.visibility = "visible";
    }

    // set page size and dropdown to local storage value.
    pageSize = localStorage.getItem("size");
    document.getElementById("size").value = pageSize;

    // If user selects all elements from list, set page size to
    // Length of heroes array.
    if (pageSize == "all") {
        pageSize = heroesData.length;
    }

    if (!localStorage.getItem("size")) {
        pageSize = 20;
        dropdown.value = pageSize;
    }

    // create html
    var result = "";
    heroesData
        .filter((row, index) => {
            let start = (currentPage - 1) * pageSize;
            let end = currentPage * pageSize;
            if (index >= start && index < end) {
                return true;
            }
        })
        .forEach((heroDetails, index) => {
            result += "<tr>";
            result += `<td>${index + currentPage * pageSize - pageSize + 1}</td>`;
            result += `<td> <img src="${heroDetails.images.xs}"/> </td>`;
            result += `<td> ${heroDetails.name}</td>`;
            result += `<td> ${heroDetails.biography.fullName} </td>`;
            result += `<td> ${heroDetails.powerstats.intelligence}`;
            result += `<td> ${heroDetails.powerstats.strength}`;
            result += `<td> ${heroDetails.powerstats.speed}`;
            result += `<td> ${heroDetails.powerstats.durability}`;
            result += `<td> ${heroDetails.powerstats.power}`;
            result += `<td> ${heroDetails.powerstats.combat}`;
            result += `<td> ${heroDetails.appearance.race} </td>`;
            result += `<td> ${heroDetails.appearance.gender} </td>`;
            result += `<td> ${heroDetails.appearance.height} </td>`;
            result += `<td> ${heroDetails.appearance.weight} </td>`;
            result += `<td> ${heroDetails.biography.placeOfBirth} </td>`;
            result += `<td> ${heroDetails.biography.alignment} </td>`;
            ("<tr>");
        });
    document.querySelector("tbody").innerHTML = result;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayTable(currentPage);
    }
}

function nextPage() {
    if (currentPage * pageSize < heroesData.length) {
        currentPage++;
        displayTable(currentPage);
    }
}

// displayTable()
function numPages() {
    return Math.ceil(heroesData.length / pageSize);
}

//Fetch Data from API
async function getData() {
    const response = await fetch(apiUrl);
    const heroes = await response.json();
    heroesData = heroes;
}

function lookup() {
    // Declare variables - W3Schools
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("mySearch");
    filter = input.value.toUpperCase();
    table = document.getElementById("heroInfo");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

let col;
let ascending;

function sort(colName) {

    // Ref https://www.raymondcamden.com/2022/03/14/building-table-sorting-and-pagination-in-javascript
    // debugger;
    let sortcolName = colName.target.dataset.sort;  // assign data-sort value
    let second_key = colName.currentTarget.id;    // eg assigns [appearance][weight] .. [col][id]
    if (col === sortcolName) ascending = !ascending;
    col = sortcolName;
    console.log("Ascending: ", ascending, col, second_key);

    let excludesList = ["", null, "-"];
    let weightHeight = ['weight', 'height']


    if (col == "name") {

        if (col != localStorage.getItem("column")) {
            ascending = false;
        }

        heroesData.sort((a, b) => {
            // Handle regular strings based on column.
            if (a[col] < b[col]) {
                localStorage.setItem("column", col)

                return ascending ? 1 : -1;
            }
            if (a[col] > b[col]) {
                localStorage.setItem("column", col)
                return ascending ? -1 : 1;
            }
            return 0;
        });
    } else {

        heroesData.sort((a, b) => {

            // Handle asc/desc;
            if (second_key != localStorage.getItem("column")) {
                console.log("1st chk:", second_key, localStorage.getItem("column"))
                ascending = false;
            }


            // Sort weight and height by spliting the field to get first value in array. (Ft. and lbs)
            if (
                weightHeight.includes(second_key) &&
                parseInt(a[col][second_key][0].split(" ")[0]) <
                parseInt(b[col][second_key][0].split(" ")[0])
            ) {
                localStorage.setItem("column", second_key)
                // console.log("a[col][second_key]",a[col][second_key], "-", b[col][second_key])
                // console.log("split",a[col][second_key][0].split(" ")[0])
                // Filter weights by lb
                return ascending ? 1 : -1;
            }

            // Sort weight and height by spliting the field to get first value in array. (Ft. and lbs)
            if (
                weightHeight.includes(second_key) &&
                parseInt(a[col][second_key][0].split(" ")[0]) >
                parseInt(b[col][second_key][0].split(" ")[0])
            ) {
                localStorage.setItem("column", second_key)
                // console.log("a[col][second_key]",a[col][second_key], "-", b[col][second_key])
                // console.log("split",a[col][second_key][0].split(" ")[0])
                return ascending ? -1 : 1;
            }

            // Handling empty heights and weights.
            if (weightHeight.includes(second_key) && a[col][second_key][0] == "-" || weightHeight.includes(second_key) && a[col][second_key][0] == "- lb") {
                console.log("FAULTY Wght DATA:", ascending, a[col][second_key], "|", a[col])
                localStorage.setItem("column", second_key)
                // debugger;
                return 1;
            }
            if (weightHeight.includes(second_key) && b[col][second_key][0] == "-" || weightHeight.includes(second_key) && b[col][second_key][0] == "- lb") {
                localStorage.setItem("column", second_key)

                return -1;
            }

            // Handling faulty data.
            if (excludesList.includes(a[col][second_key]) || localStorage.getItem("column") == "height" && a[col][second_key] == "Shaker Heights, Ohio") {
                localStorage.setItem("column", second_key)
                console.log("FAULTY Hght DATA:", a[col][second_key], "|", a[col])
                return 1;
            }
            if (excludesList.includes(b[col][second_key]) || localStorage.getItem("column") == "height" && b[col][second_key] == "Shaker Heights, Ohio") {
                localStorage.setItem("column", second_key)

                return -1
            }
            // **************

            // Handling Shaker heights faulty data.
            if (a[col][second_key] == "Shaker Heights, Ohio" && col == "placeOfBirth") {
                return 1;

            }

            if (b[col][second_key] == "Shaker Heights, Ohio" && col == "placeOfBirth") {
                return -1;

            }
            if (a[col][second_key] == "(Galan) Taa; (Galactus) the Cosmic Egg") {
                localStorage.setItem("column", second_key)

                return 1
            }
            if (b[col][second_key] == "(Galan) Taa; (Galactus) the Cosmic Egg") {
                localStorage.setItem("column", second_key)

                return -1
            }

            // Handling regular strings for multi-layered heroDetailss.
            if (a[col][second_key] < b[col][second_key]) {
                localStorage.setItem("column", second_key)
                // console.log("alpha string end sort asc1", a[col][second_key], "<", b[col][second_key])
                return ascending ? 1 : -1;
            }
            if (a[col][second_key] > b[col][second_key]) {
                localStorage.setItem("column", second_key)

                return ascending ? -1 : 1;
            }

            // Handle regular strings based on column.
            if (a[col] < b[col]) {
                localStorage.setItem("column", col)
                // console.log("name string end sort asc2", a[col], "<", b[col])
                return ascending ? 1 : -1;
            }
            if (a[col] > b[col]) {
                localStorage.setItem("column", col)
                // console.log("name string end sort desc2", a[col], ">", b[col])
                return ascending ? -1 : 1;
            }

            return 0;
        });

    }

    displayTable();
}
