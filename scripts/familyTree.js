console.log("Family Tree Script Loaded");
var canvas = document.getElementById("familytree");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "black"; //text

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
    { "id": 20, "name": "Tom", "birthdate": "1972-01-24" }
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
    { "child_id": 3, "parent1_id": 30, "parent2_id": 2 },
    { "child_id": 1, "parent1_id": 6, "parent2_id": 9 },
    { "child_id": 5, "parent1_id": 6, "parent2_id": 9 },
    { "child_id": 7, "parent1_id": 3, "parent2_id": 1 },
    { "child_id": 2, "parent1_id": 6, "parent2_id": 9 },
    { "child_id": 6, "parent1_id": 12, "parent2_id": 15 },
    { "child_id": 12, "parent1_id": 120, "parent2_id": 30 },
    { "child_id": 30, "parent1_id": 1210, "parent2_id": 99 },
    { "child_id": 15    , "parent1_id": 69, "parent2_id": -2 }
  ]
  
  //keeps track of drawing cursor
  let cursorX = 0;
  let cursorY = 0;

  function drawParent(x, y, id, depth){

    thisID = id; //_currentUserID
    const parentList = childParentRelatinoshipsTable.filter( (col) => col.child_id === thisID); //parents


    //get some calcs
    generation_depth = 0;
    calculateGeneration(thisID);

    if(generation_depth == 0){
        setFillStyle("red");
    } else {
        setFillStyle("white");
    }

    //IMPORTANT
    //Mess with these mess with width
    const distance = 15 + 35 * generation_depth;

    //draw
    ctx.fillText("parent"+id, x, y); //draw parent

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
  
  function startDrawingParentTree(x = canvas.width / 2, y = canvas.height / 2) {
    ctx.strokeStyle='black';
    cursorX = x;
    cursorY = y;

    const rootID = thisUser[0].id;

    const parentList = childParentRelatinoshipsTable.filter( (col) => col.child_id === rootID);

    generation_depth = 0;
    calculateGeneration(rootID); //initial calculation to calculate {generation_depth} for starting width

    const distance = 70 * generation_depth;

    drawParent(cursorX - distance / 2, cursorY - 5, parentList[0].parent1_id, generation_depth);
    drawParent(cursorX + distance / 2, cursorY - 5, parentList[0].parent2_id, generation_depth);

  }


  //generation_depth knows how many generations the family tree goes back
  //this is used to set the initial starting width of the tree
  let generation_depth = 0;
  function calculateGeneration(rootID, parent_depth = 0){

    const parents = childParentRelatinoshipsTable.filter( (item) => item.child_id == rootID) //returns a table with parents

    if(parent_depth > generation_depth){
        generation_depth = parent_depth;
    }

    //has parents
    if(parents[0] != undefined){
        calculateGeneration(parents[0].parent1_id, parent_depth + 1);
        calculateGeneration(parents[0].parent2_id, parent_depth + 1);
    }
  }
  
  startDrawingParentTree();