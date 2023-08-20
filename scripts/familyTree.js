//Image sources are hardcoded into the class

/**
 * Image holder for rendering on marriage canvas, contains logic necessary to render profile images onto screen.
 * Initialize, applyUserData(), draw().
 */
class ProfileCard {
    constructor(x, y, width, height) {
        this.image = new Image();
        this.image.src = "./images/marriage_assets/person_frame.png"; //image link src
        this.scale = 10; //bigger number smaller image
        this.x = x; //cursor position
        this.y = y; //cursor position
        this.width = width; //image width
        this.height = height; //image height

        this.profileImage = new Image();
        this.profileImageSrc = ""; //image source for profile image
        this.username = "No Username"; //username
        this.birthday = "No Rank" //testing
    }

    /**
     * 
     * @param {string} profileImageSrc 
     * @param {string} username 
     * @param {string} birthday 
     */
    applyUserData(profileImageSrc, username, birthday){
        this.profileImageSrc = profileImageSrc;
        this.username = username;
        this.birthday = birthday;
    }

    /**
     * Renders image
     * @param {canvas} ctx canvas source
     * @param {int} scale bigger number smaller image
     */
    draw(ctx, scale = this.scale){
        this.image.onload = () => {

            let w_scaled = this.image.width / scale;
            let h_scaled = this.image.height / scale;

            ctx.drawImage(this.image, this.x - w_scaled / 2, this.y - h_scaled / 2, w_scaled, h_scaled);

            //this.x / this.y start at the very center of the rendered
            ctx.fillText(this.username, this.x - 14, this.y + 15); //username
            
            
            this.profileImage.src = this.profileImageSrc;

            this.profileImage.onload = () => {
                console.log("Profile image loaded");
                ctx.drawImage(this.profileImage, this.x - 13, this.y - 19.5, 26, 26);
            }
        }
    }
}

cextraProfileImageLink = "https://hosting.photobucket.com/albums/w672/linkswords10/Cextra-avy_zps2f4db921.gif";

console.log("Family Tree Script Loaded");
var canvas = document.getElementById("familytree");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "black"; //text

let asset_marriage_image = "./images/marriage_assets/person_frame.png";
let profileFrameHeight = 465;
let profileFrameWidth = 354;

let thisUser = [
    {"id": 7, "name": "Cextra"}
]

let individualTable = [
    { "id": 1, "name": "Alice", "birthdate": "1990-01-01" },
    { "id": 2, "name": "Bob", "birthdate": "1995-05-15" },
    { "id": 3, "name": "Carol", "birthdate": "1988-09-20" },
    { "id": 4, "name": "David", "birthdate": "2002-03-10" },
    { "id": 5, "name": "Emma", "birthdate": "1998-11-25" },
    { "id": 6, "name": "Frank", "birthdate": "1976-07-14" },
    { "id": 7, "name": "Grace", "birthdate": "1985-02-08" },
    { "id": 8, "name": "Henry", "birthdate": "1993-06-03" },
    { "id": 9, "name": "Isabel", "birthdate": "2000-09-17" },
    { "id": 10, "name": "Jack", "birthdate": "1991-04-22" },
    { "id": 11, "name": "Karen", "birthdate": "1979-12-12" },
    { "id": 12, "name": "Leo", "birthdate": "1982-08-30" },
    { "id": 13, "name": "Mia", "birthdate": "2004-07-07" },
    { "id": 14, "name": "Nathan", "birthdate": "1997-11-03" },
    { "id": 15, "name": "Olivia", "birthdate": "2001-02-18" },
    { "id": 16, "name": "Paul", "birthdate": "1989-10-29" },
    { "id": 17, "name": "Quinn", "birthdate": "1994-03-07" },
    { "id": 18, "name": "Ryan", "birthdate": "1992-06-16" },
    { "id": 19, "name": "Sophia", "birthdate": "1984-09-05" },
    { "id": 20, "name": "Tom", "birthdate": "1972-01-24" },
];


//for married users
let marriages = [
    { "marriage_id": 1, "spouse1_id": 1, "spouse2_id": 2 },
    { "marriage_id": 2, "spouse1_id": 3, "spouse2_id": 6 },
    { "marriage_id": 3, "spouse1_id": 7, "spouse2_id": 10 },
    { "marriage_id": 4, "spouse1_id": 12, "spouse2_id": 18 },
    { "marriage_id": 5, "spouse1_id": 15, "spouse2_id": 19 }
];



//showing heiarchy
  let hierarchicalRelationships = [
    { "ancestor_id": 1, "descendant_id": 2, "depth": 1 },
    { "ancestor_id": 1, "descendant_id": 3, "depth": 2 },
    { "ancestor_id": 1, "descendant_id": 6, "depth": 2 },
    { "ancestor_id": 1, "descendant_id": 7, "depth": 1 },
    { "ancestor_id": 1, "descendant_id": 10, "depth": 2 },
    { "ancestor_id": 1, "descendant_id": 12, "depth": 2 },
    { "ancestor_id": 1, "descendant_id": 15, "depth": 2 },
    { "ancestor_id": 1, "descendant_id": 19, "depth": 2 },
    { "ancestor_id": 2, "descendant_id": 3, "depth": 1 },
    { "ancestor_id": 2, "descendant_id": 6, "depth": 1 },
    { "ancestor_id": 2, "descendant_id": 7, "depth": 2 },
    { "ancestor_id": 2, "descendant_id": 10, "depth": 3 },
    { "ancestor_id": 2, "descendant_id": 12, "depth": 3 },
    { "ancestor_id": 2, "descendant_id": 15, "depth": 3 },
    { "ancestor_id": 2, "descendant_id": 19, "depth": 3 },
    // ... and so on for the other relationships
  ];

  //for children
  let childParentRelatinoshipsTable = [
    { "child_id": 3, "parent1_id": 17, "parent2_id": 30 },
    { "child_id": 2, "parent1_id": 5, "parent2_id": 8 }, //change child id to 7 for testing parents
    { "child_id": 5, "parent1_id": 30, "parent2_id": 7 },
    { "child_id": 7, "parent1_id": 3, "parent2_id": 1 },
    { "child_id": 6, "parent1_id": 10, "parent2_id": 12 },
    { "child_id": 12, "parent1_id": 17, "parent2_id": 19 },
    { "child_id": 15, "parent1_id": 7, "parent2_id": 16 },
    { "child_id": 18, "parent1_id": 1232, "parent2_id": 7 },
    { "child_id": 35, "parent1_id": 1232, "parent2_id": 20 },
    { "child_id": 4, "parent1_id": 7, "parent2_id": 3 },
    { "child_id": 9, "parent1_id": 50, "parent2_id": 2 },

    
    
];

// Draw the ellipse
ctx.beginPath();
ctx.ellipse(canvas.width / 2, canvas.height / 2 - 50, 10, 10, 0, 0, 6.28);
ctx.stroke();
  
  //keeps track of drawing cursor
  let cursorX = 0;
  let cursorY = 0;

  function drawParent(x, y, id, depth){

    thisID = id; //_currentUserID
    const parentList = childParentRelatinoshipsTable.filter( (col) => col.child_id === thisID); //parents


    //get some calcs
    generation_depth = 0;
    calculateParentGeneration(thisID);

    //set color
    if(generation_depth == 0){
        setFillStyle("red");
    } else {
        setFillStyle("black");
    }

    //IMPORTANT
    //Mess with these mess with width
    //Update this with a graph of some sort in the future to better dictate width
    const distance = 15 + 35 * generation_depth;

    let a = new ProfileCard(x, y, 256, 256);
    a.applyUserData(cextraProfileImageLink, individualTable.find((item) => item.id == id)?.name, individualTable.find((item) => item.userID == id)?.birthdate);
    a.draw(ctx, 10);

    //draw
    //ctx.fillText("parent"+id, x, y); //moved to ProfileCard

    //left line
    if(generation_depth > 0){
    ctx.beginPath();
    ctx.moveTo(x - (distance / 2), y - 40);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();
    }

    //right line
    if(generation_depth > 0){
        ctx.beginPath();
        ctx.moveTo(x + (distance / 2), y - 40);
        ctx.lineTo(x, y);
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    console.log("I am parent"+thisID + " I have a generation_depth of " + generation_depth + ": This should be my distance - " + distance);

    //iterate
    for(const key in parentList){
        drawParent(x - (distance / 2), y - 40, parentList[key].parent1_id, generation_depth);
        drawParent(x + (distance / 2), y - 40, parentList[key].parent2_id, generation_depth);
    }

  }

  function setFillStyle(color){
    ctx.fillStyle = color;
  }
  
  function startDrawingParentTree(userID = 0, x = canvas.width / 2, y = canvas.height / 2) {
    ctx.strokeStyle='black';
    cursorX = x;
    cursorY = y;

    const parentList = childParentRelatinoshipsTable.filter( (col) => col.child_id === userID);

    generation_depth = 0;
    calculateParentGeneration(userID); //initial calculation to calculate {generation_depth} for starting width

    const distance = 70 * generation_depth;

    if(parentList[0] != undefined){
        drawParent(cursorX - distance / 2, cursorY - 80, parentList[0].parent1_id, generation_depth);
        drawParent(cursorX + distance / 2, cursorY - 80, parentList[0].parent2_id, generation_depth);
    } else {
        //console.log("No parents");
    }

  }


  //generation_depth knows how many generations the family tree goes back
  //this is used to set the initial starting width of the tree
  let generation_depth = 0;
  function calculateParentGeneration(rootID, parent_depth = 0){

    const parents = childParentRelatinoshipsTable.filter( (item) => item.child_id == rootID) //returns a table with parents

    if(parent_depth > generation_depth){
        generation_depth = parent_depth;
    }

    //has parents
    if(parents[0] != undefined){
        calculateParentGeneration(parents[0].parent1_id, parent_depth + 1);
        calculateParentGeneration(parents[0].parent2_id, parent_depth + 1);
    }
  }

  function drawChildren(x, y, userID){

    let b = new ProfileCard(x, y, 256, 256);
    b.applyUserData(cextraProfileImageLink, individualTable.find((item) => item.id == userID)?.name, individualTable.find((item) => item.userID == userID)?.birthdate);
    b.draw(ctx, 10);

    //ctx.fillText("child"+userID, x, y); //draw parent

    const childrenList = childParentRelatinoshipsTable.filter( (data) => data.parent1_id == userID || data.parent2_id == userID );

    childGenerationDepth = 0;
    calculatechildGenerations(userID);

    let r = 30 + (40 * childGenerationDepth);
    let a = childrenList.length;
    if(a == 0) a = 1;
    if(childrenList.length > 0){
        calculatechildGenerations(userID); //get depth to calculate initial width
        for(var i = 0; i < childrenList.length; i++){           
            let formula = (x - (r / 2)) + (((r / 2) * i));
            drawChildren(formula, y + 30, childrenList[i].child_id);
        }
    } else {
        console.log("No Kids");
    }

  }

  //Children Function
  function startDrawingChildrenTree(userID, x = canvas.width / 2, y = canvas.height / 2){

    const childrenList = childParentRelatinoshipsTable.filter( (data) => data.parent1_id == userID || data.parent2_id == userID );

    console.log(x, y);
   
    let r = 300; //desired distance
    let a = childrenList.length; //amount of children
    if(childrenList.length > 0){
        calculatechildGenerations(userID); //get depth to calculate initial width
        for(var i = 0; i < childrenList.length; i++){
            
            let formula = x - (r / 2) + ((r/a * i));
            drawChildren(formula, y + 5, childrenList[i].child_id);
        }
    } else {
        console.log("No Kids");
    }

  }


let calls = 0;
let childGenerationDepth = 0;
function calculatechildGenerations(rootID, childDepth = 0){
    calls++;
    if(calls > 800) {
        console.log("Max calls reached...");
        return;
    };

    if(childDepth > childGenerationDepth){
        childGenerationDepth = childDepth;
    }

    const childrenList = childParentRelatinoshipsTable.filter( (data) => data.parent1_id == rootID || data.parent2_id == rootID );

    if(childrenList.length > 0){
        for(var i = 0; i < childrenList.length; i++){
            let name = individualTable.find((item) => item.id == childrenList[i].child_id).name;
            calculatechildGenerations(childrenList[i].child_id, childDepth + 1);
        }
    } 
}
  
//Init

window.addEventListener('load', function () {
    startDrawingParentTree(7);
    startDrawingChildrenTree(7);
  })
