// <li class="w3-padding-16">
//     <img src="/w3images/skies.jpg" alt="Image" class="w3-left w3-margin-right" style="width:50px">
//     <span class="w3-large">Dorum</span><br>
//     <span>Ultricies congue</span>
// </li>

const repo = {
    url: "",
    img_src: "",
    img_alt: "",
    name: "",
    description: "",
    created_date: "",
    updated_date: ""
};

var records = [];

// Utility functions to edit the document.
function createNode (element) { return document.createElement(element); }
function append (parent, element) { parent.appendChild(element); };

function getMonth (month) {
    var month_num = parseInt(month);
    var m = ""; // month as a string.

    switch (month_num) {
        case 1:
            m = "January";
            break;
        case 2:
            m = "Febuary";
            break;
        case 3:
            m = "March";
            break;
        case 4:
            m = "April";
            break;
        case 5:
            m = "May";
            break;
        case 6:
            m = "June";
            break;
        case 7:
            m = "July";
            break;
        case 8:
            m = "August";
            break;
        case 9:
            m = "September";
            break;
        case 10:
            m = "October";
            break;
        case 11:
            m = "November";
            break;
        case 12:
            m = "December";
            break;
        default:
            m = "INVALED MONTH";
            break;
    }

    return m;
}

function formatDate (date) {
    date = date.split('-').reverse();

    var t = date[0];
    date[0] = date[1];
    date[1] = t;

    // Gets the month as string.
    // Then parse the day to a int to remove leading 0s.
    // Concat year to the end.
    return getMonth(date[0]) + " " + parseInt(date[1]) + ", " + date[2];
}

function createSubtitle (description, created_date, updated_date) {
    if (description === "null") {
        description = "";
    }
    else {
        description = description + " | ";
    }

    return  description + "<b>Created On</b>: " +
            formatDate(created_date) + " | <b>Last Updated: </b>: "
            + formatDate(updated_date);
}

function appendRecordsToDocument (list) {

    for (var i = 0; i < records.length; i++) {
        let a = createNode ('a');
        a.href = records[i].url;
        a.style = "text-decoration: none";

        let li = createNode ('li');
        li.className = "w3-padding-16";

        let img = createNode ('img');

        img.className = "w3-left w3-margin-right";
        img.style = "width: 50px";
        img.src = records[i].img_src;
        img.alt = records[i].img_alt;

        let title = createNode('span');

        title.className = "w3-large";
        title.innerHTML = records[i].name;

        let br = createNode('br');

        let subtitle = createNode('span');
        subtitle.innerHTML = createSubtitle(records[i].description, records[i].created_date, records[i].updated_date);

        append (li, img);
        append (li, title);
        append (li, br);
        append (li, subtitle);

        append (a, li);

        append (list, a);
    }
}

// Gets the list of my repos using the Github REST api and sorts it by when
// the repo was last updated.
async function createRepoRecords () {
    const list = document.getElementById('project-list');
    const url = "http://api.github.com/users/jdselsor/repos";

    const responce = await fetch (url);
    const result = await responce.json();

    // Maps the elements from the JSON string to the records.
    // TODO: see if I can just directly map the repos to records.
    const repos = result.map (function (r) {
        var repo_record = Object.assign({}, repo); // Makes a copy of the repo object.

        repo_record.url             = `${r.html_url}`;
        repo_record.img_src         = `${r.owner.avatar_url}`;
        repo_record.img_alt         = `${r.owner}`;
        repo_record.name            = `${r.name}`;
        repo_record.description     = `${r.description}`;
        repo_record.created_date    = `${r.created_at}`.substring(0, 10);
        repo_record.updated_date    = `${r.updated_at}`.substring(0, 10);

        console.log(repo_record.url);

        records.push(repo_record);
    });

    // Sorts the records by updated date.
    records = records.slice().sort((a, b) => b.updated_date - a.updated_date);

    appendRecordsToDocument(list);
}

async function createRepos () {
    let li = createNode ('li');
    li.className = "w3-padding-16";

    let img = createNode ('img');
    let repoNameSpan = createNode('span');
    let repoDescription = createNode('span');

    img.src = `${repo.owner.avatar_url}`;
    img.alt = `${repo.owner}`;
    img.className = "w3-left w3-margin-right";
    img.style = "width: 50px";

    repoNameSpan.className = "w3-large";
    repoNameSpan.innerHTML = `${repo.name}`;

    br = createNode('br');

    let des = `${repo.description}`;
    let subtitle = "";

    if (des !== "null") {
        subtitle += des + " | ";
    }

    let created_date = `${repo.created_at}`.substring(0, 10);
    let c_year = created_date.substring(0, 4);
    let c_month = created_date.substring(5, 7);
    let c_day = created_date.substring(8);

    subtitle += "<b>Created On:</b> " + (c_month + "/" + c_day + "/" + c_year);

    let last_updated = `${repo.updated_at}`.substring(0, 10);
    let u_year = last_updated.substring(0, 4);
    let u_month = last_updated.substring(5, 7);
    let u_day = last_updated.substring(8);

    subtitle += " | <b>Last Updated:</b> " + (u_month + "/" + u_day + "/" + u_year);

    repoDescription.innerHTML = subtitle;

    append (li, img);
    append (li, repoNameSpan);
    append (li, br);
    append (li, repoDescription);

    append (list, li);
}

createRepoRecords();
